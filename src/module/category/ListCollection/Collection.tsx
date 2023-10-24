import { TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { useAppSelector } from '@store/hook';
import { cdnImage } from '@util/cdnImage';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const ListCollection = () => {
    const category = useAppSelector(state => state.category.categoryTree);

    console.log(category);
    return (
        <View style={styles.container}>
            {category?.map(item => (
                <CollectionItem item={item} key={item.id} />
            ))}
        </View>
    );
};

const CollectionItem = memo(({ item }: { item: any }) => {
    const toSubCollection = () => {
        navigate('SubCollection', {
            parentId: item.id,
            title: item.name,
        });
    };
    return (
        <Pressable style={styles.item} onPress={toSubCollection}>
            <FastImage style={{ width: '100%', height: '100%' }} source={{ uri: cdnImage(item.image_url, 400, 400) }} />
            <LinearGradient
                style={styles.shadowView}
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <TextSemiBold style={styles.title}>{item.name}</TextSemiBold>
            </LinearGradient>
        </Pressable>
    );
});

export default memo(ListCollection);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
        paddingHorizontal: 16,
    },
    item: {
        width: '100%',
        height: 154,
        marginBottom: 26,
        borderRadius: 6,
        overflow: 'hidden',
    },
    shadowView: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 40,
        zIndex: 100,
    },
    title: {
        fontSize: 16,
        marginTop: 6,
        color: 'white',
        marginLeft: 10,
    },
});
