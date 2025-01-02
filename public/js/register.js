// Register page functionality
document.addEventListener('DOMContentLoaded', () => {
  const steps = ['agreement', 'authentication', 'form'];
  let currentStep = 0;

  // Step indicators
  const stepIndicators = document.querySelectorAll('.step');
  
  // Step elements
  const stepElements = steps.map(step => 
    document.getElementById(`step-${step}`)
  );

  // Agreement step
  const agreeTerms = document.querySelector('[name="agree-terms"]');
  const agreePrivacy = document.querySelector('[name="agree-privacy"]');
  const nextButtons = document.querySelectorAll('.next-button');
  const prevButtons = document.querySelectorAll('.prev-button');
  const authButton = document.querySelector('.auth-button');
  const signupForm = document.querySelector('.signup-form');

  // Update step visibility
  function showStep(index) {
    stepElements.forEach((el, i) => {
      if (el) {
        el.style.display = i === index ? 'block' : 'none';
      }
    });

    // Update step indicators
    stepIndicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i <= index);
    });

    currentStep = index;
  }

  // Agreement step handlers
  function updateNextButton() {
    const nextButton = nextButtons[0];
    if (nextButton) {
      nextButton.disabled = !(agreeTerms?.checked && agreePrivacy?.checked);
    }
  }

  [agreeTerms, agreePrivacy].forEach(checkbox => {
    checkbox?.addEventListener('change', updateNextButton);
  });

  // Authentication step handlers
  authButton?.addEventListener('click', () => {
    // Simulate authentication process
    setTimeout(() => {
      nextButtons[1].disabled = false;
      authButton.textContent = '인증완료';
      authButton.disabled = true;
    }, 1000);
  });

  // Navigation handlers
  nextButtons.forEach(button => {
    button?.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  prevButtons.forEach(button => {
    button?.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  });

  // Form validation and submission
  const checkButtons = document.querySelectorAll('.check-button');
  
  checkButtons.forEach(button => {
    button?.addEventListener('click', async () => {
      const input = button.previousElementSibling;
      const formGroup = button.closest('.form-group');
      const errorMessage = formGroup?.querySelector('.error-message');
      
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (input?.value.length < 4) {
        errorMessage.textContent = '4자 이상 입력해주세요';
        errorMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'none';
        button.textContent = '확인완료';
        button.disabled = true;
      }
    });
  });

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    const inputs = signupForm.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup?.querySelector('.error-message');
        errorMessage.textContent = '필수 입력 항목입니다';
        errorMessage.style.display = 'block';
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate form submission
    const submitButton = signupForm.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.textContent = '처리중...';

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect to success page or show success message
    window.location.href = '/';
  });

  // Initialize first step
  showStep(0);
});