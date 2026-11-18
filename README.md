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

New nodes use **node version 3**, with three resources. The npm package version and the node version stored in workflows are separate values.

### Account

- **Get Account Info** — Get account details, token usage, and token limits. This keeps the existing `GET https://api.app.mrscraper.com/api/v1/subscription-accounts` implementation.

### Scraper API

All five operations use `https://api.mrscraper.com` and your saved credential.

HTML, Markdown, screenshot, and JSON requests also supply the documented `token` query parameter from that credential. Brand and Web Search requests use header authentication.

| Operation           | Request                                                                              | Output                                                  |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **Scrape HTML**     | `GET /` with `url` and `html=true`                                                   | Page content in `html`                                  |
| **Scrape Markdown** | `GET /` with `url`, `markdown=true`, and `html=false`                                | Page content in `markdown`                              |
| **Get Screenshot**  | `GET /` with `url`, `screenshot=full` or `top`, and browser rendering enabled        | API JSON containing the base64 screenshot and page HTML |
| **Scrape Brand**    | `POST /?action=brand-scraping&bundle=none&url=...` with a JSON body containing `url` | Brand data in `data.brand` and its ID in `data.job_id`  |
| **Scrape JSON**     | `POST /` with `url`, `prompt`, and `agent: "general"` in a JSON body                 | Structured extraction and API metadata                  |

For HTML, Markdown, and JSON, enable **Browser Rendering** when the page needs JavaScript. Screenshot requests always render the page in a browser.

**Options** exposes the settings supported by each page operation: geolocation, proxy country, retries, timeout, token cap, Super routing, lifecycle waiting, and applicable output or browser settings. Browser waits use `domcontentloaded`, `load`, `networkidle0`, or `networkidle2`. Options are sent only when added; omitting token cap or retries leaves those limits to the API. Timeout is in seconds. n8n also has a separate request timeout under its request options.

See the official references for [Scrape HTML](https://docs.mrscraper.com/docs/api/scraper-api/scrape-html), [Scrape Markdown](https://docs.mrscraper.com/docs/api/scraper-api/scrape-markdown), [Get Screenshot](https://docs.mrscraper.com/docs/api/scraper-api/get-screenshot), [Scrape Brand](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/scrape-brand), and [Scrape JSON](https://docs.mrscraper.com/docs/api/scraper-api/scrape-json).

### Discovery

- **Web Search** — Search with **Search Query**, **Country** (default `us`), and **Number of Results** (default `10`).

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

### Scrape and retrieve a brand

1. Select **Scraper API > Scrape Brand**.
2. Set **Brand Action** to **Scrape Brand** and enter the page URL.
3. Choose **Bundle**: **None** returns brand JSON; **Clean** adds HTML, screenshots, and a ZIP without scripts; **Full** keeps scripts in the ZIP. Clean and Full can take about a minute.
4. Keep `data.job_id` from the response.

To read it again, use **Brand Action > Get Brand** and supply **Job ID**. The node sends `GET /neo/brand?id=<job_id>`.

To download a file, use **Brand Action > Download File**, enter the job ID, and choose **HTML**, **ZIP Bundle**, **Screenshot**, or **Full Screenshot**. The node sends `GET /neo/brand?id=<job_id>&output=...` and puts the file in binary field `data`, ready for a file storage node. Jobs scraped with Bundle None only have HTML available; Clean and Full provide all four files.

See [Get Brand](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/get-brand) for the retrieval and download contract.

### Search the web

Select **Discovery > Web Search**, enter the query `e-menessaptieka.lv linkedin`, and leave Country `us` and Number of Results `10` to send the example request above.

## Existing workflows

Existing workflows saved with node version 0 or 2 keep their previous resources, operations, fields, and routes. The previous implementation remains available for those versions, including Extraction, Results, Scraper Creation, Scraper Runs, and Crawl Website URLs.

New version 3 nodes expose only Account, Scraper API, and Discovery. To migrate, create a new MrScraper node and configure its inputs explicitly:

| Previous selection                  | New selection                                                 |
| ----------------------------------- | ------------------------------------------------------------- |
| Account > Get Account Info          | Account > Get Account Info                                    |
| Discovery > Web Search              | Discovery > Web Search                                        |
| Extraction > Fetch Rendered HTML    | Scraper API > Scrape HTML, Scrape Markdown, or Get Screenshot |
| Extraction > Extract Page by Prompt | Scraper API > Scrape JSON                                     |

The Platform scraper creation, listing, crawl, run, and result operations remain in the older node versions. Scrape JSON performs extraction directly; configure its prompt and output schema when migrating. Test migrated workflows before activating them.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run lint
npm test
```

`npm test` builds the package and runs local regression tests for node versions, field visibility, request routing, prompt schemas, and brand downloads. These tests do not call the live MrScraper API.

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
