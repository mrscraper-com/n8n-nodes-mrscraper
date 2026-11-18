import type { INodeProperties } from 'n8n-workflow';
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
				description: 'Search the web for relevant URLs, titles, and descriptions',
				routing: {
					request: {
						method: 'POST',
						baseURL: 'https://api.mrscraper.com',
						url: '/',
					},
					send: { type: 'body', property: 'action', value: 'websearch' },
				},
			},
		],
		default: 'webSearch',
	},
	...webSearchDescription,
];
