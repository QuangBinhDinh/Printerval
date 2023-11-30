import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
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
import { SCREEN_WIDTH } from '@util/index';
import FastImage from 'react-native-fast-image';

import { load } from 'cheerio';
import { TextNormal, TextSemiBold } from '@components/text';
import { POLICY_POST_ID } from '@constant/index';

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
        params: { post, postId },
    } = useRoute<BlogScreenRouteProp>();
    const { policyPost, blogPost } = useAppSelector(state => state.posts);

    //lấy Post/Blog được truyền vào hoặc lấy theo ID
    const blog = post || policyPost.concat(blogPost).find(i => i.id == postId);

    //blog này có phải là policy không
    const isPolicy = POLICY_POST_ID.includes(blog?.id || -1);

    const { imgUrl, html } = extractImageFromHTML(blog?.content || '');

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

    const HTMLView = () => (
        <RenderHTML
            contentWidth={SCREEN_WIDTH}
            renderersProps={renderersProps}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
            enableExperimentalMarginCollapsing
            source={{ html: html }}
            systemFonts={['Poppins-Regular', 'Poppins-Medium', 'Poppins-Bold', 'Poppins-SemiBold']}
        />
    );

    //console.log('blog', blog?.content);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={blog?.name || 'Blog'} />
            <View style={{ flex: 1 }}>
                {!imgUrl ? (
                    <Image
                        style={styles.headerImg}
                        source={require('@image/image-blog-default.jpg')}
                        resizeMode="cover"
                    />
                ) : (
                    <FastImage style={styles.headerImg} source={{ uri: imgUrl }} />
                )}

                <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.transparent} />
                    <View style={styles.whiteContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextNormal style={{ color: lightColor.secondary }}>
                                {isPolicy ? 'Policy' : 'Blog'}
                            </TextNormal>
                            <TextNormal>{blog?.created_at}</TextNormal>
                        </View>

                        <TextSemiBold style={{ fontSize: 20, lineHeight: 24, marginTop: 8 }}>{blog?.name}</TextSemiBold>

                        <HTMLView />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default BlogScreen;

const extractImageFromHTML = (htmlString: string) => {
    let imgUrl = '';

    var instance = load(htmlString);

    //remove title center
    instance('h2[style="text-align: center;"]').remove();

    //extract first image src and remove it
    const firstImg = instance('img').first();
    if (firstImg.length > 0) {
        imgUrl = firstImg.attr('src') || '';
        firstImg.remove();
    }

    return { imgUrl, html: instance.html() };
};

const styles = StyleSheet.create({
    headerImg: {
        position: 'absolute',
        top: 0,
        width: SCREEN_WIDTH,
        height: 310,
        backgroundColor: lightColor.graybg,
    },
    transparent: {
        width: SCREEN_WIDTH,
        height: 280,
        backgroundColor: 'transparent',
    },
    whiteContainer: {
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 24,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingHorizontal: 18,
    },
});
