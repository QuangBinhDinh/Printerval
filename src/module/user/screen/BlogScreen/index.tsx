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
        params: { post, isPolicy, postId },
    } = useRoute<BlogScreenRouteProp>();

    const { policyPost, blogPost } = useAppSelector(state => state.posts);
    //lấy Post/Blog được truyền vào hoặc lấy theo ID
    const blog = post || policyPost.concat(blogPost).find(i => i.id == postId);

    const { imgUrl, html } = extractImageFromHTML(blog?.content || '');

    const imageUnavailable = !blog?.image_url.includes('https');

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
            source={{ html: blog?.content || '' }}
            systemFonts={['Poppins-Regular', 'Poppins-Medium', 'Poppins-Bold', 'Poppins-SemiBold']}
        />
    );

    console.log('Image url', html);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={blog?.name || 'Blog'} />
            <View style={{ flex: 1 }}>
                {imageUnavailable ? (
                    <Image
                        style={styles.headerImg}
                        source={require('@image/image-blog-default.jpg')}
                        resizeMode="cover"
                    />
                ) : (
                    <FastImage style={styles.headerImg} source={{ uri: blog?.image_url }} />
                )}

                <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.transparent} />
                    <View style={styles.whiteContainer}>
                        <HTMLView />
                    </View>
                </ScrollView>
            </View>
        </View>
    );

    // return (
    //     <View style={{ flex: 1, backgroundColor: 'white' }}>
    //         <HeaderScreen title={blog?.name || 'Blog'} />
    //         <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24 }}>
    //             <HTMLView />
    //         </ScrollView>
    //     </View>
    // );
};

export default BlogScreen;

const extractImageFromHTML = (htmlString: string) => {
    let temp = htmlString;
    let imgUrl = '';
    const imgRegex = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*\s*\/?>/;

    // Match the first img tag
    const match = htmlString.match(htmlString);

    if (match) {
        imgUrl = match[1];
        temp = htmlString.replace(imgRegex, '');
    }

    return { html: temp, imgUrl };
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
