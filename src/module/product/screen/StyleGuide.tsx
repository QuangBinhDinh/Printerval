import HeaderScreen from '@components/HeaderScreen';
import { TextNormal } from '@components/text';
import { StyleGuideRouteProp } from '@navigation/navigationRoute';
import { useFetchStyleGuideQuery } from '@product/service';
import { useRoute } from '@react-navigation/native';
import { stripHTMLTags } from '@util/index';
import React from 'react';
import { View, ScrollView } from 'react-native';

const StyleGuide = () => {
    const {
        params: { product_id, style_id, type_id },
    } = useRoute<StyleGuideRouteProp>();

    const { data: { result } = {} } = useFetchStyleGuideQuery({ product_id, style_id, type_id });

    console.log(result);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Style guide" />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
            >
                <TextNormal style={{ lineHeight: 21, marginTop: 30 }}>{stripHTMLTags(result, true)}</TextNormal>
            </ScrollView>
        </View>
    );
};

export default StyleGuide;
