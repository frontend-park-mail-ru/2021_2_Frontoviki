/**
 *
 */
export default class Bus {
  listeners : Map<string, Function| null>
  /**
    * @param {array} signals массив строк сигналов
    */
  constructor(signals: string[]) {
    this.listeners = new Map;
    for (const signal of signals) {
      this.listeners.set(signal, null);
    }
  }
  /**
    * Подписываемся на событие
    */
  on(event: string, callback: Function): void { // подписываемся на событие
    this.listeners.set(event, callback);
  }
  /**
    *
    * @param {*} event
    * @param {*} data
    * @return {*}
    */
  emit(event: string, ...data : any[]): void { // публикуем (диспатчим, эмитим) событие
    if (!this.listeners.has(event)) {
      return;
    }
    const callback = this.listeners.get(event);
    if (callback != null) {
      callback(...data);
    }
  }
}

