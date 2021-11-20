export type categoryList = {
    name: string;
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
    id: string;
}

export type args = {
    url: string;
    body: Object | null;
}

export type route = {
    regExp: RegExp;
    handler: Function;
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
    is_new: boolean;
    category: string;
    publisher_id: number;
    latitude: number;
    longitude: number
}

export type salesman = {
    name:string;
    surname: string;
    image: string;
    date: string;
    id: string;
    created_at: string;
}

export type cart = {
    advert_id: number;
}