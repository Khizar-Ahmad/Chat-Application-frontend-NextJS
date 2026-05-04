import { messaging, getToken, onMessage } from "./firebase";

const vapidKey =
  "BKoohuizLMvRAqWyIGVyb5l2fHnyGloEaw097xgbXR5_cgr_pf-HBuGtQV9buyBmdiAIydS6fRN78fVge51IZqo";

// export const requestNotificationPermission = async (): Promise<
//   string | null
// > => {
//   try {
//     // const permission = await Notification.requestPermission();

//     // if (permission !== "granted") {
//     //   console.warn("Permission not granted");
//     //   return null;
//     // }

//     const token = await getToken(messaging, { vapidKey });
//     console.log("FCM Token:", token);

//     return token;
//   } catch (error) {
//     console.error("Error getting notification permission:", error);
//     return null;
//   }
// };

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    // STEP 1 — check if browser supports notifications
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications");
      return null;
    }

    // STEP 2 — check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      console.error("Service worker not supported in this browser");
      return null;
    }

    // STEP 3 — request permission FIRST (you commented this out — that was the bug)
    console.log("before permission check");
    const permission = await Notification.requestPermission();
    console.log("Permission status:", permission);

    if (permission !== "granted") {
      console.warn("Permission not granted by user");
      return null;
    }

    // STEP 4 — register service worker explicitly before getToken
    console.log("before service");
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    console.log("Service worker registered:", serviceWorkerRegistration);

    // STEP 5 — now get the token
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration, // pass it explicitly
    });

    if (!token) {
      console.error("No token returned — check VAPID key and service worker");
      return null;
    }

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

// Optional: handle foreground messages
export const subscribeToForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    // Show custom toast or popup here if desired
  });
};
