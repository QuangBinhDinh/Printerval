import React, { useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SCREEN_WIDTH } from '@util/index';
import HeaderScreen from '@components/HeaderScreen';
import { TextSemiBold, TextNormal } from '@components/text';
import { ActivityIndicator, FlatList, StyleSheet, View, Pressable } from 'react-native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import { useFetchProductReviewQuery } from '@product/service';
import ReviewCard from '@product/component/ReviewCard';
import { ProductReview } from '@type/common';
import { lightColor } from '@styles/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { goBack } from '@navigation/service';
import { shadow } from '@styles/shadow';

const MAX_CHAR = 22;
const AllReview = () => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const insets = useSafeAreaInsets();

    const [args, setArgs] = useState({
        targetId: productId,
        dt: Date.now(),
        pageSize: 20,
        pageId: 0,
    });
    const { data: { result, meta } = {} } = useFetchProductReviewQuery(args);

    const headerTitle = useMemo(() => {
        var text = productName;
        if (text.length > MAX_CHAR) {
            text = text.slice(0, MAX_CHAR);
            text = text + '...';
        }
        return text + ' reviews';
    }, []);

    const loadMore = () => {
        if (meta?.has_next) {
            setArgs(prev => ({ ...prev, pageId: prev.pageId + 1 }));
        }
    };
    const renderItem = ({ item }: { item: ProductReview }) => <ReviewCard item={item} />;

    const ListFooter = () => (
        <View style={styles.footer}>
            {meta?.has_next && <ActivityIndicator size={'small'} color={lightColor.secondary} />}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={[styles.header, { height: 54 + insets.top / 1.5, paddingTop: 6 + insets.top / 1.5 }, shadow]}>
                <Pressable style={styles.button} onPress={goBack}>
                    <Icon type="antdesign" name="arrowleft" size={22} color={lightColor.secondary} />
                </Pressable>
                <View style={styles.titleView}>
                    <TextSemiBold style={{ fontSize: 18, marginTop: 2 }} numberOfLines={1}>
                        {headerTitle}
                    </TextSemiBold>
                </View>
            </View>

            {result && result.length > 0 && (
                <FlatList
                    data={result}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 18 }}
                    renderItem={renderItem}
                    removeClippedSubviews
                    ListFooterComponent={<ListFooter />}
                    onEndReachedThreshold={0.5}
                    onEndReached={loadMore}
                />
            )}
        </View>
    );
};

export default AllReview;

const styles = StyleSheet.create({
    header: {
        height: 54,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 200,
        paddingHorizontal: 6,
    },
    button: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleView: { flex: 1, height: '100%', justifyContent: 'center', paddingHorizontal: 5 },
    footer: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
