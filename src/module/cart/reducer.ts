import { createSlice } from '@reduxjs/toolkit';
import { CartItem, ShippingAddress } from '@type/common';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '@api/service';
import { cartEndpoints } from './service';
import { userDomain } from '@user/service';

interface PaymentConfig {
    public_key: string;
    test_public_key: string;

    stripe_fee_percent: number;
    paypal_fee_percent: number;

    design_fee: number;
    design_include_fee: number;
}

interface Cart {
    items: CartItem[];

    cart_sub_total: number;

    defaultAddress: ShippingAddress | null;

    paymentConfig: PaymentConfig;
}

const initialState: Cart = {
    items: [],

    cart_sub_total: 0,

    defaultAddress: null,

    paymentConfig: null,
};

const cart = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: state => {
            state.items = [];
            state.cart_sub_total = 0;
        },

        setDefaultAddress: (state, { payload }: PayloadAction<ShippingAddress>) => {
            state.defaultAddress = payload;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(cartEndpoints.fetchCart.matchFulfilled, (state, { payload }) => {
            state.items = payload.items;

            if (payload.items.length >= 0 && !!state.paymentConfig) {
                var new_sub_total = payload.items.reduce((prev, next) => {
                    let design_fee = 0;
                    if (next.configurations?.includes('buy_design')) {
                        design_fee += state.paymentConfig.design_fee;
                        if (next.is_include_design_fee) design_fee += state.paymentConfig.design_include_fee;
                    }
                    return prev + next.price * next.quantity + design_fee;
                }, 0);

                state.cart_sub_total = new_sub_total;
            }
        });

        //set thông tin payment config
        builder.addMatcher(api.endpoints.fetchPaymentConfig.matchFulfilled, (state, { payload }) => {
            const { stripe, paypal, sa } = payload;
            var configData: PaymentConfig = {
                public_key: stripe.public_key,
                test_public_key: stripe.test_public_key,
                stripe_fee_percent: stripe.include_fee / 100,
                paypal_fee_percent: paypal.include_fee / 100,
                design_fee: Number(sa.design_fee),
                design_include_fee: Number(sa.design_include_fee),
            };
            state.paymentConfig = configData;
        });

        //set default address nếu chưa có, hoặc có nhưng trong addressBook không có address này
        builder.addMatcher(userDomain.fetchAddressFirstTime.matchFulfilled, (state, { payload }) => {
            if (payload.length > 0) {
                if (
                    !state.defaultAddress ||
                    (!!state.defaultAddress && !payload.find(item => item.id == state.defaultAddress?.id))
                ) {
                    state.defaultAddress = payload[0];
                }
            } else {
                state.defaultAddress = null;
            }
        });
    },
});

export default cart;
