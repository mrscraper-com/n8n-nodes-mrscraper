# n8n-nodes-mrscraper

![MrScraper](./mrscraper.jpeg)

Use [MrScraper](https://mrscraper.com) in n8n to scrape HTML, Markdown, screenshots, brand information, and structured JSON, search the web, and check your account.

This package is an [n8n community node](https://docs.n8n.io/integrations/community-nodes/).

- [Installation](#installation) and [credentials](#credentials)
- [Quick start](#quick-start)
- [Payload fields and options](#how-the-request-payload-works)
- [Payload examples by operation](#payload-examples-by-operation)
- [Use the output in n8n](#use-the-output-in-n8n)
- [Call the API from JavaScript](#call-the-api-from-javascript)
- [Troubleshooting](#troubleshooting)

## Installation

Install `n8n-nodes-mrscraper` from **Settings > Community Nodes** in n8n. For other installation methods, follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. Sign in to the [MrScraper app](https://app.mrscraper.com) and copy an API token from your account.
2. Create a **MrScraper API** credential in n8n and enter the token in **API Token**.
3. Select that credential in your MrScraper node.

The node sends the saved token in the `x-api-token` header. Keep it in the credential rather than workflow fields or source control.

## Quick start

1. Add a **Manual Trigger** and connect it to a **MrScraper** node.
2. Select your **MrScraper API** credential.
3. Set **Resource** to **Scraper API** and **Operation** to **Scrape HTML**.
4. Enter `https://books.toscrape.com/` in **URL** and execute the node.
5. Open the output's JSON view. The page source is in `html`.
6. Connect an **HTML** node to extract elements, or use `{{ $json.html }}` in a following node.

For readable text, select **Scrape Markdown** and read `{{ $json.markdown }}`. For named fields such as product names and prices, use **Scrape JSON** with a prompt.

## Resources and operations

| Resource    | Operation        | HTTP request                                                     | Where to read the result in n8n            |
| ----------- | ---------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| Account     | Get Account Info | `GET https://api.app.mrscraper.com/api/v1/subscription-accounts` | API response fields in the output JSON     |
| Scraper API | Scrape HTML      | `GET https://api.mrscraper.com/`                                 | `$json.html`                               |
| Scraper API | Scrape Markdown  | `GET https://api.mrscraper.com/`                                 | `$json.markdown`                           |
| Scraper API | Get Screenshot   | `GET https://api.mrscraper.com/`                                 | `$json.screenshot` and `$json.html`        |
| Scraper API | Scrape Brand     | `GET https://api.mrscraper.com/`                                 | `$json.data.brand` and `$json.data.job_id` |
| Scraper API | Scrape JSON      | `POST https://api.mrscraper.com/`                                | `$json.data`, plus extraction metadata     |
| Discovery   | Web Search       | `POST https://api.mrscraper.com/`                                | Search results in `$json.data`             |

## How the request payload works

A **request payload** is the set of values sent to the API. In this node, values can be sent in three places:

| Location         | Purpose                               | Example                                                                                           |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Header           | Authentication and content type       | `x-api-token: <API_TOKEN>`                                                                        |
| Query parameters | Settings after `?` in the request URL | `?html=true&browserRendering=false`                                                               |
| JSON body        | Input data for POST requests          | `{ "url": "https://books.toscrape.com/", "prompt": "Extract product names", "agent": "general" }` |

The saved credential supplies the `x-api-token` header for every operation. HTML, Markdown, Screenshot, and JSON also send the same token as the `token` query parameter. Brand, Web Search, and Account use header authentication only.

**Resource**, **Operation**, and the **Options** container are n8n configuration fields. The node translates them into the HTTP method, endpoint, query parameters, and body. For example, **Screenshot Mode** becomes `screenshot`, and **Expected Output Schema** is appended to `prompt`.

The query examples below are shown as JSON objects for readability. For a GET request, encode those values in the URL; do not send that object as a JSON body. cURL's `--data-urlencode` and JavaScript's `URLSearchParams` handle encoding for you.

### Shared scraping fields

These fields apply to HTML, Markdown, Screenshot, and JSON unless the table says otherwise. Defaults here describe **this n8n node**; the API's defaults may differ when called directly.

| n8n field → API field                      | Type / default   | Meaning and when to use it                                                                                                                                              |
| ------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL** → `url`                            | String, required | Full address of the page to scrape, including `https://`. Also used by Brand. Sent in the JSON body for Scrape JSON and in the query for the other scraping operations. |
| **Browser Rendering** → `browserRendering` | Boolean, `false` | Execute page JavaScript in a browser. Enable it for pages whose content loads dynamically. Screenshot always sends `true`.                                              |
| **Warm Start** → `warmStart`               | Boolean, `false` | Enable a warm start for more reliable scraping. Available for HTML, Markdown, and Screenshot.                                                                           |
| **Super** → `super`                        | Boolean, `false` | Route the request through a real device for more reliable page loading.                                                                                                 |
| **Proxy Country** → `proxyCountry`         | String, `"us"`   | Two-letter country code for the proxy server, such as `us` or `gb`.                                                                                                     |

All of these fields are sent when available for the selected operation. Apart from Scrape JSON's `url`, they are query parameters.

### Optional scraping settings

Add these under **Options > Add Option**. An option is sent only after you add it. The initial value shown below is the value inserted by the n8n editor, rather than a value this node sends when the option is absent.

| n8n option → query parameter              | Type / initial value         | Available operations             | Meaning                                                                                                                                                  |
| ----------------------------------------- | ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Block Resources** → `blockResources`    | Boolean, `false`             | HTML, Markdown, Screenshot       | Skip images, fonts, and stylesheets to reduce loading work. This can change a screenshot's appearance.                                                   |
| **Geo Code** → `geoCode`                  | String, `"us"`               | HTML, Markdown, Screenshot, JSON | Country to load the page from. Both this and `proxyCountry` are forwarded separately; the node does not combine them.                                    |
| **Max Retries** → `maxRetries`            | Integer ≥ `0`, `3`           | HTML, Markdown, Screenshot, JSON | Maximum retry attempts. `0` disables retries. Omit the option for no retry limit.                                                                        |
| **Proxy** → `proxy`                       | String, empty                | Markdown, Screenshot             | Your own proxy URL, for example `http://user:pass@host:port`. An empty value is omitted.                                                                 |
| **Return Cookie** → `returnCookie`        | Boolean, `false`             | HTML, Markdown, Screenshot       | Ask the API to include browser session cookies. HTML and Markdown still use the text output wrappers described below.                                    |
| **Return HTML** → `html`                  | Boolean, `true`              | JSON                             | Include page HTML alongside the extracted data. Use `false` if you only need structured data.                                                            |
| **Save Result** → `saveResult`            | Boolean, `true`              | Markdown, Screenshot, JSON       | Save the result to the Result tab in your MrScraper account.                                                                                             |
| **Screenshot** → `screenshot`             | Boolean, `false`             | JSON                             | Include a Base64 screenshot with the extraction response. This is a boolean; Get Screenshot uses `"full"` or `"top"` instead.                            |
| **Timeout** → `timeout`                   | Integer ≥ `1`, `300`         | HTML, Markdown, Screenshot, JSON | Maximum page load wait in **seconds**. This is separate from n8n's own request or workflow timeout.                                                      |
| **Token Cap** → `tokenCap`                | Integer ≥ `1`, `30`          | HTML, Markdown, Screenshot, JSON | Maximum MrScraper tokens for the scrape and its retries. Omit for no cap. These are service usage tokens, not the API credential or an LLM input length. |
| **Wait for Selector** → `waitForSelector` | String, empty                | HTML, Markdown, Screenshot       | Wait for a CSS selector such as `.product-list` to appear. Enable Browser Rendering for JavaScript content. An empty value is omitted.                   |
| **Wait Until** → `waitUntil`              | String, `"domcontentloaded"` | HTML, Markdown, Screenshot, JSON | Browser navigation event to wait for; see the values below.                                                                                              |

| `waitUntil` value  | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| `domcontentloaded` | Wait until the HTML is parsed.                             |
| `load`             | Wait until the page's load event, including its resources. |
| `networkidle0`     | Wait until no network connections remain active.           |
| `networkidle2`     | Wait until at most two network connections remain active.  |

## Payload examples by operation

### Scrape HTML

Select **Scraper API > Scrape HTML** and enter the URL. With the default settings, the node sends `GET https://api.mrscraper.com/` with these query parameters:

```json
{
	"token": "<API_TOKEN>",
	"url": "https://books.toscrape.com/",
	"html": true,
	"browserRendering": false,
	"warmStart": false,
	"super": false,
	"proxyCountry": "us"
}
```

`html: true` selects HTML output and is added automatically. The other fields are explained in [Shared scraping fields](#shared-scraping-fields).

The equivalent cURL request, using a token stored in the `MRSCRAPER_API_TOKEN` environment variable, is:

```sh
curl --get 'https://api.mrscraper.com/' \
  --header "x-api-token: $MRSCRAPER_API_TOKEN" \
  --header 'Accept: text/html' \
  --data-urlencode "token=$MRSCRAPER_API_TOKEN" \
  --data-urlencode 'url=https://books.toscrape.com/' \
  --data-urlencode 'html=true' \
  --data-urlencode 'browserRendering=false' \
  --data-urlencode 'warmStart=false' \
  --data-urlencode 'super=false' \
  --data-urlencode 'proxyCountry=us'
```

The API returns text, and the node wraps it in an n8n item. A shortened output JSON example is:

```json
{
	"html": "<!DOCTYPE html><html><body><h1>Books</h1></body></html>"
}
```

Read the source using `{{ $json.html }}`. To extract elements visually, connect an **HTML** node, choose JSON as the source, and set the JSON property to `html`.

[Official Scrape HTML reference](https://docs.mrscraper.com/docs/api/scraper-api/scrape-html).

### Scrape Markdown

Select **Scraper API > Scrape Markdown**. The default `GET /` query is:

```json
{
	"token": "<API_TOKEN>",
	"url": "https://books.toscrape.com/",
	"markdown": true,
	"html": false,
	"browserRendering": false,
	"warmStart": false,
	"super": false,
	"proxyCountry": "us"
}
```

`markdown: true` selects Markdown output; `html: false` disables HTML output. Both are fixed by the operation. The node wraps the returned text as:

```json
{
	"markdown": "# Books\n\nA list of available books."
}
```

Read `{{ $json.markdown }}` to pass the text to an AI node, save it, or process it in a Code node.

[Official Scrape Markdown reference](https://docs.mrscraper.com/docs/api/scraper-api/scrape-markdown).

### Get Screenshot

Select **Scraper API > Get Screenshot**. Set **Screenshot Mode** to **Full** for the whole scrollable page or **Top** for the visible area at the top. The default `GET /` query is:

```json
{
	"token": "<API_TOKEN>",
	"url": "https://books.toscrape.com/",
	"screenshot": "full",
	"browserRendering": true,
	"html": true,
	"warmStart": false,
	"super": false,
	"proxyCountry": "us"
}
```

`screenshot` is `"full"` or `"top"`. This operation always sets `browserRendering: true` and `html: true`. A shortened response is:

```json
{
	"html": "<!DOCTYPE html>...",
	"screenshot": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

`screenshot` contains Base64 image data. It is not an image URL or an n8n binary attachment; decode it or convert it to a file before uploading it elsewhere. The JavaScript example below shows how to save it.

[Official Get Screenshot reference](https://docs.mrscraper.com/docs/api/scraper-api/get-screenshot).

### Scrape Brand

Select **Scraper API > Scrape Brand** and enter a URL. This operation exposes only the URL field and sends `GET /` with:

```json
{
	"action": "brand-scraping",
	"bundle": "none",
	"url": "https://books.toscrape.com/"
}
```

| Field    | Meaning                                                                    |
| -------- | -------------------------------------------------------------------------- |
| `action` | Fixed to `"brand-scraping"` to select brand extraction.                    |
| `bundle` | Fixed to `"none"` to request brand JSON without an additional page bundle. |
| `url`    | Website page whose brand identity you want to inspect.                     |

The response's `data.brand` contains the extracted brand identity. Read `data.job_id` for the job identifier and `data.status` for its status. Brand fields can include `name`, `colors`, `typography`, `logos`, and `social`; their contents depend on the website.

For example, use `{{ $json.data.brand.colors }}` to read the colors or `{{ $json.data.brand.typography }}` to read the typography.

[Official Scrape Brand reference](https://docs.mrscraper.com/docs/api/scraper-api/scrape-brand/scrape-brand).

### Scrape JSON

Select **Scraper API > Scrape JSON** and configure:

| n8n field                  | Meaning                                                                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL**                    | Page to extract data from. Sent as `url` in the JSON body.                                                                                                                                     |
| **Prompt**                 | Description of the data you need, such as `Extract the product name, price, and availability`. Sent as `prompt`. The node's default is `Extract all available data as completely as possible.` |
| **Expected Output Schema** | Optional valid JSON describing the desired result. The node appends it to the prompt; it does not send a separate `outputSchema` field.                                                        |

For example, enter this **Expected Output Schema**:

```json
{
	"name": "string",
	"price": "number",
	"inStock": "boolean"
}
```

With the default shared fields, the node sends `POST /` with these **query parameters**:

```json
{
	"token": "<API_TOKEN>",
	"browserRendering": false,
	"super": false,
	"proxyCountry": "us"
}
```

The **JSON request body** is:

```json
{
	"url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
	"prompt": "Extract the product name, price, and availability.\n\nJson Schema:\n{\"name\":\"string\",\"price\":\"number\",\"inStock\":\"boolean\"}",
	"agent": "general"
}
```

`agent: "general"` selects the extraction agent and is added automatically. Without a schema, `prompt` contains only your prompt text. Invalid schema JSON stops the node before the API request with `Expected Output Schema must be valid JSON`.

The schema guides extraction; this node does not validate the response against it. The prompt describes what to extract from the loaded page. Use Browser Rendering and other scraping options to control page loading. POST keeps long prompts and schemas out of the request URL.

An illustrative response, shortened to the main fields:

```json
{
	"success": true,
	"data": {
		"name": "Example Book",
		"price": 12.5,
		"inStock": true
	},
	"thread_id": "<extraction_id>",
	"token_usage": 3,
	"status": "Results ready",
	"error": "",
	"runtime": 8.2
}
```

| Response field                              | Meaning / how to use it                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `success`                                   | Whether extraction succeeded. Check this before using the extracted values.                                               |
| `data`                                      | Extracted object or collection, shaped by the page, prompt, and schema. The example product name is at `$json.data.name`. |
| `thread_id`                                 | Identifier for the extraction. Keep it when you need to trace a result.                                                   |
| `token_usage`                               | MrScraper service tokens consumed by this request.                                                                        |
| `status`                                    | Human-readable processing status.                                                                                         |
| `error`                                     | Error details, if present.                                                                                                |
| `runtime`                                   | Reported execution time in seconds.                                                                                       |
| `html`, `markdown`, `screenshot`, `cookies` | Additional content or session fields that may be present; their availability depends on the request and API response.     |

For example, add **Options > Return HTML** and set it to `false` to send `html=false` in the query. Adding **Max Retries = 0** sends `maxRetries=0`; omitting that option applies no retry limit.

[Official Scrape JSON reference](https://docs.mrscraper.com/docs/api/scraper-api/scrape-json).

### Web Search

Select **Discovery > Web Search**. The node sends `POST https://api.mrscraper.com/` with this JSON body and no scraping query parameters:

```json
{
	"action": "websearch",
	"query": "e-menessaptieka.lv linkedin",
	"country": "us",
	"numResults": 10
}
```

| n8n field → body field               | Type / default              | Meaning                                                                               |
| ------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------- |
| Automatic → `action`                 | String, `"websearch"`       | Selects the search action. The node sets it for you.                                  |
| **Search Query** → `query`           | String, required            | Search keywords or a question. This is search text, rather than a page URL to scrape. |
| **Country** → `country`              | String, `"us"`, required    | Two-letter country code for localized search results, such as `us` or `gb`.           |
| **Number of Results** → `numResults` | Integer, `10`, minimum `10` | Requested number of results. The actual response may contain fewer.                   |

Search results are returned in `data`. Each result can include `rank` (position), `title` (page title), `url` (page address), `description` (search snippet), and `source` (result source). Use a Code node or **Split Out** to turn the result array into individual items before passing their URLs to another MrScraper node.

### Get Account Info

Select **Account > Get Account Info**. No operation-specific payload fields are required. The node sends:

```sh
curl 'https://api.app.mrscraper.com/api/v1/subscription-accounts' \
  --header "x-api-token: $MRSCRAPER_API_TOKEN" \
  --header 'Accept: application/json'
```

There is no query payload or request body. The response includes account information such as token usage and limits. The node passes the response through; inspect the output JSON to select the fields you need.

## Use the output in n8n

### Map values with expressions

Suppose an **Edit Fields (Set)** node before MrScraper produces this input item:

```json
{
	"url": "https://books.toscrape.com/",
	"query": "web scraping tutorials"
}
```

Switch the MrScraper **URL** field to expression mode and enter `{{ $json.url }}`. For Web Search, set **Search Query** to `{{ $json.query }}`. Each incoming item supplies its own field values.

After the MrScraper node, use these expressions in the next node:

| Value                                | Expression                |
| ------------------------------------ | ------------------------- |
| HTML source                          | `{{ $json.html }}`        |
| Markdown text                        | `{{ $json.markdown }}`    |
| Base64 screenshot                    | `{{ $json.screenshot }}`  |
| Extracted JSON object                | `{{ $json.data }}`        |
| Product name from the example schema | `{{ $json.data.name }}`   |
| Brand identity                       | `{{ $json.data.brand }}`  |
| Brand job ID                         | `{{ $json.data.job_id }}` |
| Web Search results array             | `{{ $json.data }}`        |

### Process page text in a Code node

Connect a **Code** node after Scrape HTML or Scrape Markdown. Choose **JavaScript** and **Run Once for All Items**, then paste:

```javascript
return $input.all().map((item, index) => {
	const content = item.json.markdown ?? item.json.html;
	if (typeof content !== 'string') {
		throw new Error('Expected an html or markdown string');
	}

	return {
		json: {
			content,
			characterCount: content.length,
		},
		pairedItem: { item: index },
	};
});
```

`$input.all()` reads incoming items. `item.json` contains each item's fields, and the returned `json` object becomes the next node's input. `pairedItem` preserves the link to the incoming item. This example counts source characters; it does not strip HTML tags. See n8n's [input helpers](https://docs.n8n.io/code/builtin/current-node-input/) and [data structure](https://docs.n8n.io/data/data-structure/) documentation.

### Read extracted product fields

After Scrape JSON with the product schema above, use a separate Code node in **Run Once for All Items** mode:

```javascript
return $input.all().map((item, index) => {
	const result = item.json;
	if (result.success !== true || result.data === null || typeof result.data !== 'object') {
		throw new Error(String(result.error || 'Extraction did not return product data'));
	}

	return {
		json: {
			name: result.data.name,
			price: result.data.price,
			inStock: result.data.inStock,
			tokensUsed: result.token_usage,
		},
		pairedItem: { item: index },
	};
});
```

Adapt the fields to your prompt. If you ask for a list, define a list in the schema and split that array into items instead.

### Turn search results into items to scrape

After Web Search, use a Code node in **Run Once for All Items** mode:

```javascript
return $input.all().flatMap((item, index) => {
	const results = item.json.data;
	if (!Array.isArray(results)) {
		throw new Error('Expected a search results array in data; inspect the Web Search output');
	}

	return results.map((result) => ({
		json: {
			url: result.url,
			title: result.title,
			description: result.description,
		},
		pairedItem: { item: index },
	}));
});
```

Connect another MrScraper node, select **Scrape Markdown**, and set **URL** to `{{ $json.url }}`. Each result now supplies a page URL. Limit the items before scraping if you only need a few pages.

## Call the API from JavaScript

These examples run **outside n8n** in Node.js 22 or newer, using built-in `fetch`. Inside n8n, select the saved credential in the MrScraper node and use the expressions or Code examples above.

Save this helper and the examples you want to run in `example.mjs`. Set the `MRSCRAPER_API_TOKEN` environment variable to your API token before running `node example.mjs`.

For example, in a macOS or Linux shell, replace the placeholder locally:

```sh
export MRSCRAPER_API_TOKEN='<YOUR_API_TOKEN>'
node example.mjs
```

```javascript
import { writeFile } from 'node:fs/promises';

const apiToken = process.env.MRSCRAPER_API_TOKEN;
if (!apiToken) throw new Error('Set MRSCRAPER_API_TOKEN before running this script');

async function request({
	method = 'GET',
	endpoint = 'https://api.mrscraper.com/',
	query = {},
	body,
	accept = 'application/json',
}) {
	const endpointUrl = new URL(endpoint);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null) {
			endpointUrl.searchParams.set(key, String(value));
		}
	}

	const response = await fetch(endpointUrl, {
		method,
		headers: {
			'x-api-token': apiToken,
			Accept: accept,
			...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
		},
		...(body === undefined ? {} : { body: JSON.stringify(body) }),
	});
	if (!response.ok) {
		throw new Error(`MrScraper returned HTTP ${response.status}: ${await response.text()}`);
	}

	const result = accept === 'application/json' ? await response.json() : await response.text();
	if (result && typeof result === 'object' && result.success === false) {
		throw new Error(String(result.error || result.message || 'MrScraper request failed'));
	}
	return result;
}

// Match the node's shared defaults. false and 0 must remain in the query.
const pageQuery = {
	token: apiToken,
	browserRendering: false,
	super: false,
	proxyCountry: 'us',
};
const pageUrl = 'https://books.toscrape.com/';
```

The helper URL-encodes query values, serializes POST bodies, checks HTTP errors, and checks the `success` flag when present. It returns the API body directly. For HTML and Markdown, the n8n node adds the `html` or `markdown` wrapper; this helper returns plain text.

### Fetch HTML or Markdown

```javascript
const html = await request({
	query: { ...pageQuery, url: pageUrl, html: true, warmStart: false },
	accept: 'text/html',
});
console.log(html);

const markdown = await request({
	query: { ...pageQuery, url: pageUrl, markdown: true, html: false, warmStart: false },
	accept: 'text/markdown',
});
console.log(markdown);
```

To wait for dynamic page content, add `browserRendering: true`, `waitForSelector: '.product_pod'`, and `waitUntil: 'networkidle2'` to the relevant query object. Add numeric settings such as `timeout: 120`, `maxRetries: 3`, or `tokenCap: 30` the same way.

### Extract structured JSON

```javascript
const outputSchema = { name: 'string', price: 'number', inStock: 'boolean' };
const product = await request({
	method: 'POST',
	query: { ...pageQuery, html: false, maxRetries: 3, tokenCap: 30 },
	body: {
		url: 'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html',
		prompt:
			'Extract the product name, price, and availability.\n\nJson Schema:\n' +
			JSON.stringify(outputSchema),
		agent: 'general',
	},
});
console.log(product.data);
```

### Save a screenshot

```javascript
const capture = await request({
	query: {
		...pageQuery,
		url: pageUrl,
		screenshot: 'full',
		browserRendering: true,
		html: true,
		warmStart: false,
	},
});
if (typeof capture.screenshot !== 'string' || !capture.screenshot) {
	throw new Error('No screenshot was returned');
}
const image = Buffer.from(capture.screenshot.replace(/^data:image\/[^;]+;base64,/, ''), 'base64');
const extension = image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
	? 'png'
	: image[0] === 255 && image[1] === 216
		? 'jpg'
		: undefined;
if (!extension) throw new Error('Unexpected screenshot format; inspect the response');
await writeFile(`screenshot.${extension}`, image);
```

### Read brand details, search results, or account information

Each call below is independent; include only the calls you need.

```javascript
const brand = await request({
	query: { action: 'brand-scraping', bundle: 'none', url: pageUrl },
});
console.log(brand.data.brand);

const search = await request({
	method: 'POST',
	body: { action: 'websearch', query: 'web scraping tutorials', country: 'us', numResults: 10 },
});
console.log(search.data);

const account = await request({
	endpoint: 'https://api.app.mrscraper.com/api/v1/subscription-accounts',
});
console.log(account);
```

## Troubleshooting

| Symptom                                                   | What to check                                                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `401` or an authentication error                          | Confirm the API token in the selected MrScraper credential. For direct calls, send the header and the query token where required. |
| Missing content from a dynamic page                       | Enable **Browser Rendering**. For HTML, Markdown, or Screenshot, add **Wait for Selector** for the content you need.              |
| `Expected Output Schema must be valid JSON`               | Use valid JSON with double-quoted property names and no trailing commas.                                                          |
| A product field is `undefined`                            | Check the output JSON and read extracted fields under `data`. Update the prompt or schema if the returned shape differs.          |
| Web Search rejects the result count                       | **Number of Results** must be an integer of at least `10`.                                                                        |
| Scrape waits too long or consumes too many service tokens | Add **Timeout**, **Max Retries**, and **Token Cap**. Leaving out retries or the cap means no corresponding limit.                 |
| Screenshot is text instead of a file                      | The API returns Base64 in `screenshot`. Decode or convert it before sending it to a file or upload step.                          |

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
