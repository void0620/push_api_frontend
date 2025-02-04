self.addEventListener("push", function (event) {
	let data = { title: "Default Title", body: "New Notification!" };
	if (event.data) {
	  try {
		data = event.data.json();
	  } catch (error) {
		console.error("Push event error:", error);
	  }
	}
  
	event.waitUntil(
	  self.registration.showNotification(data.title, {
		body: data.body,
		icon: "/logo192.png",
	  })
	);
  });
  