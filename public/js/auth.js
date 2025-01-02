import { MOCK_USER } from './config/constants.js';
import { sessionService } from './services/sessionService.js';
import { uiService } from './services/uiService.js';

// Auth service
export const auth = {
  setSession(userData) {
    sessionService.set(userData);
    // Set auth cookie
    document.cookie = `auth=${JSON.stringify(userData)}; path=/`;
    uiService.updateAuthUI();
  },

  clearSession() {
    sessionService.clear();
    // Remove auth cookie
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    uiService.updateAuthUI();
  },

  getSession() {
    return sessionService.get();
  },

  updateUI() {
    uiService.updateAuthUI();
  }
};