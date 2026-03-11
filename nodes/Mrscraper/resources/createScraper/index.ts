import type { INodeProperties } from 'n8n-workflow';
import { advanceChatGeneralAgentDescription } from './generalAgent';
import { advanceChatListingAgentDescription } from './listingAgent';
import { advanceChatMapAgentDescription } from './mapAgent';

const showOnlyForAdvanceChat = {
    resource: ['createScraper'],
};

export const advanceChatDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAdvanceChat,
        },
        options: [
            {
                name: 'Create General Agent Scraper',
                value: 'generalAgent',
                action: 'Create General Agent', // eslint-disable-line
                description: 'Create a General Agent (AI) scraper at Mrscraper platform using input link and message',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'general',
                    },
                },
            },
            {
                name: 'Create Listing Agent Scraper',
                value: 'listingAgent',
                action: 'Create Listing Agent', // eslint-disable-line
                description: 'Create a listing agent (AI) scraper at Mrscraper platform using input link and message',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'listing',
                    },
                },
            },
            {
                name: 'Create Map Agent Scraper',
                value: 'mapAgent',
                action: 'Create Map Agent', // eslint-disable-line
                description: 'Create a map agent (AI) scraper at Mrscraper platform using input link and message',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'map',
                    },
                },
            },
        ],
        default: 'generalAgent',
    },
    ...advanceChatGeneralAgentDescription,
    ...advanceChatListingAgentDescription,
    ...advanceChatMapAgentDescription,
];
