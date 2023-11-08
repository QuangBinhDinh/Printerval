import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface IProps {
    /**
     * Thông tin chi tiết của variant
     */
    item: any;

    /**
     * Thay đổi option
     * @returns
     */
    setVariant: (x: any) => void;

    /**
     * Bộ ID đang được chọn
     */
    input: number[];
}

const SelectView = ({ item, setVariant, input }: IProps) => {
    const selected = input.includes(item.id);
    return (
        <Pressable
            style={[styles.container, selected && styles.selected]}
            onPress={() => setVariant(item.id)}
            hitSlop={8}
        >
            <TextNormal style={[styles.text, selected && styles.textSelected]}>{item.name}</TextNormal>
        </Pressable>
    );
};

export default memo(SelectView);

const styles = StyleSheet.create({
    container: {
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
});
