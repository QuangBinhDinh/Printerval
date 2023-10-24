import { useEffect } from 'react';
import { debounce } from 'lodash';
/**
 * Hook debounce 1 function kèm 1 value thay đổi (dùng cho search input)
 * @param {function} callback callback truyền vào
 * @param {any} value value truyền vào callback (hay thay đổi)
 * @param {number} delay delay call time (default 500 ms)
 * @returns
 */
export const useDebounce = (callback, value, delay = 500) => {
    useEffect(
        () => {
            // Update debounced value after delay
            const handler = debounce(callback, delay);
            handler();
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                handler.cancel();
            };
        },
        [value], // Only re-call effect if value or delay changes
    );
};
