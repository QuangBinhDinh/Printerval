import { useLazyFetchSlugQuery } from '@api/service';
import { navigate } from '@navigation/service';
import { capitalize, maxBy } from 'lodash';
import { Linking } from 'react-native';

//pattern chỉ match với domain https://prinerval.com/{someText} (không có '/' thứ hai )
const slugPattern = /^https:\/\/printerval\.com\/([^\/?]+)$/;

export const useNavigateFromWebLink = () => {
    const [fetchSlug, { isLoading }] = useLazyFetchSlugQuery();

    /**
     * Navigate đến 1 screen trên app dựa vào link webview
     * @param url
     */
    const navigateFromLink = async (url: string) => {
        if (isLoading) return;

        if (url.includes('contact/ticket')) {
            navigate('CreateTicket');
        } else if (url.includes('contact-us')) {
            //do sth
        } else if (url.includes('tel') || url.includes('mailto')) {
            try {
                Linking.openURL(url);
            } catch (e) {}
        } else {
            //xử lý regex
            handleMatchingRegex(url);
        }
    };

    const handleMatchingRegex = async (url: string) => {
        const match = url.match(slugPattern);
        console.log('Match regex', match);
        if (!match) {
            navigate('NotFoundScreen');
            return;
        }

        var keyword = match[1].split('-')[0];
        try {
            const res = await fetchSlug(keyword).unwrap();

            if (res.result.length > 0) {
                var priorSlug = maxBy(res.result, item => item.priority);

                //tìm slug có priorty cao nhất để navigate
                if (priorSlug) {
                    if (priorSlug.type == 'category') {
                        navigate(
                            'ProductCategory',
                            {
                                title: capitalize(priorSlug.slug),
                                categoryId: priorSlug.target_id,
                            },
                            priorSlug.target_id,
                        );
                    } else if (priorSlug.type == 'tag') {
                        navigate('SearchResult', { title: capitalize(priorSlug.slug), tag_id: priorSlug.target_id });
                    }
                }
            } else navigate('NotFoundScreen');
        } catch (e) {
            console.log(e);
            navigate('NotFoundScreen');
        }
    };

    return {
        isLoading,
        navigateFromLink,
    };
};
