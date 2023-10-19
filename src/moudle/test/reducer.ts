import { createSlice } from '@reduxjs/toolkit';

interface Search {
    recentSearch: string[];
    productVisit: string[];
}

const initialState: Search = {
    recentSearch: [],
    productVisit: [],
};

const search = createSlice({
    name: 'search',
    initialState,
    reducers: {},
});

export default search;
