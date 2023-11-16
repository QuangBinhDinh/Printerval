import { CartItem } from '@type/common';
import { cdnImageV2 } from '@util/cdnV2';
import React, { memo, useState, useMemo, useEffect } from 'react';
import { Pressable, StyleSheet, View, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon } from '@rneui/base';
import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { formatPrice } from '@util/index';
import he from 'he';
import { navigate } from '@navigation/service';
import { useUpdateQuantityMutation } from '../service';
import { useDebounceValue } from '@components/hooks/useDebounceValue';
import { askBeforeRemove } from './PopupRemoveCart';

interface IProps {
    item: CartItem;

    removeCart: any;
}
const CartItemCard = ({ item, removeCart }: IProps) => {
    const productName = useMemo(() => {
        if (!item.name_variant) return item.product_name;
        return item.product_name.substring(0, item.product_name.indexOf(item.name_variant) - 2);
    }, [item]);

    const toDetailProduct = () => {
        navigate('DetailProduct', { productId: item.product_id, productName }, item.product_id);
    };

    const onDelete = () => {
        askBeforeRemove(() => removeCart(item.id));
    };

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Pressable style={styles.img} onPress={toDetailProduct}>
                    <FastImage
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: cdnImageV2(item.image_url) }}
                        resizeMode="cover"
                    />
                </Pressable>

                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Pressable style={styles.iconClose} hitSlop={10} onPress={onDelete}>
                        <Icon type="antdesign" name="close" size={18} color={'#444'} />
                    </Pressable>

                    <Pressable hitSlop={10} onPress={toDetailProduct}>
                        <TextNormal style={styles.textTitle} numberOfLines={2}>
                            {he.decode(productName)}
                        </TextNormal>
                    </Pressable>

                    <Pressable style={styles.variantView}>
                        {!!item.name_variant && (
                            <View style={styles.variantInner}>
                                <TextNormal style={styles.textGray} numberOfLines={1}>
                                    {item.name_variant}
                                </TextNormal>
                                <Icon type="feather" name="chevron-down" size={18} color="#999" />
                            </View>
                        )}
                    </Pressable>

                    <View style={styles.bottom}>
                        <View style={{ height: 36, justifyContent: 'space-between' }}>
                            <TextNormal style={{ fontSize: 13, color: lightColor.price }}>
                                {item.display_price}
                            </TextNormal>
                            <TextNormal style={{ fontSize: 13, color: '#999', textDecorationLine: 'line-through' }}>
                                {formatPrice(item.high_price)}
                            </TextNormal>
                        </View>

                        <CartItemQty itemQty={item.quantity} id={item.id} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default memo(CartItemCard);

const CartItemQty = memo(({ itemQty, id }: { itemQty: number; id: number }) => {
    const [qtyText, setText] = useState(itemQty.toString());

    //chỉ dùng để lưu trữ qty mới đc thay đổi bởi user. Nếu như qty từ data thay đổi , giá trị này sẽ bị reset
    //sử dụng debounce mỗi khi giá trị này thay đổi để call api update quantity
    const [qtyTemp, setQtyTemp] = useState(-1);

    useEffect(() => {
        setText(itemQty.toString());
        setQtyTemp(-1);
    }, [itemQty]);

    const increase = () => {
        var numQty = Number(qtyText);
        if (numQty < 50) {
            var newQty = numQty + 1;
            setText(newQty.toString());
            setQtyTemp(newQty);
        }
    };
    const decrease = () => {
        var numQty = Number(qtyText);
        if (numQty > 1) {
            var newQty = numQty - 1;
            setText(newQty.toString());
            setQtyTemp(newQty);
        }
    };
    /**
     * Update qty sau khi nhập input
     */
    const textSubmit = () => {
        var intValue = Number(qtyText);
        var newValue = 1;

        if (isNaN(intValue)) {
            newValue = 1;
        } else if (intValue < 1) {
            newValue = 1;
        } else if (intValue > 50) {
            newValue = 50;
        } else {
            newValue = intValue;
        }
        setText(newValue.toString());
        setQtyTemp(newValue);
    };

    const [postNewQty] = useUpdateQuantityMutation();
    const debounceQty = useDebounceValue<number>(qtyTemp, 750);
    useEffect(() => {
        if (debounceQty > 0) {
            postNewQty({ id, quantity: debounceQty });
        }
    }, [debounceQty]);

    return (
        <View style={styles.quantityContainer}>
            <Pressable style={styles.quantityButton} onPress={decrease}>
                <Icon type="antdesign" name="minus" size={15} color="#444" />
            </Pressable>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={setText}
                    value={qtyText}
                    keyboardType={'numeric'}
                    onSubmitEditing={textSubmit}
                    onBlur={textSubmit}
                />
            </View>
            <Pressable style={styles.quantityButton} onPress={increase}>
                <Icon type="antdesign" name="plus" size={15} color="#444" />
            </Pressable>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
    },
    inner: {
        width: '100%',
        flexDirection: 'row',
        height: 125,
    },
    img: {
        width: 125,
        height: 125,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        overflow: 'hidden',
    },
    textTitle: { color: lightColor.primary, lineHeight: 16, width: '80%', fontSize: 13 },
    iconClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 100,
    },

    variantView: {
        width: '85%',
        height: 32,
        marginTop: 5,
    },
    variantInner: {
        flex: 1,
        backgroundColor: '#fafafa',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        borderRadius: 6,
    },

    textGray: {
        fontSize: 13,
        color: '#999',
        lineHeight: 16,
        width: 150,
    },

    bottom: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        width: '85%',
        alignItems: 'center',
    },

    quantityContainer: {
        width: 102,
        borderWidth: 1,
        height: 30,
        borderColor: lightColor.borderGray,
        borderRadius: 6,
        flexDirection: 'row',
    },
    quantityButton: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputView: {
        flex: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: lightColor.borderGray,
    },
    input: {
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        color: '#444',
        padding: 0,
        paddingTop: 3,
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});
