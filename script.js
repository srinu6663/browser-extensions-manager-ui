const themeBtn = document.getElementById('theme-btn');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerHTML = '<img src="./assets/images/icon-moon.svg" alt="toggle">';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<img src="./assets/images/icon-sun.svg" alt="toggle">';
        localStorage.setItem('theme', 'dark');
    }
});


const extensionGrid =document.getElementById('extension-grid')
const filterBtnConstainer =document.getElementById('filter-btn')
const filterBtns = document.querySelectorAll('.filter-btn');
let extensionsData=[]
let currentFilter = 'all'

async function fetchExtensions() {
    const res =await fetch('./data.json')
    extensionsData = await res.json()
    applyFilter(currentFilter)
}

function displayExtensions(extensions) {
    extensionGrid.innerHTML = ""; // Clear existing content

    extensions.forEach(extension => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.dataset.name = extension.name;

        item.innerHTML = `
            <div class="top">
                <img src="${extension.logo}" alt="${extension.name}">
                <div class="extension-info">
                    <div class="name">${extension.name}</div>
                    <div class="description">${extension.description}</div>
                </div>
            </div>
            <div class="bottom">
                <button class="remove-btn">Remove</button>
                <div class="toggle-switch">
                    <input class="toggle-input"
                        id="toggle-${extension.name}"
                        type="checkbox"
                        ${extension.isActive ? 'checked' : ''}>
                    <label class="toggle-label" for="toggle-${extension.name}"></label>
                </div>
            </div>
        `;

        extensionGrid.appendChild(item);
    });
}


function applyFilter(filter) {
    currentFilter = filter;

    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.id === filter);
    });

    let filteredData = [];
    switch (filter) {
        case 'all':
            filteredData = extensionsData;
            break;
        case 'active':
            filteredData = extensionsData.filter(extension => extension.isActive);
            break;
        case 'inactive':
            filteredData = extensionsData.filter(extension => !extension.isActive);
            break;
    }

    displayExtensions(filteredData);
}


function handleGridClick(e) {
    if (e.target.classList.contains('filter-btn')) {
        applyFilter(e.target.id);
    } else if (e.target.classList.contains('remove-btn')) {
        const item = e.target.closest('.item');
        const name = item.dataset.name;
        extensionsData = extensionsData.filter(ext => ext.name !== name);
        applyFilter(currentFilter);
    }
}

filterBtnConstainer.addEventListener('click', handleGridClick);
extensionGrid.addEventListener('click', handleGridClick);
extensionGrid.addEventListener('change', handleToggle);


function handleToggle(e) {
    if (e.target.classList.contains('toggle-input')) {
        const item = e.target.closest('.item');
        const name = item.dataset.name;

        const extension = extensionsData.find(ext => ext.name === name);
        if (extension) {
            extension.isActive = e.target.checked;
            applyFilter(currentFilter); // Update UI
        }
    }
}


fetchExtensions()