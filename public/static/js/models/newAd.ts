import {Ajax} from '../modules/ajax';
import {engCategories, idNum, inputNum, minValidationLen,
  secureDomainUrl, statusCodes, userInfo} from '../constatns';
import Bus from '../modules/EventBus';
import { categoryList, ymapsEvent } from '../types';

/**
 * Класс модели нового объявления
 */
export default class NewAdPageModel {
  eventBus: Bus
  #coords: number[] | null
  #myMap: ymaps.Map
  /**
    * @description Constructor
    * @param {Object} eventBus to call and subscribe for signals
    */
  constructor(eventBus: Bus) {
    this.eventBus = eventBus;
    this.eventBus.on('renderDone', this.initMap.bind(this));
    this.eventBus.on('sendAd', this.validateAd.bind(this));
    this.eventBus.on('successSend', this.validatePhoto.bind(this));
    this.eventBus.on('getExistData', this.getData.bind(this));
    this.eventBus.on('getCategory', this.getCategories.bind(this));
  }

  /**
   * Функция иниализация яндекс карт
   */
  initMap() {
    this.#coords = null;
    const location = document.querySelector('.new-advert__location');
    ymaps.ready().then(() => {
      this.#myMap = new ymaps.Map('YMapsID', {
        center: [55.766062, 37.684488],
        zoom: 13,
      });
      this.#myMap.events.add('click', async (e: ymapsEvent) => {
        const coords = e.get('coords');
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: coords, // координаты точки
          },
        });
        this.#coords = coords;
        console.log(coords);
        this.#myMap.geoObjects.removeAll();
        this.#myMap.geoObjects.add(myGeoObject);
        const response =
          await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=a4627984-d4ae-4e59-a89b-7c1c4d5cf56d&format=json&geocode=${coords[1].toFixed(6)},${coords[0].toFixed(6)}`);
        /* eslint-disable  @typescript-eslint/no-unsafe-assignment */
        const json = await response.json();
        /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
        let data = <string>json.response.GeoObjectCollection.featureMember[0].GeoObject.
            metaDataProperty.GeocoderMetaData.Address.formatted;
        console.log(data);
        const dataSliced = data.split(' ');
        const dateSlice = dataSliced.slice(1);
        data = dateSlice.join(' ');
        const input = location?.childNodes[inputNum] as HTMLInputElement;
        input.value = data;
      });
    });
  }

  /**
   * Получение списка возможных категорий
   */
  getCategories() {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}category`,
      body: null,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {categories} = parsedBody.body;
      const select = document.getElementById('selCategory');
      categories.forEach((elem : categoryList, i:number) => {
        const el = document.createElement('option');
        el.value = elem.name;
        if (window.localizer.userLang == 'en') {
          el.innerHTML = engCategories[i].name;
        } else {
          el.innerHTML = elem.name;
        }
        select?.appendChild(el);
      });
    }).catch(()=> console.log('Ошибка получения категорий'));
  }

  /**
   * отправка объявления на сервер
   * @param {bool} isNew новое объявление или редактирование старого
   * @param {Blob[]} fileList массив фотографий
   * @param {string[]} imagesToDelete фотографии которые удалим
   */
  validateAd(isNew : boolean, fileList : Blob[], imagesToDelete : string[]) {
    const nameDiv = document.querySelector('.new-advert__name') as HTMLDivElement;
    const title = (<HTMLInputElement>nameDiv?.childNodes[inputNum]).value.trim();
    if (!validate(nameDiv)) {
      return;
    }
    const category = (<HTMLInputElement>document.getElementById('selCategory')).value;
    const descriptionDiv = document.querySelector('.new-advert__description') as HTMLDivElement;
    let description = (<HTMLInputElement>descriptionDiv?.childNodes[inputNum]).value.trim();
    if (!validate(descriptionDiv)) {
      description = 'Нет описания';
    }
    const condition = (<HTMLInputElement>document.getElementById('radio-new')).checked;
    const priceDiv = document.querySelector('.new-advert__price') as HTMLDivElement;
    const price = (<HTMLInputElement>priceDiv.childNodes[inputNum]).value.trim();
    const coords = this.#coords;
    if (coords === null) {
      document.querySelector('.new-advert__location')?.
          classList.add('text-input_wrong');
      return;
    }
    document.querySelector('.new-advert__location')?.
        classList.remove('text-input_wrong');
    const address = (<HTMLInputElement>document.querySelector('.new-advert__location')?.
        childNodes[inputNum]).value.trim();
    // отправка на разные endpoint
    let endpointUrl;
    if (isNew) {
      endpointUrl = secureDomainUrl + 'adverts';
    } else {
      const adId = window.location.pathname.split('/')[idNum];
      endpointUrl = `${secureDomainUrl}adverts/${adId}`;
    }
    this.eventBus.emit('validateSuccessful', endpointUrl, title, description,
        category, condition, price, address,
        coords, isNew, fileList, imagesToDelete);
  }

  /**
   * Отправляет фото
   * @param {number} id id объявления
   * @param {boolean} isNew редакт или новое
   * @param {Array} fileList массив фотографий
   */
  validatePhoto(id : number, isNew : boolean, fileList : Blob[]) {
    const formData = new FormData();
    Array.from(fileList).forEach((elem)=> {
      if (elem != undefined) {
        formData.append('images', elem);
      }
    });
    if (!formData.has('images')) {
      if (!isNew) {
        this.eventBus.emit('redirectToAd', id);
        return;
      }
      this.eventBus.emit('photosSend');
      return;
    }
    this.eventBus.emit('photoDataPacked', formData, id, isNew);
  }

  /**
   * Функция получения и автозаполнения информации
   */
  getData() {
    const adId = window.location.pathname.split('/')[idNum];
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts/${adId}`,
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      const {advert} = parsedBody.body;
      if (advert.publisher_id !== Number(userInfo.get('id'))) {
        this.eventBus.emit('notOwner');
        return;
      }
      advert.images.forEach((elem : string, key : number) => {
        advert.images[key] = `/${elem}`;
      });
      const nameInput = document.querySelector('.new-advert__name')?.
        childNodes[inputNum] as HTMLInputElement;
      nameInput.value = advert.name;

      const categoryInput = document.querySelector('.new-advert__category')?.
        childNodes[inputNum] as HTMLInputElement;
      categoryInput.value = advert.category;
      
      const descInput = document.querySelector('.new-advert__description')?.
        childNodes[inputNum] as HTMLInputElement;
      descInput.value = advert.description;

      const condTogle = document.getElementById('radio-new') as HTMLInputElement;
      condTogle.checked = advert.is_new;

      const priceInput = document.querySelector('.new-advert__price')?.
        childNodes[inputNum] as HTMLInputElement;
      priceInput.value = advert.price;

      const locationInput = document.querySelector('.new-advert__location')?.
        childNodes[inputNum] as HTMLInputElement;
        locationInput.value = advert.location;

      this.eventBus.emit('handleImages', advert.images);

      ymaps.ready().then(()=> {
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: [advert.latitude, advert.longitude], // координаты точк
          },
        });
        this.#coords = [advert.latitude, advert.longitude];
        this.#myMap.geoObjects.add(myGeoObject);
        const card = document.getElementById('YMapsID') as HTMLDivElement;
        if (card.childNodes.length > 1) {
          card.removeChild(card.childNodes[0]);
        }
      });
    }).catch(()=> console.log('Ошибка редактирования объявления'));
  }
}

/**
 * проверка валидности формы инпута
 * @param {HTMLDivElement} div див с формой
 * @return {Boolean} тру если валидна
 */
function validate(div : HTMLDivElement): boolean {
  const text = (<HTMLInputElement>div.childNodes[inputNum]).value.trim();
  if (text.length < minValidationLen) {
    div.classList.add('text-input_wrong');
    return false;
  }
  div.classList.remove('text-input_wrong');
  return true;
}
