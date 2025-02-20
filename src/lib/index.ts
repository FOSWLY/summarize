import {
	type ArticleSummarizeResponse,
	type TextSummarizeResponse,
	type VideoSummarizeResponse
} from '@toil/neurojs/types/yandex';

const SUMMARIZE_URL = 'https://summarize.toil.cc/v2/summarize';
const formatToField = {
	text: 'text',
	article: 'url',
	video: 'url'
};

export type Format = keyof typeof formatToField;
export type SummarizeResponse = {
	text: TextSummarizeResponse;
	article: ArticleSummarizeResponse;
	video: VideoSummarizeResponse;
};

export async function fetchSummarize<T extends Format>(
	content: string,
	format: T,
	bypassCache: boolean,
	sessionId?: string
): Promise<false | SummarizeResponse[T]> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const res = await fetch(`${SUMMARIZE_URL}/${format}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			signal: controller.signal,
			body: JSON.stringify({
				[formatToField[format]]: content,
				sessionId,
				bypassCache
			})
		});
		clearTimeout(timeoutId);
		if (!res.ok) {
			throw new Error(await res.text());
		}

		return (await res.json()) as SummarizeResponse[T];
	} catch (err) {
		console.error('Failed to generate a summarize', err);
		return false;
	}
}

export function getVideoId(link: string) {
	// supported youtube only
	const url = new URL(link);
	if (url.hostname === 'youtu.be') {
		url.search = `?v=${url.pathname.replace('/', '')}`;
		url.pathname = '/watch';
	}

	return (/(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
		url.searchParams.get('v')) as string | undefined;
}

export async function getUrl() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab.url;
}

export function formatTime(secs: number) {
	const hours = Math.floor(secs / 3600);
	const minutes = Math.floor((secs % 3600) / 60);
	const seconds = Math.floor(secs % 60);
	const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

	return hours ? `${hours}:${timeStr}` : timeStr;
}
