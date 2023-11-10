import { RouteProp } from '@react-navigation/native';
import { ProductFilterArgs } from '@searchResult/service';
import { Product } from '@type/common';

type RootStackParams = {
    SubCollection: {
        parentId: number;
        title: string;
    };
    SearchResult: {
        categoryId: number;
        keyword: string;
        title: string;
        tag_id: number;
    };
    FilterScreen: {
        currentFilter: Partial<ProductFilterArgs>;
        setFilter: any;
        filter: {
            Color: { id: number; name: string; text: string }[];
            Size: { id: number; name: string; text: string }[];
            Type: { id: number; name: string; text: string }[];
        };
        priceRange: { from: number; to: number }[];
    };
    ProductScreen: {
        productId: number;
        productName: string;
    };
    LoginScreen: {
        prevScreen: string;
        onLogin: ({ token, customerId }: { token: string; customerId: number }) => void;
    };
    StyleGuide: {
        product_id: number;
        style_id: number;
        type_id: number;
    };
    CreateReview: {
        product_id: number;
    };
    ReportProduct: {
        product: Product;
    };
};

export type SubCollectionRouteProp = RouteProp<RootStackParams, 'SubCollection'>;
export type SearchResultRouteProp = RouteProp<RootStackParams, 'SearchResult'>;
export type FilterScreenRouteProp = RouteProp<RootStackParams, 'FilterScreen'>;
export type ProductScreenRouteProp = RouteProp<RootStackParams, 'ProductScreen'>;
export type LoginScreenRouteProp = RouteProp<RootStackParams, 'LoginScreen'>;
export type StyleGuideRouteProp = RouteProp<RootStackParams, 'StyleGuide'>;
export type CreateReviewRouteProp = RouteProp<RootStackParams, 'CreateReview'>;
export type ReportProductRouteProp = RouteProp<RootStackParams, 'ReportProduct'>;
