import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {createDeleteModal} from '../templates/deleteModal/deleteModal.js';


/**
 * Класс модели пользователя
 */
export default class ProfilePageModel {
  /**
  * @description Constructor
  * @param {Object} eventBus to call and subscribe for signals
  */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('getGrid', this.getAds.bind(this));
    this.eventBus.on('getCart', this.getCart.bind(this));
    this.eventBus.on('getFavorite', this.getFavorite.bind(this));
    this.eventBus.on('getArchive', this.getArchive.bind(this));
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('uploadPhoto', this.uploadPhoto.bind(this));
    this.eventBus.on('settingsRendered', this.handleSettings.bind(this));
    this.eventBus.on('changePassword', this.changePassword.bind(this));
    this.eventBus.on('onDeleteClick', this.handleDelete.bind(this));
    this.eventBus.on('deleteFromCart', this.deleteFromCart.bind(this));
    this.eventBus.on('buyFromCart', this.buyFromCart.bind(this));
    this.eventBus.on('deleteFromFav', this.deleteFromFavorite.bind(this));
  }
  /**
 * Получить все объявления пользователя
 */
  getAds() {
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/salesman/' + localStorage.getItem('id'),
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      const {adverts} = parsedBody.body;
      this.eventBus.emit('gotAds', adverts);
    });
  }
  /**
   * Получить архивные объявления
   */
  getArchive() {
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/archive',
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      const {adverts} = parsedBody.body;
      this.eventBus.emit('gotAds', adverts, true);
    });
  }
  /**
 * Проверяет авторизован ли пользователь
 */
  checkForLogging() {
    if (localStorage.getItem('name') === null) {
      this.eventBus.emit('notLogged');
    }
  }

  /**
   * Загружает аватарку на сервер
   * @param {*} formData фото пользователя
   */
  uploadPhoto(formData) {
    Ajax.postImageUsingFetch({
      url: secureDomainUrl + 'users/profile/upload',
      body: formData,
    });
  }
  /**
   * Логика работы настроек
   */
  handleSettings() {
    const photoInput = document.getElementById('avatar_loader');
    const img = document.getElementById('avatar_preview');
    photoInput.onchange = () => {
      const [file] = photoInput.files;
      if (file) {
        img.src = URL.createObjectURL(file);
        document.querySelector('.profile-content__avatar__image').src =
        URL.createObjectURL(file);
        document.querySelector('.mini-profile__avatar').src =
        URL.createObjectURL(file);
        localStorage.setItem('image', URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('avatar', file);
        this.eventBus.emit('uploadPhoto', formData);
      }
    };

    const email =
    document.getElementById('settingEmail').childNodes[3].placeholder;
    const phoneInput = document.getElementById('settingPhone').childNodes[3];
    phoneInput.addEventListener('focus', () => {
      if (phoneInput.value < 15) {
        phoneInput.value = '+7(';
      }
    });
    let old = 0;
    phoneInput.addEventListener('keydown', (e)=> {
      // backspace delete
      if (!/\d/.test(e.key) && e.keyCode != 8 && e.keyCode != 46) {
        e.preventDefault();
        return;
      }
      const curLen = phoneInput.value.length;
      if (curLen < old) {
        old--;
        return;
      }
      if (curLen == 6) {
        phoneInput.value = phoneInput.value + ')';
      }
      if (curLen == 10) {
        phoneInput.value = phoneInput.value + '-';
      }
      if (curLen == 13) {
        phoneInput.value = phoneInput.value + '-';
      }
      if (curLen > 15) {
        phoneInput.value = phoneInput.value.substring(0, phoneInput.value.length - 1);
      }
      old++;
    });
    const changeInfoBtn = document.getElementById('settings__change-info');
    changeInfoBtn.addEventListener('click', ()=>{
      const nameInput = document.getElementById('settingName').childNodes[3];
      let name = nameInput.value.trim();
      const surnInpt = document.getElementById('settingSurname').childNodes[3];
      let surname = surnInpt.value.trim();
      let phone = phoneInput.value.trim();
      // не отправляем запрос если ничего не меняли
      if (name.length == 0 && surname.length == 0 && phone.length != 11) {
        return;
      }
      if (name.length == 0) {
        name = nameInput.placeholder;
      }
      if (surname.length == 0) {
        surname = surnInpt.placeholder;
      }
      phone = phoneInput.value[1] + phoneInput.value.slice(3, 6) +
        phoneInput.value.slice(7, 10) + phoneInput.value.slice(11, 13) +
        phoneInput.value.slice(14, 16);
      if (phone.length != 11) {
        phone = localStorage.getItem('phone');
      }
      if (name.length < 2) {
        document.getElementById('settingName').classList.add('text-input_wrong');
        return;
      }
      if (surname.length < 2) {
        document.getElementById('settingName').classList.remove('text-input_wrong');
        document.getElementById('settingSurname').classList.add('text-input_wrong');
        return;
      }
      console.log(email, name, surname, phone);
      const response = Ajax.postUsingFetch({
        url: secureDomainUrl + 'users/profile',
        body: {email, name, surname, phone},
      });
      response.then(({status, parsedBody}) => {
        if (status != statusCodes.OK) {
          return;
        }
        const {code} = parsedBody;
        console.log(parsedBody);
        if (code === statusCodes.OK) {
          localStorage.setItem('name', name);
          localStorage.setItem('surname', surname);
          localStorage.setItem('phone', phone);
          nameInput.placeholder = name;
          surnInpt.placeholder = surname;
          document.querySelector('.profile-content__username').innerHTML = name;
          document.querySelector('.mini-profile__capture').innerHTML = name;
        };
      });
    });

    const changePasswrdBtn = document.
        getElementById('settings__change-password');
    changePasswrdBtn.addEventListener('click', (e)=> {
      const passwordDiv = document.getElementById('settingPassword');
      const oldPasswordDiv = document.getElementById('settingOldPassword');
      const password = passwordDiv.childNodes[3].value.trim();
      const oldPassword = oldPasswordDiv.childNodes[3].value.trim();
      passwordDiv.classList.remove('text-input_correct');
      oldPasswordDiv.classList.remove('text-input_correct');
      this.eventBus.emit('changePassword', email, oldPassword, password);
    });
  }

  /**
   * Смена пароля
   * @param {*} email
   * @param {*} oldPassword
   * @param {*} password
   */
  changePassword(email, oldPassword, password) {
    const passwordDiv = document.getElementById('settingPassword');
    if (password.length < 5) {
      passwordDiv.classList.add('text-input_wrong');
      return;
    }
    if (password === oldPassword) {
      passwordDiv.childNodes[5].innerHTML = 'Пароли одинаковые';
      passwordDiv.classList.add('text-input_wrong');
      return;
    }
    passwordDiv.childNodes[5].innerHTML = 'Пароль слишком простой';
    passwordDiv.classList.remove('text-input_wrong');
    const response = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile/password',
      body: {
        email: email,
        password: oldPassword,
        new_password: password},
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        document.getElementById('settingOldPassword').classList.remove('text-input_wrong');
        document.getElementById('settingOldPassword').classList.add('text-input_correct');
        passwordDiv.classList.add('text-input_correct');
        document.getElementById('settings__change-password').innerHTML = 'Пароль изменен';
        return;
      };
      document.getElementById('settingOldPassword').classList.add('text-input_wrong');
    });
  }

  /**
   * Обработка удаления
   * @param {number} id айдишник объявления
   * @param {Number} advertPos позиция удаляемой карточки в гриде
   */
  handleDelete(id, advertPos) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.innerHTML = modalT({
      modalText: 'По какой причине вы хотите удалить объявление?',
      deleteModal: true,
    });
    document.getElementsByTagName('body')[0].appendChild(modal);
    const modal1 = document.getElementById('modal-1');
    modal1.classList.add('modal_active');
    const closeButton = modal1.getElementsByClassName('modal__close-button')[0];

    closeButton.onclick = function(e) {
      e.preventDefault();
      modal1.classList.remove('modal_active');
      document.getElementsByTagName('body')[0].removeChild(modal);
    };

    modal1.onmousedown = function(e) {
      const modalContent = modal1.getElementsByClassName('modal__content')[0];
      if (e.target.closest('.' + modalContent.className) === null) {
        this.classList.remove('modal_active');
        document.getElementsByTagName('body')[0].removeChild(modal);
      }
    };
    const deleteBtn = document.getElementById('modal__button-delete');
    deleteBtn.addEventListener('click', (e)=>{
      const res = Ajax.deleteAdUsingFetch({
        url: secureDomainUrl + 'adverts/' + id,
      });
      // обновить страницу если успешно удалили
      res.then(({status, parsedBody}) => {
        if (status != statusCodes.OK) {
          return;
        }
        const {code} = parsedBody;
        if (code === statusCodes.OK) {
          // если удалили, то удаляем карточку и закрываем модальное окно
          this.getAds();
          document.querySelector('.modal__content').classList.remove('modal_active');
          document.getElementsByTagName('body')[0].removeChild(modal);
        };
      });
    });

    const archiveBtn = document.getElementById('modal__button-to-archive');
    archiveBtn.addEventListener('click', (e)=>{
      const res = Ajax.postUsingFetch({
        url: secureDomainUrl + 'adverts/' + id + '/close',
      });
        // обновить страницу если успешно закрыли
      res.then(({status, parsedBody}) => {
        if (status != statusCodes.OK) {
          return;
        }
        const {code} = parsedBody;
        if (code === statusCodes.OK) {
          // если заархивировали закрываем модальное окно и удаляем карточку
          this.getAds();
          document.querySelector('.modal__content').classList.remove('modal_active');
          document.getElementsByTagName('body')[0].removeChild(modal);
        };
      });
    });
  }

  /**
   * Получение объявлений в корзине
   */
  getCart() {
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'cart',
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        parsedBody.body.adverts.forEach((elem, pos)=> {
          if (elem.is_active === false) {
            parsedBody.body.adverts.splice(pos, 1);
            Ajax.postUsingFetch({
              url: secureDomainUrl + 'cart/one',
              body: {
                advert_id: Number(elem.id),
                amount: 0,
              },
            });
          }
        });
        this.eventBus.emit('gotCart', parsedBody.body.adverts);
        return;
      };
    });
  }

  /**
   * Получение объявлений в избранном
   */
  getFavorite() {
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/favorite',
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        parsedBody.body.adverts.forEach((elem, pos)=> {
          if (elem.is_active === false) {
            parsedBody.body.adverts.splice(pos, 1);
            Ajax.deleteAdUsingFetch({
              url: secureDomainUrl + 'adverts/favourite/' + elem.id,
            });
          }
        });
        this.eventBus.emit('gotAds', parsedBody.body.adverts, false, true);
        return;
      };
    });
  }

  /**
   * удаляет из корзины
   * @param {*} id объявления
   * @param {Number} advertPos позиция удаляемой карточки в гриде
   */
  deleteFromCart(id, advertPos) {
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'cart/one',
      body: {
        advert_id: Number(id),
        amount: 0,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      if (advertPos != null) {
        this.getCart();
      }
    });
  }

  /**
   * удаляет из избранного
   * @param {*} id объявления
   * @param {Number} advertPos позиция удаляемой карточки в гриде
   */
  deleteFromFavorite(id, advertPos) {
    console.log('kek');
    const res = Ajax.deleteAdUsingFetch({
      url: secureDomainUrl + 'adverts/favorite/' + id,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      if (advertPos != null) {
        this.getFavorite();
      }
    });
  }

  /**
   * Оформление покупки
   * @param {*} advert объект объявления
   * @param {Number} advertPos позиция удаляем карточки в гриде
   */
  buyFromCart(advert, advertPos) {
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'cart/' + advert.id +'/checkout',
      body: {
        advert_id: advert.id,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      console.log(parsedBody);
      const {salesman} = parsedBody.body;

      const modalT = createDeleteModal();
      const modal = document.createElement('div');
      modal.innerHTML = modalT({
        modalText: 'Покупка',
        deleteModal: false,
      });
      // error := http.ListenAndServe(":8080", r)
      const modalAdvName = document.createElement('p');
      modalAdvName.innerHTML = `Товар: ${advert.name}`;
      modalText.appendChild(modalAdvName);
      const modalAdvEmail = document.createElement('p');
      modalAdvEmail.innerHTML = `email продавца: ${salesman.email}`;
      modalText.appendChild(modalAdvEmail);
      if (salesman.phone !== '') {
        const resPhone = '+' + salesman.phone[0] + '(' +
          salesman.phone.slice(1, 4) + ')' + salesman.phone.slice(4, 7) +
          '-' + salesman.phone.slice(7, 9) + '-' + salesman.phone.slice(9, 11);
        const modalAdvPh = document.createElement('p');
        modalAdvPh.innerHTML = `Контактный телефон: ${resPhone}`;
        modalText.appendChild(modalAdvPh);
      }
      const modalAdvPrice = document.createElement('p');
      modalAdvPrice.innerHTML = `Цена: ${advert.price} ₽`;
      modalText.appendChild(modalAdvPrice);

      const closeButton = modal1.getElementsByClassName('modal__close-button')[0];
      closeButton.onclick = function(e) {
        e.preventDefault();
        modal1.classList.remove('modal_active');
        document.getElementsByTagName('body')[0].removeChild(modal);
        document.querySelectorAll('.card')[advertPos].remove();
      };
      modal1.onmousedown = function(e) {
        const modalContent = modal1.getElementsByClassName('modal__content')[0];
        if (e.target.closest('.' + modalContent.className) === null) {
          this.classList.remove('modal_active');
          document.getElementsByTagName('body')[0].removeChild(modal);
          document.querySelectorAll('.card')[advertPos].remove();
        }
      };
    });
  }
}
