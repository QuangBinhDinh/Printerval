import HeaderScreen from '@components/HeaderScreen';
import { TextSemiBold, TextNormal } from '@components/text';
import { RANDOM_IMAGE_URL } from '@constant/index';
import { normalize } from '@rneui/themed';
import { useAppSelector } from '@store/hook';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { lightColor } from '@styles/color';
import ProductRow from '@components/product/ProductRow';
import { splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { useRoute } from '@react-navigation/native';
import { SellerPageRouteProp } from '@navigation/navigationRoute';
import { shadow } from '@styles/shadow';

const SellerPage = () => {
    const {
        params: { seller },
    } = useRoute<SellerPageRouteProp>();

    //data test UI
    const testProduct = useAppSelector(state => state.category.productHistory);

    const renderItem = ({ item }: { item: any }) => (
        <Pressable style={styles.item}>
            <FastImage style={styles.image} source={{ uri: RANDOM_IMAGE_URL }} />
            <TextNormal style={styles.itemTitle}>{'Some text'}</TextNormal>
        </Pressable>
    );

    const newData = splitColArray(testProduct);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={seller.name} />
            <ScrollView style={{ flex: 1 }} removeClippedSubviews>
                <View style={styles.shopBanner}>
                    <FastImage
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: RANDOM_IMAGE_URL }}
                        resizeMode="cover"
                    />
                    <FastImage
                        style={[styles.shopAvatar, shadow]}
                        source={{ uri: seller.image_avatar || RANDOM_IMAGE_URL }}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.sellerInfo}>
                    <TextSemiBold style={{ fontSize: 20, lineHeight: 24, width: '100%' }}>{seller.name}</TextSemiBold>
                    <TextNormal style={{ fontSize: 13, lineHeight: 16, width: '100%', marginTop: 2 }}>
                        Contrary to popular belief, Lorem Ipsum is not simply random text.
                    </TextNormal>
                </View>

                <TextSemiBold style={styles.sectionTitle}>Explore by trends</TextSemiBold>
                <FlatList
                    style={styles.list}
                    data={[1, 2, 4, 5, 6, 7, 8]}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
                    renderItem={renderItem}
                />

                <ProductRow title="Hot products" data={testProduct} />

                <TextSemiBold style={styles.sectionTitle}>All products</TextSemiBold>
                <View style={styles.productList}>
                    {newData?.map((col, index) => (
                        <View key={index} style={[{ width: '48%' }]}>
                            {col.map(item => (
                                <DynamicCard item={item} key={item.id} />
                            ))}
                        </View>
                    ))}
                </View>

                <View style={{ height: 70 }} />
            </ScrollView>
        </View>
    );
};

export default SellerPage;

const styles = StyleSheet.create({
    shopBanner: {
        width: SCREEN_WIDTH,
        height: normalize(200),
    },
    shopAvatar: {
        width: 120,
        height: 120,
        borderRadius: 120,
        overflow: 'hidden',
        position: 'absolute',
        left: 16,
        bottom: -60,
    },
    sectionTitle: { fontSize: 20, marginLeft: 16, lineHeight: 26, marginTop: 32 },
    list: {
        marginTop: 16,
        width: '100%',
        height: 150,
        //borderWidth: 1,
    },
    sellerInfo: {
        width: SCREEN_WIDTH * 0.6,
        marginLeft: 150,
        marginTop: 8,
    },

    item: { height: 150, width: 100, marginLeft: 12, alignItems: 'center' },
    image: { width: 100, height: 100, borderRadius: 50, backgroundColor: lightColor.graybg },
    itemTitle: { fontSize: 13.5, marginTop: 10, width: '100%', textAlign: 'center', lineHeight: 18 },

    productList: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
});
