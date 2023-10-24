import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
    valid_timestamp: number | null;
    categoryTree: any[];
}
const initialState: Category = {
    valid_timestamp: null,
    categoryTree: [],
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
    },
});
export default category;
