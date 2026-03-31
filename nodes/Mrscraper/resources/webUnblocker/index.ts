import type { INodeProperties } from 'n8n-workflow';
import { webUnblockerFetchHTMLDescription } from './fetchHTML';

const showOnlyForWebUnblocker = {
	resource: ['webUnblocker'],
};

export const webUnblockerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWebUnblocker,
		},
		options: [
			{
				name: 'Fetch Rendered HTML',
				value: 'fetchHTML',
				action: 'Fetch Rendered HTML',  // eslint-disable-line n8n-nodes-base/node-param-operation-option-action-miscased
				description: 'Fetch the rendered HTML of a page via the MrScraper stealth browser (JavaScript, bot evasion, optional geo proxy)',
				routing: {
					request: {
						method: 'GET',
						baseURL: 'https://api.mrscraper.com',
						url: '/',
						qs: {
							token: '={{$credentials.apiToken}}',
							url: '={{$parameter.url}}',
							timeout: '={{$parameter.timeout ?? 120}}',
							geoCode: '={{$parameter.geoCode ?? "US"}}',
							blockResources: '={{$parameter.blockResources ? "true" : "false"}}',
						},
					},
				},
			},
		],
		default: 'fetchHTML',
	},
	...webUnblockerFetchHTMLDescription,
];