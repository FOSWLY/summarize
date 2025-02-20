<script lang="ts">
	import type { SummarizeChapter, VideoSummarizeChapter } from '@toil/neurojs/types/yandex';
	import ThesesList from './ThesesList.svelte';
	import StartTime from './StartTime.svelte';

	type Chapter = SummarizeChapter | VideoSummarizeChapter;

	let { chapter }: { chapter: Chapter } = $props();

	const isWithTime = (chap: Chapter): chap is VideoSummarizeChapter =>
		Object.hasOwn(chap, 'startTime');
</script>

<li class="chapter">
	<h4 class="chapter-title">
		{#if isWithTime(chapter)}
			<StartTime startTime={chapter.startTime} />
		{/if}
		{chapter.content}
	</h4>
	<ThesesList theses={chapter.theses} />
</li>

<style>
	.chapter {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.chapter-title {
		font-weight: bold;
		color: var(--title-color);
	}
</style>
