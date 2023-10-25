import HeaderScreen from '@components/HeaderScreen';
import { lightColor } from '@styles/color';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@rneui/base';
import { useDebounceValue } from '@components/hooks/useDebounceValue';
import TrendingView from './TrendingView';
import { useBlur } from '@navigation/customHook';
import { useFetchCategoryTreeQuery } from '@category/service';
import { useDeepEffect } from '@components/hooks/useDeepEffect';
import { useAppDispatch } from '@store/hook';
import category from '@category/reducer';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { CATEGORY_EXPIRE_DAY } from '@constant/index';
import { useSelector } from 'react-redux';
import LoadingCategory from './LoadingCategory';
import Collection from './Collection';
import { SCREEN_WIDTH } from '@util/index';

const checkSelector = createSelector(
    (state: RootState) => state.category.valid_timestamp,
    time => !!time && time >= Date.now(),
);
const ListCollection = () => {
    const dispatch = useAppDispatch();
    // skip fetch nếu data cũ chưa expire
    const isOld = useSelector(checkSelector);
    const { data: tree, isLoading } = useFetchCategoryTreeQuery(undefined, { skip: isOld });
    useDeepEffect(() => {
        if (tree) {
            //console.log('Tree', tree);
            var today = new Date();
            today.setDate(today.getDate() + CATEGORY_EXPIRE_DAY);
            dispatch(
                category.actions.setCategoryTree({
                    tree,
                    timestamp: today.getTime(),
                }),
            );
        }
    }, [tree]);

    const [textSearch, setText] = useState('');
    const searchTerm = useDebounceValue(textSearch); // dùng để search keyword

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Collection" />
            {isLoading ? (
                <LoadingCategory />
            ) : (
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'white' }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <Icon type="feather" name="search" size={26} color={lightColor.secondary} />
                        <TextInput
                            style={styles.input}
                            value={textSearch}
                            onChangeText={setText}
                            placeholder="Search products..."
                            placeholderTextColor={'#444'}
                        />
                    </View>
                    <TrendingView searchTerm={searchTerm} />
                    {!textSearch && <Collection />}
                </ScrollView>
            )}
        </View>
    );
};

export default ListCollection;

const styles = StyleSheet.create({
    inputContainer: {
        width: SCREEN_WIDTH - 32,
        height: 52,
        backgroundColor: lightColor.graybg,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 18,
        paddingLeft: 20,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        height: '100%',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#444',
        padding: 0,
    },
});
