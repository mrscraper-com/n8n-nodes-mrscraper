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

All five operations call `https://api.mrscraper.com` by GET and authenticate with the `x-api-token` header from your saved credential. Each operation sends only the parameters listed in the [MrScraper API reference](https://docs.mrscraper.com/docs/api/overview).

| Operation           | Request                                                                                            | Output                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Scrape HTML**     | `GET /` with `url`, `html=true`, `markdown=false`, and an optional screenshot                      | Page content in `html`; with a screenshot, `html` and `screenshot`                    |
| **Scrape Markdown** | `GET /` with `url`, `markdown=true`, `html=false`, and `screenshot=false`                          | Page content in `markdown`                                                            |
| **Get Screenshot**  | `GET /` with `url`, `screenshot=full`, `html=false`, `markdown=false`, and `browserRendering=true` | JSON with the Base64-encoded full-page screenshot; the API also returns the page HTML |
| **Scrape Brand**    | `GET /?action=brand-scraping&bundle=none&url=...`                                                  | Brand details in `data.brand` and the job ID in `data.job_id`                         |
| **Scrape JSON**     | `GET /` with `url`, `prompt`, and `agent=general`; `POST /` for long URLs                          | Extracted data as JSON, plus API metadata                                             |

HTML, Markdown, Screenshot, and JSON results are always saved to the Result tab in your MrScraper account (`saveResult=true`), and no token cap is sent.

**Browser Rendering** (HTML, Markdown, and JSON) has three choices. **Auto**, the default, leaves the field out, so the API loads the page without a browser first and switches to a browser if the request is blocked. **Enabled** always loads the page in a browser, which JavaScript-heavy pages need, and **Disabled** never does. Get Screenshot always renders the page in a browser.

In Scrape HTML, **Screenshot** can be **None** (the default), **Full Page**, **Top of Page**, or **Custom Viewport**, which uses the **Viewport** you enter as `WIDTHxHEIGHT` from 100 to 3840 pixels with an optional `-ZOOM` percent from 25 to 300, such as `1280x800` or `1920x1080-75`. Any screenshot also sends `browserRendering=true`, whatever Browser Rendering is set to, and the response becomes JSON with `html` and `screenshot`.

Requests also send these documented defaults. Change them with the top-level fields or by adding the matching entry under **Options**:

| Field or option     | Operations                       | Default | Query parameter  |
| ------------------- | -------------------------------- | ------- | ---------------- |
| **Timeout**         | HTML, Markdown, Screenshot, JSON | `300`   | `timeout`        |
| **Max Age**         | HTML, Markdown, Screenshot, JSON | `0`     | `maxAge`         |
| **Block Resources** | HTML, Markdown, JSON             | `false` | `blockResources` |
| **Warm Start**      | HTML, Markdown, JSON             | `false` | `warmStart`      |
| **Screenshot**      | HTML                             | `false` | `screenshot`     |
| **Return HTML**     | JSON                             | `true`  | `html`           |
| **Screenshot**      | JSON                             | `false` | `screenshot`     |

For example, Scrape HTML with the defaults sends:

```sh
curl 'https://api.mrscraper.com/?html=true&markdown=false&timeout=300&saveResult=true&maxAge=0&blockResources=false&url=https%3A%2F%2Fwww.scrapethissite.com&screenshot=false&warmStart=false' \
  --header 'x-api-token: <token>'
```

**Options** also offers settings that are sent only when you add them:

- **Action** (HTML and Markdown) routes the request to a scraper action or flags it for analytics. The action must exist for the target site; an unknown action fails with HTTP 400.
- **Geo Code** is the two-letter country to load the page from. Leave it out to load the page from the United States.
- **Max Retries** limits retries. Leave it out for no limit.
- **Wait for Selector** waits for a CSS selector or text, up to 500 characters. It needs a rendered page, so do not combine it with Browser Rendering set to **Disabled**.

**Max Age** returns a cached result of the same request when it is newer than the selected age, in milliseconds up to `604800000` (7 days); a cached result costs the same tokens as the original scrape, and `0` always scrapes fresh. **Timeout** accepts 1 to 330 seconds and is separate from n8n's own request timeout. The node checks these ranges, the Geo Code format, and the Viewport format before it sends a request.

See the official references for [Scrape HTML](https://docs.mrscraper.com/docs/api/scraper-api/scrape-html), [Scrape Markdown](https://docs.mrscraper.com/docs/api/scraper-api/scrape-markdown), [Get Screenshot](https://docs.mrscraper.com/docs/api/scraper-api/get-screenshot), [Scrape Brand](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/scrape-brand), and [Scrape JSON](https://docs.mrscraper.com/docs/api/scraper-api/scrape-json).

### Discovery

- **Web Search** — Search the web using **Search Query**, an optional **Country**, and **Number of Results** (default `10`, from `10` to `100`).

The node sends a GET request with `action=websearch` and the search settings in the query string, after trimming the query. **Country** is sent in lowercase when you enter one; leave it empty to search from the United States:

```sh
curl 'https://api.mrscraper.com/?action=websearch&query=e-menessaptieka.lv+linkedin&numResults=10' \
  --header 'x-api-token: <token>'
```

The request authenticates with the `x-api-token` header.

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

The schema is appended to the prompt as a `Json Schema:` section. The node sends `url`, `prompt`, and `agent=general` in the query string of a GET request. If the encoded URL would exceed 8,000 characters, for example with a long prompt or schema, it sends a POST instead, with `url`, `prompt`, and `agent` in a JSON body and the other settings in the query string. The prompt only describes what to extract from the scraped page; it cannot change how the page is scraped.

### Scrape a brand

Select **Scraper API > Scrape Brand** and enter the page URL. The node sends:

```sh
curl 'https://api.mrscraper.com/?action=brand-scraping&bundle=none&url=https%3A%2F%2Fbooks.toscrape.com%2F' \
  --header 'x-api-token: <token>'
```

The response includes colors, typography, logos, social links, and other brand details in `data.brand`, along with the job ID in `data.job_id`.

### Search the web

Select **Discovery > Web Search**, enter the query `e-menessaptieka.lv linkedin`, leave Country empty, and keep the default Number of Results (`10`) to send the example request above.

## Upgrading from 5.0

Version 5.1 sends only the parameters in the MrScraper API reference:

- **Super**, **Proxy Country**, **Screenshot Mode**, and the **Proxy**, **Return Cookie**, **Wait Until**, **Save Result**, and **Token Cap** options are removed, and requests no longer repeat the token as a `token` query parameter. Results are always saved to your account, and no token cap is sent.
- **Browser Rendering** now offers Auto, Enabled, and Disabled. Workflows saved with it on or off keep that choice; workflows that left it at the old default now use Auto.
- **Get Screenshot** always captures the full page. Use **Scrape HTML** with **Screenshot** set to Top of Page or Custom Viewport for other areas.
- Scrape HTML also sends `markdown=false`, Scrape Markdown sends `html=false` and `screenshot=false`, and Get Screenshot sends `html=false` and `markdown=false`. **Web Search** sends Country only when you enter one.
- New: **Screenshot** in Scrape HTML, and the **Action** and **Max Age** options. Scrape JSON also accepts **Warm Start**, **Block Resources**, and **Wait for Selector**. Timeout accepts up to 330 seconds.

Check workflows that used a removed field before activating them.

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
