import type { PostReceiveAction, PreSendAction } from 'n8n-workflow';

export const prepareBrandRequest: PreSendAction = async function (requestOptions) {
	const mode = this.getNodeParameter('brandMode', 'scrape') as string;
	if (mode === 'scrape') return requestOptions;

	requestOptions.method = 'GET';
	requestOptions.url = '/neo/brand';
	requestOptions.qs = { id: this.getNodeParameter('jobId') as string };
	delete requestOptions.body;
	if (mode === 'download') {
		requestOptions.qs.output = this.getNodeParameter('brandOutput') as string;
		requestOptions.json = false;
		requestOptions.encoding = 'arraybuffer';
		requestOptions.headers = { ...requestOptions.headers, Accept: '*/*' };
	}
	return requestOptions;
};

export const brandOutput: PostReceiveAction = async function (items, response) {
	if (this.getNodeParameter('brandMode', 'scrape') !== 'download') return items;

	const output = this.getNodeParameter('brandOutput') as string;
	const files: Record<string, { extension: string; mimeType: string }> = {
		html: { extension: 'html', mimeType: 'text/html' },
		bundle: { extension: 'zip', mimeType: 'application/zip' },
		screenshot: { extension: 'jpg', mimeType: 'image/jpeg' },
		screenshot_full: { extension: 'jpg', mimeType: 'image/jpeg' },
	};
	const file = files[output];
	const mimeType = String(response.headers['content-type'] ?? file.mimeType).split(';')[0];
	const extension = mimeType === 'image/png' ? 'png' : file.extension;
	const data = await this.helpers.prepareBinaryData(
		response.body as Buffer,
		`brand-${output}.${extension}`,
		mimeType,
	);
	return [{ json: { jobId: this.getNodeParameter('jobId'), output }, binary: { data } }];
};
