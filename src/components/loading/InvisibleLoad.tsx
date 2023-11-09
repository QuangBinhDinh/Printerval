import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const InvisibleLoad = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1000, opacity: 0 }]}>
            <View></View>
        </View>
    );
};

export default memo(InvisibleLoad);
