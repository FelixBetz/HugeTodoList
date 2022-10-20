<script lang="ts">
	import { onMount } from 'svelte';
	import { Alert, Button, FormGroup, Label, Input } from 'sveltestrap/src';

	let alerts: string[] = [];

	let time: string;
	let date: string;

	function showAlert(message: string, time: number) {
		alerts[alerts.length] = message;
		setTimeout(() => {
			alerts = alerts.slice(1);
		}, time);
	}

	function showNotification(message: string) {
		console.log('notify test');
		const title = 'Test: ' + Date.now().toString();
		new Notification(title, { body: message });
	}

	function checkNotificationPermission() {
		window.Notification.requestPermission();
	}
	onMount(async () => {
		checkNotificationPermission();

		localStorage.setItem('myCat', 'Tom');
	});
	function createNotification() {
		if (time == '' || date == '') {
			return;
		}
		const notificationDate = new Date(date + 'T' + time + ':00');

		const now = Date.now();
		const timeDiff = notificationDate.getTime() - now;

		if (timeDiff > 0) {
			let notificationString =
				'add Notifications: ' +
				notificationDate.toLocaleDateString() +
				' ' +
				notificationDate.toLocaleTimeString();
			showAlert(notificationString, 5000);
			setTimeout(() => {
				showNotification(notificationString);
			}, timeDiff);
		}
	}
</script>

{#each alerts as alert}
	<Alert color="primary" isOpen={true} fade={true}>
		{alert}
	</Alert>
{/each}

<FormGroup>
	<Label for="exampleDate">Date</Label>
	<Input
		type="date"
		name="date"
		id="exampleDate"
		placeholder="date placeholder"
		bind:value={date}
	/>
</FormGroup>
<FormGroup>
	<Label for="exampleTime">Time</Label>
	<Input
		type="time"
		name="time"
		id="exampleTime"
		placeholder="time placeholder"
		bind:value={time}
	/>
</FormGroup>
<Button color="danger" on:click={createNotification}>send Notification</Button>
