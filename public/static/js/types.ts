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
    image: string;
    is_new: boolean;
    category: string;
    publisher_id: number;
    latitude: number;
    longitude: number;
    is_active: boolean;
    href: string;
    views: number;
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
    user1: number;
    user2: number;
    adv: number;
    created_at: string;
}

export type message = {
    from: number;
    to: number;
    message: string;
    created_at: string;
}