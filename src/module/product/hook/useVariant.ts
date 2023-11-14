import { Nullable, DynamicObject } from '@type/base';
import { cloneDeep } from 'lodash';
import { useRoute } from '@react-navigation/native';
import { ORDER_SIZE } from '@constant/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ProdVariants, Options, VariantPrice, VariantsTree, ProdDescription, NewVariants } from '@type/product';
import { getVersion } from 'react-native-device-info';

/**
 * Hook dùng để lấy thông tin các variant của 1 sp bất kì trên Printerval, kèm theo 1 số thông tin khác
 *
 * Dùng trong 2 màn Detail và Change Product
 * @param product_id ID của sản phẩm
 * @param product_name Tên sản phẩm
 * @param product_sku_id ID biến thể sản phẩm (trong TH change product )
 * @returns
 */
export const useVariant = (product_id: number, product_name: string, product_sku_id = -1) => {
    // const { params } = useRoute<any>();
    const [selectedVariant, setSelected] = useState<(number | null)[] | null>(null); // Bộ biến thể đang được chọn (dùng để display, có thể null)
    const [trueVariant, setTrueVariant] = useState<number[]>([]); //bộ biến thể đang chọn (không null, dùng trong logic)

    const [options, setOptions] = useState<Options>({}); // Toàn bộ option của các biến thể
    const displayOption = useMemo(() => {
        if (Object.keys(options).length == 0) return {};
        if (!Object.keys(options).includes('color')) return options;
        // nếu biến thể có color thì đảo color lên trên cùng khi hiển thị UI
        var newKey = ['color'].concat(Object.keys(options).filter(str => str !== 'color'));
        var obj: Options = {};

        for (const key of newKey) {
            obj[key] = options[key];
        }
        return obj;
    }, [options]);

    const [colIndex, setColIndex] = useState(-1);
    const [variantPrice, setVariantPrice] = useState<VariantPrice>({}); // list giá tiền của các biến thể có type = OPTION
    const [variantPriceField, setPriceField] = useState<string[] | null>(null);

    const [gallery, setGallery] = useState<Nullable<string[]>>(null);
    const [productVariant, setProdVariant] = useState<ProdVariants[] | null>(null); // Danh sách toàn bộ các biến thể của sp
    const [mappings, setMapping] = useState<NewVariants | null>(null); // bảng mapping biến thể (id => detail biến thể)

    const [prodNoVariant, setNoVariant] = useState(false); // sản phẩm có biến thể hay không (nếu không có thì pass)
    const [sortedVariants, setSorted] = useState<{ [x: string]: number[] } | null>(null);
    const isReady =
        Object.keys(options).length > 0 && !!productVariant && !!mappings && !!selectedVariant && !!variantPriceField;

    const [description, setDescription] = useState<string | null>(null);

    /**
     * Tìm biến thể trong product variants dựa vào bộ id truyền vào
     * @param inputs Bộ ID biến thể
     * @returns
     */
    const findVariantsWithId = (inputs: any[], prodVar?: ProdVariants[]) => {
        var pVar = prodVar ?? productVariant;
        if (!pVar) return null;

        var numInputs = inputs.filter(i => !!i); // lọc trường hợp input bị null (chưa chọn option)
        var results: ProdVariants[] = [];
        for (const varia of pVar) {
            if (numInputs.every(num => varia.variants.includes(num))) results.push(varia);
        }
        // nhớ clone object !!!
        return results.length > 0 ? cloneDeep(results) : null;
    };

    /**
     * Trả về 1 list biến thể mới đã đc sắp xếp theo quy tắc
     * @param options Danh sách các option biến thể
     * @returns
     */
    const minVariantsPrice = (options: ProdVariants[]) => {
        if (!mappings) return null;
        const temp = cloneDeep(options);
        temp.sort((a, b) => {
            if (Number.parseFloat(a.price) < Number.parseFloat(b.price)) return -1;
            else if (Number.parseFloat(a.price) > Number.parseFloat(b.price)) return 1;
            else {
                var sizeA = a.variants[a.variants.length - 1];
                var sizeB = b.variants[b.variants.length - 1];
            }

            if (ORDER_SIZE.indexOf(mappings[sizeA].name) < ORDER_SIZE.indexOf(mappings[sizeB].name)) return -1;
            else return 0;
        });
        return temp[0];
    };

    /**
     * Thông tin chi tiết sản phẩm đang được chọn
     */
    const detailSelectVar = useMemo(() => {
        if (!productVariant) return null;
        var prod = findVariantsWithId(trueVariant);
        if (!prod) return null;
        if (prod.length == 1) return prod[0];
        // trường hợp có nhiều sp => chọn sp có price min
        return minVariantsPrice(prod);
    }, [trueVariant, productVariant, mappings]);

    const variantReady = prodNoVariant || (isReady && !!detailSelectVar && !!displayOption);

    useEffect(() => {
        const fetchProdVariant = async (productId: number) => {
            var res = await axios.get(
                `https://glob.api.printerval.com/v2/variant/${productId}&dt=${new Date().getTime()}`,
            );
            if (res.data.status !== 'successful') return;
            var listVariant: ProdVariants[] = res.data.result.productVariants;
            if (listVariant.length == 0) {
                // trường hợp không có variant
                setNoVariant(true);
                return;
            }
            var prodVariants = listVariant.filter(prod => prod.variants.length > 0);
            setProdVariant(prodVariants); // lọc những variant không có bộ ID
            var variants: VariantsTree[] = res.data.result.variants;
            var mappings: NewVariants = variants.reduce((prev: { [x: string]: any }, next) => {
                next.values.forEach(item => {
                    prev[item.id] = { ...item, variantType: next.type, variantName: next.slug };
                });
                return prev;
            }, {});
            setMapping(mappings); // mapping id => bien the
            setColIndex(variants.findIndex(i => i.type == 'IMAGE')); // color index

            var priceField = variants.filter(i => i.type == 'OPTION').map(varia => varia.slug);
            setPriceField(priceField);
            var obj: DynamicObject = {};
            for (const field of priceField) {
                obj[field] = [];
            }
            setVariantPrice(obj); // khởi tạo obj lưu trữ mảng price của các option

            var cloneVariants = cloneDeep(prodVariants); // clone để tránh bị ref
            var defaultVariant: any[] | undefined;

            if (product_sku_id == -1) defaultVariant = cloneVariants.find(id => id.is_default == 1)?.variants;
            else defaultVariant = cloneVariants.find(id => id.id == product_sku_id)?.variants; // trường hợp có id biến thể (make change cart screen)

            //tạo 1 danh sách sắp xếp các variant. Khi khởi tạo option mới sẽ dựa trên danh sách này để sort lại
            var sortOptionMap = variants.reduce(
                (prev: { [x: string]: number[] }, next) => ({ ...prev, [next.slug]: next.values.map(i => i.id) }),
                {},
            );
            setSorted(sortOptionMap);

            if (product_sku_id == -1) {
                var defaultGallery = cloneVariants.find(id => id.is_default == 1)?.gallery;
                if (defaultGallery && defaultGallery?.length > 0) {
                    setGallery(defaultGallery);
                }
            } else {
                var selectGallery = cloneVariants.find(id => id.id == product_sku_id)?.gallery;
                if (selectGallery && selectGallery?.length > 0) setGallery(selectGallery);
            }

            if (!!defaultVariant) {
                if (
                    variants[variants.length - 1].name.includes('size') ||
                    (variants[variants.length - 1].slug.includes('size') && product_sku_id == -1)
                ) {
                    var tempVariant = cloneDeep(defaultVariant);
                    //nếu option cuối cùng là chọn size , k áp dụng cho màn make change cart (do id variant đã được pick r)
                    tempVariant[tempVariant.length - 1] = null;
                    setSelected(tempVariant);
                } else setSelected(defaultVariant);
                setTrueVariant(defaultVariant);

                generateOptionsFromSelected(
                    defaultVariant,
                    variants.map(i => i.slug),
                    prodVariants,
                    sortOptionMap,
                );
            }
        };
        fetchProdVariant(product_id);
    }, []);

    /**
     * Chọn biến thể
     */
    const setSelectedTuple = useCallback(
        (field: string) => (id: number) => {
            if (!selectedVariant) return;
            var fieldIndex = Object.keys(options).indexOf(field);
            var temp = [...trueVariant];
            temp[fieldIndex] = id; // bộ variant mới đã thay option của user

            var newSelected = findNextVariants(temp, fieldIndex, colIndex);
            if (!!newSelected) {
                if (newSelected.gallery?.length > 0) {
                    setGallery(newSelected.gallery);
                }
                var newVaria: any[] = [...newSelected.variants];
                if (!selectedVariant[selectedVariant.length - 1] && !field.includes('size')) {
                    //khi user chọn các biến thể khác ngoài size và chưa pick size trước đó
                    newVaria[newVaria.length - 1] = null;
                }
                setSelected(newVaria);
                setTrueVariant(newSelected.variants);
                generateOptionsFromSelected(newSelected.variants, Object.keys(options));
            }
        },
        [productVariant, selectedVariant, trueVariant, colIndex, options, mappings, sortedVariants],
    );

    /**
     * Hàm tìm biến thể selected tiếp theo dựa vào giá trị mới chuyền vào
     * @param oldInput bộ ID mới
     * @param changeIndex thứ tự ID đã được thay đổi
     * @param colorIndex bién thể nào có màu
     * @returns
     */
    const findNextVariants = (oldInput: any[], changeIndex: number, colorIndex?: Nullable<number>) => {
        const input = oldInput.filter(num => !!num); // trường hợp option cuối cùng = null
        const lastIndex = input.length - 1;

        let tempObj = findVariantsWithId(input);
        // if (oldInput.includes(null)) {
        //     // trường hợp option cuối cùng null => lấy ra sp có min price
        //     if (!!tempObj) return minVariantsPrice(tempObj);
        // }
        if (!!tempObj) return tempObj[0];

        //filter
        for (let j = changeIndex + 1; j <= lastIndex; j++) {
            tempObj = findVariantsWithId(input.filter((_, index) => index !== j));
            if (!!tempObj) {
                if (j == colorIndex) return tempObj[0];
                else return minVariantsPrice(tempObj);
            }
        }

        for (let k = changeIndex + 1; k <= lastIndex - 1; k++) {
            for (let l = k + 1; l <= lastIndex; l++) {
                tempObj = findVariantsWithId(input.filter((_, index) => ![k, l].includes(index)));
                if (!!tempObj) return minVariantsPrice(tempObj);
            }
        }

        tempObj = findVariantsWithId([input[changeIndex]]);
        if (!!tempObj) return minVariantsPrice(tempObj);
        return null;
    };

    /**
     * Hàm tạo ra danh sách các option dựa vào biến thể được selected
     */
    const generateOptionsFromSelected = (
        inputs: number[],
        keys: string[],
        prodList?: ProdVariants[],
        sortedMapping?: { [x: string]: Number[] },
    ) => {
        const prodVar = prodList ?? productVariant;
        const sorted = sortedMapping ?? sortedVariants; // danh sách dùng để sắp xếp
        if (!prodVar || !sorted) return;

        var sets: Set<Number>[] = [];
        for (let i = 0; i < keys.length; i++) {
            sets.push(new Set());
        }
        var recursive = (tuple: number[], index = 0) => {
            if (index == tuple.length) return;
            if (index == 0 || tuple[index - 1] == inputs[index - 1]) {
                //inputs[index - 1] có thể bị null (chưa chọn option cuối ), nhưng vẫn cho duyệt
                sets[index].add(tuple[index]);
                recursive(tuple, index + 1);
            }
        };
        prodVar.forEach(varia => {
            recursive(varia.variants);
        });

        var newOption: { [x: string]: any } = {};
        for (let i = 0; i < sets.length; i++) {
            var newArr = Array.from(sets[i]).sort((a, b) => {
                // if (!sorted) return 0;
                if (sorted[keys[i]].indexOf(a) < sorted[keys[i]].indexOf(b)) return -1;
                else return 1;
            });
            newOption[keys[i]] = newArr; // sort lại từng option dựa vào danh sách có sẵn
        }
        // console.log('new options ----------');
        // console.log(newOption);
        setOptions(newOption);
    };

    useEffect(() => {
        //khi option thay đổi , sẽ build lại giá tiền biến thể
        if (isReady) {
            var allField = Object.keys(options);
            var index = variantPriceField.map(fi => allField.indexOf(fi)); // tìm kiếm index có show price (ứng với mảng input)

            //build 1 object gồm các variant chứa list các option (price)
            //map với list id của biến thể rồi thay vào bộ input
            var newPrice = index.reduce((prev: DynamicObject, next) => {
                return {
                    ...prev,
                    [allField[next]]: options[allField[next]].map(id => {
                        var tempInput = [...trueVariant];
                        tempInput[next] = id;

                        var prod: Nullable<ProdVariants> = findNextVariants(tempInput, next, colIndex);
                        return !!prod ? prod.price : null;
                    }),
                };
            }, {});
            setVariantPrice(newPrice);
        }
    }, [isReady, options, variantPriceField, selectedVariant, mappings]);

    // fetch description dựa vào bộ biến thể
    useEffect(() => {
        let isCancelled = false;
        // điều kiện này có thể thay đổi (trường hợp sp k có variant )
        if (!detailSelectVar) return;

        const fetchDescript = async () => {
            const { product_id, id, sku } = detailSelectVar;
            try {
                const res = await axios.get(
                    `https://printerval.com/module/get-description?product_id=${product_id}&spid=${id}&variant_default_sku=${sku}`,
                    {
                        headers: {
                            'User-Agent': `printervalApp/${getVersion()}`,
                        },
                    },
                );
                //console.log(res);
                var descript = res.data?.result ?? '';
                setDescription(descript);
            } catch (e) {}
        };
        fetchDescript();
        return () => {
            isCancelled = true;
        };
    }, [detailSelectVar]);

    return {
        mappings,
        selectedVariant,
        displayOption,
        setSelectedTuple,
        variantPrice,
        gallery,
        variantReady,
        detailSelectVar,
        colIndex,
        /**
         * Tên variant hiển thị giá (style, size )
         */
        variantPriceField,

        /**
         * Check xem sp có biến thể hay không
         */
        prodNoVariant,
        description,
    };
};
