// is_dev = process.env.IS_OFFLINE
const case_token = process.env.scscourt_key;

import john_smith from "./fixtures/john_smith.json" with { type: "json" };
import jose_garcia from "./fixtures/jose_garcia.json" with { type: "json" };
import no_results from "./fixtures/no_results.json" with { type: "json" };
// John Smith
import case_5890621 from "./fixtures/case_5890621.json" with { type: "json" };
// Jose Garcia
import case_5893748 from "./fixtures/case_5893748.json" with { type: "json" };

const domain = "https://portal.scscourt.org";
const endpoint = "https://portal.scscourt.org/api/cases";
const endpointHeader = {
  "case-token": case_token,
};

const fetchFilings = async (firstName, lastName, liveEndpoint = false) => {
  if (liveEndpoint) {
    // Hit the live endpoint
    const response = await fetch(`${endpoint}/byname`, {
      method: "POST",
      headers: endpointHeader,
      body: JSON.stringify({
        firstName,
        lastName,
      }),
    });
    return await response.json();
  } else {
    // Fallback: Use testing fixture data
    const fn = firstName.toLowerCase();
    const ln = lastName.toLowerCase();
    switch (true) {
      case fn === "john" && ln === "smith":
        return john_smith;
      case fn === "jose" && ln === "garcia":
        return jose_garcia;
      default:
        return no_results;
    }
  }
};

const fetchCaseData = async (caseId, liveEndpoint = false) => {
  if (liveEndpoint) {
    const response = await fetch(`${endpoint}/case/${caseId}`, {
      method: "POST",
      headers: endpointHeader,
    });
    const dataJson = await response.json();
    return dataJson.data;
  } else {
    switch (true) {
      case String(caseId) === "5890621":
        return case_5890621;
      case String(caseId) === "5893748":
        return case_5893748;
      default:
        throw new Error("No fixture data for case ID " + caseId);
    }
  }
};

const requestFilingsWithCases = async (firstName, lastName) => {
  const shouldHitLiveEndpoint = case_token && case_token !== "0";

  const filings = await fetchFilings(
    firstName,
    lastName,
    shouldHitLiveEndpoint,
  );

  // Only hitting the first result as to not hammer the endpoint
  // TODO: full cloud system which periodically queries and caches all cases
  //       and slowly polls for new ones.
  //       ... with permission from the webmaster of course.
  const filingsSliced = filings.data
    .sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate))
    .slice(0, 1);
  const firstCaseId = filingsSliced[0]?.caseId;

  if (!firstCaseId) {
    return filingsSliced;
  }

  const filingDataWithCases = await Promise.all(
    filingsSliced.map(async (filing) => {
      if (filing.caseId === firstCaseId) {
        return {
          ...filing,
          case: await fetchCaseData(firstCaseId, shouldHitLiveEndpoint),
        };
      }
      return filing;
    }),
  );

  return {
    ...filings,
    data: filingDataWithCases,
  };
};
const formatFilings = (filings) => ({
  timestamp: filings.created,
  data: filings.data.map((filing) => ({
    caseNumber: filing.caseNumber,
    name: filing.caseStyle,
    filingDate: filing.filingDate,
    status: filing.caseStatus,
    type: filing.caseType,
    courtLocation: filing.case?.data.courtLocation ?? null,
    parties:
      filing.case?.data.caseParties?.map((party) => ({
        name: party.fullName,
        role: party.type,
      })) ?? null,
    hearings: filing.case?.data.hearings ?? null, // TODO: test fixtures do not have hearings
    // TODO: scraping all the case.data.caseEvents events and the pdfs inside them seems outside of scope
    //       for this interview. Could be added later.
    //       I am also not a lawyer so don't fully understand the scope of what events occur here.
    fines: null,
    fees: null,
    balance: null,
    caseUrl: `${domain}/case/${Buffer.from(filing.caseId).toString("base64")}`,
    scrapeTimestamp: new Date().toISOString(), // TODO: if using cached data, do not update this every time
  })),
});

export const search = async (event) => {
  try {
    const requestBody = JSON.parse(event.body) || {};
    const { firstName, lastName } = requestBody;

    if (!firstName || !lastName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "firstName and lastName are required",
        }),
      };
    }

    const filings = await requestFilingsWithCases(firstName, lastName);
    const formattedFilings = await formatFilings(filings);

    return {
      statusCode: formattedFilings.data.length > 0 ? 200 : 204,
      body: JSON.stringify(formattedFilings),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        name: error.name,
        message: error.message,
      }),
    };
  }
};
