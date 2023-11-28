import { createSlice } from '@reduxjs/toolkit';
import { BillingAddress, CartItem, ShipInfo, ShippingAddress } from '@type/common';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '@api/service';
import { cartEndpoints } from './service';
import { userDomain } from '@user/service';
import { checkoutEndpoint } from '@checkout/service';
import moment from 'moment';
import { sumBy } from 'lodash';
import { authDomain } from '@auth/service';

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

    /**
     * Shipping address được sử dụng để checkout
     */
    defaultAddress: ShippingAddress | null;

    /**
     * 1 số info khác khi checkout
     */
    additionalInfo: {
        email: string;
        delivery_note: string;
    };

    billAddress: BillingAddress | null;

    /**
     * Thông tin người được tặng quà
     */
    giftInfo: {
        name: string;
        phone: string;
    };

    /**
     * Thông tin liên quan đến payment (phí ship, etc )
     */
    paymentConfig: PaymentConfig;

    rawShipping: ShipInfo[];

    transfromShipping: ShipInfo[];

    /**
     * Index option shipping đang được chọn
     */
    shippingConfigIndex: number[];

    /**
     * Thông tin mã giảm giá
     */
    promotion: {
        promotion_code: string;
        discount: number;
    };

    shippingFee: number;

    /**
     * Số tiền tip
     *
     * LƯU Ý: có 2 loại tip là tip theo percent và tips cộng thẳng !!
     */
    tipsAmount: {
        amount: number;

        isPercent: boolean;
    };
}

const initialState: Cart = {
    items: [],

    cart_sub_total: 0,

    defaultAddress: null,

    giftInfo: {
        name: '',
        phone: '',
    },

    billAddress: null,

    paymentConfig: null,

    additionalInfo: {
        email: '',
        delivery_note: '',
    },

    rawShipping: [],

    transfromShipping: [],

    shippingConfigIndex: [],

    promotion: {
        promotion_code: '',
        discount: 0,
    },

    shippingFee: 0,

    tipsAmount: {
        amount: 0,
        isPercent: false,
    },
};

