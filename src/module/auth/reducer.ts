import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product, ShippingAddress, User } from '@type/common';
import { userDomain } from '@user/service';

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

    addressBook: ShippingAddress[];

    wishlist: Product[];
}

const initialState: Auth = {
    userInfo: null,
    logged: false,
    logging: false,
    accessToken: null,

    token: '',

    addressBook: [],

    wishlist: [],
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
        setNewUser: (state, action: PayloadAction<{ user: User; accessToken: string; token?: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.userInfo = action.payload.user;
            state.logged = true;
            state.logging = false;
            if (action.payload.token) state.token = action.payload.token;
        },
        logout: () => initialState,
    },
    extraReducers: builder => {
        builder.addMatcher(userDomain.fetchAddressFirstTime.matchFulfilled, (state, { payload }) => {
            state.addressBook = payload;
        });
        builder.addMatcher(userDomain.fetchAddressBook.matchFulfilled, (state, { payload }) => {
            state.addressBook = payload;
        });
    },
});

export default auth;
