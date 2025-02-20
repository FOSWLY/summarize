<script lang="ts">
	import { formatTime } from '$lib';

	let { startTime }: { startTime: number } = $props();

	let formattedTime: string = $derived(formatTime(startTime));
</script>

<span class="start-time">{formattedTime}</span>

<style>
	:root {
		--time-bg-color: #4f4f54;
	}

	.start-time {
		padding: 2px 6px;
		border-radius: 4px;
		background: var(--time-bg-color);
		font-size: 12px;
		font-weight: normal;
	}
</style>
