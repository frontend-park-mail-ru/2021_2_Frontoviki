import { Ajax } from '../modules/ajax.js';
import { secureDomainUrl, statusCodes } from '../constatns.js';

export default class ProfilePageModel {
    /**
       * @description Constructor
       * @param {Object} eventBus to call and subscribe for signals
       */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('getAds', this.getAds.bind(this));
        this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    }

    getAds() {
        const res = Ajax.asyncGetUsingFetch({
            url: secureDomainUrl + 'adverts/salesman/' + localStorage.getItem('id'),
            body: null,
        });
        res.then(({ status, parsedBody }) => {
            if (status != statusCodes.OK) {
                return;
            }
            const { adverts } = parsedBody;
            this.eventBus.emit('gotAds', adverts);
        });
    }

    checkForLogging() {
        if (localStorage.getItem('name') === null) {
            this.eventBus.emit('notLogged');
        }
    }
}