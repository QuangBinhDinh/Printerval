import HeaderScreen from '@components/HeaderScreen';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { DESIGN_RATIO } from '@util/index';
import { useAppSelector } from '@store/hook';
import { TextNormal } from '@components/text';
import { normalize } from '@rneui/themed';
import { Icon } from '@rneui/base';
import { navigate } from '@navigation/service';

const FAQ = () => {
    const policies = useAppSelector(state => state.posts.policyPost);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="FAQ" />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
            >
                {policies.map(item => (
                    <Pressable
                        key={item.id}
                        style={styles.sectionView}
                        onPress={() => navigate('BlogScreen', { post: item })}
                    >
                        <TextNormal style={{ lineHeight: 21 }}>{item.name}</TextNormal>
                        <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
                    </Pressable>
                ))}
                <View style={{ height: 70 }}></View>
            </ScrollView>
        </View>
    );
};

export default FAQ;

const styles = StyleSheet.create({
    sectionView: {
        width: '100%',
        paddingVertical: normalize(22),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
