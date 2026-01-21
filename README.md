# n8n-nodes-mrscraper
![](./mrscraper.jpeg)

This is an n8n community node. It lets you use **MrScraper** in your n8n workflows.

**MrScraper** is an AI-powered web scraping tool that allows users to extract structured data from websites without needing extensive coding skills. User can create scraper once via chatting with our agent and use the same logic on other URLs.

Main page: https://mrscraper.com

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

_List of operations supported:_

### Create AI Scraper
Create AI scraper programmatically. The nodes behave just like the code explained in this [docs](https://docs.mrscraper.com/docs/guides/programmatically#step-4-create-detail-scraper). There are 3 supported AI scrapers:
1. General Agent Scraper: Retrieves URL HTML and converts it to a targeted JSON structure based on your prompt. Ideal for detail pages
2. Listing Agent Scraper: Scrapes data from search results or listing pages with pagination, infinite scroll, or load more buttons
3. Map Agent Scraper: Scrapes URLs from a starting URL until the specified number of unique URLs has been collected. Ideal for URL scraping on complex landing page.

### Rerun
Re-execute your MrScraper scraping agent that you've developed on our platform or from the create AI Scraper. We provide 4 different operations corresponding to the 4 agent types available (manual only available from platform):
1. Manual Scraper: Step-by-step scraping agent
2. General Agent Scraper: Given a new URL, the agent retrieves its HTML and converts it to the same targeted JSON structure based on your previous prompt.
3. Listing Agent Scraper: Given a new URL, the agent perform pagination clicking, infinite scroll, or load more buttons and scrape the data following the previous run when creating the scraper.
4. Map Agent Scraper: Re-execute the map agent scraper.

This operation provides parameters that match those in the MrScraper platform.

### Result
Retrieve scraping results from MrScraper database:
1. Get Many: Returns results in table format with pagination (page number, page size), filters, and sorting options
2. Get Latest: Returns N most recent scraping results based on scraper ID
3. Get Detail: Returns detailed scraping results including data, screenshots, and HTML

## Credentials

**MrScraper API Token**

MrScraper API token is the only authentication method available for this node. You can find your API key in the MrScraper API Tokens page.

## Compatibility

This node has been tested with the following versions of N8N:
- N8N 2.0.3

## Usage

1. Develop your scraping agent (manual/general/listing/map) through our [platform](https://mrscraper.com)
2. Activate scraper API access
3. Integrate the param into n8n rerun operation
4. Retrieve scraping result with n8n result operation


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [MrScraper API documentation](https://docs.mrscraper.com/docs/getting-started/overview)
