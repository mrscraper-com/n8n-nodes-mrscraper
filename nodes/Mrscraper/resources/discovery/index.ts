import type { INodeProperties } from 'n8n-workflow';
import { prepareSearchRequest } from './search';
import { webSearchDescription } from './webSearch';

export const discoveryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['discovery'] } },
		options: [
			{
				name: 'Web Search',
				value: 'webSearch',
				action: 'Search the web',
				description:
					'Search the web and return matching pages with their URLs, titles, and descriptions',
				routing: {
					request: {
						method: 'GET',
						baseURL: 'https://api.mrscraper.com',
						url: '/',
						timeout: 120000,
					},
					send: {
						type: 'query',
						property: 'action',
						value: 'websearch',
						preSend: [prepareSearchRequest],
					},
				},
			},
		],
		default: 'webSearch',
	},
	...webSearchDescription,
];
