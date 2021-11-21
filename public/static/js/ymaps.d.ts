declare namespace ymaps {
    export function ready(): Promise;
  
    class Promise {
      then(onFulfilled?: Function, onRejected?: Function, onProgress?: Function, ctx?: any): Promise;
    }
  
    export class Map {
      constructor(element: string | any, state: MapState);
      geoObjects: any;
      events: any;
    }
  
    export class MapState {
      center: number[];
      zoom: number;
    }

    export class GeoObject {
        constructor(type : any)
    }
  }