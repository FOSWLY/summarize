<script lang="ts">
	import type {
		SummarizeThesis,
		SummarizeThesisWithLink,
		SummarizeThesisWithTime
	} from '@toil/neurojs/types/yandex';
	import StartTime from './StartTime.svelte';

	type Thesis = SummarizeThesis | SummarizeThesisWithLink | SummarizeThesisWithTime;

	let { thesis }: { thesis: Thesis } = $props();

	const highlight = async (e: Event) => {
		e.preventDefault();

		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		if (!tab?.id) {
			return;
		}

		await chrome.tabs.sendMessage(tab.id, {
			action: 'highlightText',
			link: (thesis as SummarizeThesisWithLink).link
		});
	};

	const isWithLink = (thes: Thesis): thes is SummarizeThesisWithLink => Object.hasOwn(thes, 'link');
	const isWithTime = (thes: Thesis): thes is SummarizeThesisWithTime =>
		Object.hasOwn(thes, 'startTime');
</script>

<li class="thesis">
	{#if isWithLink(thesis)}
		<a href={thesis.link} onclick={highlight}>
			{thesis.content}
		</a>
	{:else if isWithTime(thesis)}
		<StartTime startTime={thesis.startTime} />
		{thesis.content}
	{:else}
		<span>{thesis.content}</span>
	{/if}
</li>

<style>
	:root {
		--thesis-hover-bg-color: #424247;
	}

	.thesis {
		padding: 8px;
		margin: 0 -8px;
		border-radius: 8px;
	}

	.thesis:not(:has(.thesis_timed)) {
		padding: 8px 21px;
		text-indent: -13px;
	}

	.thesis:not(:has(.thesis_timed))::before {
		content: '•';
		margin-right: 8px;
	}

	.thesis:has(a) {
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.thesis:has(a):hover {
		background-color: var(--thesis-hover-bg-color);
	}
</style>
