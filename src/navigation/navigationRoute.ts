import { RouteProp } from '@react-navigation/native';
import { ProductFilterArgs } from '@searchResult/service';

type RootStackParams = {
    SubCollection: {
        parentId: number;
        title: string;
    };
    SearchResult: {
        categoryId: number;
        keyword: string;
        title: string;
    };
    FilterScreen: {
        currentFilter: Partial<ProductFilterArgs>;
        setFilter: any;
        filter: {
            Color: { id: number; name: string }[];
            Size: { id: number; name: string }[];
            Type: { id: number; name: string }[];
        };
        priceRange: { from: number; to: number }[];
    };
};

export type SubCollectionRouteProp = RouteProp<RootStackParams, 'SubCollection'>;
export type SearchResultRouteProp = RouteProp<RootStackParams, 'SearchResult'>;
export type FilterScreenRouteProp = RouteProp<RootStackParams, 'FilterScreen'>;
