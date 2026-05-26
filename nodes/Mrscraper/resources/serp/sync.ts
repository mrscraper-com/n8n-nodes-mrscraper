import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSyncSerp = {
	operation: ['syncSerp'],
	resource: ['serp'],
};

export const serpSyncDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description:
			'Google search URL to scrape (e.g. https://www.google.com/search?q=iphone+17)',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Raw',
		name: 'raw',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Whether to return raw SERP HTML instead of parsed results',
		routing: {
			send: {
				type: 'body',
				property: 'raw',
			},
		},
	},
];
