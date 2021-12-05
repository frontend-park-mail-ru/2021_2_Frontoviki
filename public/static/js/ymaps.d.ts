declare namespace ymaps {
    export function ready(): Promise;
    export function suggest(query: string): Promise;
  
    class Promise {
      then(onFulfilled?: any, onRejected?: any, onProgress?: any, ctx?: any): Promise;
    }
  
    export class Map {
      constructor(element: string | any, state: MapState);
      geoObjects: GeoObjects;
      events: GeoEvent;
      add(geObject: GeoObject);
    }
  
    export class MapState {
      center: number[];
      zoom: number;
    }

    export class GeoObject {
        constructor(type : any)
    }

    export class GeoObjects {
      add(geoObject: GeoObject);
      removeAll();
    }

    export class GeoEvent {
      add(name:string, callback: GeoCallback)
    }
    type GeoCallback = (e: ymapsEvent) => Promise<void>;
    type ymapsEvent = {
      get(name: string): number[]
    }
  }