'use strict';

const avatarPreview = document.getElementById("avatar_preview");
const imageInput = document.getElementById("avatar_loader");
imageInput.onchange = (evt) => {
    const [file] = imageInput.files
    if (file) {
        avatarPreview.src = URL.createObjectURL(file)
    }
};