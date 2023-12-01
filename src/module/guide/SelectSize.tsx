import { useFetchSizeGuideQuery } from '@api/service';
import FancyButton from '@components/FancyButton';
import HeaderScreen from '@components/HeaderScreen';
import InputOption from '@components/input/InputOption';
import LoadingSpinner from '@components/loading/LoadingSpinner';
import { TextNormal, TextSemiBold } from '@components/text';
import { SelectSizeRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '@navigation/service';

const TYPES = [
    {
        id: 'male',
        value: 'Male Sizing',
    },
    {
        id: 'femail',
        value: 'Female Sizing',
    },
    {
        id: 'youth',
        value: 'Youth Sizing',
    },
    {
        id: 'unisex',
        value: 'Unisex Sizing',
    },
    {
        id: 'kids',
        value: 'Kids Sizing',
    },
];

const SelectSizeGuide = () => {
    const insets = useSafeAreaInsets();
    const {
        params: { productId },
    } = useRoute<SelectSizeRouteProp>();

    const [typeId, setType] = useState<string | number>('male');

    const [categoryId, setCategoryId] = useState<string | number>(-1);

    const [subId, setSubId] = useState<string | number>(-1);

    const { data, isLoading, isFetching } = useFetchSizeGuideQuery({ productId, type: typeId.toString() });

    const categoryList = data?.filter(i => !i.parent_id) || [];
    const subCategoryList = data?.filter(i => i.parent_id == 26) || [];

    const disable = categoryId == -1 || (categoryId == 26 && subId == -1);

    const toResult = () => {
        var id = categoryId == 26 ? subId : categoryId;
        navigate('SizeGuideResult', { result: data?.find(i => i.id == id) });
    };

    console.log('Data', data);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Size guide" />
            <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 24 }}>
                <TextNormal style={{ lineHeight: 21, marginBottom: 16 }}>
                    If you're in between sizes, order a size up as our items can shrink up to half a size in the wash.
                </TextNormal>

                <InputOption
                    title="Type"
                    value={typeId}
                    setValue={opt => {
                        setType(opt.id);
                        setCategoryId(-1);
                        setSubId(-1);
                    }}
                    options={TYPES}
                />

                <InputOption
                    title="Product"
                    value={categoryId}
                    setValue={opt => {
                        setCategoryId(opt.id);
                        setSubId(-1);
                    }}
                    options={categoryList}
                    placeholder="Select a category"
                />

                {categoryId == 26 && (
                    <InputOption
                        title="Shirt"
                        value={subId}
                        setValue={opt => {
                            setSubId(opt.id);
                        }}
                        options={subCategoryList}
                        placeholder="Select a type"
                    />
                )}

                <View
                    style={[
                        styles.bottomView,
                        shadowTop,
                        { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                    ]}
                >
                    <FancyButton
                        style={[styles.button, disable && { backgroundColor: lightColor.grayout }]}
                        backgroundColor={disable ? lightColor.grayout : lightColor.secondary}
                        onPress={toResult}
                        disabled={disable}
                    >
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>{'Continue'}</TextSemiBold>
                    </FancyButton>
                </View>

                <LoadingSpinner visible={isLoading || isFetching} darkmode />
            </View>
        </View>
    );
};

export default SelectSizeGuide;

const styles = StyleSheet.create({
    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
