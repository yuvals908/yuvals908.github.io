function includeHTML(id, file) {
    console.log(`Fetching ${file} for ${id}`);
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`);
            return res.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
            console.log(`${id} content inserted`);
            if (id === 'header-include') {
                initializeHeaderScripts();
            }
        })
        .catch(error => console.error(`Error including ${file}:`, error));
}

function initializeHeaderScripts() {
    console.log('Initializing header scripts');
    const navLinks = document.querySelector('#nav-links');
    const menuToggle = document.querySelector('#menu-toggle');
    const overlay = document.querySelector('.overlay');

    // Toggle mobile menu
    function toggleMenu() {
        if (navLinks && menuToggle && overlay) {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            overlay.classList.toggle('active');
            console.log('Menu toggled:', navLinks.classList.contains('active'));
        } else {
            console.error('Navigation elements missing:', { navLinks, menuToggle, overlay });
        }
    }

    // Toggle dropdown submenu
    function toggleSubmenu(event, element) {
        event.preventDefault(); // Prevent default link behavior
        const dropdown = element.parentElement;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        if (dropdownContent) {
            // Close other dropdowns (accordion behavior)
            document.querySelectorAll('.dropdown').forEach(drop => {
                if (drop !== dropdown) {
                    drop.classList.remove('active');
                    const content = drop.querySelector('.dropdown-content');
                    if (content) content.classList.remove('active');
                }
            });
            dropdown.classList.toggle('active');
            dropdownContent.classList.toggle('active');
            console.log('Submenu toggled:', dropdownContent.classList.contains('active'), 'Max-height:', getComputedStyle(dropdownContent).maxHeight);
        } else {
            console.error('dropdown-content not found for:', element);
        }
    }

    // Bind menu toggle and overlay listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    } else {
        console.error('menu-toggle not found');
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    } else {
        console.error('overlay not found');
    }

    // Event delegation for dropdown toggles
    document.addEventListener('click', function(e) {
        const toggle = e.target.closest('.dropdown > a.dropdown-toggle');
        if (toggle) {
            console.log('Dropdown toggle clicked:', toggle);
            toggleSubmenu(e, toggle);
        }
    });

    if (!navLinks) {
        console.error('nav-links not found');
    }
}

// Initialize includes
includeHTML('header-include', '../includes/header.html');
includeHTML('footer-include', '../includes/footer.html');