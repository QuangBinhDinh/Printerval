import { TextNormal, TextSemiBold } from '@components/text';
import { useFetchProductInfoQuery } from '@product/service';
import { lightColor } from '@styles/color';
import { cdnImageV2 } from '@util/cdnV2';
import { SCREEN_HEIGHT, SCREEN_WIDTH, formatPrice } from '@util/index';
import he from 'he';
import React, { memo, useState } from 'react';
import { ActivityIndicator, InteractionManager, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import LoadingEdit from './LoadingEdit';
import { useVariant } from '@product/hook/useVariant';
import VariantSection from '@product/component/VariantSection';
import { CartItem } from '@type/common';
import { useAddToCartMutation, useRemoveCartItemMutation, useRemoveCartV2Mutation } from '../../service';
import { AddToCartBody } from '../../type';
import { useAppSelector } from '@store/hook';
import { DynamicObject } from '@type/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadowTop } from '@styles/shadow';
import { showMessage } from '@components/popup/BottomMessage';
import InvisibleLoad from '@components/loading/InvisibleLoad';

interface IProps {
    prodEdit: CartItem;

    setProduct: any;
}

const ProductEditModal = ({ prodEdit, setProduct }: IProps) => {
    const insets = useSafeAreaInsets();

    const [addCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [deleteCart, { isLoading: isDeleting }] = useRemoveCartV2Mutation();
    const { userInfo, token } = useAppSelector(state => state.auth);

    const [visible, setVisible] = useState(true);

    const { data: { result } = {}, isLoading } = useFetchProductInfoQuery(prodEdit.product_id);
    const {
        mappings,
        selectedVariant,
        displayOption,
        setSelectedTuple,
        variantPrice,
        gallery,
        variantReady,
        detailSelectVar,
        colIndex,
    } = useVariant(prodEdit.product_id, '', prodEdit.product_sku_id);

    // console.log('Display option', displayOption);
    // console.log('Detail var', detailSelectVar);

    const { product } = result || {};

    const prodImg = gallery ? gallery[0] : prodEdit.image_url;

    const onClose = () => {
        setVisible(false);
        InteractionManager.runAfterInteractions(() => {
            setProduct(null);
        });
    };

    const onCloseWithMessage = (msg: string) => {
        setVisible(false);
        InteractionManager.runAfterInteractions(() => {
            showMessage(msg);
            setProduct(null);
        });
    };

    const addNewProduct = async () => {
        if (!detailSelectVar || !userInfo) return;

        var params: AddToCartBody = {
            productId: prodEdit.product_id,
            productSkuId: detailSelectVar.id != -1 ? detailSelectVar.id : '',
            customerToken: token,
            customerId: userInfo.id,
            quantity: 1,
        };
        try {
            var res = await addCart(params).unwrap();
            if (res.status == 'successful') {
                onCloseWithMessage('Item is added to cart');
            }
        } catch (e) {
            console.log(e);
            onCloseWithMessage('Something went wrong');
        }
    };

    const changeProduct = async () => {
        if (!detailSelectVar || !userInfo) return;

        var params: AddToCartBody = {
            productId: prodEdit.product_id,
            productSkuId: detailSelectVar.id != -1 ? detailSelectVar.id : '',
            customerToken: token,
            customerId: userInfo.id,
            quantity: prodEdit.quantity,
        };
        if (prodEdit.configurations) {
            //giữ nguyên config nếu có
            var obj: DynamicObject = JSON.parse(prodEdit.configurations);
            //tạo object mới chỉ gồm các custom field
            var config = Object.entries(obj).reduce((prev: DynamicObject, [key, value]) => {
                if (['number', 'string'].includes(typeof value)) prev[key] = value;
                return prev;
            }, {});
            if (Object.keys(config).length > 0) params.configurations = JSON.stringify(config);
        }
        try {
            var res1 = await deleteCart(prodEdit.id).unwrap();
            var res2 = await addCart(params).unwrap();
            if (res2.status == 'successful') {
                onCloseWithMessage('Item is changed');
            }
        } catch (e) {
            onCloseWithMessage('Something went wrong');
        }
    };
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
            <View style={styles.container}>
                <InvisibleLoad visible={isAdding || isDeleting} />

                {isLoading || !variantReady ? (
                    <LoadingEdit />
                ) : (
                    <>
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                            <View style={styles.productContainer}>
                                <FastImage style={styles.productImg} source={{ uri: cdnImageV2(prodImg, 540, 540) }} />
                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                    <TextNormal
                                        style={{ fontSize: 15, lineHeight: 20, color: lightColor.primary }}
                                        numberOfLines={2}
                                    >
                                        {he.decode(product?.name || '')}
                                    </TextNormal>
                                    <TextNormal style={styles.price}>
                                        {formatPrice(detailSelectVar?.price || '')}{' '}
                                        <TextNormal style={styles.oldPrice}>
                                            {formatPrice(detailSelectVar?.high_price || '')}
                                        </TextNormal>
                                    </TextNormal>
                                </View>
                            </View>

                            <VariantSection
                                detailVariant={detailSelectVar}
                                changeValue={setSelectedTuple}
                                options={displayOption}
                                selected={selectedVariant}
                                variantPrice={variantPrice}
                                mappings={mappings}
                                colIndex={colIndex}
                                isEdit
                            />
                            <View style={{ height: 140 }} />
                        </ScrollView>

                        <View
                            style={[
                                styles.bottom,
                                { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                                shadowTop,
                            ]}
                        >
                            <Pressable style={styles.buttonSumbit} onPress={changeProduct}>
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Update Item</TextSemiBold>
                                )}
                            </Pressable>
                            <Pressable
                                style={[styles.buttonSumbit, { backgroundColor: 'white' }]}
                                onPress={addNewProduct}
                            >
                                {isAdding ? (
                                    <ActivityIndicator size="small" color={lightColor.secondary} />
                                ) : (
                                    <TextSemiBold style={{ fontSize: 15, color: lightColor.secondary }}>
                                        Add Item
                                    </TextSemiBold>
                                )}
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
        </Modal>
    );
};

export default memo(ProductEditModal);

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.75,
        overflow: 'hidden',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'white',
    },

    productContainer: {
        flexDirection: 'row',
        marginTop: 16,
        paddingHorizontal: 18,
        width: '100%',
        backgroundColor: 'white',
    },
    productImg: {
        width: 120,
        height: 120,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: lightColor.lightbg,
    },
    price: {
        color: lightColor.price,
        fontSize: 15,
        marginTop: 2,
    },
    oldPrice: { fontSize: 13, color: lightColor.grayout, textDecorationLine: 'line-through' },

    bottom: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    buttonSumbit: {
        height: 48,
        width: '47%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: lightColor.secondary,
        backgroundColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
