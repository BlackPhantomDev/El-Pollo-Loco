const dialog = document.getElementById('impressum-dialog');

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
