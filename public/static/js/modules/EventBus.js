/**
 *
 */
export default class Bus {
    /**
     *
     */
    constructor(signals) {
        this.listeners = new Map;

        for (const signal of signals) {
            this.listeners.set(signal, null);
        }
    }

    /**
     *
     * @param {*} event
     * @param {*} callback
     */
    on(event, callback) { // подписываемся на событие
        this.listeners.set(event, callback);
    }

    /**
     *
     * @param {*} event
     * @param {*} callback
     */
    // off(event, callback) { // отписываемся от события
    //     if (!this.listeners[event]) {
    //         return;
    //     }
    //     console.log('OFF ' + event + '    ' + this.listeners[event]);
    //     this.listeners[event] = this.listeners[event]
    //         .filter(function (listener) {
    //             return listener.place !== place;
    //         });
    //     console.log('OFF end ' + this.listeners[event]);
    // }
    /**
     *
     * @param {*} event
     * @param {*} data
     */
    emit(event, ...data) { // публикуем (диспатчим, эмитим) событие
        if (!this.listeners.has(event)) {
            return;
        }
        return this.listeners.get(event)(...data);
    }
}
