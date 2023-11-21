import { TextNormal, TextSemiBold } from '@components/text';
import { useFetchProductInfoQuery } from '@product/service';
import { lightColor } from '@styles/color';
import { cdnImageV2 } from '@util/cdnV2';
import { SCREEN_HEIGHT, SCREEN_WIDTH, formatPrice } from '@util/index';
import he from 'he';
import React, { memo, useMemo, useState } from 'react';
import { InteractionManager, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import LoadingEdit from '@cart/component/ProductEditModal/LoadingEdit';
import { useVariant } from '@product/hook/useVariant';
import VariantSection from '@product/component/VariantSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadowTop } from '@styles/shadow';
import FancyButton from '@components/FancyButton';
import { ProdVariants, ProductTogether } from '@type/product';
import { useAppSelector } from '@store/hook';

interface IProps {
    prodEdit: ProductTogether;

    changeEdit: any;

    changeVariant: (x: ProdVariants, name: string, location: string) => void;
}

const ProductEditModal = ({ prodEdit, changeVariant, changeEdit }: IProps) => {
    const insets = useSafeAreaInsets();

    const [visible, setVisible] = useState(true);

    const [printLocation, setLocation] = useState<'front' | 'back'>(prodEdit.configuration?.print_location || 'front');

    // const { data: { result } = {}, isLoading } = useFetchProductInfoQuery(prodEdit.id);
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
        variant_name_beautify,
    } = useVariant(prodEdit.id, '', prodEdit.productSku);

    const productPrice = detailSelectVar?.price || prodEdit.price || '';
    const productOldPrice = detailSelectVar?.high_price || prodEdit.high_price || '';

    const prodImg = gallery ? gallery[0] : prodEdit.image_url;

    const onClose = () => {
        setVisible(false);
        InteractionManager.runAfterInteractions(() => {
            changeEdit(null);
        });
    };

    const submit = () => {
        if (detailSelectVar) {
            changeVariant(detailSelectVar, variant_name_beautify, printLocation);
            onClose();
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
                {!variantReady ? (
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
                                        {he.decode(prodEdit.name || '')}
                                    </TextNormal>
                                    <TextNormal style={styles.price}>
                                        {formatPrice(productPrice)}{' '}
                                        {productOldPrice != '0.00' && (
                                            <TextNormal style={styles.oldPrice}>
                                                {formatPrice(productOldPrice)}
                                            </TextNormal>
                                        )}
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

                            {prodEdit.configuration?.print_location && (
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
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        <View
                            style={[
                                styles.bottom,
                                { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                                shadowTop,
                            ]}
                        >
                            <FancyButton
                                style={styles.buttonSumbit}
                                onPress={submit}
                                backgroundColor={lightColor.secondary}
                            >
                                <TextSemiBold style={{ color: 'white' }}>Confirm</TextSemiBold>
                            </FancyButton>
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
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    buttonSumbit: {
        height: 48,
        width: '95%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
    },

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
});
