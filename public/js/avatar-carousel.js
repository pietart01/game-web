const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const carouselItems = document.querySelector('.avatar-items');

prevButton.addEventListener('click', () => {
  carouselItems.scrollBy({ left: -300, behavior: 'smooth' });
});

nextButton.addEventListener('click', () => {
  carouselItems.scrollBy({ left: 300, behavior: 'smooth' });
});
