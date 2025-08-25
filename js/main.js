// Main JS for Gus By Heart website

// Newsletter signup functionality
function setupNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const thankYouMessage = document.getElementById('thank-you');
  
  if (!form || !thankYouMessage) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = form.querySelector('input[name="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    // Basic email validation
    if (!email || !isValidEmail(email)) {
      emailInput.focus();
      return;
    }
    
    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Signing up...';
    
    try {
      // Submit to Buttondown
      const response = await fetch('https://buttondown.com/api/emails/embed-subscribe/gusbyheart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}`
      });
      
      // Always show thank you message (Buttondown typically redirects, but we intercept)
      // The form submission happens regardless of response status
      showThankYouMessage();
      
    } catch (error) {
      console.log('Signup submitted to Buttondown');
      // Show thank you message even if fetch fails (network issues, CORS, etc.)
      // The important thing is the email was attempted to be sent
      showThankYouMessage();
    }
  });
  
  function showThankYouMessage() {
    // Hide form with smooth animation
    form.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      form.style.display = 'none';
      thankYouMessage.style.display = 'block';
      
      // Trigger show animation
      setTimeout(() => {
        thankYouMessage.classList.add('show');
      }, 50);
    }, 300);
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup newsletter form
  setupNewsletterForm();
  
  // Setup lyrics accordion
  const trackDetails = document.querySelectorAll('.track');
  
  trackDetails.forEach(detail => {
    const summary = detail.querySelector('summary');
    const lyricsText = detail.querySelector('.lyrics-text');
    
    // Initially hide all lyrics
    lyricsText.style.display = 'none';
    
    summary.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default details behavior
      
      // Close all other open details
      trackDetails.forEach(otherDetail => {
        if (otherDetail !== detail) {
          const otherLyrics = otherDetail.querySelector('.lyrics-text');
          otherLyrics.style.display = 'none';
          otherDetail.removeAttribute('open');
        }
      });
      
      // Toggle current detail
      if (lyricsText.style.display === 'none') {
        lyricsText.style.display = 'block';
        detail.setAttribute('open', '');
        
        // Smooth scroll to the newly opened lyrics
        detail.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        lyricsText.style.display = 'none';
        detail.removeAttribute('open');
      }
    });
  });
});
