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
    this.eventBus.on('validateProfileInfo', this.validateProfile.bind(this));
    this.eventBus.on('changePassword', this.changePassword.bind(this));
    this.eventBus.on('onDeleteClick', this.handleDeleteModal.bind(this));
    this.eventBus.on('profileUpdated', this.updateInfo.bind(this));
    this.eventBus.on('deletedSuccessful', this.adDeleted.bind(this));
    this.eventBus.on('buySuccess', this.showSuccessBuy.bind(this));
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
        parsedBody.body.adverts.forEach((elem, pos) => {
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
        parsedBody.body.adverts.forEach((elem, pos) => {
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
   * Логика работы настроек
   */
  validateProfile() {
    const email =
      document.getElementById('settingEmail').childNodes[3].placeholder;
    const phoneInput = document.getElementById('settingPhone').childNodes[3];
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
      document.getElementById('settingName').
          classList.remove('text-input_wrong');
      document.getElementById('settingSurname').
          classList.add('text-input_wrong');
      return;
    }
    this.eventBus.emit('infoChecked', email, name, surname, phone);
  }
  /**
   * Успешно обновили
   * @param {*} name
   * @param {*} surname
   * @param {*} phone
   */
  updateInfo(name, surname) {
    const nameInput = document.getElementById('settingName').childNodes[3];
    const surnInpt = document.getElementById('settingSurname').childNodes[3];
    nameInput.placeholder = name;
    nameInput.value = '';
    surnInpt.placeholder = surname;
    surnInpt.value = '';
    document.querySelector('.profile-content__username').innerHTML = name;
    document.querySelector('.mini-profile__capture').innerHTML = name;
  }

  /**
   * Смена пароля
   * @param {*} oldPassword
   * @param {*} password
   */
  changePassword(oldPassword, password) {
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
    this.eventBus.emit('passwordChecked', oldPassword, password);
  }


  /**
   * Обработка удаления
   * @param {number} id айдишник объявления
   */
  handleDeleteModal(id) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.id = 'modal';
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
    deleteBtn.addEventListener('click', () => {
      this.eventBus.emit('deleted', id);
    });

    const archiveBtn = document.getElementById('modal__button-to-archive');
    archiveBtn.addEventListener('click', (e) => {
      this.eventBus.emit('archived', id);
    });
  }

  /**
   * Удалили из профиля или архивнули
   * удаляем карточку и закрываем модальное окно
   */
  adDeleted() {
    this.getAds();
    const modal = document.getElementById('modal');
    document.querySelector('.modal__content').classList.remove('modal_active');
    document.getElementsByTagName('body')[0].removeChild(modal);
  }

  /**
   * Оформление покупки
   * @param {*} salesman объект продавца
   * @param {*} advert объект объявления
   */
  showSuccessBuy(salesman, advert) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.innerHTML = modalT({
      modalText: 'Покупка',
      deleteModal: false,
    });
    document.getElementsByTagName('body')[0].appendChild(modal);
    const modal1 = document.getElementById('modal-1');
    modal1.classList.add('modal_active');
    const modalText = document.querySelector('.modal__content');

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
    closeButton.onclick = (e) => {
      e.preventDefault();
      modal1.classList.remove('modal_active');
      this.getCart();
    };
    modal1.onmousedown = (e) => {
      const modalContent = modal1.getElementsByClassName('modal__content')[0];
      if (e.target.closest('.' + modalContent.className) === null) {
        this.classList.remove('modal_active');
        this.getCart();
      }
    };
  }
}
