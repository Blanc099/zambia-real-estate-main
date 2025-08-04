// localStorage'dan property çekme fonksiyonu
function getAllProperties() {
  const stored = localStorage.getItem('properties');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return null;
}

function renderProperties(filterType = 'all') {
  let properties = getAllProperties();
  if (!properties || properties.length === 0) {
    // Örnek veriler
    properties = [
      {
        title: 'Modern Apartment in Lusaka',
        price: 250000,
        type: 'sale',
        bedrooms: 3,
        bathrooms: 2,
        size: 150,
        description: 'A modern apartment in the heart of Lusaka.',
        image: 'https://via.placeholder.com/300x200',
        location: '',
      },
      {
        title: 'Cozy Villa in Livingstone',
        price: 450000,
        type: 'sale',
        bedrooms: 4,
        bathrooms: 3,
        size: 250,
        description: 'A cozy villa with a beautiful garden.',
        image: 'https://via.placeholder.com/300x200',
        location: '',
      },
      {
        title: 'Commercial Space in Kitwe',
        price: 180000,
        type: 'rent',
        bedrooms: 0,
        bathrooms: 0,
        size: 500,
        description: 'Spacious commercial property for your business.',
        image: 'https://via.placeholder.com/300x200',
        location: '',
      },
      {
        title: 'Luxury Project in Lusaka',
        price: 600000,
        type: 'project',
        bedrooms: 5,
        bathrooms: 4,
        size: 400,
        description: 'A new luxury project in Lusaka.',
        image: 'https://via.placeholder.com/300x200',
        location: '',
      }
    ];
  }
  const grid = document.getElementById('listing-grid');
  grid.innerHTML = '';
  let filtered = properties;
  if (filterType === 'sale') filtered = properties.filter(p => p.type === 'sale');
  if (filterType === 'rent') filtered = properties.filter(p => p.type === 'rent');
  if (filterType === 'project') filtered = properties.filter(p => p.type === 'project');
  if (filtered.length === 0) {
    grid.innerHTML = `<p data-i18n="noListingsFound">${t('noListingsFound')}</p>`;
    return;
  }
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    let mapHtml = '';
    if (p.location) {
      if (p.location.includes('google.com/maps/embed')) {
        mapHtml = `<iframe src="${p.location}" width="100%" height="150" style="border:0;margin-top:8px;" allowfullscreen="" loading="lazy"></iframe>`;
      } else {
        mapHtml = `<a href="${p.location}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;color:#0077cc;" data-i18n="viewOnMap">${t('viewOnMap')}</a>`;
      }
    }
    card.innerHTML = `
      <img src="${p.image}" alt="Property Image">
      <h3>${p.title}</h3>
      <p class="price">$${p.price.toLocaleString()}</p>
      <p class="details">${p.bedrooms ? p.bedrooms + ' ' + t('beds') + ' | ' : ''}${p.bathrooms ? p.bathrooms + ' ' + t('baths') + ' | ' : ''}${p.size} sq.m</p>
      <p>${p.description}</p>
      ${mapHtml}
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  renderProperties();
  
  // Filter button event listeners
  document.getElementById('for-sale-btn').addEventListener('click', function(e) {
    e.preventDefault();
    renderProperties('sale');
  });
  document.getElementById('for-rent-btn').addEventListener('click', function(e) {
    e.preventDefault();
    renderProperties('rent');
  });
  document.getElementById('projects-btn').addEventListener('click', function(e) {
    e.preventDefault();
    renderProperties('project');
  });
  
  // Listen for property updates from admin panel
  window.addEventListener('propertiesUpdated', function(event) {
    console.log('Properties updated from admin panel');
    renderProperties(); // Re-render with updated data
  });
  
  // Listen for localStorage changes (cross-tab communication)
  window.addEventListener('storage', function(event) {
    if (event.key === 'properties' || event.key === 'propertiesLastUpdated') {
      console.log('Properties updated via localStorage');
      renderProperties(); // Re-render with updated data
    }
  });
  
  // Periodic check for property updates (fallback)
  let lastUpdateCheck = localStorage.getItem('propertiesLastUpdated');
  setInterval(function() {
    const currentUpdate = localStorage.getItem('propertiesLastUpdated');
    if (currentUpdate && currentUpdate !== lastUpdateCheck) {
      lastUpdateCheck = currentUpdate;
      renderProperties();
    }
  }, 2000); // Check every 2 seconds
});
