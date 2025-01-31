export async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register("/sw.js");
      return registration;
    }
    throw new Error("Service Worker not supported");
  }
  
  export async function subscribeToPushNotifications() {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported in this browser.");
      return;
    }
  
    if (!("PushManager" in window)) {
      console.warn("Push API not supported in this browser.");
      return;
    }
  
    try {
      const registration = await registerServiceWorker();
  
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) return existingSubscription;
  
      const vapidPublicKey = "YOUR_PUBLIC_VAPID_KEY"; // Replace with actual key
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
  
      return await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  