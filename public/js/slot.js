import { TabComponent } from './components/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabContainer = document.querySelector('.tab-container');
  if (tabContainer) {
    new TabComponent(tabContainer, {
      onChange: (tabId) => {
        console.log(`Changed to tab: ${tabId}`);
        // Add any tab-specific logic here
      }
    });
  }
});


