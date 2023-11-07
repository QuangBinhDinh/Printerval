import React, { memo, useMemo } from 'react';
import { TextSemiBold, TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@rneui/base';

interface IProps {
    showPrintBack: boolean;
    isPrintBack: boolean;
    changePrintBack: (x: boolean) => void;

    changeQuantity: (x: any) => void;
    quantityText: string;
}
const Quantity = ({ showPrintBack, isPrintBack, changePrintBack, quantityText, changeQuantity }: IProps) => {
    const renderInput = useMemo(
        () => (
            <View style={styles.quantityContainer}>
                <Pressable style={styles.quantityButton}>
                    <Icon type="entypo" name="minus" size={20} color="#444" />
                </Pressable>
                <View style={styles.inputView}>
                    <TextInput style={styles.input} onChange={changeQuantity} value={quantityText} />
                </View>
                <Pressable style={styles.quantityButton}>
                    <Icon type="entypo" name="plus" size={20} color="#444" />
                </Pressable>
            </View>
        ),
        [quantityText],
    );

    if (showPrintBack)
        return (
            <View style={styles.container}>
                <View>
                    <TextSemiBold style={styles.title}>Print Location</TextSemiBold>
                    <View style={{ height: 4 }}></View>
                    <View style={styles.printContainer}>
                        <Pressable
                            style={[styles.optionFront, !isPrintBack && styles.optionSelected]}
                            onPress={() => changePrintBack(false)}
                        >
                            <TextNormal style={[styles.text, !isPrintBack && styles.textSelected]}>Front</TextNormal>
                        </Pressable>
                        <View style={{ width: 1, backgroundColor: lightColor.secondary, height: '100%' }}></View>
                        <Pressable
                            style={[styles.optionBack, isPrintBack && styles.optionSelected]}
                            onPress={() => changePrintBack(true)}
                        >
                            <TextNormal style={[styles.text, isPrintBack && styles.textSelected]}>Back</TextNormal>
                        </Pressable>
                    </View>
                </View>

                <View>
                    <TextSemiBold style={styles.title}>Quantity</TextSemiBold>
                    <View style={{ height: 4 }}></View>
                    {renderInput}
                </View>
            </View>
        );

    return (
        <View style={[styles.container, { marginTop: 24 }]}>
            <TextSemiBold style={styles.title}>Quantity</TextSemiBold>
            {renderInput}
        </View>
    );
};

export default memo(Quantity);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    title: { fontSize: 15, color: 'black' },

    printContainer: {
        height: 40,
        width: 150,
        flexDirection: 'row',
    },
    optionFront: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,

        borderColor: lightColor.borderGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
    },
    optionBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,

        borderColor: lightColor.borderGray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    optionSelected: {
        borderColor: lightColor.secondary,
    },
    text: {
        fontSize: 15,
        marginTop: 2,
    },
    textSelected: { color: lightColor.secondary },

    quantityContainer: {
        width: 150,
        borderWidth: 1,
        height: 40,
        borderColor: lightColor.borderGray,
        borderRadius: 6,
        flexDirection: 'row',
    },
    quantityButton: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputView: {
        flex: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: lightColor.borderGray,
    },
    input: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#444',
        padding: 0,
        paddingTop: 3,
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
});
