import { TabComponent } from './components/tabs.js';
import { initNoticeItems } from './components/notice-item.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabContainer = document.querySelector('.tab-container');
  if (tabContainer) {
    new TabComponent(tabContainer, {
      onChange: (tabId) => {
        if (tabId === 'notice') {
          initNoticeItems();
        }
      }
    });
  }
});