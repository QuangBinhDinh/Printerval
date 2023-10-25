import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { SCREEN_HEIGHT } from '@util/index';

const THRESHOLD = SCREEN_HEIGHT / 2;

/**
 * onEndReached hook cho scrollView (cần optimize lại )
 * @returns
 */
export const useScrollReachEnd = () => {
    const [reachEnd, setEnd] = useState(false);

    const onEndReached = (
        { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
        callback = () => {},
    ) => {
        const endOfScroll = layoutMeasurement.height + contentOffset.y >= contentSize.height - THRESHOLD;
        if (endOfScroll && !reachEnd) {
            console.log('End reached');
            callback();
            setEnd(true);
        } else if (!endOfScroll) {
            setEnd(false);
        }
    };
    return { onEndReached };
};
