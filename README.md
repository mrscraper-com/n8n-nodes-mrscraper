# n8n-nodes-mrscraper
![](./mrscraper.jpeg)

This is an n8n community node. It lets you use **MrScraper** in your n8n workflows.

**MrScraper** is an AI-powered web scraping platform. Create scrapers once (via the app or this node), then run them on any URL. Supports manual step-by-step scrapers, AI agents for detail/listing/map pages, batch scraping, and a stealth HTML fetcher.

- **Main site:** https://mrscraper.com  
- **API docs:** https://docs.mrscraper.com/docs/getting-started/overview

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Table of contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Resources & operations](#resources--operations)
  - [Account](#account)
  - [Agent](#agent)
  - [Create Scraper](#create-scraper)
  - [Rerun](#rerun)
  - [Result](#result)
  - [Scraping](#scraping)
  - [Web Unblocker](#web-unblocker)
- [Usage](#usage)
- [Compatibility](#compatibility)
- [Resources & links](#resources--links)
- [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

**MrScraper API** credentials are required. Use your API token from the [MrScraper API Tokens](https://app.mrscraper.com) page.

## Resources & operations

The node exposes **7 resources**. Pick a resource, then choose an operation.

### Account

- **Get Account Information** – Returns account details, token usage, and token limits.

### Agent

Create AI scrapers directly from n8n (they appear in your MrScraper account):

- **General Agent** – AI-powered extraction from a single page (detail pages). Sends URL + instructions to build a targeted JSON schema.
- **Listing Agent** – AI-powered extraction from listing/search pages with pagination, infinite scroll, or “load more”.
- **Map Agent** – Crawls from a start URL and collects URLs up to a limit (sitemap-style crawling).

### Create Scraper

Same as Agent but under the “Create Scraper” resource: create General, Listing, or Map Agent scrapers. Matches the [programmatic creation docs](https://docs.mrscraper.com/docs/guides/programmatically#step-4-create-detail-scraper).

### Rerun Scraper

Re-run existing scrapers (one URL per run). Parameters match the MrScraper platform.

- **Run Manual Scraper** – Run a manual (step-by-step) scraper created in the app on a new URL.
- **Run General Agent Scraper** – Run a General Agent scraper on a new URL.
- **Run Listing Agent Scraper** – Run a Listing Agent scraper on a new URL.
- **Run Map Agent Scraper** – Run a Map Agent scraper on a new URL.

### Get Result

Read scraping results from MrScraper:

- **Get Many** – Paginated list with filters and sorting (e.g. by scraper ID, date).
- **Get Latest** – N most recent results for a scraper.
- **Get Detail** – Full result by ID (data, screenshots, HTML if available).

### Scraping

Single-URL and batch scraping with the same scraper types as Rerun, with names aligned to use case:

- **Scrape Website Returns Structured Data (Manual)** – One URL, manual scraper.
- **Scrape Website Returns Structured Data (AI)** – One URL, General Agent.
- **Scrape Listing or Search Page Returns Structured Data (AI)** – One URL, Listing Agent.
- **Crawl Website Sitemap** – One URL, Map Agent.
- **Batch Scrape Multiple URLs (Manual)** – Many URLs in one request, manual scraper.
- **Batch Scrape Multiple URLs (AI)** – Many URLs in one request, AI scraper.

### Web Unblocker

- **Fetch HTML** – Returns the rendered HTML of a URL using the MrScraper stealth browser (JavaScript execution, bot evasion, optional geo proxy). Uses a separate API base (`api.mrscraper.com`). Options: URL, timeout, geo code, and whether to block images/CSS/fonts for faster loads.

## Usage

1. Create scrapers on the [MrScraper platform](https://app.mrscraper.com) (manual or AI) or create them from n8n via **Agent** or **Create Scraper**.
2. Enable API access for the scraper (platform or API).
3. In n8n, use **Rerun** or **Scraping** to run scrapers (single or batch).
4. Use **Result** to fetch results (Get Many, Get Latest, or Get Detail).
5. Use **Web Unblocker → Fetch HTML** when you only need rendered HTML without scraping logic.
6. Use **Account** to check token usage and limits.

## Compatibility

Tested with:

- n8n 2.x (e.g. 2.0.3)

Node package version: **2.0.0**.

## Version history

### 2.0.0

- **Account** resource: Get Account Information.
- **Agent** resource: Create General, Listing, and Map Agent scrapers from n8n.
- **Create Scraper** resource: Programmatic creation of General, Listing, and Map Agent scrapers.
- **Rerun** resource: Run Manual, General Agent, Listing Agent, and Map Agent scrapers (single URL).
- **Result** resource: Get Many, Get Latest, Get Detail.
- **Scraping** resource: Single-URL and batch operations (Manual, AI, Listing, Map, bulk).
- **Web Unblocker** resource: Fetch HTML (stealth browser, geo, block resources).
- Node version set to `[2, 0]` for n8n.

## Resources

- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)
- [MrScraper API documentation](https://docs.mrscraper.com/docs/getting-started/overview)
- [MrScraper programmatic guide](https://docs.mrscraper.com/docs/guides/programmatically)
- [Mrscraper Description & Template](https://n8n.io/integrations/mrscraper/)
