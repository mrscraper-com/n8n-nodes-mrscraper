# Web Search

WebSearch is a tool that searches the web to retrieve real-time results, including relevant website URLs, titles, descriptions, and related questions based on a given query.

## Search the web in n8n

1. Add a **MrScraper** node and select your saved **MrScraper API** credential.
2. Select **Discovery > Web Search**.
3. Enter **Search Query**.
4. Set **Country** and **Number of Results**, then run the node.

| Field | API parameter | Default | Description |
| --- | --- | --- | --- |
| Search Query | `query` | Empty; required | Search terms, for example `best hotels in New York` |
| Country | `country` | `us` | Two-letter country code for localized results |
| Number of Results | `numResults` | `10` | Positive integer specifying how many results to return |

## API request

The operation sends `POST https://api.mrscraper.com/` with a JSON body:

```json
{
  "action": "websearch",
  "query": "best hotels in New York",
  "country": "us",
  "numResults": 10
}
```

Authentication uses the `x-api-token` header from the saved n8n credential. The token is not a search field or part of the request URL or body.

For a direct API request, supply your token through the `MRSCRAPER_API_TOKEN` environment variable:

```sh
curl --request POST 'https://api.mrscraper.com/' \
  --header "x-api-token: ${MRSCRAPER_API_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"action":"websearch","query":"best hotels in New York","country":"us","numResults":10}'
```

Keep actual token values out of source files, workflow fields, and documentation.

## Migrate an existing search node

If an existing workflow stores the legacy `syncSerp` operation, open the node and reselect **Discovery > Web Search**. The current operation identifier is `webSearch`.

Keep the search query, use **Country** for localization, and set **Number of Results**. Region, language, page, response format, and JavaScript rendering are no longer search inputs. Run the updated node to verify its output before activating the workflow.

See the [package README](../README.md) for installation and credential setup.
