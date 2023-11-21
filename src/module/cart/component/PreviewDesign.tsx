import React, { memo, useEffect, useState, useMemo } from 'react';
import { InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@util/index';
import { TextNormal, TextSemiBold } from '@components/text';
import EventEmitter from '../../../EventEmitter';
import { useGetPreviewDesignMutation, useUpdateCartConfigMutation } from '../service';
import { lightColor } from '@styles/color';
import FastImage from 'react-native-fast-image';
import { Nullable } from '@type/base';
import { CartItem } from '@type/common';
import { useAppSelector } from '@store/hook';
import FancyButton from '@components/FancyButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { navigate } from '@navigation/service';

interface IProps {
    cartList: Nullable<CartItem[]>;
}

const EVENT_NAME = 'open_preview_design';

const policySelector = createSelector(
    (state: RootState) => state.posts.policyPost,
    policy => policy.find(i => i.id == 772),
);

const PreviewDesign = ({ cartList }: IProps) => {
    const insets = useSafeAreaInsets();
    const { design_fee, design_include_fee } = useAppSelector(state => state.cart.paymentConfig);
    const [fetchDesign] = useGetPreviewDesignMutation();
    const [updateConfig] = useUpdateCartConfigMutation();

    // Id list dùng để lấy preview design
    const idList = useMemo(() => {
        if (!cartList) return null;
        return cartList
            .filter(i => i.is_custom_design == 0 && i.is_valid_buy_design == 1)
            .map(i => ({ product_id: i.product_id, product_sku_id: i.product_sku_id }));
    }, [cartList]);
    //lọc ảnh design theo productId
    const [idSelect, setSelected] = useState(-1);

    const [visible, setVisible] = useState(false);
    const [designList, setList] = useState<{ product_id: number; design_url: string }[]>([]);

    const onClose = () => {
        setVisible(false);
    };

    const toDesignPolicy = () => {
        setVisible(false);
        InteractionManager.runAfterInteractions(() => {
            navigate('BlogScreen', { postId: 772 }, 772);
        });
    };

    const onPressBuyDesign = () => {
        var item = cartList ? cartList.find(i => i.product_id == idSelect) : null;
        if (item) {
            var new_fee = item.is_include_design_fee ? design_fee + design_include_fee : design_fee;

            var config = item.configurations ? JSON.parse(item.configurations) : {};
            config.buy_design = 1;
            config.design_fee = new_fee;
            updateConfig({ id: item.id, quantity: item.quantity, configurations: JSON.stringify(config) });

            setVisible(false);
        }
    };

    const open = (productId: number) => {
        setVisible(true);
        setSelected(productId);
    };
    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, open);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, open);
        };
    }, []);

    useEffect(() => {
        const getPreviewDesign = async () => {
            if (idList && idList.length > 0) {
                var result = await fetchDesign(idList).unwrap();
                console.log('Design', result);
                setList(result);
            }
        };

        getPreviewDesign();
    }, [idList]);
    return (
        <Modal
            useNativeDriverForBackdrop
            useNativeDriver
            hideModalContentWhileAnimating
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={[styles.container, { paddingBottom: 16 + insets.bottom / 3 }]}>
                <TextNormal style={{ lineHeight: 21, width: '95%' }}>
                    You will receive the link to download the original design file of this item within 24 hours
                </TextNormal>
                <Pressable hitSlop={10} onPress={toDesignPolicy} style={{ width: '95%', marginTop: 2 }}>
                    <TextNormal style={{ lineHeight: 21 }}>
                        See more at our{' '}
                        <TextNormal style={{ lineHeight: 21, color: lightColor.secondary }}>
                            Sell Design Policy
                        </TextNormal>
                    </TextNormal>
                </Pressable>
                <FastImage
                    style={styles.img}
                    source={{ uri: designList.find(i => i.product_id == idSelect)?.design_url }}
                    resizeMode="cover"
                />

                <FancyButton style={styles.button} onPress={onPressBuyDesign} backgroundColor={lightColor.secondary}>
                    <TextSemiBold style={{ color: 'white' }}>Buy design</TextSemiBold>
                </FancyButton>
            </View>
        </Modal>
    );
};

export default memo(PreviewDesign);

/**
 * Show ảnh design (nếu có) của 1 product trong cart
 * @param productId
 */
export const showDesign = (productId: number) => {
    EventEmitter.dispatch(EVENT_NAME, productId);
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        paddingTop: 20,
        paddingBottom: 16,
        overflow: 'hidden',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    img: {
        width: '95%',
        aspectRatio: 1,
        borderRadius: 6,
        backgroundColor: lightColor.lightbg,
        marginTop: 16,
    },
    button: {
        height: 48,
        width: '95%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
        marginTop: 16,
    },
});
