import { callback } from "../types";

/**
 * Эмиттер событий
 */
export default class Bus {
  listeners : Map<string, callback | null>
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
  on(event: string, callback: callback): void { // подписываемся на событие
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
      /* eslint-disable @typescript-eslint/no-unsafe-argument */
      callback(...data);
    }
  }
}

