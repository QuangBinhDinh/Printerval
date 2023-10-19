import { createSlice } from '@reduxjs/toolkit';

interface Auth {
    token: string | null;
    userInfo: any | null;
    logged: boolean;
}

const initialState: Auth = {
    token: null,
    userInfo: null,
    logged: false,
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
});

export default auth;
