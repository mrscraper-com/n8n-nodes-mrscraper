# n8n-nodes-mrscraper

![MrScraper](./mrscraper.jpeg)

Use the seven MrScraper services in n8n to retrieve page HTML, Markdown, screenshots, brand details, structured JSON, web search results, and account status.

## Overview

Services share their upstream API with the MrScraper CLI and SDKs. This integration organizes them into n8n resources, stores authentication in credentials, and returns results as n8n items.

| Resource    | Operation                           | Description                                                                                                                |
| ----------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Scraper API | [Scrape HTML](#scrape-html)         | Retrieve the raw HTML of a page. Browser rendering is optional.                                                            |
| Scraper API | [Scrape Markdown](#scrape-markdown) | Retrieve a page as clean Markdown. Browser rendering is optional.                                                          |
| Scraper API | [Get Screenshot](#get-screenshot)   | Capture a Base64 PNG screenshot of the full page, first viewport, or custom viewport. Browser rendering is always enabled. |
| Scraper API | [Scrape Brand](#scrape-brand)       | Extract a website's colors, typography, logos, and social links as JSON.                                                   |
| Scraper API | [Scrape JSON](#scrape-json)         | Extract structured JSON from a page using a natural-language prompt and optional schema.                                   |
| Discovery   | [Web Search](#web-search)           | Search the web and return ranked results with titles, URLs, descriptions, and sources.                                     |
| Account     | [Get Status](#get-status)           | Return the raw account status API response without summarizing, redacting body fields, or adding calculated fields.        |

## Installation

Install `n8n-nodes-mrscraper` through **Settings > Community Nodes** in your n8n instance. See the [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) for installation methods and requirements.

For local development with this repository, see [Development](#development).

## Authentication

1. Obtain an API token from [the MrScraper app](https://app.mrscraper.com/api-tokens).
2. Create a **MrScraper API** credential in n8n.
3. Paste the token into **API Token** and select that credential in your MrScraper node.

The saved credential supplies `Authorization: Bearer <token>` and `x-api-token` headers. Tokens are not sent in the request URL. Store the token in the credential rather than in workflow fields or Code nodes.

## Quick start

1. Add a **Manual Trigger** and connect it to a **MrScraper** node.
2. Select your **MrScraper API** credential.
3. Set **Resource** to **Scraper API** and **Operation** to **Scrape HTML**.
4. Enter `https://example.com` in **URL**.
5. Leave **Browser Rendering** at **None**, **Warm Start** off, and **Geo Code** blank.
6. Execute the node. Read the HTML using `{{ $json.html }}` in a following node.

Replace the example target with your page. Live scraping and search calls consume account quota. Response examples below illustrate selected fields; content and arrays are abbreviated, and actual responses can include additional fields.

## Shared page controls

Scrape HTML, Scrape Markdown, Get Screenshot, and Scrape JSON share the following controls. Scrape Brand, Web Search, and Get Status have separate inputs described below.

### Main configuration

| Field    | HTTP field | Type   | Default        | Description                                                                                     |
| -------- | ---------- | ------ | -------------- | ----------------------------------------------------------------------------------------------- |
| URL      | `url`      | String | Required       | Absolute HTTP or HTTPS URL of the page to process.                                              |
| Geo Code | `geoCode`  | String | Blank; omitted | Two-letter country code to load the page from, sent in lowercase. For example, `ID` sends `id`. |

**Geo Code is a regular field outside Options.** Leaving it blank uses the API's default location. The CLI reference describes that default as the United States.

### Options

Add these through **Options > Add Option**:

| Field             | HTTP field        | Type    | Default sent | Description                                                                                                                                                                                                            |
| ----------------- | ----------------- | ------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Timeout           | `timeout`         | Integer | `300`        | Maximum seconds to wait for the scrape, from 1 to 330. The HTTP request allows 30 additional seconds.                                                                                                                  |
| Wait for Selector | `waitForSelector` | String  | Omitted      | CSS selector or text to wait for before returning the result, up to 500 characters.                                                                                                                                    |
| Max Age           | `maxAge`          | Integer | `0`          | Return a cached result of the same request when it is newer than this age in milliseconds. Maximum 604800000 (seven days). Zero requests a fresh scrape. A cached result costs the same tokens as the original scrape. |
| Max Retries       | `maxRetries`      | Integer | Omitted      | Maximum retries, as a nonnegative integer. Omit for no limit; zero disables retries. Adding the option inserts `3`, which you can change.                                                                              |

Every page request sends `saveResult=true`, so results are always saved to the dashboard. There is no Save Result toggle.

### Loading controls

HTML, Markdown, and JSON extraction also support these controls:

| Field             | Location           | HTTP field         | Type                | Default | Description                                                                                                                                                        |
| ----------------- | ------------------ | ------------------ | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Browser Rendering | Main configuration | `browserRendering` | True / False / None | None    | True always loads the page in a browser; False never does. None omits the parameter, allowing the API to try without a browser first and switch to one if blocked. |
| Warm Start        | Main configuration | `warmStart`        | Boolean             | `false` | Open the site's home page first to warm the session before loading the target URL.                                                                                 |
| Block Resources   | Options            | `blockResources`   | Boolean             | `false` | Block images, fonts, and stylesheets while loading the page.                                                                                                       |

Get Screenshot always sends `browserRendering=true` and has no Browser Rendering, Warm Start, or Block Resources input.

## Scraper API

Select **Resource > Scraper API** for the five operations below. All use `https://api.mrscraper.com/`.

### Scrape HTML

Retrieve the raw HTML of a page. Browser rendering is optional.

**Inputs:** URL, Geo Code, the shared page options, and loading controls above. **Options > Screenshot** is an on/off toggle, default `false`, sent as the boolean `screenshot`. There is no Action input.

The request uses GET with `html=true`, `markdown=false`, and `saveResult=true`. Browser Rendering follows your selected True, False, or None value.

**Example configuration**

| Field                       | Value                 |
| --------------------------- | --------------------- |
| URL                         | `https://example.com` |
| Browser Rendering           | True                  |
| Warm Start                  | On                    |
| Options > Wait for Selector | `body`                |
| Options > Timeout           | `120`                 |
| Options > Max Retries       | `0`                   |

**Output**

The node wraps the response body in `html`:

```json
{
	"html": "<html><body>Example page content...</body></html>"
}
```

Use `{{ $json.html }}` in a following node, or connect an **HTML** node to extract elements. When requesting a screenshot, inspect the output first: this operation reads the response as text and places the complete body in `html`, including a JSON response returned by the API.

### Scrape Markdown

Retrieve a page as clean Markdown. Browser rendering is optional.

**Inputs:** URL, Geo Code, the shared page options, and loading controls. **Options > Screenshot** is an on/off toggle, default `false`, sent as the boolean `screenshot`. There is no Action input.

The request uses GET with `markdown=true`, `html=false`, and `saveResult=true`.

**Example:** choose **Scrape Markdown**, enter `https://example.com`, turn **Warm Start** on, and add **Options > Max Age** with `86400000` to accept a cached result up to one day old.

**Output**

```json
{
	"markdown": "# Example page\n\nExample Markdown content..."
}
```

Use `{{ $json.markdown }}` in a following node. The complete upstream body is read as text; inspect it before mapping fields when requesting a screenshot.

### Get Screenshot

Capture a Base64 PNG screenshot of the full page, first viewport, or custom viewport. Browser rendering is always enabled.

**Inputs:** URL, Geo Code, the shared page options, and **Screenshot Mode** in the main configuration.

| Screenshot Mode | Meaning                                                                   |
| --------------- | ------------------------------------------------------------------------- |
| `full`          | Capture the entire scrollable page. This is the default.                  |
| `top`           | Capture the first viewport.                                               |
| `1280x800`      | Capture a custom viewport. Width and height must each be 100–3840 pixels. |
| `1920x1080-75`  | Capture a custom viewport with zoom. Zoom must be 25–300 percent.         |

The request uses GET with `screenshot=<mode>`, `browserRendering=true`, `html=false`, `markdown=false`, and `saveResult=true`. The API can still include HTML in its response.

**Example:** choose **Get Screenshot**, set **URL** to `https://example.com`, set **Screenshot Mode** to `top`, and add **Options > Timeout** with `120`.

**Output**

```json
{
	"html": "<html>...</html>",
	"screenshot": "BASE64_PNG_DATA"
}
```

Read `{{ $json.screenshot }}`. This is Base64 text, not an n8n binary attachment; convert it before passing it to a node that requires a file.

### Scrape Brand

Extract a website's colors, typography, logos, and social links as JSON.

**Input:** URL only. Shared page and loading controls are not available.

The request uses GET with `action=brand-scraping`, `bundle=none`, and the URL. The action is fixed and is not an input field.

**Example:** choose **Scrape Brand** and set **URL** to `https://example.com`.

**Output**

```json
{
	"data": {
		"job_id": "JOB_ID",
		"status": "succeeded",
		"url": "https://example.com",
		"final_url": "https://example.com",
		"brand": {
			"name": "Example brand",
			"colors": { "background": "#ffffff", "text": "#222222" },
			"typography": { "body": { "font_family": "Example font" } }
		},
		"error": null,
		"bundle_url": null
	},
	"message": "Example response"
}
```

Use `{{ $json.data.brand }}` for brand details and `{{ $json.data.job_id }}` for the job ID.

### Scrape JSON

Extract structured JSON from a page using a natural-language prompt. Append a JSON schema to shape the output.

**Inputs:** URL, Geo Code, shared page options, loading controls, and these extraction fields:

| Field                  | Location           | HTTP field           | Type    | Default                                     | Description                                                                       |
| ---------------------- | ------------------ | -------------------- | ------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| Prompt                 | Main configuration | `prompt`             | String  | `Extract all data as complete as possible.` | Instructions describing the data to extract.                                      |
| Expected Output Schema | Main configuration | Appended to `prompt` | JSON    | Empty                                       | Optional valid JSON appended as `Json Schema:` followed by the serialized schema. |
| Return HTML            | Options            | `html`               | Boolean | `true`                                      | Include the page HTML in the response.                                            |
| Screenshot             | Options            | `screenshot`         | Boolean | `false`                                     | Include a Base64 screenshot in the response.                                      |

The request sends `agent=general` and `saveResult=true`. It uses GET unless the encoded URL exceeds 8,000 characters, when it switches to POST with only `url`, `prompt`, and `agent` in the body. Page controls remain in the query.

**Example configuration**

| Field                  | Value                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| URL                    | `https://example.com`                                                                                                                        |
| Prompt                 | `Extract the first two items with title and price.`                                                                                          |
| Expected Output Schema | `{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"price":{"type":"string"}},"required":["title","price"]}}` |
| Browser Rendering      | True                                                                                                                                         |
| Options > Return HTML  | Off                                                                                                                                          |

**Output**

```json
{
	"success": true,
	"data": [{ "title": "Example item", "price": "10.00" }],
	"thread_id": "THREAD_ID",
	"token_usage": 1,
	"html": "",
	"markdown": "",
	"screenshot": "",
	"status": "Results ready",
	"error": "",
	"runtime": 1.23,
	"cookies": []
}
```

Extracted results are in `{{ $json.data }}` and follow the requested schema. Use **Split Out** on `data` when it is an array and you need one n8n item per result. Response metadata can include `thread_id`, `token_usage`, `status`, `error`, `runtime`, and `cookies`.

## Discovery

### Web Search

Search the web and return ranked results with titles, URLs, descriptions, and sources.

Select **Resource > Discovery** and **Operation > Web Search**.

| Field             | HTTP field   | Type    | Default        | Description                                                        |
| ----------------- | ------------ | ------- | -------------- | ------------------------------------------------------------------ |
| Search Query      | `query`      | String  | Required       | Search text, trimmed before sending, containing 1–1000 characters. |
| Country           | `country`    | String  | Blank; omitted | Two-letter country code to search from, sent in lowercase.         |
| Number of Results | `numResults` | Integer | `10`           | Request 10–100 results. Fewer results may be returned.             |

The request uses GET `https://api.mrscraper.com/` with fixed `action=websearch`. Country is omitted when blank; the CLI reference describes the API default as the United States. The transport timeout is fixed at 120 seconds.

**Example:** set **Search Query** to `site:example.com documentation`, **Country** to `id`, and **Number of Results** to `20`.

**Output**

```json
{
	"success": true,
	"message": "Example response",
	"data": [
		{
			"rank": 1,
			"title": "Example result",
			"url": "https://example.com",
			"description": "Example result description.",
			"source": "example.com"
		}
	],
	"tokenUsage": 1
}
```

Use **Split Out** on `data`, connect a second MrScraper node, choose **Scrape HTML** or **Scrape Markdown**, and map the resulting URL field into **URL**. Inspect the Split Out output to choose the correct expression.

## Account

### Get Status

Return the raw account status API response without summarizing, redacting body fields, or adding calculated fields.

Select **Resource > Account** and **Operation > Get Status**, choose your credential, and execute. There are no operation-specific input fields.

The request uses GET `https://api.app.mrscraper.com/api/v1/subscription-accounts`.

**Output**

```json
{
	"message": "Example response",
	"data": {
		"id": "ACCOUNT_ID",
		"tokenLimit": 100000,
		"tokenUsage": 2500,
		"stripeStatus": "active",
		"user": {
			"name": "Example user",
			"email": "user@example.com",
			"isVerified": true
		},
		"subscriptionItem": { "name": "Example plan", "tokenLimit": 100000 },
		"scraperAllowance": { "remaining": 97500, "plans": [{ "remaining": 97500 }] }
	}
}
```

Account fields remain nested in `data`. For example, use `{{ $json.data.tokenUsage }}` or inspect `{{ $json.data.scraperAllowance }}`. The node preserves the API body rather than creating usage summaries.

## Working with n8n output

The node returns n8n items. It does not add the CLI/SDK response envelope containing `status_code`, `data`, and `headers`. A `data` field shown above belongs to the API body itself.

| Operation       | Result expression        |
| --------------- | ------------------------ |
| Scrape HTML     | `{{ $json.html }}`       |
| Scrape Markdown | `{{ $json.markdown }}`   |
| Get Screenshot  | `{{ $json.screenshot }}` |
| Scrape Brand    | `{{ $json.data.brand }}` |
| Scrape JSON     | `{{ $json.data }}`       |
| Web Search      | `{{ $json.data }}`       |
| Get Status      | `{{ $json.data }}`       |

To use a URL produced by a previous node, switch **URL** to expression mode and enter `{{ $json.url }}`. For search, use `{{ $json.query }}` in **Search Query**.

For example, connect a **Code** node after Scrape Markdown, choose **Run Once for All Items**, and count the returned characters:

```javascript
return $input.all().map((item, index) => ({
	json: {
		characterCount: String(item.json.markdown ?? '').length,
	},
	pairedItem: { item: index },
}));
```

## Errors and troubleshooting

HTTP and network failures appear as node execution errors. Input validation rejects invalid URLs, page limits, screenshot viewport formats, search inputs, and JSON schemas before sending the affected request. Inspect API response fields such as `success`, `status`, and `error` for service-level results.

| Symptom                                      | What to check                                                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Authentication fails                         | Check the token in the selected MrScraper API credential.                                                                   |
| Dynamic content is missing                   | Set Browser Rendering to True and add Wait for Selector if needed.                                                          |
| A scrape takes too long                      | Set Timeout up to 330 seconds and configure Max Retries. The transport allows 30 additional seconds.                        |
| Expected Output Schema is rejected           | Use valid JSON with double quotes and no trailing commas.                                                                   |
| Screenshot settings are rejected             | HTML, Markdown, and JSON use boolean toggles. Get Screenshot uses full, top, or a supported viewport.                       |
| Screenshot output is text rather than a file | Decode the Base64 output into binary before passing it to a node requiring a file.                                          |
| Old configuration fields still appear        | Restart `npm run dev`, reload the editor, and confirm n8n is loading this local package rather than another installed copy. |
| An output expression returns undefined       | Inspect the node's output JSON and map the actual response fields.                                                          |

## Migration

**Get Account Info** is now named **Get Status**. Its internal operation identifier is retained so existing selections continue to work.

Geo Code is in the main configuration. Browser Rendering choices are **True**, **False**, and **None**. HTML and Markdown use boolean Screenshot toggles and have no Action input. `proxy`, `proxyCountry`, `super`, `returnCookie`, `tokenCap`, and `waitUntil` are not exposed or forwarded.

Web Search and ordinary JSON extraction use GET. Results are always saved for page operations. Get Screenshot sends `html=false`, although the API may still return HTML.

The previous Extraction, Results, Scraper Creation, Scraper Runs, and Crawl Website URLs resources are unavailable. Rebuild workflows using those resources with the supported operations.

## Development

Requires Node.js 22 or newer and npm. From the repository directory:

```sh
npm ci
npm run dev
```

Open the URL printed in the terminal to run n8n with the local node. Restart the server after changes if the editor still shows an older configuration.

Run local checks:

```sh
npm run lint
npm test
```

Tests build the package and verify resources, input visibility, authentication configuration, request preparation, validation, and JSON GET/POST fallback without calling the production API. To check live behavior, execute the corresponding operation in your local n8n instance with your credential; scraping and search consume quota.

## Resources

- [MrScraper](https://mrscraper.com)
- [MrScraper app](https://app.mrscraper.com)
- [API reference](https://docs.mrscraper.com/docs/api/overview)
- [Changelog](./CHANGELOG.md)

## License

MIT. See [LICENSE](./LICENSE).
