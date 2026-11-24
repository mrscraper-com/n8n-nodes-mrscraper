import { NodeOperationError, type PreSendAction } from 'n8n-workflow';

export const prepareSearchRequest: PreSendAction = async function (requestOptions) {
	const query = String(this.getNodeParameter('query')).trim();
	const country = String(this.getNodeParameter('country', '')).trim();
	const numResults = this.getNodeParameter('numResults', 10) as number;
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message);
	};
	if (!query || query.length > 1000) fail('Search Query must be 1 to 1000 characters');
	if (country && !/^[a-z]{2}$/i.test(country)) fail('Country must be a two-letter country code');
	if (!Number.isInteger(numResults) || numResults < 10 || numResults > 100)
		fail('Number of Results must be an integer from 10 to 100');
	requestOptions.qs = {
		action: 'websearch',
		query,
		numResults,
		...(country ? { country: country.toLowerCase() } : {}),
	};
	delete requestOptions.body;
	return requestOptions;
};
