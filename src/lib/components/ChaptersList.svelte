<script lang="ts">
	import { slide } from 'svelte/transition';
	import Chapter from './Chapter.svelte';

	let { chapters } = $props();
</script>

<ul class="chapters" out:slide={{ duration: 200 }}>
	{#each chapters as chapter}
		<Chapter {chapter} />
	{/each}
</ul>

<style>
	.chapters {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
</style>
