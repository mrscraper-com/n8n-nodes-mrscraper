import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { rerunDescription } from './resources/rerun';
import { resultDescription } from './resources/result';
import { advanceChatDescription } from './resources/createScraper';
import { accountDescription } from './resources/account';
import { agentDescription } from './resources/agent';
import { scrapingDescription } from './resources/scraping';
import { webUnblockerDescription } from './resources/webUnblocker';
import { batchOperationDescription } from './resources/batchOperation';
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
						name: 'Agent',
						value: 'agent',
					},
					{
						name: 'Batch Operation',
						value: 'batchOperation',
					},
					{
						name: 'Create Scraper',
						value: 'createScraper',
					},
					{
						name: 'Get Result',
						value: 'result',
					},
					{
						name: 'Rerun Scraper',
						value: 'rerun',
					},
					{
						name: 'Scraping',
						value: 'scraping',
					},
					{
						name: 'SERP',
						value: 'serp',
					},
					{
						name: 'Web Unblocker',
						value: 'webUnblocker',
					},
				],
				default: 'rerun',
			},
			...rerunDescription,
			...resultDescription,
			...advanceChatDescription,
			...accountDescription,
			...agentDescription,
			...batchOperationDescription,
			...scrapingDescription,
			...serpDescription,
			...webUnblockerDescription,
		],
	};
}
