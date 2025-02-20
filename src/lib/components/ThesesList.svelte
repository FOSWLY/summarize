<script lang="ts">
	import { slide } from 'svelte/transition';
	import Thesis from './Thesis.svelte';

	let { theses } = $props();
</script>

<ul class="theses" out:slide={{ duration: 200 }}>
	{#each theses as thesis}
		<Thesis {thesis} />
	{/each}
</ul>

<style>
	.theses {
		display: flex;
		flex-direction: column;
		list-style: none;
	}
</style>
