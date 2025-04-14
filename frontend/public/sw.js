self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/vite.svg',
    data: {
      url: self.registration.scope
    },
    requireInteraction: true
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
self.clients.openWindow('https://ticket.redsqyare.com/agent')
  );
});