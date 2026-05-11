const dialog = document.getElementById('imprint-dialog');
const splashScreen = document.getElementById('splash-screen');
let canvas = document.getElementById('canvas');

document.getElementById('imprint-link').addEventListener('click', (e) => {
    e.preventDefault();
    dialog.showModal();
});

document.getElementById('imprint-close').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});
