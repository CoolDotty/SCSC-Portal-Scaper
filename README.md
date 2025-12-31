# SCSC-Portal-Scaper

A simple AWS Lambda middleware for querying the [Santa Clara County Superior Court public portal](https://portal.scscourt.org/search).

## Try it out!

Send a `POST` request to `https://3ntn7l7uuhudt24bryqceq5f2y0iobzl.lambda-url.us-west-2.on.aws/api/search` and receive some mock (fixture) data!

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

Run `nvm install` if you don't already have Node 24 LTS installed

`yarn install`

`yarn dev`

### Docker

`docker build -t vigilant-guacamole .`

then

`docker run -p 3000:3000 vigilant-guacamole`

## Deploying

Make sure your `.env` contains:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Or authenticate with [OSS Serverless](https://github.com/oss-serverless/serverless) however you prefer.

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

[portal.scscourt.org](https://portal.scscourt.org) has no `robots.txt` or Terms of Service, though we can reasonably assume it is covered by [scscourt.org/robots.txt](https://scscourt.org/robots.txt) and [courts.ca.gov/about/terms-use](https://courts.ca.gov/about/terms-use).

The [robots.txt](https://scscourt.org/robots.txt) disallows crawling `/search`. Although robots.txt does not cover subdomains, this project nonetheless does not programmatically call `portal.scscourt.org/search`.

The [terms-use](https://courts.ca.gov/about/terms-use) clearly states that the use of bots or data mining is explicitly forbidden. As such, this project and the demo make no requests to the site unless you have an authorized API key.

The creation of this project itself, for personal non-commercial purposes (granted, for a technical interview), should fall within fair use.

#### Your compliant approach to access limits and geo-restrictions.

This project makes no effort to circumvent geo-restrictions. To my knowledge, scscourt.org does not place geo-restrictions on browsing from my home internet.

Ensure you deploy your Lambda to an AWS region approved by the Santa Clara County Superior Court.

#### How mock-mode (offline fixtures) and live-mode are managed.

The source code uses offline fixtures unless you set up a `scscourt_key` in your AWS Secrets.

The live demo always uses offline fixtures.

#### Your safeguards for proxy or networking design (without any bypass methods).

To prevent excessive crawling, this project only finds detailed case data for the most recently filed case.

(It should only find the most recent filed case; however, the portal returns all results at once, so the fixture contains multiple cases.)

#### A clear statement confirming that no security protections were circumvented.

No security protections were circumvented in the creation of this project.
