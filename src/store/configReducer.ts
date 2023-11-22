import { api } from '@api/service';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Country } from '@type/common';

interface ConfigState {
    /**
     * Category ID được coi là không có option print back của sp
     */
    invalidPrintBack: number[] | null;

    appRating: {
        rate: number;
        rateCount: number;
    };

    countries: Country[];
}
const initialState: ConfigState = {
    invalidPrintBack: null,
    // networkErr: null,
    appRating: {
        rate: 0,
        rateCount: 0,
    },
    countries: [],
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
    extraReducers: builder => {
        builder.addMatcher(api.endpoints.fetchCountries.matchFulfilled, (state, { payload }) => {
            state.countries = payload.map(item => ({
                ...item,
                value: item.nicename,
                provinces: item.provinces.map(i => ({ ...i, value: i.name })),
            }));
        });
    },
});

export default config;
