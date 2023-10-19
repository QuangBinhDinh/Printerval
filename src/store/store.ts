import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { api, domainApi } from '@api/service';
const Store = configureStore({
    reducer: rootReducer,
    middleware: gDM => gDM().concat(api.middleware).concat(domainApi.middleware),
});
export default Store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
