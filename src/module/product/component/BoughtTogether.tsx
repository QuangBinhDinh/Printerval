import React, { memo, useCallback, useState } from 'react';
import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';

import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import { sumBy } from 'lodash';
import FancyButton from '@components/FancyButton';
import { useAddAllToCartMutation, useLazyFetchCartQuery } from '@cart/service';
import { navigate } from '@navigation/service';
import BoughtTogetherEdit from './BoughtTogetherEdit';
import { ProdVariants, ProductTogether } from '@type/product';
import { cdnImageV2 } from '@util/cdnV2';
import { useAppSelector } from '@store/hook';
import { alertSuccess } from '@components/popup/PopupSuccess';

const BoughtTogether = ({ data, currentProd }: { data: ProductTogether[]; currentProd: ProductTogether }) => {
    const invalidPrintBack = useAppSelector(state => state.config.invalidPrintBack);
    const { userInfo, token } = useAppSelector(state => state.auth);
    const [fetchCart] = useLazyFetchCartQuery();

    const [postAll] = useAddAllToCartMutation();
    const transformData = data.map(item => {
        if (invalidPrintBack) {
            var ids = item.categories.map(i => i.id);
            if (ids.includes(6) && !ids.some(i => invalidPrintBack.includes(i))) {
                return {
                    ...item,
                    configuration: {
                        print_location: 'front',
                    },
                };
            }
        }
        return item;
    });

    //bộ ID sp mua cùng , dùng để tick chọn
    const [selected, setSelected] = useState<number[]>(transformData.map(i => i.id));

    //List config sp để gửi lên api add-all-to-cart
    const [prodList, setList] = useState<ProductTogether[]>(transformData);

    //sp đang được edit
    const [prodEdit, changeEdit] = useState<ProductTogether | null>(null);

    //thay đổi variant id của sp đang được edit
    const changeProdVariant = useCallback((item: ProdVariants, variantName: string, print_location: string) => {
        setList(prev =>
            prev.map(i => {
                if (i.id == item.product_id)
                    return {
                        ...i,
                        productSku: item.id,
                        image_url: item.gallery[0] || i.image_url,
                        price: item.price,
                        high_price: item.high_price,
                        display_price: formatPrice(item.price),
                        display_high_price: formatPrice(item.high_price),
                        variantName,
                        ...(!!i.configuration && {
                            configuration: {
                                print_location,
                            },
                        }),
                    };
                return i;
            }),
        );
    }, []);

    const selectProduct = useCallback((id: number) => {
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(i => i != id);
            return prev.concat(id);
        });
    }, []);

    //call api thêm toàn bộ sp mua cùng được chọn vào giỏ hàng
    const addAllToCart = async () => {
        if (!userInfo) return;
        var dataSend = [currentProd].concat(prodList).map(i => ({
            quantity: i.quantity,
            productId: i.id,
            productSkuId: i.productSku,
            configurations: i.configuration ? JSON.stringify(i.configuration) : '',
        }));

        try {
            var res = await postAll({
                data: dataSend,
                token,
                customerId: userInfo.id,
                productId: currentProd.id,
            }).unwrap();
            if (res.status == 'successful') {
                alertSuccess('All product is added to cart!');
                fetchCart({ token, customerId: userInfo.id });
            }
        } catch (e) {
            console.log(e);
        }
    };

    if (!data || data.length == 0) return null;
    return (
        <>
            <View style={styles.container}>
                <TextSemiBold style={styles.sectionTitle}>Frequently bought together</TextSemiBold>
                <BoughtItem item={currentProd} disable selected={selected} />
                {prodList.map(item => (
                    <BoughtItem
                        item={item}
                        key={item.id}
                        select={selectProduct}
                        selected={selected}
                        toogleEdit={changeEdit}
                    />
                ))}

                <View style={styles.addAllRow}>
                    <TextNormal>
                        Price:{'  '}
                        <TextSemiBold style={{ color: lightColor.price }}>
                            {formatPrice(
                                sumBy(
                                    data.filter(i => selected.includes(i.id)),
                                    i => Number(i.price),
                                ) + Number(currentProd?.price),
                            )}
                        </TextSemiBold>
                    </TextNormal>

                    <FancyButton style={styles.addButton} backgroundColor={lightColor.secondary} onPress={addAllToCart}>
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Add all to cart</TextSemiBold>
                    </FancyButton>
                </View>
            </View>

            {!!prodEdit && (
                <BoughtTogetherEdit prodEdit={prodEdit} changeEdit={changeEdit} changeVariant={changeProdVariant} />
            )}
        </>
    );
};

export default memo(BoughtTogether);

interface ItemProps {
    item: ProductTogether;
    /**
     * Dùng để phân biệt với chính item của sp màn này
     */
    disable?: boolean;

    /**
     * Hàm tick chọn sp
     */
    select?: any;

    /**
     * Sp đang được tick chọn
     */
    selected: number[];

    /**
     * Mở modal change variants
     */
    toogleEdit?: (x: ProductTogether) => void;
}
const BoughtItem = memo(({ item, disable, select, selected, toogleEdit }: ItemProps) => {
    const checked = selected?.includes(item?.id) || disable;

    const navigateProduct = () => {
        navigate('DetailProduct', { productId: item.id, productName: item.name }, item.id);
    };

    const openEdit = () => {
        if (toogleEdit) toogleEdit(item);
    };

    if (!item) return null;
    return (
        <View style={styles.item}>
            <Pressable
                style={[styles.checkBox, disable && { opacity: 0.5 }]}
                onPress={() => select(item?.id)}
                disabled={disable}
                hitSlop={20}
            >
                {checked && <Icon size={14} color={lightColor.bluesky} type="feather" name="check" />}
            </Pressable>

            <Pressable style={{ flex: 1, flexDirection: 'row' }} onPress={navigateProduct} disabled={disable}>
                <FastImage style={styles.prodImg} resizeMode="cover" source={{ uri: cdnImageV2(item.image_url) }} />
                <View style={{ flex: 1, height: 100 }}>
                    <TextSemiBold style={{ lineHeight: 20 }} numberOfLines={1}>
                        {item.name}
                    </TextSemiBold>
                    <TextNormal style={[styles.grayText, { marginTop: 4 }]} numberOfLines={1}>
                        {item.variantName || item.name}
                    </TextNormal>

                    <Pressable style={styles.editView} disabled={disable} onPress={openEdit}>
                        <Icon type="feather" size={16} color={lightColor.bluesky} name="edit" />
                        <TextNormal style={{ fontSize: 13, color: lightColor.bluesky, marginTop: 3 }}> Edit</TextNormal>
                    </Pressable>

                    <TextSemiBold style={styles.price}>
                        {item.display_price} <TextNormal style={styles.oldPrice}>{item.display_high_price}</TextNormal>
                    </TextSemiBold>
                </View>
            </Pressable>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
        paddingHorizontal: 18,
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 24,
    },
    item: {
        width: '100%',
        height: 100,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: lightColor.bluesky,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    prodImg: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 6,
        overflow: 'hidden',
    },
    grayText: {
        fontSize: 13,
        lineHeight: 17,
        color: lightColor.grayout,
    },
    editView: {
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },

    price: {
        color: lightColor.price,
        fontSize: 18,
        marginTop: 4,
    },
    oldPrice: { fontSize: 14, color: lightColor.grayout, textDecorationLine: 'line-through' },

    addAllRow: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        paddingTop: 16,
    },
    addButton: {
        width: SCREEN_WIDTH * 0.55,
        height: 45,
        borderRadius: 6,
        backgroundColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
