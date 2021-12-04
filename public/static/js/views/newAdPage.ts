import BaseView from './baseView';
import {createNewAdForm} from '../templates/newAdForm/newAdFormT';
import {newImage} from '../templates/newAdForm/image';
import Bus from '../modules/EventBus';
import { templateFunc } from '../types';

/**
 * Класс вьюхи страницы добавления нового объявления
 */
export default class NewAdPageView extends BaseView {
  #editDeletedImages : string[] = []
  #editOffset : number
  #fileList : Blob[] = []
  #imageTemplate : templateFunc
  /**
    * Конструктор страницы нового объявления
    * @param {*} eventBus локальный событие автобус
    */
  constructor(eventBus : Bus) {
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
    document.querySelector('.root__new-advert-btn-wrapper')?.remove();
    const toogle = document.getElementById('mini-profile__toogle') as HTMLInputElement;
    toogle.checked = false;
    const adFormT = createNewAdForm();
    this.root.innerHTML = adFormT({
      newAdvert: window.localizer.getLocaleItem('newAdvert'),
      title: window.localizer.getLocaleItem('title'),
      titleHint: window.localizer.getLocaleItem('titleHint'),
      category: window.localizer.getLocaleItem('category'),
      description: window.localizer.getLocaleItem('description'),
      conditionAdNew: window.localizer.getLocaleItem('conditionAdNew'),
      condition: window.localizer.getLocaleItem('condition'),
      conditionAdUsed: window.localizer.getLocaleItem('conditionAdUsed'),
      price: window.localizer.getLocaleItem('price'),
      priceHint: window.localizer.getLocaleItem('priceHint'),
      uploadImages: window.localizer.getLocaleItem('uploadImages'),
      add: window.localizer.getLocaleItem('add'),
      address: window.localizer.getLocaleItem('address'),
      addressHint: window.localizer.getLocaleItem('addressHint'),
      submit: window.localizer.getLocaleItem('submit'),
    });
    this.eventBus.emit('getCategory');
    this.eventBus.emit('renderDone');
    this.#editDeletedImages.length = 0;
    this.#fileList.length = 0;
    this.#editOffset = 0;
    document.getElementById('newAdForm')?.addEventListener('click', this.sendAd);
    const input = document.querySelectorAll('.new-ad-form__input');
    [].forEach.call(input, (elem : HTMLElement) => {
      elem.addEventListener('focusin', () => {
        (<HTMLElement>elem.parentElement?.childNodes[1]).classList.add('active');
      });
    });
    (<NodeListOf<HTMLInputElement>>input).forEach((elem: HTMLInputElement) => {
      elem.addEventListener('focusout', () => {
        if (!elem.value) {
          (<HTMLElement>elem.parentElement?.childNodes[1]).classList.remove('active');
        }
      });
    });

    const fileInput = document.getElementById('image_upload') as HTMLInputElement;
    fileInput.onchange = () => {
      const file = fileInput.files;
      if (file != null) {
        Array.from(file).forEach((elem : Blob) => {
          this.insertImageIntoImageUploader(URL.createObjectURL(elem));
          this.#fileList.push(elem);
        });
      }
      }
    document.getElementById('image-uploader')?.addEventListener('click', (e)=>{
      this.deleteImage(e);
    });
  }

  /**
   * Функция редактирования
   */
  edit() {
    this.render();
    this.eventBus.emit('getExistData');
    const submitButton = document.getElementById('newAdForm') as HTMLButtonElement;
    submitButton?.removeEventListener('click', this.sendAd);
    submitButton?.addEventListener('click', this.editAd);
    submitButton.innerHTML = <string>window.localizer.getLocaleItem('edit');
    const backBtn = document.createElement('button');
    backBtn.classList.add('button');
    backBtn.style.backgroundColor = '#e0e3e5';
    backBtn.style.color = 'black';
    backBtn.innerHTML = <string>window.localizer.getLocaleItem('cancel');
    backBtn.addEventListener('click', ()=> this.eventBus.emit('back'));
    document.querySelector('.button-container')?.prepend(backBtn);
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
  insertImageIntoImageUploader(url: string) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-uploader__image');
    imageContainer.innerHTML = this.#imageTemplate({imageUrl: url});
    document.querySelector('.image-uploader__default')?.before(imageContainer);
  }

  /**
   * Редактирование старого
   */
  editAd() {
    this.eventBus.emit('sendAd', false,
        this.#fileList, this.#editDeletedImages);
  }

  /**
   * Удаляет картинку
   * @param {*} e
   */
  deleteImage(e: Event) {
    let target = e.target;
    if (target instanceof SVGPathElement) {
      if (target.parentElement != null)
      target = target.parentElement.parentElement;
    }
    if (target instanceof SVGElement) {
      target = target.parentElement;
    }
    const crosses = document.querySelectorAll('.image-uploader__image__cross-container');
    const id = Array.from(crosses).indexOf(<Element> target);
    if (id > -1) {
      const images = document.querySelectorAll('.image-uploader__image');
      // значит что собираемся удалять старую фотку
      if (id < this.#editOffset) {
        const imagesSrc = images[id].childNodes[3].childNodes[1] as HTMLImageElement;
        const path = imagesSrc.src.split('/');
        this.#editDeletedImages.
            push(path.slice(3, 6).join('/'));
      } else {
        this.#fileList.splice(id, 1);
      }
      images[id].remove();
    }
  }

  /**
   * вставляет картинки с сервера
   * @param {*} images
   */
  pushExistingImages(images: string[]) {
    let cursed = false;
    images.forEach((elem)=>{
      if (elem == '/static/advertimages/default_image.png') {
        cursed = true;
        return;
      }
      this.insertImageIntoImageUploader(elem);
    });
    if (!cursed) {
      this.#fileList.length = images.length;
      this.#editOffset = images.length;
    }
  }
}
