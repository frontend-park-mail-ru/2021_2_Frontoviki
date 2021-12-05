export type categoryList = {
    name: string;
    href: string;
    analog: string;
}

export type card = {
    image: string;
    images: string[];
    name: string;
    location: string;
    price: string;
    canDelete: boolean;
    canBuy: boolean;
    href: string;
    id: number;
    is_active: boolean;
    buy: string;
}

export type args = {
    url: string;
    body: unknown | null;
}

export type route = {
    regExp: RegExp;
    handler: callback;
}

export type rating = {
    avg: number;
    is_rated: boolean;
    rate: number;
}

export type advert = {
    name: string;
    price: string;
    location: string;
    published_at: string;
    description: string;
    id: number;
    images: string[];
    image: string;
    is_new: boolean;
    category: string;
    publisher_id: number;
    latitude: number;
    longitude: number;
    is_active: boolean;
    href: string;
    views: number;
    categoryHref: string;
}

export type salesman = {
    email: string;
    name:string;
    surname: string;
    image: string;
    date: string;
    id: string;
    created_at: string;
    phone: string;
}

export type cart = {
    advert_id: number;
}

export type dialog = {
    id: number;
    adv_info: dialogAdvertInfo;
    created_at: string;
    name: string;
    surname: string;
}

type dialogAdvertInfo = {
    id: number;
    image: string;
    location: string;
    name: string;
    price: number;
}

export type message = {
    info: innerMessage;
    created_at: string;
    message: string;
}

type innerMessage = {
    from: number;
    to: number;
    adv: number;
}

export type templateFunc = (params?: unknown | null) => string;


export type parsedBody = {
    code: number;
    body: body;
    message: string;
}


export type body = {
    code: number;
    adverts: card[];
    salesman: salesman;
    rating: rating;
    cart: cart[];
    advert: advert;
    profile: salesman;
    categories: categoryList[];
    dialogs: dialog[];
    messages: message[];
}

export type ymapsEvent = {
    get(name: string): number[]
}

export type state = {
    url : string;
}

export type callback = (...args: any[]) => void;