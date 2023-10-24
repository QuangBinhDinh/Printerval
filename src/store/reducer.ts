import { combineReducers } from '@reduxjs/toolkit';
import auth from '../module/auth/reducer';
import search from '../module/test/reducer';
import category from '@category/reducer';
import { api, domainApi } from '@api/service';

export const rootReducer = combineReducers({
    auth: auth.reducer,
    search: search.reducer,
    category: category.reducer,
    [api.reducerPath]: api.reducer,
    [domainApi.reducerPath]: domainApi.reducer,
});
