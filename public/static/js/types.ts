export type categoryList = {
    name: string;
}

export type card = {
    image: string;
    name: string;
    location: string;
    price: string;
    canDelete: boolean;
    canBuy: boolean;
}

export type args = {
    url: string;
    body: Object | null;
}

export type route = {
    regExp: RegExp;
    handler: Function;
}