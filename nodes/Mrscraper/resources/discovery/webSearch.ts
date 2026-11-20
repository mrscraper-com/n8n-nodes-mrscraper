import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebSearch = {
	operation: ['webSearch'],
	resource: ['discovery'],
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
		description: 'Keywords or a question to search for, such as "best hotels in New York"',
		routing: {
			send: {
				type: 'query',
				property: 'query',
				value: '={{ String($value).trim() }}',
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
		description: 'Two-letter country code for localized results, such as us or gb',
		routing: {
			send: {
				type: 'query',
				property: 'country',
				value: '={{ String($value).toLowerCase() }}',
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
			minValue: 10,
			numberPrecision: 0,
		},
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description: 'Number of search results to return, with a minimum of 10',
		routing: {
			send: {
				type: 'query',
				property: 'numResults',
			},
		},
	},
];
