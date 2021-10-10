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
