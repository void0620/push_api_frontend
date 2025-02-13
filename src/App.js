import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import axios from "axios";

const PUBLIC_VAPID_KEY = "BI5gWL3u-paHcH32d1wSuQ24RtHV1P6YSk3tuH9aacnUmyrHrj5oZ7pNWJmYiUnqEuMM7OeX5smJRQ8vIXrXus4"; // Replace with your actual VAPID key

const App = () => {
  const [subscribedRooms, setSubscribedRooms] = useState([]);
  // const location = useLocation();
  const subscribeToRoom = async (roomId) => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      const parsedSubscription = JSON.stringify(subscription);
      const unParsedSubscription = JSON.parse(parsedSubscription);
      console.log(subscription);
      // Send subscription to backend
      await fetch("https://push-api-backend.onrender.com/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Ensures the server knows the data format
        },
        body: JSON.stringify({
          endpoint: unParsedSubscription.endpoint,
          p256dh: unParsedSubscription.keys.p256dh,
          auth: unParsedSubscription.keys.auth,
          room: roomId
        })
      })

      setSubscribedRooms((prev) => [...prev, roomId]);
      alert(`Subscribed to ${roomId}`);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const sendNotification = (roomId) => {
    fetch("https://push-api-backend.onrender.com/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Ensures the server knows the data format
      },
      body: JSON.stringify({
        room: roomId,
        title: `${roomId} update`,
        message: "This is a new message"
      })
    })
  }

  const clearSubscription = async () => {
    try {
      await fetch("https://push-api-backend.onrender.com/clearSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setSubscribedRooms([]);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Push Notification Rooms</h1>
      <p>Click a room to subscribe:</p>
      <div>
        <button onClick={() => subscribeToRoom("room1")}>Subscribe to Room 1</button>
        <button onClick={() => sendNotification('room1')}>Send Message to Room 1</button>
      </div>
      <div>
        <button onClick={() => subscribeToRoom("room2")}>Subscribe to Room 2</button>
        <button onClick={() => sendNotification('room2')}>Send Message to Room 2</button>
      </div>
      <div>
        <button onClick={() => subscribeToRoom("room3")}>Subscribe to Room 3</button>
        <button onClick={() => sendNotification('room3')}>Send Message to Room 3</button>
      </div>
      <p>Subscribed Room: {subscribedRooms || "None"}</p>
      <button onClick={() => clearSubscription()}>Clear Subscriptions</button>
    </div>
  );
};

// Helper function to convert VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default App;