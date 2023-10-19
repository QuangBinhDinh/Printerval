import { createSlice } from '@reduxjs/toolkit';

interface Auth {
    token: string | null;
    userInfo: any | null;
    logged: boolean;
    logging: boolean;
}

const initialState: Auth = {
    token: null,
    userInfo: null,
    logged: false,
    logging: false,
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogging: (state, action) => {
            state.logging = action.payload;
        },
    },
});

export default auth;
