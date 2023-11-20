import { TextNormal, TextSemiBold } from '@components/text';
import { useFetchProductInfoQuery } from '@product/service';
import { lightColor } from '@styles/color';
import { cdnImageV2 } from '@util/cdnV2';
import { SCREEN_HEIGHT, SCREEN_WIDTH, formatPrice } from '@util/index';
import he from 'he';
import React, { memo, useMemo, useState } from 'react';
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
import { increaseQtyLocal } from '../CartItemCard';

interface IProps {
    prodEdit: CartItem;

    setProduct: any;

    refreshQty: () => void;
}

const ProductEditModal = ({ prodEdit, setProduct }: IProps) => {
    const insets = useSafeAreaInsets();
    const invalidPrintBack = useAppSelector(state => state.config.invalidPrintBack);

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
        prodNoVariant,
        colIndex,
    } = useVariant(prodEdit.product_id, '', prodEdit.product_sku_id);

    const { product } = result || {};

    const prodImg = gallery ? gallery[0] : prodEdit.image_url;

    //có hiển thị option print location không
    const showPrint = useMemo(() => {
        if (!result || !invalidPrintBack) return false;

        let pass = false;
        let isInvalidPrintBack = false;
        let isShirt = false;
        const prod = result.product;
        const category = result.category;

        var jsonBreadcrumb = JSON.parse(category.breadcrumb);
        var filter = jsonBreadcrumb.filter((item: any) => item.id == 6);
        if (filter.length > 0) {
            isShirt = true;
        }
        if (invalidPrintBack.includes(category.id.toString())) {
            isInvalidPrintBack = true;
        }
        if (
            isShirt &&
            !isInvalidPrintBack &&
            !prod.attributes.multiple_design &&
            !prod.attributes.double_sided &&
            !prod.attributes.is_custom_design
        ) {
            pass = true;
        }

        return pass;
    }, [result, invalidPrintBack]);

    const initialPrint = JSON.parse(prodEdit.configurations)?.print_location || 'front';
    const [printLocation, setLocation] = useState<'front' | 'back'>(initialPrint);

    //object chỉ gồm custom field
    const customObject = useMemo(() => {
        if (!prodEdit.configurations) return null;
        var obj: DynamicObject = JSON.parse(prodEdit.configurations);
        var config = Object.entries(obj).reduce((prev: DynamicObject, [key, value]) => {
            if (['number', 'string'].includes(typeof value)) prev[key] = value;
            return prev;
        }, {});
        delete config.buy_design;
        delete config.design_fee;
        delete config.previewUrl;
        delete config.print_location;
        return config;
    }, [prodEdit]);

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
        if (prodEdit.configurations) {
            //giữ nguyên config nếu có
            var obj: DynamicObject = JSON.parse(prodEdit.configurations);
            //tạo object mới chỉ gồm các custom field
            var config = Object.entries(obj).reduce((prev: DynamicObject, [key, value]) => {
                if (['number', 'string'].includes(typeof value)) prev[key] = value;
                return prev;
            }, {});
            if (showPrint) config.print_location = printLocation;
            if (Object.keys(config).length > 0) params.configurations = JSON.stringify(config);
        }

        //DANGER: refresh lại qty (+1) trong trường hợp thêm sp giống y hệt ban đầu
        if (detailSelectVar?.id == prodEdit.product_sku_id && printLocation == initialPrint) {
            //call đến function đã đc export ở component CartItemCard
            increaseQtyLocal(prodEdit.id);
            onCloseWithMessage('Item is added to cart');
        } else {
            try {
                var res = await addCart(params).unwrap();
                if (res.status == 'successful') {
                    onCloseWithMessage('Item is added to cart');
                }
            } catch (e) {
                console.log(e);
                onCloseWithMessage('Something went wrong');
            }
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
            if (showPrint) config.print_location = printLocation;
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

    const CustomView = () => {
        if (customObject) {
            return (
                <View style={{ marginTop: 12, paddingHorizontal: 18 }}>
                    {Object.entries(customObject).map(([title, value]) => {
                        return (
                            <TextNormal key={title} style={{ marginTop: 12, lineHeight: 20 }}>
                                <TextSemiBold style={{ fontSize: 15, color: '#444' }}>{title}: </TextSemiBold>
                                {value}
                            </TextNormal>
                        );
                    })}
                </View>
            );
        }
        return null;
    };

    const BottomView = () => {
        if (prodNoVariant)
            return (
                <View
                    style={[
                        styles.bottom,
                        { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2, justifyContent: 'center' },
                        shadowTop,
                    ]}
                >
                    <Pressable style={styles.buttonSumbit} onPress={onClose}>
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>OK</TextSemiBold>
                    </Pressable>
                </View>
            );
        return (
            <View
                style={[styles.bottom, { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 }, shadowTop]}
            >
                <Pressable style={styles.buttonSumbit} onPress={changeProduct}>
                    {isDeleting || isAdding ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Update Item</TextSemiBold>
                    )}
                </Pressable>
                <Pressable style={[styles.buttonSumbit, { backgroundColor: 'white' }]} onPress={addNewProduct}>
                    {isAdding ? (
                        <ActivityIndicator size="small" color={lightColor.secondary} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: lightColor.secondary }}>Add Item</TextSemiBold>
                    )}
                </Pressable>
            </View>
        );
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
                                <View style={{ flex: 1, paddingLeft: 16 }}>
                                    <TextNormal
                                        style={{ fontSize: 13, lineHeight: 17, color: lightColor.primary }}
                                        numberOfLines={2}
                                    >
                                        {he.decode(product?.name || '')}
                                    </TextNormal>
                                    <TextNormal style={styles.price}>
                                        {formatPrice(detailSelectVar?.price || prodEdit.price || '')}{' '}
                                        <TextNormal style={styles.oldPrice}>
                                            {formatPrice(detailSelectVar?.high_price || prodEdit.high_price || '')}
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

                            {showPrint && (
                                <>
                                    <TextSemiBold style={{ marginLeft: 18, marginTop: 16, color: '#444' }}>
                                        Print Location
                                    </TextSemiBold>
                                    <View style={styles.printContainer}>
                                        <Pressable
                                            style={[
                                                styles.optionFront,
                                                printLocation == 'front' && styles.optionSelected,
                                            ]}
                                            onPress={() => setLocation('front')}
                                        >
                                            <TextNormal
                                                style={[styles.text, printLocation == 'front' && styles.textSelected]}
                                            >
                                                Front
                                            </TextNormal>
                                        </Pressable>
                                        <View
                                            style={{ width: 1, backgroundColor: lightColor.secondary, height: '100%' }}
                                        ></View>
                                        <Pressable
                                            style={[
                                                styles.optionBack,
                                                printLocation == 'back' && styles.optionSelected,
                                            ]}
                                            onPress={() => setLocation('back')}
                                        >
                                            <TextNormal
                                                style={[styles.text, printLocation == 'back' && styles.textSelected]}
                                            >
                                                Back
                                            </TextNormal>
                                        </Pressable>
                                    </View>
                                </>
                            )}

                            <CustomView />
                            <View style={{ height: 140 }} />
                        </ScrollView>
                        <BottomView />
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
        marginTop: 4,
    },
    oldPrice: { fontSize: 13, color: lightColor.grayout, textDecorationLine: 'line-through' },
    text: {
        fontSize: 15,
        marginTop: 2,
    },
    textSelected: { color: lightColor.secondary },
    printContainer: {
        height: 40,
        width: 150,
        flexDirection: 'row',
        marginLeft: 18,
        marginTop: 4,
    },
    optionFront: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,

        borderColor: lightColor.borderGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
    },
    optionBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,

        borderColor: lightColor.borderGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    optionSelected: {
        borderColor: lightColor.secondary,
    },

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
