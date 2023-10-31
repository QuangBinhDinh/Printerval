export interface Product {
    id: number;
    name: string;
    price: string;
    high_price: string;
    display_price: string;
    display_high_price: string;
    image_url: string;
    sku: string;
}

export interface User {
    id: number;
    username: string | null;
    full_name: string;
    phone: string;
    image_url: string;
    email: string;
    api_token: string;
    token: string;
    gender: string;
    status: string;
}
