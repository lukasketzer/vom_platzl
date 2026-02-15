import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  manifest: {
    name: 'Vom Platzl',
    description: 'Reimpower Local Stores',
    permissions: ['storage', 'activeTab', 'scripting'],
    host_permissions: [
      'https://www.google.com/*',
      'https://maps.googleapis.com/*',
      'https://ipapi.co/*',
      'http://localhost:8000/*',
      'http://127.0.0.1:8000/*'
    ],
    web_accessible_resources: [
      {
        resources: ['Silhouette_of_Munich.svg-removebg-preview.png', 'logo.png'],
        matches: ['<all_urls>'],
      },
    ],
    action: {},
  },
});
