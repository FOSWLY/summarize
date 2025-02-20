<script lang="ts">
	import './global.css';

	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		max-height: 600px;
		width: 350px;
		height: 100%;
		/* overflow: auto;
		-ms-overflow-style: none;
		scrollbar-width: none; */
	}

	/* .app::-webkit-scrollbar {
		width: 0;
		height: 0;
	} */
</style>
