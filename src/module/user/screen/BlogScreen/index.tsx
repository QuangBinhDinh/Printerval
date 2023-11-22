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
import { useAppSelector } from '@store/hook';
import { normalize } from '@rneui/themed';

const baseStyle: MixedStyleDeclaration = {
    fontFamily: 'Poppins-Regular',
    color: '#444444',
    fontSize: normalize(15),
};

const tagsStyles: MixedStyleRecord = {
    b: { fontFamily: 'Poppins-SemiBold', fontWeight: '500' },
    strong: { fontFamily: 'Poppins-Medium', fontWeight: '500' },
    a: { color: lightColor.secondary },
};

const BlogScreen = () => {
    const {
        params: { postId },
    } = useRoute<BlogScreenRouteProp>();
    const { policyPost, blogPost } = useAppSelector(state => state.posts);

    const blog = policyPost.concat(blogPost).find(i => i.id == postId);

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
            <HeaderScreen title={blog?.name || 'Blog'} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24 }}>
                <RenderHTML
                    renderersProps={renderersProps}
                    baseStyle={baseStyle}
                    tagsStyles={tagsStyles}
                    enableExperimentalMarginCollapsing
                    source={{ html: blog?.content || '' }}
                    systemFonts={['Poppins-Regular', 'Poppins-Medium', 'Poppins-Bold', 'Poppins-SemiBold']}
                />
            </ScrollView>
        </View>
    );
};

export default BlogScreen;
