import type { INodeProperties } from 'n8n-workflow';
import { advanceChatMapAgentDescription } from '../scraping/mapAgent';
import { serpSyncDescription } from './sync';

const showOnlyForSerp = {
	resource: ['serp'],
};

export const serpDescription: INodeProperties[] = [
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
				name: 'Search Google SERP',
				value: 'syncSerp',
				action: 'Search google serp',
				description:
					'Fetch Google search results as JSON or HTML via the synchronous MrScraper SERP API',
				routing: {
					request: {
						method: 'POST',
						baseURL: 'https://sync.scraper.mrscraper.com',
						url: '/api/google/serp/v2/sync',
						headers: {
							Authorization: '={{"Bearer " + $credentials.apiToken}}',
						},
					},
				},
			},
		],
		default: 'mapAgent',
	},
	...advanceChatMapAgentDescription,
	...serpSyncDescription,
];
