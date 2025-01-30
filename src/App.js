import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [rooms, setRooms] = useState(["Room 1", "Room 2", "Room 3"]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const userId = "user123"; // Replace with a dynamic user ID for production

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission();
    }
  }, []);

  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
  
    if (subscription) {
      await subscription.unsubscribe();
      console.log("Unsubscribed successfully");
    }
  };

  const joinRoom = async (room) => {
    if (joinedRooms.includes(room)) {
      alert(`You are already subscribed to ${room}`);
      return;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");

    let subscription = await registration.pushManager.getSubscription();

    if(subscription) {
      await unsubscribe();
    }
    // Subscribe to push notifications
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: await getVapidPublicKey(),
    });

    // Send subscription to the server
    await axios.post("https://push-api-backend.onrender.com/subscribe", {
      userId,
      room,
      subscription,
    });

    setJoinedRooms((prev) => [...prev, room]);
    alert(`Subscribed to notifications for ${room}`);
  };

  const getVapidPublicKey = async () => {
    const response = await axios.get("https://push-api-backend.onrender.com/vapid-public-key");
    return urlBase64ToUint8Array(response.data.publicKey);
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };

  const sendMessage = async(room) => {
    const response = await fetch("https://push-api-backend.onrender.com/notify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room: room,
        message: "test message",
      }),
    });
  }

  return (
    <div>
      <h1>Join Rooms for Notifications</h1>
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>
            <button style={{marginRight: 20}} onClick={() => joinRoom(room)}>Join {room}</button>
            <button onClick={() => sendMessage(room)}>Send message to {room}</button>
          </li>
        ))}
      </ul>
      <h2>Joined Rooms</h2>
      <ul>
        {joinedRooms.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

// curl -X POST https://push-api-backend.onrender.com/notify/ -H "Content-Type: application/json" -d "{\"room\": \"Room 1\", \"message\": \"test message\"}"