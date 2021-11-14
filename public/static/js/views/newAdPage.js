import BaseView from './baseView.js';
import {createNewAdForm} from '../templates/newAdForm/newAdFormT.js';
import {newImage} from '../templates/newAdForm/image.js';

/**
 * Класс вьюхи страницы добавления нового объявления
 */
export default class NewAdPageView extends BaseView {
  #fileList = []
  #imageTemplate
  /**
    * Конструктор страницы нового объявления
    * @param {*} eventBus локальный событие автобус
    */
  constructor(eventBus) {
    super(eventBus);
    this.#imageTemplate = newImage();
    this.render = this.render.bind(this);
    this.edit = this.edit.bind(this);
    this.sendAd = this.sendAd.bind(this);
    this.editAd = this.editAd.bind(this);
    this.eventBus.on('handleImages', this.pushExistingImages.bind(this));
  }

  /**
    * Рендер страницы
    */
  render() {
    this.eventBus.emit('checkLog');
    document.getElementById('mini-profile__toogle').checked = false;
    const adFormT = createNewAdForm();
    this.root.innerHTML = adFormT();
    this.eventBus.emit('getCategory');
    this.eventBus.emit('renderDone');
    this.#fileList.length = 0;
    document.getElementById('newAdForm').addEventListener('click', this.sendAd);
    const input = document.querySelectorAll('.new-ad-form__input');
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

    const fileInput = document.getElementById('image_upload');
    fileInput.onchange = e => {
      const file = fileInput.files;
      Array.from(file).forEach((elem) => {
        this.insertImageIntoImageUploader(URL.createObjectURL(elem));
        this.#fileList.push(elem);
      });
    };
    document.getElementById('image-uploader').addEventListener('click', (e)=>{
      this.deleteImage(e);
    });
  }

  /**
   * Функция редактирования
   */
  edit() {
    this.render();
    this.eventBus.emit('getExistData');
    const submitButton = document.getElementById('newAdForm');
    submitButton.removeEventListener('click', this.sendAd);
    submitButton.addEventListener('click', this.editAd);
    submitButton.innerHTML = 'Редактировать';
  }

  /**
   * Новое объявление
   */
  sendAd() {
    this.eventBus.emit('sendAd', true, this.#fileList);
  }


  /**
   * Вставляет картинку
   * @param {*} url
   */
  insertImageIntoImageUploader(url) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-uploader__image');
    imageContainer.innerHTML = this.#imageTemplate({imageUrl: url});
    document.querySelector('.image-uploader__default').before(imageContainer);
  };

  /**
   * Редактирование старого
   */
  editAd() {
    this.eventBus.emit('sendAd', false, this.#fileList);
  }

  /**
   * Удаляет картинку
   * @param {*} e
   */
  deleteImage(e) {
    let target = e.target;
    if (target instanceof SVGPathElement) {
      target = target.parentElement.parentElement;
    }
    if (target instanceof SVGElement) {
      target = target.parentElement;
    }
    const crosses = document.querySelectorAll('.image-uploader__image__cross-container');
    const id = Array.from(crosses).indexOf(target);
    if (id > -1) {
      const images = document.querySelectorAll('.image-uploader__image');
      images[id].remove();
      this.#fileList.splice(id, 1);
    }
  }

  /**
   * вставляет картинки с сервера
   * @param {*} images
   */
  pushExistingImages(images) {
    console.log(images);
    images.forEach((elem)=>{
      this.insertImageIntoImageUploader(elem);
    });
  }
}
