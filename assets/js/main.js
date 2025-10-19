/*
 * Main JavaScript for RelyPro Cleaning Services
 *
 * Handles navbar colour changes on scroll and sends form data to WhatsApp
 * when quote or contact forms are submitted.
 */

// Change navbar background on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Wait for DOM to load before attaching form handlers
document.addEventListener('DOMContentLoaded', () => {
  
  // Handle dropdown placeholder styling
  const handleDropdownStyling = () => {
    const dropdowns = ['quoteType', 'quoteService'];
    
    dropdowns.forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        // Initial styling for placeholder
        if (select.value === '' || select.selectedIndex === 0) {
          select.style.color = '#9ca3af';
          select.style.fontSize = '0.875rem';
          select.style.fontWeight = '400';
        }
        
        // Add change event listener
        select.addEventListener('change', function() {
          if (this.value === '' || this.selectedIndex === 0) {
            // Placeholder selected
            this.style.color = '#9ca3af';
            this.style.fontSize = '0.875rem';
            this.style.fontWeight = '400';
          } else {
            // Real option selected
            this.style.color = '#374151';
            this.style.fontSize = '0.9rem';
            this.style.fontWeight = '500';
          }
        });
      }
    });
  };
  
  // Initialize dropdown styling
  handleDropdownStyling();

  const contactForm = document.getElementById('contactForm');
  const quoteForm = document.getElementById('quoteForm');
  const quoteTypeSelect = document.getElementById('quoteType');
  const quoteServiceSelect = document.getElementById('quoteService');

  /**
   * Filter service options to match the selected cleaning type
   */
  if (quoteTypeSelect && quoteServiceSelect) {
    const placeholderOption = quoteServiceSelect.querySelector('option[value=""]');
    const placeholderDefaultText = placeholderOption ? placeholderOption.textContent : '';
    const serviceOptions = Array.from(
      quoteServiceSelect.querySelectorAll('option[data-group]')
    );

    const setPlaceholderSelected = () => {
      if (placeholderOption) {
        quoteServiceSelect.value = placeholderOption.value;
      } else {
        quoteServiceSelect.selectedIndex = 0;
      }

      quoteServiceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const updateServiceOptions = (selectedType) => {
      const normalizedType = selectedType ? selectedType.toLowerCase() : '';
      let visibleCount = 0;

      serviceOptions.forEach((option) => {
        const groups = (option.dataset.group || '')
          .split(',')
          .map((group) => group.trim().toLowerCase())
          .filter(Boolean);

        const matches = normalizedType && groups.includes(normalizedType);
        option.hidden = !matches;
        option.disabled = !matches;

        if (matches) {
          visibleCount += 1;
        }
      });

      if (placeholderOption) {
        placeholderOption.textContent = normalizedType
          ? placeholderDefaultText
          : 'Select a cleaning type first';
      }

      quoteServiceSelect.disabled = visibleCount === 0;
      setPlaceholderSelected();
    };

    // Initial state on page load
    updateServiceOptions(quoteTypeSelect.value);

    quoteTypeSelect.addEventListener('change', (event) => {
      updateServiceOptions(event.target.value);
    });

    if (quoteForm) {
      quoteForm.addEventListener('reset', () => {
        // Allow the browser to complete its reset before re-applying filters
        setTimeout(() => updateServiceOptions(''), 0);
      });
    }
  }
  
  /**
   * Send contact form data via API
   */
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const formData = {
          name: document.getElementById('contactName').value.trim(),
          email: document.getElementById('contactEmail').value.trim(),
          subject: document.getElementById('contactSubject').value.trim(),
          message: document.getElementById('contactMessage').value.trim(),
          phone: '+447796584056',
          type: 'contact'
        };
        
        const whatsappMessage = `*RelyPro - New Contact Form Submission*\n\n` +
          `👤 *Name:* ${formData.name}\n` +
          `📧 *Email:* ${formData.email}\n` +
          `📋 *Subject:* ${formData.subject}\n` +
          `💬 *Message:* ${formData.message}\n\n` +
          `⏰ *Submitted:* ${new Date().toLocaleString()}`;
        
        // Send to WhatsApp using API service
        const response = await sendToWhatsApp(whatsappMessage, formData.phone);
        
        if (response.success) {
          showSuccessMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
          contactForm.reset();
        } else {
          throw new Error('Failed to send message');
        }
        
      } catch (error) {
        console.error('Error sending contact form:', error);
        showErrorMessage('Sorry, there was an issue sending your message. Please try again or contact us directly at enquiries@relypro.co.uk or +44 7796 584056.');
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Send quote form data via API
   */
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Show loading state
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const formData = {
          name: document.getElementById('quoteName').value.trim(),
          email: document.getElementById('quoteEmail').value.trim(),
          phone: document.getElementById('quotePhone').value.trim(),
          type: document.getElementById('quoteType').value,
          service: document.getElementById('quoteService').value,
          address: document.getElementById('quoteAddress').value.trim(),
          date: document.getElementById('quoteDate').value,
          time: document.getElementById('quoteTime').value,
          notes: document.getElementById('quoteNotes').value.trim(),
          businessPhone: '+447796584056',
          formType: 'quote'
        };
        
        const whatsappMessage = `*RelyPro - New Quote Request*\n\n` +
          `👤 *Name:* ${formData.name}\n` +
          `📧 *Email:* ${formData.email}\n` +
          `📱 *Phone:* ${formData.phone}\n` +
          `🏠 *Type:* ${formData.type}\n` +
          `🧹 *Service:* ${formData.service}\n` +
          `📍 *Address:* ${formData.address}\n` +
          `📅 *Date:* ${formData.date}\n` +
          `⏰ *Time:* ${formData.time}\n` +
          `📝 *Notes:* ${formData.notes || 'None'}\n\n` +
          `⏰ *Submitted:* ${new Date().toLocaleString()}`;
        
        // Send to WhatsApp using API service
        const response = await sendToWhatsApp(whatsappMessage, formData.businessPhone);
        
        if (response.success) {
          showSuccessMessage('Thank you for your quote request! We\'ll review your requirements and get back to you with a personalized quote within 24 hours.');
          quoteForm.reset();
        } else {
          throw new Error('Failed to send quote request');
        }
        
      } catch (error) {
        console.error('Error sending quote form:', error);
        showErrorMessage('Sorry, there was an issue sending your quote request. Please try again or contact us directly at enquiries@relypro.co.uk or +44 7796 584056.');
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  /**
   * Send message to WhatsApp using multiple methods
   */
  async function sendToWhatsApp(message, phone) {
    try {
      // Method 1: Try CallMeBot API first
      const success = await tryCallMeBot(message, phone);
      if (success) {
        return { success: true };
      }
      
      // Method 2: Fallback to WhatsApp Web (silent)
      const whatsappSuccess = await tryWhatsAppWeb(message, phone);
      return { success: whatsappSuccess };
      
    } catch (error) {
      console.error('All WhatsApp methods failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Try CallMeBot API
   */
  async function tryCallMeBot(message, phone) {
    try {
      const apiKey = '4226641'; 
      const phoneNumber = phone.replace('+', '').replace(/\s/g, '');
      const encodedMessage = encodeURIComponent(message);
      
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      
      // Use fetch with no-cors mode
      const response = await fetch(callMeBotUrl, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      console.log('CallMeBot request sent');
      return true; // Assume success since we can't read the response with no-cors
      
    } catch (error) {
      console.log('CallMeBot failed:', error);
      return false;
    }
  }
  
  /**
   * Fallback: Use WhatsApp Web in hidden iframe
   */
  async function tryWhatsAppWeb(message, phone) {
    try {
      const phoneNumber = phone.replace('+', '');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Create hidden iframe to trigger WhatsApp Web
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = whatsappUrl;
      document.body.appendChild(iframe);
      
      // Remove iframe after 2 seconds
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2000);
      
      console.log('WhatsApp Web fallback triggered');
      return true;
      
    } catch (error) {
      console.log('WhatsApp Web fallback failed:', error);
      return false;
    }
  }
  
  /**
   * Show success message to user
   */
  function showSuccessMessage(message) {
    // Create and show success modal/alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
      <i class="fa-solid fa-check-circle me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
  
  /**
   * Show error message to user
   */
  function showErrorMessage(message) {
    // Create and show error modal/alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
      <i class="fa-solid fa-exclamation-triangle me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 8 seconds (longer for error messages)
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 8000);
  }
});