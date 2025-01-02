export function initNoticeItems() {
  const noticeHeaders = document.querySelectorAll('.notice-header');
  
  noticeHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const noticeItem = header.closest('.notice-item');
      const expandButton = header.querySelector('.expand-button');
      const noticeBody = noticeItem.querySelector('.notice-body');
      
      // Toggle expanded state
      expandButton.classList.toggle('expanded');
      noticeBody.classList.toggle('expanded');
    });
  });
}