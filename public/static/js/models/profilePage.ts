import {Ajax} from '../modules/ajax';
import {inputNum, minValidationLen, passwordLength,
      phLength, secureDomainUrl, statusCodes, userInfo} from '../constatns';
import {createDeleteModal} from '../templates/deleteModal/deleteModal';
import Bus from '../modules/EventBus';
import { advert, salesman } from '../types';


/**
 * Класс модели пользователя
 */
export default class ProfilePageModel {
  eventBus: Bus
  /**
  * @description Constructor
  * @param {Object} eventBus to call and subscribe for signals
  */
  constructor(eventBus: Bus) {
    this.eventBus = eventBus;
    this.eventBus.on('getGrid', this.getAds.bind(this));
    this.eventBus.on('getCart', this.getCart.bind(this));
    this.eventBus.on('getFavorite', this.getFavorite.bind(this));
    this.eventBus.on('getArchive', this.getArchive.bind(this));
    this.eventBus.on('validateProfileInfo', this.validateProfile.bind(this));
    this.eventBus.on('changePassword', this.validatePassword.bind(this));
    this.eventBus.on('onDeleteClick', this.handleDeleteModal.bind(this));
    this.eventBus.on('profileUpdated', this.updateInfo.bind(this));
    this.eventBus.on('deletedSuccessful', this.adDeleted.bind(this));
    this.eventBus.on('buySuccess', this.showSuccessBuy.bind(this));
    this.eventBus.on('getMessages', this.getMessages.bind(this));
    this.eventBus.on('connectToDialog', this.connectToDialog.bind(this));
  }
  /**
 * Получить все объявления пользователя
 */
  getAds() {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts/salesman/${<string>userInfo.get('id')}`,
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
      body: null,
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        parsedBody.body.adverts.forEach((elem : advert, pos: number) => {
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
      }
    });
  }

  /**
   * Получение объявлений в избранном
   */
  getFavorite() {
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/favorite',
      body: null,
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        parsedBody.body.adverts.forEach((elem: advert, pos: number) => {
          if (elem.is_active === false) {
            parsedBody.body.adverts.splice(pos, 1);
            Ajax.deleteAdUsingFetch({
              url: secureDomainUrl + 'adverts/favourite/' + elem.id,
              body: null,
            });
          }
        });
        this.eventBus.emit('gotAds', parsedBody.body.adverts, false, true);
        return;
      }
    });
  }

  /**
   * Получение активных диалогов
   */
  getMessages(isDetailed: boolean) {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}chat/getDialogs/${userInfo.get('id')}`,
      body: null,
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        console.log(parsedBody.body.dialogs);
        this.eventBus.emit('foundDialogs', parsedBody.body.dialogs, isDetailed);
        return;
      }
    });
  }

  /**
   * 
   */
  connectToDialog() {
    const idTo = window.location.pathname.split('/')[3];
    const advertId = window.location.pathname.split('/')[4];
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}chat/getHistory/${userInfo.get('id')}/${idTo}/${advertId}?count=9999`,
      body: null,
    });
    res.then(async ({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        console.log(parsedBody.body);
        this.eventBus.emit('historyFound', parsedBody.body.messages);
        this.eventBus.emit('connectToChat', idTo, advertId);
        return;
      }
      // если новый чатик
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('connectToChat', idTo, advertId);
        return;
      }
    });
  }


  /**
   * Логика работы настроек
   */
  validateProfile() {
    const email =
      (<HTMLInputElement>document.getElementById('settingEmail')?.childNodes[inputNum]).placeholder;
    const phoneInput = document.getElementById('settingPhone')?.
        childNodes[inputNum] as HTMLInputElement;
    const nameInput = document.getElementById('settingName')?.
        childNodes[inputNum] as HTMLInputElement;
    const surnInpt = document.getElementById('settingSurname')?.
        childNodes[inputNum] as HTMLInputElement;
    let name = nameInput.value.trim();
    let surname = surnInpt.value.trim();
    let phone : string | null = phoneInput.value.trim();
    // не отправляем запрос если ничего не меняли
    if (name.length == 0 && surname.length == 0 && phone.length != phLength) {
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
    if (phone.length != phLength) {
      phone = <string>userInfo?.get('phone')
    }
    if (name.length < minValidationLen) {
      document.getElementById('settingName')?.classList.add('text-input_wrong');
      return;
    }
    if (surname.length < minValidationLen) {
      document.getElementById('settingName')?.
          classList.remove('text-input_wrong');
      document.getElementById('settingSurname')?.
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
  updateInfo(name: string, surname: string) {
    const nameDiv = document.getElementById('settingName');
    const surnameDiv = document.getElementById('settingSurname');
    const nameInput = nameDiv?.childNodes[inputNum] as HTMLInputElement;
    const surnInpt = surnameDiv?.childNodes[inputNum] as HTMLInputElement;
    nameDiv?.classList.add('text-input_correct');
    surnameDiv?.classList.add('text-input_correct');
    document.getElementById('settingEmail')?.classList.add('text-input_correct');
    document.getElementById('settingPhone')?.classList.add('text-input_correct');
    const changeBtn = document.getElementById('settings__change-info');
    if (changeBtn != null) {
      changeBtn.innerHTML = 'Информация сохранена';
    }
    nameInput.placeholder = name;
    nameInput.value = '';
    surnInpt.placeholder = surname;
    surnInpt.value = '';
    const profileUsername = document.querySelector('.profile-content__username');
    if (profileUsername != null) {
      profileUsername.innerHTML = name;
    }
    const headerUsername = document.querySelector('.mini-profile__capture');
    if (headerUsername != null) {
      headerUsername.innerHTML = name;
    }
  }

  /**
   * Смена пароля
   * @param {*} oldPassword
   * @param {*} password
   */
  validatePassword(oldPassword : string, password: string) {
    const passwordDiv = document.getElementById('settingPassword');
    const passwordInput = passwordDiv?.childNodes[inputNum] as HTMLInputElement;
    if (password.length < passwordLength) {
      passwordDiv?.classList.add('text-input_wrong');
      return;
    }
    if (password === oldPassword) {
      passwordInput.innerHTML = 'Пароли одинаковые';
      passwordDiv?.classList.add('text-input_wrong');
      return;
    }
    passwordInput.innerHTML = 'Пароль слишком простой';
    passwordDiv?.classList.remove('text-input_wrong');
    this.eventBus.emit('passwordChecked', oldPassword, password);
  }


  /**
   * Обработка удаления
   * @param {number} id айдишник объявления
   */
  handleDeleteModal(id: number) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.innerHTML = modalT({
      modalText: 'По какой причине вы хотите удалить объявление?',
      deleteModal: true,
    });
    document.getElementsByTagName('body')[0].appendChild(modal);
    const modal1 = document.getElementById('modal-1') as HTMLDivElement;
    modal1?.classList.add('modal_active');
    const closeButton = modal1?.getElementsByClassName('modal__close-button')[0] as HTMLButtonElement;

    closeButton.onclick = function(e) {
      e.preventDefault();
      modal1?.classList.remove('modal_active');
      document.getElementsByTagName('body')[0].removeChild(modal);
    };

    modal1.onmousedown = (e) => {
      const modalContent = modal1.getElementsByClassName('modal__content')[0];
      if ((<HTMLElement>e.target)?.closest('.' + modalContent.className) === null) {
        modal1.classList.remove('modal_active');
        document.getElementsByTagName('body')[0].removeChild(modal);
      }
    };
    const deleteBtn = document.getElementById('modal__button-delete');
    deleteBtn?.addEventListener('click', () => {
      this.eventBus.emit('deleted', id);
    });

    const archiveBtn = document.getElementById('modal__button-to-archive');
    archiveBtn?.addEventListener('click', (e) => {
      this.eventBus.emit('archived', id);
    });
  }

  /**
   * Удалили из профиля или архивнули
   * удаляем карточку и закрываем модальное окно
   */
  adDeleted() {
    this.getAds();
    const modal = document.getElementById('modal') as HTMLDivElement;
    document.querySelector('.modal__content')?.classList.remove('modal_active');
    document.getElementsByTagName('body')[0].removeChild(modal);
  }

  /**
   * Оформление покупки
   * @param {*} salesman объект продавца
   * @param {*} advert объект объявления
   */
  showSuccessBuy(salesman: salesman, advert: advert) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.innerHTML = modalT({
      modalText: 'Покупка',
      deleteModal: false,
    });
    document.getElementsByTagName('body')[0].appendChild(modal);
    const modal1 = document.getElementById('modal-1') as HTMLDivElement;
    modal1?.classList.add('modal_active');
    const modalText = document.querySelector('.modal__content');

    const modalAdvName = document.createElement('p');
    modalAdvName.innerHTML = `Товар: ${advert.name}`;
    modalText?.appendChild(modalAdvName);
    const modalAdvEmail = document.createElement('p');
    modalAdvEmail.innerHTML = `email продавца: ${salesman.email}`;
    modalText?.appendChild(modalAdvEmail);
    if (salesman.phone !== '') {
      const resPhone = '+' + salesman.phone[0] + '(' +
          salesman.phone.slice(1, 4) + ')' + salesman.phone.slice(4, 7) +
          '-' + salesman.phone.slice(7, 9) + '-' + salesman.phone.slice(9, 11);
      const modalAdvPh = document.createElement('p');
      modalAdvPh.innerHTML = `Контактный телефон: ${resPhone}`;
      modalText?.appendChild(modalAdvPh);
    }
    const modalAdvPrice = document.createElement('p');
    modalAdvPrice.innerHTML = `Цена: ${advert.price} ₽`;
    modalText?.appendChild(modalAdvPrice);

    const closeButton = modal1?.getElementsByClassName('modal__close-button')[0] as HTMLButtonElement;
    closeButton.onclick = (e) => {
      e.preventDefault();
      modal1?.classList.remove('modal_active');
      modal.remove();
      this.getCart();
    };
    modal1.onmousedown = (e) => {
      const modalContent = modal1.getElementsByClassName('modal__content')[0];
      if ((<HTMLElement>e.target)?.closest('.' + modalContent.className) === null) {
        modal1.classList.remove('modal_active');
        modal.remove();
        this.getCart();
      }
    };
  }
}
