import HeaderScreen from '@components/HeaderScreen';
import { lightColor } from '@styles/color';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { useDebounceValue } from '@components/hooks/useDebounceValue';
import SuggestText from './SuggestText';
import { useBlur } from '@navigation/customHook';

const ListCollection = () => {
    const insets = useSafeAreaInsets();
    const [textSearch, setText] = useState('');
    const searchTerm = useDebounceValue(textSearch); // dùng để search keyword

    useBlur(() => {
        setText('');
    });
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Collection" />
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
            >
                <View style={styles.inputContainer}>
                    <Icon type="feather" name="search" size={28} color={lightColor.secondary} />
                    <TextInput
                        style={styles.input}
                        value={textSearch}
                        onChangeText={setText}
                        placeholder="Search products..."
                        placeholderTextColor={'#444'}
                    />
                </View>
                <SuggestText searchTerm={searchTerm} />
            </ScrollView>
        </View>
    );
};

export default ListCollection;

const styles = StyleSheet.create({
    inputContainer: {
        width: '92%',
        height: 52,
        backgroundColor: lightColor.graybg,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 24,
        paddingLeft: 20,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        height: '100%',
        fontSize: 17,
        fontFamily: 'Poppins-Regular',
        color: '#444',
        padding: 0,
    },
});
