<script lang="ts">
	let { onclick, buttonTitle = '', showButton = false } = $props();
	let buttonEl: HTMLButtonElement;

	export function changeButtonDisabled(disabled: boolean) {
		buttonEl.disabled = disabled;
		buttonEl.title = disabled ? '' : buttonTitle;
		return true;
	}
</script>

<header class="header">
	<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
		><path
			fill="#fff"
			fill-rule="evenodd"
			d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5m9-3a.75.75 0 0 1 .728.568l.258 1.036a2.63 2.63 0 0 0 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a2.63 2.63 0 0 0-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.63 2.63 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.63 2.63 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5M16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395a1.5 1.5 0 0 0-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395a1.5 1.5 0 0 0 .948-.948l.395-1.183A.75.75 0 0 1 16.5 15"
			clip-rule="evenodd"
		/></svg
	>
	<div class="header-info">
		<p class="header-info__title">Краткий пересказ</p>
		<p class="header-info__desc">сделан нейросетью</p>
	</div>
	<div class="header-actions">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button
			class="button refresh-button"
			class:hidden={!showButton}
			{onclick}
			title={buttonTitle}
			bind:this={buttonEl}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
				><g fill="none"
					><path
						d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
					/><path
						fill="currentColor"
						d="M20 9a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8H9.414l.793.793a1 1 0 0 1-1.414 1.414l-2.496-2.496a1 1 0 0 1-.287-.567L6 17.991a1 1 0 0 1 .237-.638l.056-.06l2.5-2.5a1 1 0 0 1 1.414 1.414L9.414 17H13a6 6 0 0 0 6-6v-1a1 1 0 0 1 1-1m-4.793-6.207l2.5 2.5a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 1 1-1.414-1.414L14.586 7H11a6 6 0 0 0-6 6v1a1 1 0 1 1-2 0v-1a8 8 0 0 1 8-8h3.586l-.793-.793a1 1 0 0 1 1.414-1.414"
					/></g
				></svg
			>
		</button>
	</div>
</header>

<style>
	:root {
		--refresh-btn-disabled-color: #777;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 16px;
		gap: 8px;
	}

	.header-info {
		display: flex;
		flex-direction: column;
	}

	.header-info__title {
		font-weight: bold;
		color: var(--title-color);
	}

	.header-info__desc {
		color: var(--additional-color);
	}

	.header-actions {
		margin-left: auto;
	}

	.refresh-button {
		background-color: transparent;
		border-radius: 50%;
	}

	.refresh-button.hidden {
		display: none;
	}

	.refresh-button:not([disabled]):hover {
		background-color: var(--button-hover-bg-color);
	}

	.refresh-button:global([disabled]) {
		color: var(--refresh-btn-disabled-color);
		cursor: initial;
	}
</style>
