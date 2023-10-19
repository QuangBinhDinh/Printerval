import { combineReducers } from '@reduxjs/toolkit';
import auth from '../moudle/auth/reducer';
import search from '../moudle/test/reducer';
import { api, domainApi } from '@api/service';

export const rootReducer = combineReducers({
    auth: auth.reducer,
    search: search.reducer,
    [api.reducerPath]: api.reducer,
    [domainApi.reducerPath]: domainApi.reducer,
});
