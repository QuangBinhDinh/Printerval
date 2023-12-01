import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native';

const LoadingSpinner = ({ visible, darkmode }: { visible: boolean; darkmode?: boolean }) => {
    if (!visible) return null;
    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: darkmode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.35)',
                    zIndex: 500,
                },
            ]}
        >
            <Lottie style={{ width: 200, height: 200 }} source={require('@animation/loading-v2.json')} autoPlay loop />
        </View>
    );
};

export default memo(LoadingSpinner);
