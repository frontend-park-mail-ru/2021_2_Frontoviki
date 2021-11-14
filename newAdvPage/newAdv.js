const input = document.querySelectorAll(".new-ad-form__input");

[].forEach.call(input, (elem) => {
    elem.addEventListener('focusin', (e) => {
        elem.parentElement.childNodes[1].classList.add('active');
    });
});


input.forEach(elem => {
    elem.addEventListener('focusout', (e) => {
        if (!this.value) {
            elem.parentElement.childNodes[1].classList.remove('active');
        }
    });
});

// ДОБАВЛЕНИЕ НОВОГО КУБИКА В ЗАГРУЗЧИК КАРТИНОК

const fileInput = document.getElementById('image_upload');
const imageUploader = document.getElementById('image-uploader');

const insertImageIntoImageUploader = url => {
  // тут создаешь кубик и вставляешь его 
  // на предпоследнее место перед label
}

fileInput.onchange = e => {
  const [file] = fileInput.files;
  if (file) {
    insertImageIntoImageUploader(URL.createObjectURL(file));
  }
}