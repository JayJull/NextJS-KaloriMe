export function registerServiceWorker() {
  console.log("Register service worker...");
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW Registered:', registration);
        })
        .catch((error) => {
          console.error('SW Registration failed:', error);
        });
    });
  } else {
    console.warn('Browser tidak mendukung service worker.');
  }
}
