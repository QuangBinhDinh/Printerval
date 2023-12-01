import { useFetchSizeGuideQuery } from '@api/service';
import FancyButton from '@components/FancyButton';
import HeaderScreen from '@components/HeaderScreen';
import InputOption from '@components/input/InputOption';
import LoadingSpinner from '@components/loading/LoadingSpinner';
import { TextNormal, TextSemiBold } from '@components/text';
import { SelectSizeRouteProp, SizeGuideResultRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SizeGuideResult = () => {
    const {
        params: { result },
    } = useRoute<SizeGuideResultRouteProp>();

    // console.log('Result', result);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Size guide" />
            <ScrollView
                style={{ flex: 1 }}
                // showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24, alignItems: 'center' }}
            >
                <TextNormal>{result.display_name}</TextNormal>
                <View style={styles.table}>
                    <View>
                        <TextNormal style={{ color: lightColor.primary, lineHeight: 20 }}>Measurements</TextNormal>
                        {result.sizes.map(item => (
                            <TextSemiBold key={item} style={styles.textSize}>
                                {item}
                            </TextSemiBold>
                        ))}
                    </View>

                    {Object.entries(result.sizes_data).map(([title, col]) => {
                        return (
                            <View style={{ alignItems: 'center' }} key={title}>
                                <TextNormal style={{ color: lightColor.primary, lineHeight: 20 }}>
                                    {capitalize(title)}
                                </TextNormal>
                                {col.inch.map(item => (
                                    <TextNormal key={item} style={styles.textValue}>
                                        {item}
                                    </TextNormal>
                                ))}
                            </View>
                        );
                    })}
                </View>

                {result.infographics.map(item => (
                    <FastImage style={styles.img} source={{ uri: item }} resizeMode="cover" key={item} />
                ))}
            </ScrollView>
        </View>
    );
};

export default SizeGuideResult;

const styles = StyleSheet.create({
    table: {
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textSize: {
        fontSize: 13,
        lineHeight: 16,
        marginTop: 16,
        color: lightColor.secondary,
    },
    textValue: {
        fontSize: 13,
        lineHeight: 16,
        marginTop: 16,
    },

    img: {
        width: SCREEN_WIDTH * 0.85,
        aspectRatio: 31 / 17,

        marginTop: 16,
    },
});
