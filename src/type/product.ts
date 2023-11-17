import { Nullable } from './base';

export interface ProdVariants {
    id: number;
    is_default: 0 | 1;
    variants: number[];
    product_id: number;
    price: string;
    high_price: string;
    gallery: string[];
    name: string;
    image_url: string;
    content: string;
    sku: string;
}

export interface VariantsTree {
    name: string;
    slug: string;
    type: string;
    values: {
        id: number;
        name: string;
    }[];
}

export interface NewVariants {
    [x: string]: {
        id: number;
        name: string;
        variantType: string;
        variantName: string;
        price: string;
        color_code: string;
        image_url: string;
    };
}

export interface Options {
    [x: string]: number[];
}
export interface VariantPrice {
    [x: string]: string[];
}

export interface ProdDescription {
    result: string;
    seoDescription: {
        start: string;
        end: string;
        first_part_of_end: string;
        last_part_of_end: string;
    };
    category: {
        slug: string;
        name: string;
        url: string;
    };
}

export interface CustomAttribute {
    custom_design_image: Nullable<{ name: string }[]>;

    custom_design_text: Nullable<string[]>;

    custom_design_option: Nullable<{ title: string; values: string[] }[]>;
}

export interface ErrorField {
    timestamp: number;

    type: 'custom_text' | 'size' | 'custom_image';
}

export interface ProductTogether {
    id: number;
    name: string;
    image_url: string;

    quantity: number;
    display_price: string;
    display_high_price: string;
    price: string;
    high_price: string;

    productSku: number;
    variantName: string;
}
