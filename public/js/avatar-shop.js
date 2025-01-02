document.addEventListener('DOMContentLoaded', () => {
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      // Add filter logic here
    });
  });
});