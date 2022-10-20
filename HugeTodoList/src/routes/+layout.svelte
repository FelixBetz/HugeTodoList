<script lang="ts">
	import { Styles } from 'sveltestrap/src';
	import {
		Navbar,
		NavItem,
		Collapse,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavLink
	} from 'sveltestrap/src';
	let isOpen = false;
	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	interface Links {
		label: string;
		route: string;
	}
	const navItems: Links[] = [
		{ label: 'Home', route: '/' },
		{ label: 'notifyTest', route: '/notifyTest' },
		{ label: 'storageTest', route: '/storageTest' }
	];
</script>

<Styles />

<Navbar color="light" light expand="md">
	<NavbarBrand href="/">HugeTodoList</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			{#each navItems as item}
				<NavItem>
					<NavLink href={item.route}>{item.label}</NavLink>
				</NavItem>
			{/each}
		</Nav>
	</Collapse>
</Navbar>

<slot />
