import { NoResult } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { View } from 'react-native';

const EmptyResult = () => {
    return (
        <View style={{ width: SCREEN_WIDTH, alignItems: 'center', paddingHorizontal: 16, marginTop: 24 }}>
            <NoResult width={150} height={150} />
            <TextSemiBold style={{ fontSize: 20, marginTop: 16, color: '#444' }}>
                Nothing matches your search
            </TextSemiBold>
            <TextNormal style={{ fontSize: 15, marginTop: 16, textAlign: 'center' }}>
                Don’t give up! Check your spelling, clear some filters or try something new
            </TextNormal>
        </View>
    );
};

export default memo(EmptyResult);
