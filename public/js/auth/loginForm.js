// Login form handling with improved security and UX
import { MOCK_USER } from '../config/constants.js';
import { authState } from './authState.js';

export function initLoginForm(modal) {
  const form = modal.querySelector('#loginForm');
  if (!form) return;

  const userIdInput = form.querySelector('#userId');
  const passwordInput = form.querySelector('#userPassword');
  const submitButton = form.querySelector('.login-submit');
  const errorContainer = form.querySelector('.login-error-message');

  // Rate limiting setup
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  let failedAttempts = 0;
  let lockoutEndTime = 0;

  function showError(message) {
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.add('visible');
      // Add shake animation for emphasis
      errorContainer.classList.add('shake');
      setTimeout(() => {
        errorContainer.classList.remove('shake');
      }, 500);
    }
  }

  function clearError() {
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.remove('visible');
    }
  }

  function validateForm() {
    clearError();

    if (!userIdInput.value.trim()) {
      showError('아이디를 입력해주세요');
      return false;
    }

    if (!passwordInput.value.trim()) {
      showError('비밀번호를 입력해주세요');
      return false;
    }

    return true;
  }

  function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? '로그인 중...' : '로그인';

    // Disable inputs during loading
    userIdInput.disabled = isLoading;
    passwordInput.disabled = isLoading;

    // Optional: Add loading spinner class
    if (isLoading) {
      submitButton.classList.add('loading');
    } else {
      submitButton.classList.remove('loading');
    }
  }

  function isLockedOut() {
    if (Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      showError(`너무 많은 로그인 시도가 있었습니다. ${remainingMinutes}분 후에 다시 시도해주세요.`);
      return true;
    }
    return false;
  }

  function handleFailedAttempt() {
    failedAttempts++;

    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutEndTime = Date.now() + LOCKOUT_DURATION;
      failedAttempts = 0;
      showError(`너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.`);
      return false;
    }

    const remainingAttempts = MAX_ATTEMPTS - failedAttempts;
    showError(`로그인에 실패했습니다. ${remainingAttempts}번의 시도가 남았습니다.`);
    return true;
  }

  // Input event listeners for real-time validation
  [userIdInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
      clearError();
      submitButton.disabled = false;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm() || isLockedOut()) return;

    setLoadingState(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const userId = userIdInput.value;
      const password = passwordInput.value;

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const result = await response.json();
      if(response.ok && result.success) { //(userId === MOCK_USER.id && password === MOCK_USER.password) {
        const { user } = result;
/*        authState.setSession({
          id: user.id,//MOCK_USER.id,
          username: user.username, //MOCK_USER.username,
          avatarUrl: MOCK_USER.avatarUrl,
          // add additional user data here (including cash if needed)
          cash: 5000000
        });*/

        modal.style.display = 'none';
        form.reset();
        clearError();

        window.location.reload();
      } else {
        // Failed login
        if (!handleFailedAttempt()) {
          return; // Don't proceed if locked out
        }

        // Clear password field on failed attempt
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoadingState(false);
    }
  });
}
