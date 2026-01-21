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
                action: 'Create general agent',
                description: 'Create a general agent scraper using input link and message',
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
                action: 'Create listing agent',
                description: 'Create a listing agent scraper using input link and message',
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
                action: 'Create map agent',
                description: 'Create a map agent scraper using input link and message',
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
