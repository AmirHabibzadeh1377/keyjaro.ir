// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

// Move auth buttons to nav-links in mobile view
function moveAuthButtons() {
    if (window.innerWidth <= 768) {
        if (!navLinks.contains(authButtons)) {
            navLinks.appendChild(authButtons);
        }
    } else {
        const mainNav = document.querySelector('.main-nav');
        if (navLinks.contains(authButtons)) {
            mainNav.insertBefore(authButtons, mobileMenuBtn);
        }
    }
}

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
});

// Handle window resize
window.addEventListener('resize', function() {
    moveAuthButtons();
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
    }
});

// Initial setup
moveAuthButtons();

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav')) {
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Dynamic content loading
function loadContent(url) {
    const mainContent = document.getElementById('main-content');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            // Reinitialize any necessary event listeners
            initializeEventListeners();
        })
        .catch(error => {
            console.error('Error loading content:', error);
            mainContent.innerHTML = '<p class="error">خطا در بارگذاری محتوا</p>';
        });
}

// Initialize event listeners for dynamically loaded content
function initializeEventListeners() {
    // Add any event listeners needed for dynamically loaded content
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach(card => {
        card.addEventListener('click', () => {
            const tourId = card.dataset.tourId;
            if (tourId) {
                loadContent(`/tour-detail.html?id=${tourId}`);
            }
        });
    });
}

// Handle navigation
// document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', (e) => {
//         e.preventDefault();
//         const href = link.getAttribute('href');
//         if (href.startsWith('/')) {
//             loadContent(href);
//             // Update URL without page reload
//             history.pushState(null, '', href);
//         }
//     });
// });

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    loadContent(window.location.pathname);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
}); 