# n8n-nodes-mrscraper

![MrScraper](./mrscraper.jpeg)

Use [MrScraper](https://mrscraper.com) in your n8n workflows to create and run AI or manual scrapers, extract structured content, discover URLs, search Google, and retrieve results.

This package is an [n8n community node](https://docs.n8n.io/integrations/community-nodes/) for the AI-powered MrScraper web scraping platform.

## Version 3.0.5

Version 3.0.5 reorganizes the node around six task-based resources and removes duplicated operations.

- New **Discovery**, **Extraction**, **Results**, **Scraper Creation**, and **Scraper Runs** resource names
- One **Scraper Runs** interface for single and batch runs of AI and manual scrapers
- Dedicated creation flows for prompt-based, listing, and website crawl scrapers
- Expected JSON output schemas for prompt-based and listing extraction
- Updated Google SERP v2 inputs: query, region, language, page, response format, and JavaScript rendering
- Streamlined rendered-page controls with opt-in Markdown and screenshots, selectable screenshot modes, selector waits, home-page navigation, and grouped advanced browser options
- Rendered HTML requests now consistently use the MrScraper API's `POST` method
- More run options for General, Listing, Map, and Manual scrapers

Version 3.0.5 changes resource and operation selections. Review the [migration guide](#migrating-from-2x) before activating existing workflows.

## Table of contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Resources and operations](#resources-and-operations)
  - [Account](#account)
  - [Discovery](#discovery)
  - [Extraction](#extraction)
  - [Results](#results)
  - [Scraper Creation](#scraper-creation)
  - [Scraper Runs](#scraper-runs)
- [Usage examples](#usage-examples)
- [Migrating from 2.x](#migrating-from-2x)
- [Compatibility](#compatibility)
- [Compliance and legal risk](#compliance-and-legal-risk)
- [Resources](#resources)

## Installation

Install `n8n-nodes-mrscraper` from **Settings > Community Nodes** in n8n. For other installation methods, follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

The node requires a **MrScraper API** credential.

1. Sign in to the [MrScraper app](https://app.mrscraper.com).
2. Create or copy an API token from your account.
3. In n8n, create a **MrScraper API** credential and enter the token in **API Token**.
4. Select the credential in your MrScraper node.

Keep the token private. Do not place it directly in workflow fields or commit it to source control.

## Resources and operations

Version 3.0.5 exposes six resources. Choose a resource, then select one of its operations.

### Account

- **Get Account Info** — Get account details, token usage, and token limits.

### Discovery

- **Crawl Website URLs** — Discover links from a starting URL. Set crawl depth, pages evaluated, result limit, and optional pipe-separated include or exclude regular expressions.
- **Search Google SERP** — Search Google through the synchronous SERP v2 API. Configure the query, region, language, page, JSON or HTML response format, and optional JavaScript rendering.

### Extraction

- **Extract Page by Prompt** — Extract data from one page using a natural-language prompt and an optional expected JSON output schema. Supports Super or Cheap mode and an optional proxy country.
- **Extract Listings and Paginated Content** — Extract repeated listing data with a prompt, optional item schema, page limit, and proxy country.
- **Extract Structured Data** — Use a preset extraction schema for Article, Forum Thread, Hotel, Job Posting, Post, Product, Property, Restaurant, Social Media Profile, or Tour / Attraction content.
- **Fetch Rendered HTML** — Load a page using the MrScraper stealth browser with a rendered JavaScript page. HTML is returned by default; Markdown and screenshots are opt-in. A screenshot can cover the full page or only the top. The primary fields configure retries, timeout, geolocation, and proxy country, while **Advanced Options** contains the token cap, CSS selector wait, lifecycle wait condition, resource blocking, home-page navigation, cookies, and Super mode.

### Results

- **Get Results** — Get paginated results for a scraper ID with page size and created-date sort order.
- **Get Latest Results** — Get the latest N results for a scraper ID.
- **Get Result Detail** — Get one complete result by result ID.

### Scraper Creation

- **Create Prompt-Based Scraper** — Create a General AI scraper from a URL, prompt, optional expected JSON schema, mode, and proxy country.
- **Create Listing Scraper** — Create a Listing AI scraper from a URL, prompt, optional item schema, maximum page count, and proxy country.
- **Create Website Crawl Scraper** — Create a Map AI scraper with crawl depth, maximum pages, result limit, and optional URL include or exclude patterns.

Created scrapers are available in your MrScraper account and can be reused with **Scraper Runs**.

### Scraper Runs

- **Run Existing Scraper** — Run one URL with an existing AI or manual scraper.
- **Run Existing Scraper in Batch** — Run multiple URLs with an existing AI or manual scraper.

For a single AI run, choose the agent type:

- **General** — Prompt-based page extraction, with optional HTML, Markdown, screenshot, cookies, JavaScript rendering, selector wait, and home-page visit settings.
- **Listing** — Listing and pagination extraction, with page and timeout limits plus optional streaming and rendering settings.
- **Map** — Website URL discovery with crawl limits and URL filtering patterns.

Manual runs support browser, proxy, cookie, paginator, recording, output, timeout, and token-cap options. Batch runs accept URLs as a JSON array or a comma/newline-separated list.

## Usage examples

### Extract data with a JSON shape

1. Select **Extraction > Extract Page by Prompt**.
2. Enter the page URL.
3. Enter a prompt such as `Extract the product name, price, availability, and image URL`.
4. Optionally enter an expected output schema:

```json
{
	"name": "string",
	"price": "number",
	"inStock": "boolean",
	"imageUrl": "string"
}
```

5. Select **Super** for stronger scraping capabilities or **Cheap** for sites with weaker protection, then run the node.

### Fetch a rendered page

1. Select **Extraction > Fetch Rendered HTML** and enter the target URL.
2. Leave **Return HTML** enabled, or enable **Return Markdown** if Markdown output is also needed.
3. To capture an image, enable **Screenshot**, then choose **Full** or **Top** under **Screenshot Mode**.
4. Use **Advanced Options** when the page needs a CSS selector wait, a different lifecycle event, resource blocking controls, home-page navigation, returned cookies, Super mode, or a custom token cap.

The operation defaults to a 300-second timeout, three retries, `us` geolocation and proxy country, HTML output enabled, and Markdown and screenshot output disabled. **Wait Until** supports **DOM Content Loaded**, **Load**, and **Network Idle**.

### Run an existing scraper in batch

1. Select **Scraper Runs > Run Existing Scraper in Batch**.
2. Choose **AI** or **Manual** and enter the scraper ID.
3. Enter the URLs as a JSON array:

```json
["https://example.com/page-1", "https://example.com/page-2"]
```

You can also use comma-separated or newline-separated URLs.

### Retrieve completed results

Use **Results > Get Latest Results** with the scraper ID, or use **Get Result Detail** when you already have a result ID.

## Migrating from 2.x

After upgrading, open each existing MrScraper node and reselect its resource and operation. The most common mappings are:

| 2.x selection                                       | 3.0.5 selection                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| Agent > General Agent                               | Scraper Creation > Create Prompt-Based Scraper                              |
| Agent > Listing Agent                               | Scraper Creation > Create Listing Scraper                                   |
| Agent > Map Agent                                   | Scraper Creation > Create Website Crawl Scraper                             |
| Batch Operation > Batch Scrape URLs                 | Scraper Runs > Run Existing Scraper in Batch                                |
| Rerun Scraper > Manual or AI agent operation        | Scraper Runs > Run Existing Scraper, then select the scraper and agent type |
| Get Result > Get Many                               | Results > Get Results                                                       |
| Get Result > Get Latest                             | Results > Get Latest Results                                                |
| Get Result > Get Detail                             | Results > Get Result Detail                                                 |
| Scraping > prompt, listing, or structured operation | Extraction > matching extraction operation                                  |
| SERP > Scrape Google SERP                           | Discovery > Search Google SERP                                              |
| Web Unblocker > Fetch Rendered HTML                 | Extraction > Fetch Rendered HTML                                            |

Also review these field changes:

- Google SERP now accepts a search query instead of a complete Google search URL and uses the v2 synchronous endpoint.
- Single and batch reruns now share **Scraper Runs**. Select **AI** or **Manual** explicitly.
- AI single runs expose agent-specific fields after selecting General, Listing, or Map.
- Batch URLs can be a JSON array string or a comma/newline-separated list.
- Prompt-based and listing operations can append an expected JSON schema to the extraction prompt.
- **Fetch Rendered HTML** now uses a screenshot toggle followed by a **Full** or **Top** mode; screenshots and Markdown are disabled by default.
- Browser rendering is always enabled and is no longer a user-configurable field.
- Token cap, resource blocking, lifecycle waiting, cookies, and Super mode are now under **Advanced Options**, which also adds CSS selector waiting and optional home-page navigation.

Test migrated workflows before enabling them in production.

## Compatibility

- `n8n-nodes-mrscraper` version: **3.0.5**
- Node.js: **22 or newer**
- Package manager used by this project: **npm**

## Compliance and legal risk

> [!WARNING]
> Scraping login-protected pages carries serious legal and compliance risks. Many websites prohibit automated access in their terms of service. Only scrape content you are authorized to access, review the target website's terms and applicable laws, and accept responsibility for how you use this node.

## Resources

- [MrScraper](https://mrscraper.com)
- [MrScraper app](https://app.mrscraper.com)
- [MrScraper API documentation](https://docs.mrscraper.com/docs/getting-started/overview)
- [MrScraper programmatic guide](https://docs.mrscraper.com/docs/guides/programmatically)
- [MrScraper n8n integration](https://n8n.io/integrations/mrscraper/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Changelog](./CHANGELOG.md)

## License

This package is released under the MIT License.
