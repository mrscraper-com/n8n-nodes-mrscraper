import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { discoveryDescription } from './resources/discovery';
import { scraperApiDescription } from './resources/scraperApi';

export class Mrscraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MrScraper',
		name: 'mrscraper',
		icon: { light: 'file:mrscraper.svg', dark: 'file:mrscraper.dark.svg' },
		group: ['transform'],
		version: 3,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the MrScraper API',
		defaults: { name: 'MrScraper' },
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
					{ name: 'Account', value: 'account' },
					{ name: 'Discovery', value: 'discovery' },
					{ name: 'Scraper API', value: 'scraperApi' },
				],
				default: 'scraperApi',
			},
			...accountDescription,
			...scraperApiDescription,
			...discoveryDescription,
		],
	};
}
