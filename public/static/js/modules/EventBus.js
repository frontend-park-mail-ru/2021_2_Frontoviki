/**
 *
 */
export default class Bus {
  /**
    * @param {array} signals массив строк сигналов
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
    * @param {*} data
    * @return {*}
    */
  emit(event, ...data) { // публикуем (диспатчим, эмитим) событие
    if (!this.listeners.has(event)) {
      return;
    }
    this.listeners.get(event)(...data);
  }
}

