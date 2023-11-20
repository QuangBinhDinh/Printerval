import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PaymentConfig {
    public_key: string;
    test_public_key: string;

    stripe_fee_percent: number;
    paypal_fee_percent: number;

    design_fee: number;
    design_include_fee: number;
}
interface ConfigState {
    /**
     * Category ID được coi là không có option print back của sp
     */
    invalidPrintBack: number[] | null;

    paymentConfig: PaymentConfig;

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
    paymentConfig: null,
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

        setPaymentConfiguration: (state, action: PayloadAction<PaymentConfig>) => {
            state.paymentConfig = action.payload;
        },
    },
});

export default config;
