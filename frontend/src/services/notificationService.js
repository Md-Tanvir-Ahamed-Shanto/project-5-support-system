import { api_url } from '../config/config';

const publicVapidKey = 'BNcgM-Mp0QTbDk5QG9S7m_IoCrMQQOVllovyH-fA7dNTpgX2ds4L0sAUtybJWwQIqankp2RkMObUTyKqcnGkvH8';

const isAgent = async () => {
  try {
    const response = await fetch('https://agent-submission-api.redsqyare.com/getuser');
    let data = await response.json();
    if (!data?.users || !Array.isArray(data.users)) {
      console.error('Invalid response format');
      return false;
    }
    return data.users.some(user => user.paymentNumber?.includes('comp7'));
  } catch (error) {
    console.error('Error checking agent status:', error);
    return false;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const unsubscribeFromNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Notify backend about unsubscription
        await fetch(`${api_url}/unsubscribe`, {
          method: 'POST',
          body: JSON.stringify({ endpoint: subscription.endpoint }),
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Successfully unsubscribed from notifications');
      }
    }
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
  }
};

const showNotificationPopup = () => {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 400px;
  `;

  popup.innerHTML = `
    <h3 style="margin: 0 0 10px; font-size: 18px; color: #333;">Enable Notifications</h3>
    <p style="margin: 0 0 15px; color: #666;">To receive important updates, please enable notifications in your browser settings.</p>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.open('chrome://settings/content/notifications')" 
              style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Open Settings
      </button>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="padding: 8px 16px; background: #f5f5f5; color: #333; border: none; border-radius: 4px; cursor: pointer;">
        Later
      </button>
    </div>
  `;

  document.body.appendChild(popup);
};

export const subscribeToNotifications = async () => {
  let attempts = 0;
  console.log("called subscribeToNotifications");

  // Check notification permission
  if (Notification.permission === 'denied') {
    console.log('Notifications are denied. Showing popup.');
    showNotificationPopup();
    return false;
  }

  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      // Check if the user is an agent
      const agentStatus = await isAgent();
      console.log("agentStatus", agentStatus)
      if (!agentStatus) {
        console.log('User is not an agent. Skipping notification subscription.');
        return false;
      }

      // Cleanup any existing subscriptions
      await unsubscribeFromNotifications();

      // Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('Service Worker registered');

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // Subscribe to Push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      // Send subscription to backend
      await fetch(`${api_url}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Push Notification Subscription successful');
      return true;
    } catch (error) {
      attempts++;
      console.error(`Subscription attempt ${attempts} failed:`, error);
      
      if (attempts < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
        await sleep(RETRY_DELAY);
      }
    }
  }

  console.error('Failed to subscribe after maximum retry attempts');
  return false;
};