const cart = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: state => {
            state.items = [];
            state.cart_sub_total = 0;
            state.defaultAddress = null;
            state.billAddress = null;
            state.giftInfo = initialState.giftInfo;
            state.rawShipping = [];
            state.transfromShipping = [];
            state.promotion = initialState.promotion;
            state.tipsAmount = initialState.tipsAmount;
            state.shippingFee = 0;
            state.shippingConfigIndex = [];
            state.additionalInfo.delivery_note = '';
        },
        resetCartAfterCheckout: state => {
            state.items = [];
            state.cart_sub_total = 0;
            // state.defaultAddress = null;
            // state.billAddress = null;
            state.giftInfo = initialState.giftInfo;
            state.rawShipping = [];
            state.transfromShipping = [];
            state.promotion = initialState.promotion;
            state.tipsAmount = initialState.tipsAmount;
            state.shippingFee = 0;
            state.shippingConfigIndex = [];
            state.additionalInfo.delivery_note = '';
        },

        setDefaultAddress: (state, { payload }: PayloadAction<ShippingAddress>) => {
            state.defaultAddress = payload;
        },

        setCheckoutAddress: (
            state,
            {
                payload,
            }: PayloadAction<{
                address: ShippingAddress;
                additional: { email: string; delivery_note: string };
                giftInfo?: { name: string; phone: string };
            }>,
        ) => {
            state.defaultAddress = payload.address;
            state.additionalInfo = payload.additional;
            if (payload.giftInfo) {
                state.giftInfo = payload.giftInfo;
            }
        },

        setBillAddress: (state, { payload }: PayloadAction<BillingAddress>) => {
            state.billAddress = payload;
        },

        setShippingOption: (state, { payload }: PayloadAction<{ index: number; newValue: number }>) => {
            const { index, newValue } = payload;

            //mảng option shipping mới ,lưu trữ các index đang đc chọn
            var newConfig = state.shippingConfigIndex.map((item, i) => (i == index ? newValue : item));

            var new_shipping_fee = state.transfromShipping.reduce(
                (prev, next, index) => prev + next.shipping_info[newConfig[index]].shipping_fee,
                0,
            );

            state.shippingConfigIndex = newConfig;
            state.shippingFee = new_shipping_fee;
        },

        setTipsAmount: (state, { payload }: PayloadAction<{ value: number; percent: boolean }>) => {
            var newTips = {
                amount: payload.value,
                isPercent: payload.percent,
            };
            state.tipsAmount = newTips;
        },

        setPromotion: (state, { payload }: PayloadAction<{ promotion_code: string; discount: number }>) => {
            state.promotion = payload;
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

        builder.addMatcher(checkoutEndpoint.fetchCartCheckout.matchFulfilled, (state, { payload }) => {
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

        builder.addMatcher(checkoutEndpoint.fetchShippingInfo.matchFulfilled, (state, { payload }) => {
            const curDate = new Date();

            var apply_config_ids = Object.keys(payload[0].shipping_info[0].apply_config_item).map(num => Number(num));

            //format lại thời gian dự kiến của từng loại shipping
            var new_ship_info = payload.map(item => {
                var id_list = item.cart_item_id;
                var new_cart = state.items.filter(i => id_list.includes(i.id));

                var shipping_options = item.shipping_info.map(info => {
                    var firstDate = moment(curDate).add(info.shipping_min_time, 'd').format('MMM. D');
                    var secondDate = moment(curDate).add(info.shipping_max_time, 'd').format('MMM. D');
                    return {
                        ...info,
                        title: info.name_shipping + ' shipping from ' + info.location,
                        min_date: firstDate,
                        max_date: secondDate,
                    };
                });
                return { ...item, cart_list: new_cart, shipping_info: shipping_options };
            });

            var transformed = buildNewShipping(apply_config_ids, new_ship_info);

            //tính tổng phí ship dựa vào option shipping đầu tiên của từng đơn
            var shipping_fee = sumBy(transformed, item => item.shipping_info[0].shipping_fee);

            state.rawShipping = new_ship_info;
            state.transfromShipping = transformed;
            state.shippingConfigIndex = new Array<number>(new_ship_info.length).fill(0);
            state.shippingFee = shipping_fee;
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
        //nếu không thoả mãn vẫn giữ nguyên address lưu ở cache
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

        //email mặc định khi checkout là email của user!
        builder.addMatcher(authDomain.postLogin.matchFulfilled, (state, { payload }) => {
            state.additionalInfo = {
                email: payload.customer.email,
                delivery_note: '',
            };
        });
        builder.addMatcher(authDomain.postLoginSocial.matchFulfilled, (state, { payload }) => {
            state.additionalInfo = {
                email: payload.customer.email,
                delivery_note: '',
            };
        });
    },
});

export default cart;

/**
 * Build lại phí ship của shipping info
 * @param config_item_id list id shipping option (list key của apply_config_item)
 * @param old_shipping shipping info trả về từ api
 * @returns
 */
export const buildNewShipping = (config_item_id: number[], old_shipping: ShipInfo[]) => {
    var new_shipping = old_shipping.map((item, index) => {
        if (index == 0) return item;

        var shipping_info = item.shipping_info.map(method => {
            let new_shipping_fee = method.shipping_fee;
            for (const [key, applyItem] of Object.entries(method.apply_config_item)) {
                if (config_item_id.includes(Number(key))) {
                    new_shipping_fee =
                        new_shipping_fee -
                        Number.parseFloat(applyItem.default_shipping_fee) +
                        Number.parseFloat(applyItem.default_adding_item); // thay đổi giá ship
                }
            }
            return { ...method, shipping_fee: new_shipping_fee };
        });
        return {
            ...item,
            shipping_info,
        };
    });

    return new_shipping;
};
