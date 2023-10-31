import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const LoadingSpinner = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    zIndex: 500,
                },
            ]}
        ></View>
    );
};

export default memo(LoadingSpinner);
