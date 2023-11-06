export interface ProdVariants {
    id: number;
    is_default: 0 | 1;
    variants: number[];
    product_id: string;
    price: string;
    high_price: string;
    gallery: string[];
    name: string;
    image_url: string;
    content: string;
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