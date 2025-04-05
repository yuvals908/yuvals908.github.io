// include.js

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-include]').forEach(el => {
      const file = el.getAttribute('data-include');
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Could not fetch ${file}`);
          return response.text();
        })
        .then(data => {
          if (el.tagName === "HEAD") {
            const temp = document.createElement('div');
            temp.innerHTML = data;
            Array.from(temp.children).forEach(child => document.head.appendChild(child));
          } else {
            el.innerHTML = data;
          }
        })
        .catch(error => console.error(error));
    });
  });
  