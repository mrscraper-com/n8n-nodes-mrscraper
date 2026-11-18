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

- **Get Account Info** — Retrieve your account details, including token usage and limits. The node sends `GET https://api.app.mrscraper.com/api/v1/subscription-accounts`.

### Scraper API

All five operations call `https://api.mrscraper.com` with your saved credential.

HTML, Markdown, screenshot, and JSON requests also send the token as the `token` query parameter, as the API reference requires. Brand and Web Search requests authenticate with the header only.

| Operation           | Request                                                                       | Output                                                        |
| ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Scrape HTML**     | `GET /` with `url` and `html=true`                                            | Page content in `html`                                        |
| **Scrape Markdown** | `GET /` with `url`, `markdown=true`, and `html=false`                         | Page content in `markdown`                                    |
| **Get Screenshot**  | `GET /` with `url`, `screenshot=full` or `top`, and browser rendering enabled | JSON with the Base64-encoded screenshot and the page HTML     |
| **Scrape Brand**    | `GET /?action=brand-scraping&bundle=none&url=...`                             | Brand details in `data.brand` and the job ID in `data.job_id` |
| **Scrape JSON**     | `POST /` with `url`, `prompt`, and `agent: "general"` in a JSON body          | Extracted data as JSON, plus API metadata                     |

For HTML, Markdown, and JSON, enable **Browser Rendering** when the page needs JavaScript. Screenshot requests always render the page in a browser.

The following fields are always sent. Turn on **Warm Start** or **Super** for more reliable scraping on difficult pages.

| Field             | Operations                       | Default | Query parameter |
| ----------------- | -------------------------------- | ------- | --------------- |
| **Warm Start**    | HTML, Markdown, Screenshot       | `false` | `warmStart`     |
| **Super**         | HTML, Markdown, Screenshot, JSON | `false` | `super`         |
| **Proxy Country** | HTML, Markdown, Screenshot, JSON | `us`    | `proxyCountry`  |

For example, Scrape HTML with the defaults sends:

```sh
curl 'https://api.mrscraper.com/?token=<token>&html=true&url=https%3A%2F%2Fwww.scrapethissite.com&browserRendering=false&warmStart=false&super=false&proxyCountry=us' \
  --header 'x-api-token: <token>'
```

Under **Options**, the HTML, Markdown, screenshot, and JSON operations offer additional settings, such as geolocation, retries, timeout, token cap, page load waiting, and output or browser settings for the selected operation. **Wait Until** accepts `domcontentloaded`, `load`, `networkidle0`, or `networkidle2`. Options are sent only when you add them, so leaving out **Token Cap** or **Max Retries** means no limit is applied. **Timeout** is measured in seconds and is separate from n8n's own request timeout.

See the official references for [Scrape HTML](https://docs.mrscraper.com/docs/api/scraper-api/scrape-html), [Scrape Markdown](https://docs.mrscraper.com/docs/api/scraper-api/scrape-markdown), [Get Screenshot](https://docs.mrscraper.com/docs/api/scraper-api/get-screenshot), [Scrape Brand](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/scrape-brand), and [Scrape JSON](https://docs.mrscraper.com/docs/api/scraper-api/scrape-json).

### Discovery

- **Web Search** — Search the web using **Search Query**, **Country** (default `us`), and **Number of Results** (default and minimum `10`).

The node sends `POST https://api.mrscraper.com/` with this JSON body:

```json
{
	"action": "websearch",
	"query": "e-menessaptieka.lv linkedin",
	"country": "us",
	"numResults": 10
}
```

The request authenticates with the `x-api-token` header and uses the `application/json` content type.

## Usage examples

### Extract structured JSON

1. Select **Scraper API > Scrape JSON** and enter a page URL.
2. Enter a **Prompt**, such as `Extract the product name, price, and availability`.
3. Optionally, add an **Expected Output Schema**:

```json
{
	"name": "string",
	"price": "number",
	"inStock": "boolean"
}
```

The schema is appended to the prompt as a `Json Schema:` section. Requests are sent as POST so that long prompts and schemas stay within the URL length limit. The prompt only describes what to extract from the scraped page; it cannot change how the page is scraped.

### Scrape a brand

Select **Scraper API > Scrape Brand** and enter the page URL. The node sends:

```sh
curl 'https://api.mrscraper.com/?action=brand-scraping&bundle=none&url=https%3A%2F%2Fbooks.toscrape.com%2F' \
  --header 'x-api-token: <token>'
```

The response includes colors, typography, logos, social links, and other brand details in `data.brand`, along with the job ID in `data.job_id`.

### Search the web

Select **Discovery > Web Search**, enter the query `e-menessaptieka.lv linkedin`, and keep the default Country (`us`) and Number of Results (`10`) to send the example request above.

## Upgrading from 4.x

This release replaces the previous resources. Only Account, Scraper API, and Discovery remain. Extraction, Results, Scraper Creation, Scraper Runs, and Crawl Website URLs have been removed, so workflows that use them must be rebuilt with a new MrScraper node:

| Previous selection                  | New selection                                                 |
| ----------------------------------- | ------------------------------------------------------------- |
| Account > Get Account Info          | Account > Get Account Info                                    |
| Discovery > Web Search              | Discovery > Web Search                                        |
| Extraction > Fetch Rendered HTML    | Scraper API > Scrape HTML, Scrape Markdown, or Get Screenshot |
| Extraction > Extract Page by Prompt | Scraper API > Scrape JSON                                     |

The scraper creation, listing, crawl, run, and result operations have no replacement in this node. Test migrated workflows before activating them.

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
