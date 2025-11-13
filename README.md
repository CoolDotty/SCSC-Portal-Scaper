# vigilant-guacamole

A simple AWS Lambda middleware for querying the [Santa Clara County Superior Court public portal](https://portal.scscourt.org/search).

## Try it out!

Send a `POST` request to `https://3ntn7l7uuhudt24bryqceq5f2y0iobzl.lambda-url.us-west-2.on.aws/api/search` and recieve some _groovy_ fixtured (placeholder) data!

_!!_ Don't forget to head it with `content-type` as `application/json` _!!_

Example Request:

```bash
curl --request POST \
  --url https://3ntn7l7uuhudt24bryqceq5f2y0iobzl.lambda-url.us-west-2.on.aws/api/search \
  --header 'content-type: application/json' \
  --data '{
  "firstName": "Jose",
  "lastName": "Garcia"
}'
```

Example Response:

```json
{
  "timestamp": "2025-11-13T03:32:25.3638255Z",
  "data": [
    {
      "caseNumber": "25CV479555",
      "name": "Capital One, N.a. vs Jose Garcia",
      "filingDate": "11/7/2025",
      "status": "Active",
      "type": "Collections Rule 3.740 Limited (09) - under 10,000",
      "courtLocation": "Civil",
      "parties": [
        {
          "name": " Capital One, N.a.",
          "role": "Plaintiff"
        },
        {
          "name": "Jose A Garcia",
          "role": "Defendant"
        }
      ],
      "hearings": null,
      "fines": null,
      "fees": null,
      "balance": null,
      "caseUrl": "https://portal.scscourt.org/case/NTg5Mzc0OA==",
      "scrapeTimestamp": "2025-11-13T08:52:27.823Z"
    }
  ]
}
```

## Getting Started

### Open in Codespaces ✨

Get started in browser

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/CoolDotty/vigilant-guacamole)

### Run locally

`nvm install` if not already on node 24 LTS

`yarn install`

`yarn dev`

### Docker

`docker build -t vigilant-guacamole .`

then

`docker run -p 3000:3000 vigilant-guacamole`

## Deploying

Make sure you have a `.env` with

`AWS_ACCESS_KEY_ID` and

`AWS_SECRET_ACCESS_KEY`

(Or authenticate [OSS Serverless](https://github.com/oss-serverless/serverless) however you like)

Your AWS Secrets Manager will need a **Plaintext** entry for your legally obtained `scscourt_key` if you wish to query the live portal.

Then `yarn sls:deploy`

## Undeploying

`yarn sls:remove`

## Docs

### /api/search

_!!_ Don't forget to head it with `content-type` as `application/json` _!!_

```
{
    firstName: "",
    lastName: ""
}
```

### Access & Anti-Bot Strategy (Legal and Operational)

#### How you verified whether scraping is permitted (robots.txt, terms of use, or by contacting the site owner).

[portal.scscourt.org](https://portal.scscourt.org) has no `robots.txt` or Terms of Service though we can resonably assume it is under the scope of [scscourt.org/robots.txt](https://scscourt.org/robots.txt) and [courts.ca.gov/about/terms-use](https://courts.ca.gov/about/terms-use).

The [robots.txt](https://scscourt.org/robots.txt) makes mentions of not crawling `/search`. Though the scope of `robots.txt` does not cover subdomains, this project none-the-less does not programically call `portal.scscourt.org/search`.

The [terms-use](https://courts.ca.gov/about/terms-use) outlines clearly that the use of bots or datamining is expecitly forbidden. As such this project and the demo makes no requests to the site unless you have an authorized api key to do so.

The creation of this project in itself for personal non-commercial purpose (granted, for a technical interview) should fall within fair use.

#### Your compliant approach to access limits and geo-restrictions.

This project makes no effort to circumvent geo-restrictions. [scscourt.org](https://scscourt.org/) does not place any geo-restrictions on my human websurfing from my home internet as far as I can tell.

That being said, make sure you deploy your lambda to an AWS region that the Santa Clara County Superior Court approves of.

#### How mock-mode (offline fixtures) and live-mode are managed.

The source code uses offline fixtures unless you setup a `scscourt_key` in your AWS Secrets.

The live demo always uses offline fixtures.

#### Your safeguards for proxy or networking design (without any bypass methods).

To prevent excesive crawling, this project only finds detailed case data on the most recent case that has been filed.

(It _should_ only find the most recent filed case *period*, but the portal returns all results at once so that's what got copy pasted into the data fixture)

#### A clear statement confirming that no security protections were circumvented.

No security protections were cirucmvented in the creation of this project.
