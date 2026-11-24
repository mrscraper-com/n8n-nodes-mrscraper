# n8n-nodes-mrscraper

![MrScraper](./mrscraper.jpeg)

Use MrScraper in n8n to retrieve HTML, Markdown, screenshots, structured JSON, brand information, web search results, and account information.

## Installation and credentials

Install `n8n-nodes-mrscraper` from **Settings > Community Nodes**. Create a **MrScraper API** credential with your API token from [the MrScraper app](https://app.mrscraper.com).

Requests authenticate with both `Authorization: Bearer <token>` and `x-api-token`, matching the local Python SDK. Credentials are never sent as query parameters.

## Quick start

1. Connect a **Manual Trigger** to a **MrScraper** node.
2. Select your credential and **Scraper API > Scrape HTML**.
3. Set **URL** to `https://books.toscrape.com/` and execute.
4. Read `{{ $json.html }}` in the next node. For Markdown, choose **Scrape Markdown** and read `{{ $json.markdown }}`.

## Operations

| Resource    | Operation        | Upstream request                                                                     |
| ----------- | ---------------- | ------------------------------------------------------------------------------------ |
| Account     | Get Account Info | GET `https://api.app.mrscraper.com/api/v1/subscription-accounts`                     |
| Scraper API | Scrape HTML      | GET `https://api.mrscraper.com/`, `html=true`, `markdown=false`, `screenshot=false`  |
| Scraper API | Scrape Markdown  | GET same endpoint, `markdown=true`, `html=false`, `screenshot=false`                 |
| Scraper API | Get Screenshot   | GET same endpoint, `html=false`, `markdown=false`, `browserRendering=true`           |
| Scraper API | Scrape JSON      | GET same endpoint, `url`, `prompt`, `agent=general`, `html=true`, `screenshot=false` |
| Scraper API | Scrape Brand     | GET same endpoint, `action=brand-scraping`, `bundle=none`, `url`                     |
| Discovery   | Web Search       | GET same endpoint, `action=websearch`, `query`, optional `country`, `numResults`     |

Page inputs are query parameters. JSON extraction switches to POST when the encoded request URL exceeds 8,000 characters; only `url`, `prompt`, and `agent` move into the JSON body. All other controls stay in the query.

## Page controls

These controls apply to Scrape HTML, Scrape Markdown, Get Screenshot, and Scrape JSON, with the operation-specific exceptions below. Add optional controls under **Options > Add Option**.

| Control           | Default / behavior                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL               | Required absolute HTTP or HTTPS URL                                                                                                                              |
| Browser Rendering | Automatic: omit the parameter so the service can switch to a browser when blocked. Enabled sends true; Disabled sends false. Available for HTML, Markdown, JSON. |
| Warm Start        | False; available for HTML, Markdown, JSON                                                                                                                        |
| Block Resources   | False; available for HTML, Markdown, JSON                                                                                                                        |
| Timeout           | 300 seconds, range 1–330. The HTTP transport allows 30 additional seconds.                                                                                       |
| Wait for Selector | Optional, up to 500 characters                                                                                                                                   |
| Geo Code          | Optional two-letter country code, normalized to lowercase                                                                                                        |
| Max Age           | 0 milliseconds, maximum 604800000 (seven days). Cached requests cost the same tokens as the original scrape.                                                     |
| Max Retries       | Omitted for unlimited retries. Add this option to set a nonnegative integer; zero disables retries.                                                              |
| Action            | Optional routing action or analytics label; HTML and Markdown only                                                                                               |

**Warm Start** is a main field. **Block Resources**, **Timeout**, **Wait for Selector**, **Geo Code**, **Max Age**, **Max Retries**, and **Action** are optional controls. Adding **Max Retries** inserts `3`; change it to the limit you need or remove it for unlimited retries.

Every page request sends `saveResult=true`; this is not a user option. `proxy`, `proxyCountry`, `super`, `returnCookie`, `tokenCap`, and `waitUntil` are not exposed or forwarded.

### Screenshots

**Get Screenshot > Screenshot Mode** accepts `full`, `top`, or `WIDTHxHEIGHT[-ZOOM]`, such as `1280x800` or `1920x1080-75`. Dimensions must be 100–3840 pixels and zoom 25–300 percent. Browser rendering is always enabled. This operation has no Warm Start or Block Resources control.

To capture a screenshot with HTML, add **Options > Screenshot Area**. The same formats apply, and browser rendering is forced on. The screenshot is returned by the API as Base64; inspect the output before mapping it to another node.

### JSON extraction

Set **Prompt** to describe the data you need. The default is `Extract all data as complete as possible.` An optional **Expected Output Schema** is appended as `Json Schema:` followed by serialized JSON.

**Return HTML** defaults to true. **Screenshot** is a boolean and defaults to false. JSON extraction supports Warm Start, Block Resources, and Wait for Selector.

The node passes JSON API responses through. Inspect the output and use fields such as `{{ $json.data }}` in later nodes.

### Web Search

**Search Query** is trimmed and must contain 1–1000 characters. **Country** is optional and normalized to a lowercase two-letter code. **Number of Results** defaults to 10 and must be 10–100. The transport timeout is 120 seconds.

### Scrape Brand

Scrape Brand is retained with its existing action, bundle, and URL query. It does not expose page controls. Inspect `{{ $json.data.brand }}` and `{{ $json.data.job_id }}` in the response.

## Request examples

The following objects show the query parameters sent upstream. They are not JSON request bodies. Authentication comes from your saved credential.

### Scrape HTML with automatic browser selection

Select **Scraper API > Scrape HTML**, enter the URL, and leave **Browser Rendering** on **Automatic**:

```json
{
	"url": "https://books.toscrape.com/",
	"html": true,
	"markdown": false,
	"screenshot": false,
	"timeout": 300,
	"warmStart": false,
	"blockResources": false,
	"saveResult": true,
	"maxAge": 0
}
```

Automatic leaves `browserRendering` out of the request. Optional fields such as `geoCode`, `waitForSelector`, and `maxRetries` are omitted until configured.

### Extract product data

Select **Scrape JSON** and use these fields:

| Field                  | Example                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| URL                    | `https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html` |
| Prompt                 | `Extract the product name, price, and availability.`                        |
| Expected Output Schema | `{ "name": "string", "price": "number", "inStock": "boolean" }`             |
| Options > Return HTML  | `false` if you only need extracted data                                     |

The node appends the schema to the prompt and sends `agent=general`. Read the response JSON before mapping the extracted fields; the shape depends on the API response and your prompt.

### Capture a custom screenshot

Select **Get Screenshot**, enter the URL, and set **Screenshot Mode** to `1920x1080-75`. Add **Options > Wait for Selector** if you need to wait for a page element. This sends `screenshot=1920x1080-75`, `browserRendering=true`, `html=false`, and `markdown=false`, alongside the shared page defaults.

### Search the web

Select **Discovery > Web Search**, set **Search Query** to `web scraping tutorials`, leave **Country** blank, and keep **Number of Results** at `10`:

```json
{
	"action": "websearch",
	"query": "web scraping tutorials",
	"numResults": 10
}
```

This is a GET request. Country is omitted when blank; entering `GB` sends `country=gb`.

## Use values from other nodes

If a preceding node outputs `{ "url": "https://example.com" }`, switch the MrScraper **URL** field to expression mode and use `{{ $json.url }}`. For search input, use `{{ $json.query }}` in **Search Query**.

HTML and Markdown are wrapped in `html` and `markdown` output fields. Account, Brand, Screenshot, JSON, and Search responses pass through as returned by the API; inspect the node's output JSON before choosing expressions. The node does not add the Python SDK's `status_code`, `data`, and `headers` response envelope.

## Troubleshooting

| Symptom                                        | What to check                                                                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Old Proxy or Proxy Country fields still appear | Restart the local development server and reload the editor. Confirm n8n is loading this local package rather than another installed copy. |
| Authentication fails                           | Check the selected MrScraper API credential and token.                                                                                    |
| Dynamic content is missing                     | Set Browser Rendering to Enabled and optionally add Wait for Selector.                                                                    |
| Expected Output Schema is rejected             | Enter valid JSON with double quotes and no trailing commas.                                                                               |
| A request waits too long                       | Set Timeout (1–330 seconds) and Max Retries. Transport allows an additional 30 seconds.                                                   |
| Screenshot settings are rejected               | Use full, top, or a supported viewport such as 1280x800 or 1920x1080-75.                                                                  |

## Migration

Reconfigure existing nodes after upgrading: legacy proxy and scraping options have been removed. Browser Rendering now defaults to Automatic. Web Search and ordinary JSON extraction now use GET. Results are always saved. Screenshot requests no longer request HTML.

The previous Extraction, Results, Scraper Creation, Scraper Runs, and Crawl Website URLs resources are unavailable; rebuild those workflows with the supported operations.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by the development server to test the local node in n8n.

```sh
npm run lint
npm test
```

Tests build the package and verify request preparation, defaults, validation, resource visibility, authentication configuration, and JSON GET/POST fallback without calling the live API.

## Resources

- [MrScraper](https://mrscraper.com)
- [API reference](https://docs.mrscraper.com/docs/api/overview)
- [Changelog](./CHANGELOG.md)

## License

MIT.
