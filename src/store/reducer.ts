import { combineReducers } from '@reduxjs/toolkit';
import auth from '../module/auth/reducer';
import search from '../module/test/reducer';
import category from '@category/reducer';
import { api, domainApi, globalApi } from '@api/service';
import config from './configReducer';
import posts from './postReducer';
import cart from '@cart/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import persistReducer from 'redux-persist/es/persistReducer';

//lưu defaultAddress khi checkout vào storage

const cartPersistConfig = {
    key: 'cart',
    storage: AsyncStorage,
    whitelist: ['defaultAddress'],
};
export const rootReducer = combineReducers({
    auth: auth.reducer,
    search: search.reducer,
    category: category.reducer,
    config: config.reducer,
    posts: posts.reducer,
    cart: persistReducer(cartPersistConfig, cart.reducer),
    [api.reducerPath]: api.reducer,
    [domainApi.reducerPath]: domainApi.reducer,
    [globalApi.reducerPath]: globalApi.reducer,
});
