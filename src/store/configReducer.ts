import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
    /**
     * Category ID được coi là không có option print back của sp
     */
    invalidPrintBack: string[] | null;

    appRating: {
        rate: number;
        rateCount: number;
    };
}
const initialState: ConfigState = {
    invalidPrintBack: null,
    // networkErr: null,
    appRating: {
        rate: 0,
        rateCount: 0,
    },
};

/**
 * Kết hợp action với reducer làm một reducer
 */
const config = createSlice({
    name: 'config',
    initialState,
    reducers: {
        //define cac action
        setInvalidPrintBack: (state, action) => {
            state.invalidPrintBack = action.payload;
        },
        // setNetworkError: (state, action) => {
        //     state.networkErr = action.payload;
        // },

        setAppRating: (state, action) => {
            state.appRating = action.payload;
        },
    },
});

export default config;
