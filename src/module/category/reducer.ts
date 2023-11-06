import { MAX_SEARCH_HISTORY } from '@constant/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@type/common';
import { uniq, uniqBy } from 'lodash';

interface Category {
    valid_timestamp: number | null;

    /**
     * Cây category , bao gồm sub category
     */
    categoryTree: any[];

    /**
     * Lịch sử search
     */
    searchHistory: string[];

    /**
     * Lịch sử sp đã xem
     */
    productHistory: Partial<Product>[];
}
const initialState: Category = {
    valid_timestamp: null,
    categoryTree: [],
    searchHistory: [],
    productHistory: [],
};

/**
 * Kết hợp action với reducer làm một reducer
 */
const category = createSlice({
    name: 'category',
    initialState,
    reducers: {
        //define cac action

        setCategoryTree: (state, action: PayloadAction<{ tree: any[]; timestamp: number }>) => {
            state.categoryTree = action.payload.tree;
            state.valid_timestamp = action.payload.timestamp;
        },
        setHistory: (state, action: PayloadAction<string>) => {
            var tempArr = [...state.searchHistory];
            tempArr.unshift(action.payload);
            state.searchHistory = uniq(tempArr).slice(0, MAX_SEARCH_HISTORY);
        },

        setProdHistory: (state, action: PayloadAction<Partial<Product>>) => {
            var tempProd = [...state.productHistory];
            tempProd.unshift(action.payload);
            state.productHistory = uniqBy(tempProd, i => i.id).slice(0, MAX_SEARCH_HISTORY);
        },
    },
});
export default category;
