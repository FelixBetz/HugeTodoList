<script lang="ts">
	/////////////////////////////////////////////////////////////////////////////
	//forked from : https://github.com/jwlarocque/svelte-dragdroplist
	/////////////////////////////////////////////////////////////////////////////
	import { flip } from 'svelte/animate';
	import type { TodoItem } from '$lib/interfaces';
	export let data: TodoItem[] = [];
	export let removesItems = false;

	let ghost: HTMLDivElement;
	let grabbed: HTMLDivElement | null;

	let lastTarget: Element | null;

	let mouseY = 0; // pointer y coordinate within client
	let offsetY = 0; // y distance from top of grabbed element to pointer
	let layerY = 0; // distance from top of list to top of client

	function grab(clientY: number, element: HTMLDivElement) {
		// modify grabbed element
		grabbed = element;

		// modify ghost element (which is actually dragged)
		if (grabbed != null) {
			grabbed.dataset.grabY = clientY.toString();
			ghost.innerHTML = grabbed.innerHTML;
			// record offset from cursor to top of element
			// (used for positioning ghost)
			offsetY = grabbed.getBoundingClientRect().y - clientY;
			drag(clientY);
		}
	}

	// drag handler updates cursor position
	function drag(clientY: number) {
		if (grabbed) {
			mouseY = clientY;
			if (ghost.parentElement != undefined) {
				layerY = ghost.parentElement?.getBoundingClientRect().y;
			}
		}
	}

	// touchEnter handler emulates the mouseenter event for touch input
	// (more or less)
	function touchEnter(ev: Touch) {
		drag(ev.clientY);
		// trigger dragEnter the first time the cursor moves over a list item
		let target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.item');
		if (target && target instanceof HTMLDivElement) {
			if (target && target != lastTarget) {
				lastTarget = target;
				dragEnter(ev, target);
			}
		}
	}

	function dragEnter(_ev: MouseEvent | Touch, target: HTMLDivElement) {
		// swap items in data
		if (grabbed && target != grabbed && target?.classList.contains('item')) {
			if (grabbed.dataset.index && target.dataset.index) {
				moveDatum(parseInt(grabbed.dataset.index), parseInt(target.dataset.index));
			}
		}
	}

	// does the actual moving of items in data
	function moveDatum(from: number, to: number) {
		let temp = data[from];
		data = [...data.slice(0, from), ...data.slice(from + 1)];
		data = [...data.slice(0, to), temp, ...data.slice(to)];
	}

	function release() {
		grabbed = null;
	}

	function removeDatum(index: number) {
		data = [...data.slice(0, index), ...data.slice(index + 1)];
	}
</script>

<!-- All the documentation has to go up here, sorry.
     (otherwise it conflicts with the HTML or svelte/animate) 
     The .list has handlers for pointer movement and pointer up/release/end.
     Each .item has a handler for pointer down/click/start, which assigns that
     element as the item currently being "grabbed".  They also have a handler
     for pointer enter (the touchmove handler has extra logic to behave like the
     no longer extant 'touchenter'), which swaps the entered element with the
     grabbed element when triggered.
     You'll also find reactive styling below, which keeps it from being directly
     part of the imperative javascript handlers. -->
<main class="dragdroplist">
	<div
		bind:this={ghost}
		id="ghost"
		class={grabbed ? 'item haunting' : 'item'}
		style={'top: ' + (mouseY + offsetY - layerY) + 'px'}
	>
		<p />
	</div>
	<div
		class="list"
		on:mousemove={function (ev) {
			ev.stopPropagation();
			drag(ev.clientY);
		}}
		on:touchmove={function (ev) {
			ev.stopPropagation();
			drag(ev.touches[0].clientY);
		}}
		on:mouseup={function (ev) {
			ev.stopPropagation();
			release();
		}}
		on:touchend={function (ev) {
			ev.stopPropagation();
			release();
		}}
	>
		{#each data as datum, i (datum.id ? datum.id : JSON.stringify(datum))}
			<div
				id={grabbed && (datum.id ? datum.id : JSON.stringify(datum)) == grabbed.dataset.id
					? 'grabbed'
					: ''}
				class="item"
				data-index={i}
				data-id={datum.id ? datum.id : JSON.stringify(datum)}
				data-grabY="0"
				on:mousedown={function (ev) {
					if (this instanceof HTMLDivElement) {
						grab(ev.clientY, this);
					}
				}}
				on:touchstart={function (ev) {
					if (this instanceof HTMLDivElement) {
						grab(ev.touches[0].clientY, this);
					}
				}}
				on:mouseenter={function (ev) {
					ev.stopPropagation();
					if (ev.target instanceof HTMLDivElement) {
						dragEnter(ev, ev.target);
					}
				}}
				on:touchmove={function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					touchEnter(ev.touches[0]);
				}}
				animate:flip={{ duration: 200 }}
			>
				<div class="buttons">
					<button
						class="up"
						style={'visibility: ' + (i > 0 ? '' : 'hidden') + ';'}
						on:click={() => {
							moveDatum(i, i - 1);
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px"
							><path d="M0 0h24v24H0V0z" fill="none" /><path
								d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"
							/></svg
						>
					</button>
					<button
						class="down"
						style={'visibility: ' + (i < data.length - 1 ? '' : 'hidden') + ';'}
						on:click={() => {
							moveDatum(i, i + 1);
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px"
							><path d="M0 0h24v24H0V0z" fill="none" /><path
								d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
							/></svg
						>
					</button>
				</div>

				<div class="content">
					<p>{datum.title}</p>
				</div>

				<div class="buttons delete">
					{#if removesItems}
						<button
							on:click={() => {
								removeDatum(i);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"
								><path d="M0 0h24v24H0z" fill="none" /><path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
								/></svg
							>
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		position: relative;
	}

	.list {
		cursor: grab;
		z-index: 5;
		display: flex;
		flex-direction: column;
	}

	.item {
		box-sizing: border-box;
		display: inline-flex;
		width: 100%;
		min-height: 3em;
		margin-bottom: 0.5em;
		background-color: white;
		border: 1px solid rgb(190, 190, 190);
		border-radius: 2px;
		user-select: none;
	}

	.item:last-child {
		margin-bottom: 0;
	}

	.item:not(#grabbed):not(#ghost) {
		z-index: 10;
	}

	.item > * {
		margin: auto;
	}

	.buttons {
		width: 32px;
		min-width: 32px;
		margin: auto 0;
		display: flex;
		flex-direction: column;
	}

	.buttons button {
		cursor: pointer;
		width: 18px;
		height: 18px;
		margin: 0 auto;
		padding: 0;
		border: 1px solid rgba(0, 0, 0, 0);
		background-color: inherit;
	}

	.buttons button:focus {
		border: 1px solid black;
	}

	.delete {
		width: 32px;
	}

	#grabbed {
		opacity: 0;
	}

	#ghost {
		pointer-events: none;
		z-index: -5;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}

	#ghost * {
		pointer-events: none;
	}

	#ghost.haunting {
		z-index: 20;
		opacity: 1;
	}
</style>
