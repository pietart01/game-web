// Profile modal functionality
export function initProfileModal() {
  const profileModal = document.getElementById('profileModal');
  const userProfile = document.querySelector('.user-profile');
  
  // Guard clause if elements don't exist
  if (!profileModal || !userProfile) return;
  
  const closeBtn = profileModal.querySelector('.close');
  if (!closeBtn) return;
  
  userProfile.addEventListener('click', () => {
    profileModal.style.display = 'block';
    
    // Update profile info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const profileAvatar = document.getElementById('profileAvatar');
      if (profileAvatar) {
        profileAvatar.src = user.avatarUrl;
      }
    }
  });
  
  closeBtn.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });
}