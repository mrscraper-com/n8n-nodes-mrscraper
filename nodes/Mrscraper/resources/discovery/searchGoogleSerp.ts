import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSyncSerp = {
	operation: ['syncSerp'],
	resource: ['serp'],
};

export const searchGoogleSerpDescription: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'best hotels in New York',
		required: true,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Google search terms, for example best hotels in New York',
		routing: {
			send: {
				type: 'body',
				property: 'query',
			},
		},
	},
	{
		displayName: 'Region',
		name: 'region',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		required: true,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Two-letter country or region code used for localized results, for example us or gb',
		routing: {
			send: {
				type: 'body',
				property: 'region',
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'en',
		placeholder: 'e.g. en',
		required: true,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Two-letter result language code, for example en or fr',
		routing: {
			send: {
				type: 'body',
				property: 'language',
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		placeholder: 'e.g. 1',
		required: true,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Google results page number, for example 1',
		routing: {
			send: {
				type: 'body',
				property: 'page',
			},
		},
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'JSON',
				value: 'json',
				description: 'Return parsed search results as JSON',
			},
			{
				name: 'HTML',
				value: 'html',
				description: 'Return the Google results page as HTML',
			},
		],
		default: 'json',
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Response format, for example JSON',
		routing: {
			send: {
				type: 'body',
				property: 'format',
			},
		},
	},
	{
		displayName: 'Render JavaScript',
		name: 'renderJs',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForSyncSerp,
		},
		description: 'Whether to render JavaScript before collecting results; for example false for a faster request',
		routing: {
			send: {
				type: 'body',
				property: 'renderJs',
			},
		},
	},
];
