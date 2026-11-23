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
		default: '',
		placeholder: 'e.g. us',
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description:
			'Two-letter code of the country to search from, such as us or gb. Leave empty to search from the United States.',
		routing: {
			send: {
				type: 'query',
				property: 'country',
				value: '={{ String($value).trim().toLowerCase() || undefined }}',
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
			maxValue: 100,
			numberPrecision: 0,
		},
		displayOptions: {
			show: showOnlyForWebSearch,
		},
		description: 'Number of search results to return, from 10 to 100. The search may return fewer.',
		routing: {
			send: {
				type: 'query',
				property: 'numResults',
			},
		},
	},
];
