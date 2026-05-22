import type { INodeProperties } from 'n8n-workflow';
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
				name: 'Scrape Google SERP',
				value: 'syncSerp',
				action: 'Scrape Google SERP', // eslint-disable-line n8n-nodes-base/node-param-operation-option-action-miscased
				description:
					'Fetch Google search results synchronously via the MrScraper SERP API',
				routing: {
					request: {
						method: 'POST',
						baseURL: 'https://sync.scraper.mrscraper.com',
						url: '/api/google/serp/sync',
						headers: {
							Authorization: '={{"Bearer " + $credentials.apiToken}}',
						},
					},
				},
			},
		],
		default: 'syncSerp',
	},
	...serpSyncDescription,
];
