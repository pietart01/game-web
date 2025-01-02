document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.winning-banner');
    const content = banner.querySelector('.banner-content');

    // Clone the content
    const clone = content.cloneNode(true);
    content.appendChild(clone.children[0]);
    content.appendChild(clone.children[0]);

    // Calculate the total width of original content
    let totalWidth = 0;
    Array.from(content.children).forEach(child => {
        totalWidth += child.offsetWidth + 48; // 48px is the gap (3rem)
    });

    // Adjust animation duration based on content width
    const duration = Math.max(totalWidth * 0.02, 10); // minimum 10 seconds
    content.style.animationDuration = `${duration}s`;
});
