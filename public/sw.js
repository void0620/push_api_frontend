self.addEventListener("push", function (event) {
	let data = { title: "Default Title", body: "New Notification!" };
	if (event.data) {
	  try {
		data = event.data.json();
	  } catch (error) {
		console.error("Push event error:", error);
	  }
	}
  console.log(data);
	event.waitUntil(
	  self.registration.showNotification(data.title, {
		body: data.body,
		icon: "/logo192.png",
		data: data.data
	  })
	);
});

self.addEventListener('notificationclick', function(event) {
	console.log('Notification clicked.');
	event.notification.close();
	console.log(event.notification);
	let clickResponsePromise = Promise.resolve();
	if (event.notification.data && event.notification.data.url) {
		clickResponsePromise = clients.openWindow(event.notification.data.url);
	}

	event.waitUntil(clickResponsePromise);
});