<script lang="ts">
	import { Button } from 'sveltestrap/src';

	function showNotification() {
		const title = 'Test: ' + Date.now().toString();
		new Notification(title, { body: 'test tests' });
	}

	function checkNotification() {
		console.log(Notification.permission);
		window.Notification.requestPermission();
		if (Notification.permission === 'granted') {
			showNotification();
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					showNotification();
				}
			});
		}
	}
</script>

<Button color="danger" on:click={checkNotification}>send Notification</Button>
