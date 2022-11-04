<script lang="ts">
	/////////////////////////////////////////////////////////////////////////////
	//forked from : https://github.com/jwlarocque/svelte-dragdroplist
	/////////////////////////////////////////////////////////////////////////////
	import { flip } from 'svelte/animate';
	import type { TodoItem } from '$lib/interfaces';
	import { Input } from 'sveltestrap/src';
	import { createEventDispatcher } from 'svelte';

	export let data: TodoItem[] = [];
	export let isOpenList = false;

	const dispatch = createEventDispatcher();

	function dispactchMessage(todo: TodoItem) {
		dispatch('message', {
			text: todo.title + ', ' + todo.createdDate.toString()
		});
	}

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
	/>
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
		{#each data as datum, i (datum.createdDate ? datum.createdDate : JSON.stringify(datum))}
			<div animate:flip={{ duration: 200 }}>
				{#if datum.isDone == isOpenList}
					<div
						id={grabbed &&
						(datum.createdDate ? datum.createdDate : JSON.stringify(datum)) == grabbed.dataset.id
							? 'grabbed'
							: ''}
						class={'item' + (datum.isDone ? ' itemIsDone' : '')}
						data-index={i}
						data-id={datum.createdDate ? datum.createdDate : JSON.stringify(datum)}
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
					>
						<Input
							type="checkbox"
							bind:checked={datum.isDone}
							on:change={() => {
								datum.isDone = !datum.isDone;
								datum.modifiedDate = Date.now();
								dispactchMessage(datum);
							}}
						/>

						<div class="content">
							<p>{datum.title} (id:{datum.createdDate})</p>
							<p>modifiedDate: {new Date(datum.modifiedDate).toLocaleTimeString()}</p>
							<p>modifiedDate: {datum.modifiedDate}</p>
						</div>
					</div>{/if}
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
	}

	.itemIsDone {
		text-decoration: line-through;
	}

	.item {
		box-sizing: border-box;
		display: inline-flex;
		width: 100%;

		background-color: white;
		border: 1px solid rgb(190, 190, 190);
		border-radius: 2px;
		user-select: none;
	}

	.item:not(#grabbed):not(#ghost) {
		z-index: 10;
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

	#ghost.haunting {
		z-index: 20;
		opacity: 1;
	}
</style>
