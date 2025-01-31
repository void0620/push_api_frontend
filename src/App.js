import React, { useEffect, useState } from "react";
import { subscribeToPushNotifications } from "./utils/pushNotifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      try {
        const subscription = await subscribeToPushNotifications();
        await fetch("https://push-api-backend.onrender.com/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        toast.success("Subscribed successfully!");
        setIsSubscribed(true);
      } catch (error) {
        toast.error("Subscription failed.");
      }
    } else {
      toast.error("Notification permission denied.");
    }
  };

  return (
    <div>
      <h1>Web Push Notification Demo</h1>
      {!isSubscribed && <button onClick={requestPermission}>Enable Notifications</button>}
      <button onClick={() => fetch("https://push-api-backend.onrender.com/send-notification", { method: "POST" })}>
        Send Notification
      </button>
      <ToastContainer />
    </div>
  );
}

export default App;
