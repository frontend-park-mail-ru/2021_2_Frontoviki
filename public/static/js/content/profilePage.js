
export class profilePage {
    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    render({ name, rating, profilePic }) {
        this.#parent.innerHTML = '';

        const content = document.createElement('div');
        content.classList.add('inner-profile-content');

        const profileBlock = document.createElement('div');
        profileBlock.classList.add('profile-block');

        const text = document.createElement('h1');
        text.innerHTML = 'Ваш профиль';
        profileBlock.appendChild(text);

        const img = document.createElement('img');
        img.src = profilePic;
        profileBlock.appendChild(img);

        const nickname = document.createElement('div');
        nickname.classList.add('nickname');
        nickname.innerHTML = 'The best ninja';
        profileBlock.appendChild(name);

        const stars = document.createElement('div');
        stars.classList.add('rating-result');
        for (let i = 0; i < rating; i++) {
            const star = document.createElement('span');
            star.classList.add('active');
            stars.appendChild(star);
        }
        profileBlock.appendChild(stars);

        profileBlock.appendChild(createProfileBtn('Отзывы'));
        profileBlock.appendChild(createProfileBtn('Мои объявления'));
        profileBlock.appendChild(createProfileBtn('Мои отзывы'));
        profileBlock.appendChild(createProfileBtn('Избранное'));
        profileBlock.appendChild(createProfileBtn('Сообщения'));
        profileBlock.appendChild(createProfileBtn('Платные услуги'));
        profileBlock.appendChild(createProfileBtn('Настройки'));
        profileBlock.appendChild(createProfileBtn('Выход'));

        const contentBlock = document.createElement('div');
        contentBlock.classList.add('profile-info');
        const blockText = document.createElement('h1');
        blockText.innerHTML = 'Ваши объявления';
        contentBlock.appendChild(blockText);
        contentBlock.appendChild(createProductGrid());

        content.appendChild(profileBlock);
        content.appendChild(contentBlock);
        this.#parent.appendChild(content);
    }

    createProfileBtn(text) {
        const btn = document.createElement('button');
        btn.classList.add('profile-btn');
        btn.innerHTML = text;
        return btn;
    }
};
