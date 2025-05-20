// Header/Footer include logic
function includeHTML(id, file) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if(id === 'header-include') {
                const menuToggle = document.getElementById('menu-toggle');
                const navLinks = document.getElementById('nav-links');
                if(menuToggle && navLinks) {
                    menuToggle.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                        menuToggle.classList.toggle('active');
                    });
                }
            }
        });
}
includeHTML('header-include', '../includes/header.html');
includeHTML('footer-include', '../includes/footer.html');
