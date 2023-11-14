import React from 'react';
import { View, ScrollView } from 'react-native';
import HeaderScreen from '@components/HeaderScreen';
import { BlogScreenRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import RenderHTML, {
    RenderersProps,
    MixedStyleRecord,
    MixedStyleDeclaration,
    defaultSystemFonts,
} from 'react-native-render-html';
import { useNavigateFromWebLink } from '@util/renderHTML';
import { lightColor } from '@styles/color';

const baseStyle: MixedStyleDeclaration = {
    fontFamily: 'Poppins-Regular',
    color: '#444444',
    fontSize: 15,
};

const tagsStyles: MixedStyleRecord = {
    b: { fontFamily: 'Poppins-SemiBold', fontWeight: '500' },
    strong: { fontFamily: 'Poppins-Medium', fontWeight: '500' },
    a: { color: lightColor.secondary },
};

const BlogScreen = () => {
    const {
        params: { title, content },
    } = useRoute<BlogScreenRouteProp>();
    const { navigateFromLink } = useNavigateFromWebLink();

    const renderersProps: Partial<RenderersProps> = {
        img: { enableExperimentalPercentWidth: true },
        a: {
            onPress: async (_, href) => {
                console.log('Link clicked', href);
                navigateFromLink(href);
            },
        },
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={title} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24 }}>
                <RenderHTML
                    renderersProps={renderersProps}
                    baseStyle={baseStyle}
                    tagsStyles={tagsStyles}
                    enableExperimentalMarginCollapsing
                    source={{ html: content }}
                    systemFonts={['Poppins-Regular', 'Poppins-Medium', 'Poppins-Bold', 'Poppins-SemiBold']}
                />
            </ScrollView>
        </View>
    );
};

export default BlogScreen;
