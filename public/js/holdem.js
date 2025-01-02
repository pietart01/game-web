// holdem.js

document.addEventListener('DOMContentLoaded', () => {
  // Initialize room modal using global function
  const roomModal = window.initHoldemRoomModal();

  // Add click handlers to channel cards
  const channelCards = document.querySelectorAll('.channel-card');
  channelCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const channelId = card.getAttribute('data-channel-id'); // Get channelId from the data attribute
      roomModal.show(channelId); // Pass channelId to roomModal.show
    });
  });

  // Carousel functionality
  const channelList = document.querySelector('.channel-list');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  if (channelList && prevButton && nextButton) {
    const scrollAmount = 270; // card width + gap

    prevButton.addEventListener('click', () => {
      channelList.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextButton.addEventListener('click', () => {
      channelList.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Update button visibility based on scroll position
    function updateButtons() {
      const { scrollLeft, scrollWidth, clientWidth } = channelList;
      prevButton.style.opacity = scrollLeft > 0 ? '1' : '0.5';
      nextButton.style.opacity = scrollLeft < scrollWidth - clientWidth ? '1' : '0.5';
    }

    channelList.addEventListener('scroll', updateButtons);
    updateButtons(); // Initial state
  }
});
