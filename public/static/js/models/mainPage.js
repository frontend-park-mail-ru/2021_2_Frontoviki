import EventBus from "../modules/EventBus.js";
import { Ajax } from "../modules/ajax.js";

export default class MainPageModel {
    /**
     * @description Constructor
     * @param {Object} eventBus to call and subscribe for signals
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('getData', this.getAds.bind(this));
    }

    getAds() {
        console.log('signal emmited')
        // const res = Ajax.asyncGetUsingFetch({
        //   url: secureDomainUrl + 'adverts', body: null,
        // });
        // res.then(({status, parsedBody})=> {
        //   if (status != statusCodes.OK) {
        //     return;
        //   }
        //   console.log(parsedBody);
        //   const {code} = parsedBody;
        //   if (code === statusCodes.OK) {
        //     const mainPg = new MainPage(root);
        //     const {body} = parsedBody;
        //     const {advert} = body;
        //     mainPg.render(navigation, advert);
        //   }
        // });
        const ad = {
            href: '/ads/3',
            image: 'https://volchock.ru/static/img/2spooky4me.jpg',
            name: 'Картина A',
            location: 'Moscow',
            price: 100,
        };
        const advert = [
            ad,
            ad,
        ];
        this.eventBus.emit('getAds', undefined, undefined, advert);
    }
}