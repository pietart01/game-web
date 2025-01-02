// UI update service
export const uiService = {
  updateAuthUI() {
    const loginSection = document.querySelector('.login-section');
    const userSection = document.querySelector('.user-section');
    
    // Guard clause if elements don't exist
    if (!loginSection || !userSection) return;
    
    const user = sessionService.get();

    if (user) {
      loginSection.style.display = 'none';
      userSection.style.display = 'flex';
      
      const avatar = userSection.querySelector('.user-avatar');
      const username = userSection.querySelector('.username');
      
      if (avatar) avatar.src = user.avatarUrl;
      if (username) username.textContent = user.username;
    } else {
      loginSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  }
};