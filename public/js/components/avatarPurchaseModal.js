// Avatar Purchase Modal Component
export class AvatarPurchaseModal {
  constructor() {
    this.modal = document.getElementById('avatarPurchaseModal');
    this.previewImage = document.getElementById('previewImage');
    this.avatarName = document.getElementById('avatarName');
    this.avatarPrice = document.getElementById('avatarPrice');
    this.cashDeduction = document.getElementById('cashDeduction');
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('.close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Cancel button
    const cancelBtn = this.modal.querySelector('.btn-cancel');
    cancelBtn?.addEventListener('click', () => this.hide());

    // Close on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // Purchase button
    const purchaseBtn = this.modal.querySelector('.btn-purchase');
    purchaseBtn?.addEventListener('click', () => this.handlePurchase());
  }

  show(avatarData) {
    this.currentAvatar = avatarData;
    
    // Update modal content
    this.previewImage.src = avatarData.image;
    this.avatarName.textContent = avatarData.name;
    this.avatarPrice.textContent = `${avatarData.price.toLocaleString()} 캐시`;
    this.cashDeduction.textContent = '-10,000 캐시';
    
    this.modal.style.display = 'block';
  }

  hide() {
    this.modal.style.display = 'none';
  }

  async handlePurchase() {
    try {
      // Add your purchase logic here
      console.log('Purchasing avatar:', this.currentAvatar);
      
      // Show success message or handle errors
      alert('아바타 구매가 완료되었습니다.');
      this.hide();
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('구매 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }
}