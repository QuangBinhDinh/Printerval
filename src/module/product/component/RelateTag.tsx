import { TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { randomizeColor } from '@util/index';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const RelateTag = ({ data }: { data?: any[] }) => {
    if (!data || data.length == 0) return null;

    const random_bg = randomizeColor(data.length);

    const searchTagByID = (item: any) => {
        navigate('SearchResult', { title: item.title, tag_id: item.id }, `tag-${item.id}`);
    };
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 20, lineHeight: 24, marginLeft: 18 }}>Related Tags</TextSemiBold>
            <ScrollView
                style={{ width: '100%', minHeight: 37, marginTop: 16 }}
                contentContainerStyle={{ paddingLeft: 18 }}
                showsHorizontalScrollIndicator={false}
                horizontal
            >
                {data.map((item, index) => (
                    <TouchableOpacity
                        style={[styles.tagButton, { backgroundColor: random_bg[index] }]}
                        key={item.id}
                        onPress={() => searchTagByID(item)}
                    >
                        <TextSemiBold style={styles.tagTitle}>{item.title}</TextSemiBold>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default memo(RelateTag);

const styles = StyleSheet.create({
    container: { width: '100%', marginTop: 32 },
    tagButton: {
        paddingHorizontal: 16,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderRadius: 6,
        overflow: 'hidden',
    },
    tagTitle: { fontSize: 15, color: '#444', marginTop: 2 },
});
