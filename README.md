# n8n-nodes-mrscraper
![](./mrscraper.jpeg)

This is an n8n community node. It lets you use **MrScraper** in your n8n workflows.

**MrScraper** is an AI-powered web scraping platform. Create scrapers once (via the app or this node), then run them on any URL. Supports manual step-by-step scrapers, AI agents for detail/listing/map pages, preset structured-data extraction, paginated listing scrapes, batch reruns, and a stealth HTML fetcher.

- **Main site:** https://mrscraper.com  
- **API docs:** https://docs.mrscraper.com/docs/getting-started/overview

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Table of contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Resources & operations](#resources--operations)
  - [Account](#account)
  - [Agent](#agent)
  - [Batch Operation](#batch-operation)
  - [Create Scraper](#create-scraper)
  - [Rerun Scraper](#rerun-scraper)
  - [Get Result](#get-result)
  - [Scraping](#scraping)
  - [SERP](#serp)
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

The node exposes **9 resources**. Pick a resource, then choose an operation.

Most calls use the app API (`api.app.mrscraper.com`). Some operations (paginated listing scrape and stealth HTML) use `api.mrscraper.com` with your token in the query string, as in the MrScraper API.

### Account

- **Get Account Information** – Returns account details, token usage, and token limits.

### Agent

Create AI scrapers directly from n8n (they appear in your MrScraper account):

- **General Agent** – AI-powered extraction from a single page (detail pages). Sends URL + instructions to build a targeted JSON schema.
- **Listing Agent** – AI-powered extraction from listing/search pages with pagination, infinite scroll, or “load more”.
- **Map Agent** – Crawls from a start URL and collects URLs up to a limit (sitemap-style crawling).

### Batch Operation

Run many URLs against a scraper you already created in the app (parallel server-side dispatch):

- **Batch Scrape URLs** – Choose **AI** or **Manual** mode, provide the scraper ID and a list of URLs. Calls the bulk rerun endpoints (`/api/v1/scrapers-ai-rerun/bulk` or `/api/v1/scrapers-manual-rerun/bulk`).

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

Single-step flows that create or run AI scrapers and helpers. Operations are named for what you do in the UI:

- **Crawl Website Sitemap** – Map Agent: from a start URL, collect URLs up to a limit (`graph: map`).
- **Scrape Dynamic Content by Prompt** – General Agent: URL + prompt to define what to extract (`graph: general`).
- **Scrape Search Results** – Listing Agent: URL + message for listing/search pages (`graph: listing`), via the app AI scrapers API.
- **Scrape Paginated Content** – Listing-style scrape with explicit pagination controls (URL, prompt, `maxPages`, etc.) via `api.mrscraper.com` (token in query).
- **Scrape Structured Data** – General Agent with a **preset schema by category** (Article, Product, Hotel, Job Posting, Property, Restaurant, and others). The prompt is selected from the chosen category.
- **Scrape Web Page** – Returns rendered HTML via the MrScraper stealth browser on `api.mrscraper.com` (JavaScript, bot evasion, optional geo proxy, resource blocking). Same family of behavior as **Web Unblocker → Fetch Rendered HTML**, exposed here under Scraping for convenience.

### SERP

- **Scrape Google SERP** – Fetch Google search results synchronously via `sync.scraper.mrscraper.com` (`POST /api/google/serp/sync`). Provide a Google search URL and optionally request raw HTML (`raw: true` by default).

### Web Unblocker

- **Fetch Rendered HTML** – Fetch the rendered HTML of a URL using the MrScraper stealth browser (`api.mrscraper.com`). Options include URL, timeout, geo code, and whether to block images/CSS/fonts for faster loads.

## Usage

1. Create scrapers on the [MrScraper platform](https://app.mrscraper.com) (manual or AI) or create them from n8n via **Agent** or **Create Scraper**.
2. Enable API access for the scraper (platform or API).
3. In n8n, use **Rerun Scraper** for one URL per run, or **Batch Operation** to send many URLs to an existing scraper in one request.
4. Use **Scraping** for single-shot AI creation/scrape flows (dynamic prompt, structured categories, paginated listing API, sitemap crawl, or stealth HTML).
5. Use **Get Result** to fetch results (Get Many, Get Latest, or Get Detail).
6. Use **Web Unblocker → Fetch Rendered HTML** (or **Scraping → Scrape Web Page**) when you only need rendered HTML without scraper definitions.
7. Use **Account** to check token usage and limits.

## Compatibility

Tested with:

- n8n 2.x (e.g. 2.0.3)

Node package version: **2.0.0**.

## Version history

### 2.0.0

- **Account** resource: Get Account Information.
- **Agent** resource: Create General, Listing, and Map Agent scrapers from n8n.
- **Batch Operation** resource: Batch Scrape URLs (AI or manual bulk rerun).
- **Create Scraper** resource: Programmatic creation of General, Listing, and Map Agent scrapers.
- **Rerun Scraper** resource: Run Manual, General Agent, Listing Agent, and Map Agent scrapers (single URL).
- **Get Result** resource: Get Many, Get Latest, Get Detail.
- **Scraping** resource: Crawl Website Sitemap; Scrape Dynamic Content by Prompt; Scrape Search Results; Scrape Paginated Content; Scrape Structured Data (preset categories); Scrape Web Page (stealth HTML).
- **Web Unblocker** resource: Fetch Rendered HTML (stealth browser, geo, block resources).
- Node version set to `[2, 0]` for n8n.

## Resources

- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)
- [MrScraper API documentation](https://docs.mrscraper.com/docs/getting-started/overview)
- [MrScraper programmatic guide](https://docs.mrscraper.com/docs/guides/programmatically)
- [Mrscraper Description & Template](https://n8n.io/integrations/mrscraper/)
