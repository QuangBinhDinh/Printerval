export interface Product {
    id: number;
    sku: string;
    name: string;
    price: string;
    high_price: string;
    display_price: string;
    display_high_price: string;
    image_url: string;
    rating_count: number;
    rating_value: number;
    user: Seller;
}

export interface Seller {
    id: number;
    name: string;
    email: string | null;
    image_avatar: string | null;
}

export interface ProductReview {
    id: number;
    full_name: string;
    email: string;
    title: string;
    content: string;
    target_id: number;
    status: string;
    created_at: string;
    images: string;
    rating: number;
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

export interface ResponseMeta {
    page_id: number;
    page_size: number;
    total_count: number;
    has_next: true;
}
