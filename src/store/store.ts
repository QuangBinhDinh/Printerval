import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { api, domainApi } from '@api/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['category'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
    reducer: persistedReducer,
    middleware: gDM => gDM().concat(api.middleware).concat(domainApi.middleware),
});
export default Store;

export const persistor = persistStore(Store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
