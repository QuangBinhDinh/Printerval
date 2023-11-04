import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@type/common';

interface Auth {
    /**
     * Thông tin user
     */
    userInfo: User | null;

    logged: boolean;
    logging: boolean;

    /**
     * Dùng làm header 1 số request về user
     */
    accessToken: string | null;

    /**
     * Token dùng để addToCart, payment, show product history
     */
    token: string;
}

const initialState: Auth = {
    userInfo: null,
    logged: false,
    logging: false,
    accessToken: null,

    token: '',
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCustomerToken: (state, action) => {
            state.token = action.payload;
        },
        setLogging: (state, action) => {
            state.logging = action.payload;
        },
        setNewUser: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.userInfo = action.payload.user;
            state.logged = true;
            state.logging = false;
        },
        logout: () => initialState,
    },
});

export default auth;
