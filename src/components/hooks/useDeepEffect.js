import { isEqual } from 'lodash';
import { useRef, useEffect } from 'react';
export const useDeepEffect = (fn, deps, firstTime = true) => {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);

    useEffect(() => {
        const isFirstEffect = isFirst.current;
        const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));

        isFirst.current = false;
        prevDeps.current = deps;

        if (firstTime) {
            if (isFirstEffect || !isSame) {
                fn();
            }
        } else {
            if (!isSame) {
                fn();
            }
        }
    }, deps);
};
