document.addEventListener('DOMContentLoaded', function() {
    // Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
        });
    });

    function toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }

    // Service Prices Map
    const servicePrices = {
        'peinture': 120000,
        'vinyl': 180000,
        'bodykit': 90000,
        'rims': 20000,
        'tint': 15000,
        'lights': 10000,
        'decals': 13000,
        'ceramic': 40000,
        'ppf': 55000
    };

    const serviceNames = {
        'peinture': 'Peinture Automobile',
        'vinyl': 'Covering Vinyl Complet',
        'bodykit': 'Kit Carrosserie',
        'rims': 'Jantes Customization',
        'tint': 'Vitres Teintées',
        'lights': 'Phares/Feux Teintés',
        'decals': 'Stickers & Graphics',
        'ceramic': 'Coating Céramique',
        'ppf': 'PPF Pare-chocs'
    };

    // Booking Form Handler
    const bookingForm = document.getElementById('booking-form');
    const priceModal = document.getElementById('price-modal');
    const successModal = document.getElementById('success-modal');
    let currentBookingData = null;

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    function handleBookingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const name = formData.get('name').trim();
        const phone = formData.get('phone').trim();
        const service = formData.get('service');
        const message = formData.get('message').trim();

        if (!name || !phone || !service) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Check for existing customer
        const isReturningCustomer = checkReturningCustomer(phone);
        const basePrice = servicePrices[service];
        const discount = isReturningCustomer ? 0.2 : 0;
        const finalPrice = Math.round(basePrice * (1 - discount));

        currentBookingData = {
            name,
            phone,
            service,
            serviceName: serviceNames[service],
            message,
            basePrice,
            discount,
            finalPrice,
            isReturningCustomer
        };

        showPriceConfirmation();
    }

    function checkReturningCustomer(phone) {
        const orders = JSON.parse(localStorage.getItem('autoCustomOrders') || '[]');
        return orders.some(order => order.phone === phone);
    }

    function showPriceConfirmation() {
        const data = currentBookingData;
        const priceDetails = document.getElementById('price-details');
        
        let discountHTML = '';
        if (data.isReturningCustomer) {
            discountHTML = `
                <div class="price-item">
                    <span>Remise Client Fidèle (-20%):</span>
                    <span class="discount-animation">-${(data.basePrice * 0.2).toLocaleString()} DZD</span>
                </div>
            `;
        }

        priceDetails.innerHTML = `
            <div class="price-item">
                <span>Service:</span>
                <span>${data.serviceName}</span>
            </div>
            <div class="price-item">
                <span>Prix de base:</span>
                <span>${data.basePrice.toLocaleString()} DZD</span>
            </div>
            ${discountHTML}
            <div class="price-item">
                <span>Prix Final:</span>
                <span>${data.finalPrice.toLocaleString()} DZD</span>
            </div>
        `;

        priceModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Modal Event Listeners
    document.getElementById('confirm-booking')?.addEventListener('click', confirmBooking);
    document.getElementById('cancel-booking')?.addEventListener('click', () => closeModal('price-modal'));

    // Close modal when clicking outside or on X
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    function confirmBooking() {
        if (!currentBookingData) return;

        const orders = JSON.parse(localStorage.getItem('autoCustomOrders') || '[]');
        const newOrder = {
            id: generateOrderId(),
            ...currentBookingData,
            date: new Date().toISOString(),
            status: 'Nouveau'
        };

        orders.push(newOrder);
        localStorage.setItem('autoCustomOrders', JSON.stringify(orders));

        closeModal('price-modal');
        showSuccessModal();
        bookingForm.reset();
        currentBookingData = null;
    }

    function generateOrderId() {
        return 'CMD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    function showSuccessModal() {
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Make closeModal function globally available
    window.closeModal = closeModal;

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and other elements
    document.querySelectorAll('.service-card, .pricing-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Gallery hover effects
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });

    // Add loading states to form submission
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton?.textContent;

    function setButtonLoading(isLoading) {
        if (!submitButton) return;
        
        if (isLoading) {
            submitButton.innerHTML = '<span class="loading"></span> Traitement...';
            submitButton.disabled = true;
        } else {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }

    // Enhanced form validation
    const formInputs = document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        removeFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Numéro de téléphone invalide');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.9rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function removeFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function clearFieldError(e) {
        removeFieldError(e.target);
    }

    // Keyboard navigation for FAQ
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('faq-question')) {
            const faqItems = Array.from(document.querySelectorAll('.faq-question'));
            const currentIndex = faqItems.indexOf(e.target);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % faqItems.length;
                    faqItems[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex === 0 ? faqItems.length - 1 : currentIndex - 1;
                    faqItems[prevIndex].focus();
                    break;
            }
        }
    });

    // Add entrance animations with stagger effect
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .pricing-card, .gallery-item');
        
        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !el.classList.contains('animated')) {
                setTimeout(() => {
                    el.classList.add('animated');
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Enhanced mobile menu
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // Add scroll progress indicator
    const createScrollIndicator = () => {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(155, 89, 182, 0.6);
        `;
        document.body.appendChild(indicator);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            indicator.style.width = scrollPercent + '%';
        });
    };

    createScrollIndicator();

    console.log('AutoCustom Pro - Website Loaded Successfully! 🚗✨');
});
