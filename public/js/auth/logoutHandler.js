// Logout handling
import { authState } from './authState.js';
import { ConfirmModal } from '../components/confirmModal.js';

export function initLogoutHandler() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  // const confirmModal = new ConfirmModal('confirmModal');

  logoutBtn.addEventListener('click', async () => {
    // const confirmed = await confirmModal.show();
    // if (confirmed) {
      authState.clearSession();
    // }
  });
}
