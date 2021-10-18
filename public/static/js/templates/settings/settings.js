import settingsT from './settings.handlebars';
export function settings() {
    const settings = document.createElement('div');
    settings.innerHTML = settingsT({
        userName: localStorage.getItem('name'),
        userSurname: localStorage.getItem('surname'),
        userEmail: localStorage.getItem('email'),
    });
    return settings;
}