/// отправка на сервер
const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
wrapper.appendChild(createHeader())
root.id = 'root';
wrapper.appendChild(root);

function ajax(method, url, body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
}

function createHeader() {
    let header = document.querySelector('.header');
    if (header) {
        wrapper.removeChild(header);
    }
    header = document.createElement('div');
    header.classList.add('header');
    const nav = document.createElement('nav');
    nav.classList.add('nav_menu');

    const brand = document.createElement('a');
    brand.href = '#';
    brand.innerHTML = 'Volchock';
    nav.appendChild(brand);

    const sign = document.createElement('p');
    sign.innerHTML = '|';
    nav.appendChild(sign);

    const newAd = document.createElement('a');
    newAd.href = '#';
    newAd.innerHTML = 'Создать объявление';
    nav.appendChild(newAd);

    const s = document.createElement('p');
    s.innerHTML = '|';
    nav.appendChild(s);

    ajax(
        'GET',
        '/profile',
        null,
        (status, responseText) => {
            let isAuthorized = false;
    
            if (status === 200) {
                isAuthorized = true;
            }
            if (!isAuthorized) {
                const login = document.createElement('a');
                login.href = '#';
                login.innerHTML = 'Войти';
                login.id = 'auth';
                login.addEventListener('click', e => {
                    e.preventDefault();
                    
                    const window = document.querySelector('.modal-window');
                    const blackout = document.querySelector('.blackout');
                
                    createLoginForm(window);
                
                    window.classList.add('active');
                    blackout.classList.add('active');
                })
                nav.appendChild(login);
            }
            else {
                const profile = document.createElement('li');
                profile.classList.add('dropdown');
                profile.innerHTML = 'Профиль';

                const menu = document.createElement('ul');
                menu.classList.add('dropdown_menu');
                menu.classList.add('dropdown_menu--animated');

                const content = document.createElement('li');
                content.classList.add("dropdown_item");

                const imgref = document.createElement('a');
                imgref.href='#';

                const img = document.createElement('img');
                img.src = 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg';
                imgref.appendChild(img);
                content.appendChild(imgref);

                const logout = document.createElement('li');
                logout.classList.add("logout_item");

                const logoutBtn = document.createElement('a');
                logoutBtn.href = '/logout';
                logoutBtn.innerHTML = 'Выход';

                logout.appendChild(logoutBtn);

                menu.appendChild(content);
                menu.appendChild(logout);
                profile.appendChild(menu);
                nav.appendChild(profile);
            }
        });
    header.appendChild(nav);
    return header;
}


