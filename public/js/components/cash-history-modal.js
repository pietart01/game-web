// Cash History Modal Component
export class CashHistoryModal {
  constructor() {
    this.modal = document.getElementById('cashHistoryModal');
    if (!this.modal) return;

    this.setupEventListeners();
    this.setupTabs();
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('.close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Close on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }

  setupTabs() {
    const tabs = this.modal.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Add tab switching logic here
      });
    });
  }

  show() {
    this.modal.style.display = 'block';
  }

  hide() {
    this.modal.style.display = 'none';
  }
}

// Initialize and export a single instance
export const cashHistoryModal = new CashHistoryModal();