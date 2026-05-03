const dialog = document.getElementById('impressum-dialog');
const splashScreen = document.getElementById('splash-screen');
let canvas = document.getElementById('canvas');

document.getElementById('impressum-link').addEventListener('click', (e) => {
    e.preventDefault();
    dialog.showModal();
});

document.getElementById('impressum-close').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});
