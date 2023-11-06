export type Nullable<T> = T | null | undefined;

/**
 * Hàm callback set 1 gía trị bất kì
 */
export type Callback<T = any> = (data: T) => void;

/**
 * Object có key dynamic
 */
export interface DynamicObject {
    [key: string]: any;
}
