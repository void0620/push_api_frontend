self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log('received notification');
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  });
  