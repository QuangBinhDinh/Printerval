import StarRating from '@components/StarRating';
import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { Product } from '@type/common';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface IProps {
    detail: Product;
    category: any;
    title: string;
}
const ProductTitle = ({ detail, category, title }: IProps) => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.favButton}>
                <Icon type="antdesign" name="heart" size={20} color={lightColor.price} />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextNormal style={styles.categoryName}>{category.name}</TextNormal>

                {detail.rating_count > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                        <StarRating rating={detail.rating_value} width={80} />
                        <TextNormal
                            style={{ fontSize: 11, color: lightColor.grayout, marginLeft: 5, marginTop: 2 }}
                        >{`(${detail.rating_count})`}</TextNormal>
                    </View>
                )}
            </View>

            <TextSemiBold style={{ fontSize: 20, marginTop: 8, lineHeight: 25 }}>{title}</TextSemiBold>
        </View>
    );
};

export default memo(ProductTitle);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderTopWidth: 1,
        borderColor: '#E1E1E1',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginTop: -24,
        paddingTop: 24,
        paddingHorizontal: 18,

        width: '100%',
    },
    categoryName: { color: lightColor.secondary, width: '65%', lineHeight: 21, marginTop: 2 },

    favButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderStartColor: 'white',
        borderColor: '#E1E1E1',
        borderWidth: 1,
        zIndex: 200,
        position: 'absolute',
        top: -20,
        right: 18,
    },
});
