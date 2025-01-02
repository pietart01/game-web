// Reusable tab component
export class TabComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      activeClass: 'active',
      onChange: null,
      ...options
    };
    
    this.tabs = container.querySelectorAll('[data-tab]');
    this.panels = container.querySelectorAll('[data-panel]');
    
    this.init();
  }
  
  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.selectTab(tab));
    });
    
    // Activate first tab by default
    if (this.tabs.length > 0) {
      this.selectTab(this.tabs[0]);
    }
  }
  
  selectTab(selectedTab) {
    // Update tabs
    this.tabs.forEach(tab => {
      tab.classList.toggle(
        this.options.activeClass, 
        tab === selectedTab
      );
    });
    
    // Update panels
    const targetPanel = selectedTab.dataset.tab;
    this.panels.forEach(panel => {
      panel.style.display = 
        panel.dataset.panel === targetPanel ? 'block' : 'none';
    });
    
    // Trigger change callback
    if (this.options.onChange) {
      this.options.onChange(targetPanel);
    }
  }
}