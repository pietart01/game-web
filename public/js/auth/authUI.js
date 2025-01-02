import { authState } from './authState.js';


/*
      authState.setSession({
        id: user.id,//MOCK_USER.id,
        username: user.username, //MOCK_USER.username,
        avatarUrl: MOCK_USER.avatarUrl,
        // add additional user data here (including cash if needed)
        cash: 5000000
      });
 */

export function initAuthUI() {
  const loginSection = document.querySelector('.login-section');
  const userSection = document.querySelector('.user-section');
  const cashAmountEl = document.querySelector('.cash-amount');

  // 1. Attach a listener
  authState.addListener(updateUI);


  function updateUI() {
    const user = authState.getUser();
    if (!loginSection || !userSection) return;

    if (user) {
      loginSection.style.display = 'none';
      userSection.style.display = 'flex';

      // Example: update username, avatar, cash, etc.
      const avatar = userSection.querySelector('.user-avatar');
      const username = userSection.querySelector('.username');
      if (avatar)   avatar.src = user.avatarUrl;
      if (username) username.textContent = user.username;

      // If your user object has cash info
      if (cashAmountEl && user.cash !== undefined) {
        cashAmountEl.textContent = user.cash.toLocaleString();
      }
    } else {
      // Hide user section, show login
      loginSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  }

  // 2. Call once on startup in case user is already logged in
  updateUI();
}
