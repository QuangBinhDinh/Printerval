import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface User {
    id: number;
    username: string | null;
    full_name: string;
    phone: string;
    image_url: string;
    email: string;
    api_token: string;
    token: string;
    gender: string;
    status: string;
}
interface Auth {
    userInfo: User | null;
    logged: boolean;
    logging: boolean;
    accessToken: string | null;
}

const initialState: Auth = {
    userInfo: null,
    logged: false,
    logging: false,
    accessToken: null,
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
