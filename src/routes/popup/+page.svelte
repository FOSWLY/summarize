<script lang="ts">
	import { onMount } from 'svelte';
	import {
		SummarizeStatus,
		type SummarizeThesisWithTime,
		type ArticleSummarizeResponse,
		type TextSummarizeResponse,
		type VideoSummarizeResponse,
		type VideoSummarizeChapter
	} from '@toil/neurojs/types/yandex';

	import Loading from '$lib/components/Loading.svelte';
	import ThesesList from '$lib/components/ThesesList.svelte';
	import ChaptersList from '$lib/components/ChaptersList.svelte';
	import { type Format, fetchSummarize, formatTime, getUrl, getVideoId } from '$lib';
	import Header from '$lib/components/Header.svelte';

	type ErrorResponse = {
		title: string;
		message: string;
		type: 'error';
	};
	type SuccessResponse = ArticleSummarizeResponse | TextSummarizeResponse | VideoSummarizeResponse;
	type SummarizeResult = SuccessResponse | ErrorResponse;

	const VIDEO_HOST = 'https://youtu.be/';

	let headerEl: Header;
	let loading = $state(true);
	let isShortLevel = $state(true);
	let result: SummarizeResult | undefined = $state(undefined);

	async function summarizeImpl(
		content: string,
		format: Format = 'text',
		bypassCache: boolean = false,
		sessionId?: string,
		timer?: ReturnType<typeof setTimeout>
	) {
		clearTimeout(timer);
		const generatedInfo = await fetchSummarize<typeof format>(
			content,
			format,
			bypassCache,
			sessionId
		);
		if (!generatedInfo) {
			loading = false;
			result = {
				title: 'Ошибка суммаризации',
				type: 'error',
				message:
					'Не удалось выполнить суммаризацию. Произошла внутренняя ошибка при запросе к Summarize API.'
			};
			return false;
		}

		sessionId = generatedInfo.sessionId;
		loading = !generatedInfo.thesis.length;
		result = generatedInfo;
		if (generatedInfo.statusCode === SummarizeStatus.GENERATING) {
			return new Promise((resolve) => {
				timer = setTimeout(async () => {
					resolve(await summarizeImpl(content, format, false, sessionId, timer));
				}, generatedInfo.pollIntervalMs);
			});
		}

		if (!generatedInfo.thesis.length && !generatedInfo.chapters.length) {
			loading = false;
			result = {
				title: 'Ошибка суммаризации',
				type: 'error',
				message: 'Сервер не смог выполнить суммаризацию. Возможно, эта страница не поддерживается.'
			};
			return false;
		}

		return true;
	}

	async function summarize(bypassCache = false) {
		loading = true;
		result = undefined;
		isShortLevel = true;
		const url = await getUrl();
		if (!url?.match(/http(s)?:\/\//)) {
			loading = false;
			result = {
				title: 'Ошибка суммаризации',
				type: 'error',
				message: 'Расширение не работает на этой странице.'
			};
			return false;
		}

		const videoId = getVideoId(url);
		const content = videoId ? `${VIDEO_HOST}${videoId}` : url;
		const format: Format = videoId ? 'video' : 'article';
		return await summarizeImpl(content, format, bypassCache);
	}

	onMount(async () => {
		await summarize();
	});

	const copyThesis = (theses: SuccessResponse['thesis']) =>
		theses
			.map((thesis) => {
				const delimiter = Object.hasOwn(thesis, 'startTime')
					? formatTime((thesis as SummarizeThesisWithTime).startTime)
					: '•';
				return `${delimiter} ${thesis.content}`;
			})
			.join('\n');

	const copyChapters = (chapters: SuccessResponse['chapters']) =>
		chapters
			.map((chapter) => {
				const timed = Object.hasOwn(chapter, 'startTime')
					? `${formatTime((chapter as VideoSummarizeChapter).startTime)} `
					: '';
				return `${timed}${chapter.content}\n\n${copyThesis(chapter.theses)}`;
			})
			.join('\n\n');

	const copySummarize = async (result: SuccessResponse) => {
		const content = isShortLevel ? copyThesis(result.thesis) : copyChapters(result.chapters);
		const text = `${result.title}\n\n${content}`;

		await navigator.clipboard.writeText(text);
	};

	const refreshSummarize = async () => {
		headerEl.changeButtonDisabled(true);
		const success = await summarize(true);
		headerEl.changeButtonDisabled(!success);
	};

	const onSelectLevel = () => {
		isShortLevel = !isShortLevel;
	};
</script>

<Header
	onclick={refreshSummarize}
	buttonTitle="Обновить"
	showButton={!loading && result && result.type !== 'error'}
	bind:this={headerEl}
/>
<section class="wrapper">
	{#if loading || !result}
		<Loading />
	{:else if result && result.type === 'error'}
		<div class="content">
			<h1 class="content-title">{result.title}</h1>
			<p class="error-message">
				{result.message}
			</p>
		</div>
	{:else}
		<div class="content">
			<h1 class="content-title">{result.title}</h1>
			{#if result.haveChapters}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<ul class="content-levels">
					<li class="button content-level" class:active={isShortLevel} onclick={onSelectLevel}>
						Коротко
					</li>
					<li class="button content-level" class:active={!isShortLevel} onclick={onSelectLevel}>
						Подробно
					</li>
				</ul>
			{/if}

			<div class="content-list">
				{#if isShortLevel}
					<ThesesList theses={result.thesis} />
				{:else}
					<ChaptersList chapters={result.chapters} />
				{/if}
			</div>
		</div>
		<div class="content-actions">
			{#if result.type !== 'video' && result.sharingUrl}
				<a class="button action-button copy-button" href={result.sharingUrl} target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
						><g fill="none"
							><path
								d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
							/><path
								fill="currentColor"
								d="M10.232 10.231a5 5 0 0 1 6.89-.172l.181.172l2.828 2.829a5 5 0 0 1-6.89 7.243l-.18-.172l-2.122-2.122a1 1 0 0 1 1.32-1.497l.094.083l2.122 2.122a3 3 0 0 0 4.377-4.1l-.135-.143l-2.828-2.828a3 3 0 0 0-4.243 0a1 1 0 0 1-1.414-1.415M3.868 3.867a5 5 0 0 1 6.89-.172l.181.172L13.06 5.99a1 1 0 0 1-1.32 1.497l-.094-.083l-2.121-2.121A3 3 0 0 0 5.147 9.38l.135.144l2.829 2.829a3 3 0 0 0 4.242 0a1 1 0 1 1 1.415 1.414a5 5 0 0 1-6.89.172l-.182-.172l-2.828-2.829a5 5 0 0 1 0-7.07Z"
							/></g
						></svg
					>
					Открыть пересказ</a
				>
			{/if}
			<button
				class="button action-button"
				class:full={result.type === 'video' || !result.sharingUrl}
				title="Скопировать пересказ"
				aria-label="Скопировать пересказ"
				onclick={async () => await copySummarize(result as SuccessResponse)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
					><g fill="none" fill-rule="evenodd"
						><path
							d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
						/><path
							fill="currentColor"
							d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 2h11v11H4z"
						/></g
					></svg
				>
				{#if result.type === 'video' || !result.sharingUrl}
					Скопировать пересказ
				{/if}
			</button>
		</div>
	{/if}
</section>

<style>
	:root {
		--levels-bg-color: #424247;
		--level-selected-bg-rgb: 111, 111, 115;
		--levels-colors: #fff;
		--action-button-color: #fff;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 0 16px 16px;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.content-title {
		color: var(--title-color);
	}

	.content-levels {
		background: var(--levels-bg-color);
		display: flex;
		width: 100%;
		padding: 4px;
		border-radius: 8px;
	}

	.content-level {
		color: var(--levels-colors);
		background: transparent;
		flex: 1;
		display: flex;
		align-items: center;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.content-level.active {
		background: rgba(var(--level-selected-bg-rgb));
	}

	.content-level:not(.active):hover {
		background: rgba(var(--level-selected-bg-rgb), 0.35);
	}

	.content-list {
		max-height: 320px;
		overflow-y: auto;
		margin: 0 -16px;
		padding: 0 16px;
	}

	.content-actions {
		display: flex;
		gap: 12px;
	}

	.action-button {
		color: var(--action-button-color);
		padding: 12px;
	}

	.copy-button,
	.action-button.full {
		padding: 12px 24px;
		flex: 1;
		gap: 6px;
	}
</style>
