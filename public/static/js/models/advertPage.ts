import {Ajax} from '../modules/ajax';
import {idNum, secureDomainUrl, statusCodes} from '../constatns';
import Bus from '../modules/EventBus';

/**
 * Класс главной страницы с последними объявлениями
 */
export default class AdvertPageModel {
  eventBus: Bus
  /**
     * @description Constructor
     * @param {Object} eventBus to call and subscribe for signals
     */
  constructor(eventBus: Bus) {
    this.eventBus = eventBus;
    this.eventBus.on('GetAdData', this.getAdData.bind(this));
    this.eventBus.on('getPriceHistory', this.getPriceHistory.bind(this));
  }

  /**
   * Получение информации об объявлении
   */
  getAdData() {
    const adId = window.location.pathname.split('/')[idNum];
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/' + adId,
      body: null,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      const {advert, salesman, rating} = parsedBody.body;
      advert['imagesContainer'] = [];
      advert.images.forEach((elem: string) => {
        const newElem = {
          imagePath: '',
          format: ''
        };
        if (elem == 'static/advertimages/default_image.webp') {
          newElem.imagePath = '/static/advertimages/default_image';
        } else {
          newElem.imagePath = '/' + elem;
          newElem.format = '.' + elem.split('__')[1];
        }
        advert['imagesContainer'].push(newElem);
      });
      this.eventBus.emit('gotAd', advert, salesman, rating);
    }).catch((err)=> console.log(err));
  }

  getPriceHistory(advertId: number) {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts/price_history/${advertId}`,
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      this.eventBus.emit('gotPriceHistory', parsedBody.body.history);
    }).catch((err)=> console.log(err));
  }
}
