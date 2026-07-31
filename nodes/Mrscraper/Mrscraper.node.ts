import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { rerunDescription } from './resources/rerun';
import { resultDescription } from './resources/result';
import { advanceChatDescription } from './resources/createScraper';
import { accountDescription } from './resources/account';
import { scrapingDescription } from './resources/scraping';
import { serpDescription } from './resources/serp';

export class Mrscraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MrScraper',
		name: 'mrscraper',
		icon: { light: 'file:mrscraper.svg', dark: 'file:mrscraper.dark.svg' },
		group: ['transform'],
		version: [2, 0],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the MrScraper API',
		defaults: {
			name: 'MrScraper',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mrscraperApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.app.mrscraper.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Discovery',
						value: 'serp',
					},
					{
						name: 'Extraction',
						value: 'scraping',
					},
					{
						name: 'Results', // eslint-disable-line n8n-nodes-base/node-param-resource-with-plural-option
						value: 'result',
					},
					{
						name: 'Scraper Creation',
						value: 'createScraper',
					},
					{
						name: 'Scraper Runs',
						value: 'rerun',
					},
				],
				default: 'rerun',
			},
			...rerunDescription,
			...resultDescription,
			...advanceChatDescription,
			...accountDescription,
			...scrapingDescription,
			...serpDescription,
		],
	};
}
