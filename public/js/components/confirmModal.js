// Confirm modal component
export class ConfirmModal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    if (!this.modal) return;
    
    this.closeBtn = this.modal.querySelector('.close');
    this.cancelBtn = this.modal.querySelector('.btn-cancel');
    this.confirmBtn = this.modal.querySelector('.btn-confirm');
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Close modal handlers
    [this.closeBtn, this.cancelBtn].forEach(btn => {
      btn?.addEventListener('click', () => this.hide());
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }
  
  show() {
    return new Promise((resolve) => {
      this.modal.style.display = 'block';
      
      const handleConfirm = () => {
        this.hide();
        resolve(true);
        this.confirmBtn.removeEventListener('click', handleConfirm);
      };
      
      this.confirmBtn?.addEventListener('click', handleConfirm);
    });
  }
  
  hide() {
    this.modal.style.display = 'none';
  }
}