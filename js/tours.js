// Tour data structure
let tours = [];

// Fetch tours from API
async function fetchTours() {
    try {
        const response = await fetch('/api/tours');
        tours = await response.json();
        displayTours(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
        document.getElementById('main-content').innerHTML = '<p class="error">خطا در بارگذاری تورها</p>';
    }
}

// Display tours in the grid
function displayTours(toursToDisplay) {
    const tourGrid = document.querySelector('.tour-grid');
    if (!tourGrid) return;

    tourGrid.innerHTML = toursToDisplay.map(tour => `
        <div class="tour-card" data-tour-id="${tour.id}">
            <img src="${tour.image}" alt="${tour.title}" class="tour-image">
            <div class="tour-content">
                <h3 class="tour-title">${tour.title}</h3>
                <p class="tour-description">${tour.description}</p>
                <div class="tour-details">
                    <span class="tour-date">${formatDate(tour.startDate)}</span>
                    <span class="tour-duration">${tour.duration} روز</span>
                </div>
                <div class="tour-footer">
                    <span class="tour-price">${formatPrice(tour.price)} تومان</span>
                    <button class="btn btn-book" onclick="bookTour(${tour.id})">رزرو تور</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format date to Persian calendar
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Book a tour
async function bookTour(tourId) {
    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/book-tour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ tourId })
        });

        const data = await response.json();
        if (data.success) {
            alert('تور با موفقیت رزرو شد');
        } else {
            throw new Error(data.message || 'خطا در رزرو تور');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Filter tours
function filterTours(filters) {
    let filteredTours = [...tours];

    if (filters.destination) {
        filteredTours = filteredTours.filter(tour => 
            tour.destination.toLowerCase().includes(filters.destination.toLowerCase())
        );
    }

    if (filters.minPrice) {
        filteredTours = filteredTours.filter(tour => 
            tour.price >= filters.minPrice
        );
    }

    if (filters.maxPrice) {
        filteredTours = filteredTours.filter(tour => 
            tour.price <= filters.maxPrice
        );
    }

    if (filters.startDate) {
        filteredTours = filteredTours.filter(tour => 
            new Date(tour.startDate) >= new Date(filters.startDate)
        );
    }

    displayTours(filteredTours);
}

// Initialize tours page
document.addEventListener('DOMContentLoaded', () => {
    const toursPage = document.querySelector('.tours-page');
    if (toursPage) {
        fetchTours();

        // Initialize filters
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(filterForm);
                const filters = Object.fromEntries(formData.entries());
                filterTours(filters);
            });
        }
    }
}); 