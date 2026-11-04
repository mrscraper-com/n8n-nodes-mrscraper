import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebSearch = {
	operation: ['webSearch'],
	resource: ['serp'],
};

export const webSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'best hotels in New York',
		required: true,
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description: 'Search terms, for example best hotels in New York',
		routing: {
			send: {
				type: 'body',
				property: 'query',
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		required: true,
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description: 'Two-letter country code used for localized results, for example us or gb',
		routing: {
			send: {
				type: 'body',
				property: 'country',
			},
		},
	},
	{
		displayName: 'Number of Results',
		name: 'numResults',
		type: 'number',
		default: 10,
		required: true,
		typeOptions: {
			minValue: 1,
			numberPrecision: 0,
		},
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description: 'Number of search results to return',
		routing: {
			send: {
				type: 'body',
				property: 'numResults',
			},
		},
	},
];
