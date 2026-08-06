import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { scraperRunsDescription } from './resources/scraperRuns';
import { resultsDescription } from './resources/results';
import { scraperCreationDescription } from './resources/scraperCreation';
import { accountDescription } from './resources/account';
import { extractionDescription } from './resources/extraction';
import { discoveryDescription } from './resources/discovery';

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
						name: 'Result',
						value: 'result',
					},
					{
						name: 'Scraper Creation',
						value: 'createScraper',
					},
					{
						name: 'Scraper Run',
						value: 'rerun',
					},
				],
				default: 'rerun',
			},
			...scraperRunsDescription,
			...resultsDescription,
			...scraperCreationDescription,
			...accountDescription,
			...extractionDescription,
			...discoveryDescription,
		],
	};
}
