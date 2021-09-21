/*const modalWindow = document.querySelector('.modal-window');
const forms = modalWindow.getElementsByClassName('modal-form');


const patterns = {
    username: /^[a-z\d]{5,12}$/i,
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    password: /^[\w@_-]{8,30}$/i,
    telephone: /^\d{11}$/,
    slug: /^[a-z\d-]{8,20}$/i,
};


const validate = (field, regex) => {
    const valid = regex.test(field.value);
    if (valid) {
        field.className = 'valid';
    } else {
        field.className = 'invalid';
    }
    return valid;
};


for (let form of forms) {
    form.addEventListener('submit', (e) => {
        const inputs = this.querySelectorAll('input:not([type="submit"])');
        let access = true;

        for (let input of inputs) {
            access = access && validate(input, patterns[input.attributes.name.value]);
        }

        if (!access) {
            alert('wrong data');
        }
    });
}*/