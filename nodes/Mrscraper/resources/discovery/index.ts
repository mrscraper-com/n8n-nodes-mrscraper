import type { INodeProperties } from 'n8n-workflow';
import { crawlWebsiteUrlsDescription } from './crawlWebsiteUrls';
import { webSearchDescription } from './webSearch';

const showOnlyForSerp = {
	resource: ['serp'],
};

export const discoveryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSerp,
		},
		options: [
			{
				name: 'Crawl Website URLs',
				value: 'mapAgent',
				action: 'Crawl website urls',
				description: 'Discover URLs by crawling links from a starting website',
				routing: {
					request: {
						method: 'POST',
						url: '/api/v1/scrapers-ai',
					},
					send: {
						type: 'body',
						property: 'graph',
						value: 'map',
					},
				},
			},
			{
				name: 'Web Search',
				value: 'webSearch',
				action: 'Search the web',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period -- Preserve the supplied description.
				description:
					'WebSearch is a tool that searches the web to retrieve real-time results, including relevant website URLs, titles, descriptions, and related questions based on a given query.',
				routing: {
					request: {
						method: 'POST',
						baseURL: 'https://api.mrscraper.com',
						url: '/',
					},
					send: {
						type: 'body',
						property: 'action',
						value: 'websearch',
					},
				},
			},
		],
		default: 'mapAgent',
	},
	...crawlWebsiteUrlsDescription,
	...webSearchDescription,
];
