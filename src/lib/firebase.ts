import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, logEvent as fbLogEvent } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;
let ready = false;

async function init() {
  if (ready) return;
  if (!(await isSupported())) return;
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  }
  ready = true;
}

export async function logEvent(eventName: string, params?: Record<string, unknown>) {
  try {
    await init();
    if (analytics) {
      fbLogEvent(analytics, eventName, params);
    }
  } catch {
    // analytics unavailable — noop
  }
}
