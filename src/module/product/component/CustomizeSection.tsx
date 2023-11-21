import { TextNormal, TextSemiBold } from '@components/text';
import { normalize } from '@rneui/themed';
import { lightColor } from '@styles/color';
import { DynamicObject } from '@type/base';
import { CustomAttribute, ErrorField } from '@type/product';
import { SCREEN_WIDTH } from '@util/index';
import { capitalize, isEqual } from 'lodash';
import React, { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomizeImage from './CustomizeImage';

interface IProps {
    currentConfig: DynamicObject;

    setConfig: any;

    customConfig: CustomAttribute;

    errors: ErrorField | null;
}
const CustomizeSection = ({ currentConfig, setConfig, customConfig, errors }: IProps) => {
    const { custom_design_image, custom_design_option, custom_design_text } = customConfig;

    const setFieldConfig = (fieldName: string, value: string) => {
        setConfig((prev: any) => ({ ...prev, [fieldName]: value }));
    };

    const isSelected = (fieldName: string, value: string) => currentConfig[fieldName] == value;

    // console.log('Image', custom_design_image);
    return (
        <View style={styles.container}>
            {custom_design_option &&
                custom_design_option.map(item => (
                    <View style={styles.optionView} key={item.title}>
                        <TextSemiBold style={styles.optionTitle}>{capitalize(item.title)}</TextSemiBold>
                        <ScrollView
                            style={styles.optionRow}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 18, paddingRight: 6 }}
                        >
                            {item.values.map(opt => (
                                <Pressable
                                    style={[styles.optionButton, isSelected(item.title, opt) && styles.selected]}
                                    key={opt}
                                    onPress={() => setFieldConfig(item.title, opt)}
                                >
                                    <TextNormal
                                        style={[styles.text, isSelected(item.title, opt) && styles.textSelected]}
                                    >
                                        {opt}
                                    </TextNormal>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                ))}

            {custom_design_text &&
                custom_design_text.map(item => {
                    var isError = !currentConfig[item] && errors?.type == 'custom_text';
                    return (
                        <View style={styles.optionView} key={item}>
                            <TextSemiBold style={styles.optionTitle}>
                                {capitalize(item)}
                                <TextSemiBold style={{ color: lightColor.error }}>*</TextSemiBold>
                            </TextSemiBold>
                            <TextInput
                                style={[styles.optionInput, isError && { borderColor: lightColor.error }]}
                                value={currentConfig[item]}
                                onChangeText={text => setFieldConfig(item, text)}
                                placeholder="Enter some text"
                            />
                            {isError && <TextNormal style={styles.errorText}>Field cannot be empty</TextNormal>}
                        </View>
                    );
                })}
            {!!custom_design_image && (
                <CustomizeImage imageConfig={custom_design_image} setConfig={setFieldConfig} errors={errors} />
            )}
        </View>
    );
};

export default memo(CustomizeSection);
const styles = StyleSheet.create({
    container: {
        //marginTop: 16,
        width: '100%',
    },

    optionView: {
        width: '100%',
        marginTop: 16,
    },
    optionTitle: { fontSize: 15, color: 'black', marginLeft: 18 },
    optionRow: {
        width: '100%',
        marginTop: 4,
    },
    optionInput: {
        width: SCREEN_WIDTH - 36,
        height: 44,
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: 4,
        borderWidth: 1,
        borderColor: lightColor.borderGray,
        fontSize: normalize(15),
        fontFamily: 'Poppins-Regular',
        textAlignVertical: 'center',
        padding: 0,
        paddingLeft: 10,
        color: '#444',
    },

    optionButton: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: lightColor.borderGray,
    },
    selected: {
        borderColor: lightColor.secondary,
    },
    text: {
        fontSize: 15,
        marginTop: 2,
    },
    textSelected: { color: lightColor.secondary },
    errorText: {
        fontSize: 13,
        color: lightColor.error,
        marginLeft: 22,
        marginTop: 8,
        lineHeight: 15,
    },
});
