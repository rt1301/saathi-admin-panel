import Client from './index';

const helperFunc = async (routeLoc, data, reqmethod) => {
    try {
        let result;
        if (reqmethod === 'get') {
            result = await Client.get(routeLoc, {
                validateStatus: function (status) {
                    return status < 500;
                },
            });
            //console.log(result);
        }
        if (reqmethod === 'post') {
            result = await Client.post(routeLoc, data, {
                validateStatus: function (status) {
                    console.log(status);
                    return status < 500;
                },
            });
            console.log(result);
        }
        if (reqmethod === 'put') {
            result = await Client.put(routeLoc, data, {
                validateStatus: function (status) {
                    return status < 500;
                },
            });
            //console.log(result);
        }
        if (reqmethod === 'delete') {
            result = await Client.delete(routeLoc, {
                validateStatus: function (status) {
                    return status < 500;
                },
            });
            //console.log(result);
        }
        // console.log(result);
        return result.data;
    } catch (error) {
        // console.log('server error');
        console.log(error);
    }
};

const MERCHANT = 'api/merchant';
const PRODUCT = 'api/product';

export const getAllMerchants = () => helperFunc(`${MERCHANT}/list`,{},"get");
export const createMerchants = (data) => helperFunc(`${MERCHANT}/create`,data, "post");
export const getOneMerchant = (id) => helperFunc(`${MERCHANT}/read/${id}`,{},"get");
export const updateMerchant = (data, id) => helperFunc(`${MERCHANT}/update/${id}`,data,"put");
export const deleteMerchant = (id) => helperFunc(`${MERCHANT}/delete/${id}`,{},"delete");

export const getAllProducts = () => helperFunc(`${PRODUCT}/list`,{},"get");
export const createProducts = (data) => helperFunc(`${PRODUCT}/create`,data, "post");
export const getOneProduct = (id) => helperFunc(`${PRODUCT}/read/${id}`,{},"get");
export const updateProduct = (data, id) => helperFunc(`${PRODUCT}/update/${id}`,data,"put");
export const deleteProduct = (id) => helperFunc(`${PRODUCT}/delete/${id}`,{},"delete");