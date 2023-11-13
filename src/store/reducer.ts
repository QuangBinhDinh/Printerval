import { combineReducers } from '@reduxjs/toolkit';
import auth from '../module/auth/reducer';
import search from '../module/test/reducer';
import category from '@category/reducer';
import { api, domainApi, globalApi } from '@api/service';
import config from './configReducer';
import posts from './postReducer';

export const rootReducer = combineReducers({
    auth: auth.reducer,
    search: search.reducer,
    category: category.reducer,
    config: config.reducer,
    posts: posts.reducer,
    [api.reducerPath]: api.reducer,
    [domainApi.reducerPath]: domainApi.reducer,
    [globalApi.reducerPath]: globalApi.reducer,
});
