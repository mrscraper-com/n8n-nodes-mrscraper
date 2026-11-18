# n8n-nodes-mrscraper

![MrScraper](./mrscraper.jpeg)

Use [MrScraper](https://mrscraper.com) in n8n to scrape HTML, Markdown, screenshots, brand information, and structured JSON, search the web, and check your account.

This package is an [n8n community node](https://docs.n8n.io/integrations/community-nodes/).

## Installation

Install `n8n-nodes-mrscraper` from **Settings > Community Nodes** in n8n. For other installation methods, follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. Sign in to the [MrScraper app](https://app.mrscraper.com) and copy an API token from your account.
2. Create a **MrScraper API** credential in n8n and enter the token in **API Token**.
3. Select that credential in your MrScraper node.

The node sends the saved token in the `x-api-token` header. Keep it in the credential rather than workflow fields or source control.

## Resources and operations

The node has three resources: **Account**, **Scraper API**, and **Discovery**.

### Account

- **Get Account Info** — Get account details, token usage, and token limits. This keeps the existing `GET https://api.app.mrscraper.com/api/v1/subscription-accounts` implementation.

### Scraper API

All five operations use `https://api.mrscraper.com` and your saved credential.

HTML, Markdown, screenshot, and JSON requests also supply the documented `token` query parameter from that credential. Brand and Web Search requests use header authentication.

| Operation           | Request                                                                       | Output                                                  |
| ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Scrape HTML**     | `GET /` with `url` and `html=true`                                            | Page content in `html`                                  |
| **Scrape Markdown** | `GET /` with `url`, `markdown=true`, and `html=false`                         | Page content in `markdown`                              |
| **Get Screenshot**  | `GET /` with `url`, `screenshot=full` or `top`, and browser rendering enabled | API JSON containing the base64 screenshot and page HTML |
| **Scrape Brand**    | `GET /?action=brand-scraping&bundle=none&url=...`                             | Brand data in `data.brand` and its ID in `data.job_id`  |
| **Scrape JSON**     | `POST /` with `url`, `prompt`, and `agent: "general"` in a JSON body          | Structured extraction and API metadata                  |

For HTML, Markdown, and JSON, enable **Browser Rendering** when the page needs JavaScript. Screenshot requests always render the page in a browser.

These fields are always sent:

| Field             | Operations                       | Default | Query parameter |
| ----------------- | -------------------------------- | ------- | --------------- |
| **Warm Start**    | HTML, Markdown, Screenshot       | `true`  | `warmStart`     |
| **Super**         | HTML, Markdown, Screenshot, JSON | `true`  | `super`         |
| **Proxy Country** | HTML, Markdown, Screenshot, JSON | `us`    | `proxyCountry`  |

For example, Scrape HTML with the defaults sends:

```sh
curl 'https://api.mrscraper.com/?token=<token>&html=true&url=https%3A%2F%2Fwww.scrapethissite.com&browserRendering=false&warmStart=true&super=true&proxyCountry=us' \
  --header 'x-api-token: <token>'
```

**Options** (HTML, Markdown, screenshot, and JSON) exposes the remaining settings supported by each operation: geolocation, retries, timeout, token cap, lifecycle waiting, and applicable output or browser settings. Browser waits use `domcontentloaded`, `load`, `networkidle0`, or `networkidle2`. Options are sent only when added; omitting token cap or retries leaves those limits to the API. Timeout is in seconds. n8n also has a separate request timeout under its request options.

See the official references for [Scrape HTML](https://docs.mrscraper.com/docs/api/scraper-api/scrape-html), [Scrape Markdown](https://docs.mrscraper.com/docs/api/scraper-api/scrape-markdown), [Get Screenshot](https://docs.mrscraper.com/docs/api/scraper-api/get-screenshot), [Scrape Brand](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/scrape-brand), and [Scrape JSON](https://docs.mrscraper.com/docs/api/scraper-api/scrape-json).

### Discovery

- **Web Search** — Search with **Search Query**, **Country** (default `us`), and **Number of Results** (default and minimum `10`).

The node sends `POST https://api.mrscraper.com/` with this JSON body:

```json
{
	"action": "websearch",
	"query": "e-menessaptieka.lv linkedin",
	"country": "us",
	"numResults": 10
}
```

Authentication uses the saved credential in `x-api-token`; the content type is `application/json`.

## Usage examples

### Extract structured JSON

1. Select **Scraper API > Scrape JSON** and enter a page URL.
2. Set **Prompt**, for example `Extract the product name, price, and availability`.
3. Optionally supply **Expected Output Schema**:

```json
{
	"name": "string",
	"price": "number",
	"inStock": "boolean"
}
```

The schema is appended to the prompt as a `Json Schema:` section. Requests use POST so long prompts and schemas do not exceed the URL length limit. Prompts describe the data to extract from the scraped page.

### Scrape a brand

Select **Scraper API > Scrape Brand** and enter the page URL. The node sends:

```sh
curl 'https://api.mrscraper.com/?action=brand-scraping&bundle=none&url=https%3A%2F%2Fbooks.toscrape.com%2F' \
  --header 'x-api-token: <token>'
```

The response contains colors, typography, logos, social links, and other brand metadata in `data.brand`, plus `data.job_id`.

### Search the web

Select **Discovery > Web Search**, enter the query `e-menessaptieka.lv linkedin`, and leave Country `us` and Number of Results `10` to send the example request above.

## Upgrading from 4.x

This release replaces the previous resources. Only Account, Scraper API, and Discovery remain; Extraction, Results, Scraper Creation, Scraper Runs, and Crawl Website URLs were removed. Workflows that use a removed operation must be rebuilt with a new MrScraper node:

| Previous selection                  | New selection                                                 |
| ----------------------------------- | ------------------------------------------------------------- |
| Account > Get Account Info          | Account > Get Account Info                                    |
| Discovery > Web Search              | Discovery > Web Search                                        |
| Extraction > Fetch Rendered HTML    | Scraper API > Scrape HTML, Scrape Markdown, or Get Screenshot |
| Extraction > Extract Page by Prompt | Scraper API > Scrape JSON                                     |

Scraper creation, listing, crawl, run, and result operations have no replacement in the node. Test migrated workflows before activating them.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run lint
npm test
```

`npm test` builds the package and runs local regression tests for resources, field visibility, request routing, and prompt schemas. These tests do not call the live MrScraper API.

## Compliance and legal risk

> [!WARNING]
> Scraping login-protected pages carries serious legal and compliance risks. Many websites prohibit automated access in their terms of service. Only scrape content you are authorized to access, review the target website's terms and applicable laws, and accept responsibility for how you use this node.

## Resources

- [MrScraper](https://mrscraper.com)
- [MrScraper app](https://app.mrscraper.com)
- [MrScraper API reference](https://docs.mrscraper.com/docs/api/overview)
- [MrScraper n8n integration](https://n8n.io/integrations/mrscraper/)
- [Changelog](./CHANGELOG.md)

## License

This package is released under the MIT License.
