// Cash charge modal functionality
export function initCashChargeModal() {
  // Guard clause - check if we're on a page that needs this functionality
  const modal = document.getElementById('cashChargeModal');
  if (!modal) return;

  // Get required elements with null checks
  const cashChargeBtn = document.getElementById('cashChargeBtn');
  const closeBtn = modal.querySelector('.close');
  const methodTabs = modal.querySelectorAll('.method-tab');
  
  // Only set up event listeners if the button exists
  if (cashChargeBtn) {
    cashChargeBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }
  
  // Close button handler
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Close on outside click
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Tab switching - only if we have tabs
  if (methodTabs.length > 0) {
    methodTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        methodTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }
}

// Initialize only when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCashChargeModal);
} else {
  initCashChargeModal();
}