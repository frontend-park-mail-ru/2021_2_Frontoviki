export function settings() {
    const setTemplate = Handlebars.templates.settings;
    const settings = document.createElement('div');
    settings.innerHTML = setTemplate({
        userName: localStorage.getItem('name'),
        userSurname: localStorage.getItem('surname'),
        userEmail: localStorage.getItem('email'),
    });
    return settings;
}