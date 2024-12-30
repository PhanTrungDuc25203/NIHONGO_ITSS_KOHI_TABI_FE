import { add } from 'lodash';
import axios from '../axios';

const handleLogin = (usernameOrEmail, password) => {
    return axios.post('/api/login', { usernameOrEmail: usernameOrEmail, password: password });
}

const handleSearch = (name, waiting_time, open_time, end_time, min_price, max_price, style, service, amenity,uid) => {
    return axios.get('/api/search-coffeshop', {
        params: {
            name: name,
            waiting_time: waiting_time,
            open_time: open_time,
            end_time: end_time,
            min_price: min_price,
            max_price: max_price,
            style: style,
            service: service,
            amenity: amenity,
            uid: uid
        }
    });
}

const fetchCoffeeShopDetail = (id) => {
    return axios.get(`/api/get-coffee-shop/${id}`);
}

const getCoffeeShopData = (id) => {
    return axios.get(`/api/get-coffee-shop-data/${id}`);
}

const isFavoriteCoffeeShop = (userId, coffeeShopId) => {
    return axios.get('/api/is-favorite-coffee-shop', {
        params: {
            user_id: userId,
            coffee_shop_id: coffeeShopId
        }
    });
};

const handleSignUp = (email, username, password, confirmPassword, phone) => {
    return axios.get('/api/signup', { params: { email: email, username: username, password: password, confirmPassword: confirmPassword, phone: phone } });
}

const handleGetCoffeeShopForYou = (email) => {
    return axios.get('/api/get-coffee-shop-for-you', {
        params: { email: email }
    });
}

const getUserProfileData = (email) => {
    return axios.get('/api/getuserdata', { params: { email: email } });
}

const updateUserProfileData = (email, phone, name, address) => {
    return axios.get('/api/saveuserdata', { params: { email: email, phone: phone, name: name, address: address } });
}

const addFavoriteCoffeeShop = (userId, coffeeShopId) => {
    return axios.post('/api/add-favorite-coffee-shop', {
        user_id: userId,
        coffee_shop_id: coffeeShopId
    });
}

const removeFavoriteCoffeeShop = (userId, coffeeShopId) => {
    return axios.put('/api/remove-favorite-coffee-shop', {
        user_id: userId,
        coffee_shop_id: coffeeShopId
    });
}

const getListFavoriteCoffeeShop = (userId) => {
    console.log(`/api/get-list-favorite-coffee-shop/${userId}`);
    return axios.get('/api/get-list-favorite-coffee-shop/' + userId);
}

const getDataForUserPreference = () => {
    return axios.get('/api/get-data-for-select-box-user-preference-page');
}

const adminChangePasswordService = (email, oldPassword, newPassword) => {
    return axios.post('/api/admin-change-password', { email: email, oldPassword: oldPassword, newPassword: newPassword });
}

const getAllCoffeeShopData = () => {
    return axios.get('/api/get-all-coffee-shops');
}

const adminDeleteCoffeeShop = (idShopToDelete) => {
    return axios.post('/api/delete-coffee-shop-by-admin', { cid: idShopToDelete });
}

const getMostFavoriteCoffeeShop = () => {
    return axios.get('/api/get-most-favorite-shop');
}


const addCoffeeShop = (coffeeShopData) => {
    return axios.post('/api/add-coffee-shop', coffeeShopData);
}

const getMaxCoffeeShopId = () => {
    return axios.get('/api/get-max-coffee-shop-id');
}

const addDrinkToCoffeeShop = (drinkData) => {
    return axios.post('/api/add-drink-to-coffee-shop', drinkData);
}

const addAmenity = (amenityData) => {
    return axios.post('/api/add-amenity', amenityData);
}

const addAmenityToCoffeeShop = (amenityData) => {
    return axios.post('/api/add-amenity-to-coffee-shop', amenityData);
}

const addService = (serviceData) => {
    return axios.post('/api/add-service', serviceData);
}

const addServiceToCoffeeShop = (serviceData) => {
    return axios.post('/api/add-service-to-coffee-shop', serviceData);
}

const getAllUser = () => {
    return axios.get('/api/getalluser');

}


const getMaxDrinkId = async () => {
    return axios.get('/api/get-max-drink-id');
}

const getMaxAmenityId = () => {
    return axios.get('/api/get-max-amenity-id');
}

const getMaxServiceId = () => {
    return axios.get('/api/get-max-service-id');
}

const updateCoffeeShop = async (coffeeShopData) => {
    const newCoffeeShop = axios.put('/api/update-coffee-shop', coffeeShopData);
    const drinks = coffeeShopData.drinks;
    const amenities = coffeeShopData.amenities;
    const services = coffeeShopData.services
    for (const drink of drinks) {

        const response = await axios.get('/api/get-max-drink-id');
        const maxId = response.maxId;
        console.log("maxDrinkId", maxId);
        console.log("drinkId", drink.did);

        if (drink.did > maxId) {
            console.log("Tạo đồ uống mới nè!");
            const drinkData = {
                did: drink.did,
                name_vi: drink.name_vi,
                name_eng: drink.name_eng,
                name_ja: drink.name_ja,
                price: drink.price,
                picture: drink.picture,
                cid: coffeeShopData.cid,
            };
            axios.post('/api/add-drink-to-coffee-shop', drinkData);
        } else {
            console.log("Hoặc là sửa drink cũ!");
            axios.put('/api/update-drink', drink);
        }
    }
    const deleteDrinks = coffeeShopData.deleteDrinks;
    console.log("deleteDrinks", deleteDrinks);
    for (const drink of deleteDrinks) {
        axios.put('/api/remove-included-drink', {
            did: drink,
            cid: coffeeShopData.cid,
        });
    }

    for (const amenity of amenities) {
        const response = await axios.get('/api/get-max-amenity-id');
        const maxId = response.maxId;
        console.log("maxAmenityId", maxId);
        console.log("amenityId", amenity.aid);

        console.log("amenity: ", amenity);

        if (amenity.aid > maxId) {
            console.log("Tạo tiện ích mới nè!");

            const amenityData1 = {
                name_eng: amenity.name_eng,
                name_jap: amenity.name_jap,
            }

            const responseAmenity1 = await addAmenity(amenityData1);
            if (responseAmenity1.errCode !== 0) {
                console.log('Failed to add amenity: ' + responseAmenity1.errMessage);
                return {
                    errCode: 0,
                    newCoffeeShop,
                }
            }
            console.log("resAmenity1: ", responseAmenity1);

            const amenityData2 = {
                cid: coffeeShopData.cid,
                aid: responseAmenity1.newAmenity.aid,
                price: amenity.Include_amenity.price,
            }

            console.log("amenityData2: ", amenityData2);

            const responseAmenity2 = await addAmenityToCoffeeShop(amenityData2);
            if (responseAmenity2.errCode !== 0) {
                console.log("Failed to add amenity to coffee shop: " + responseAmenity2.errMessage);
                return {
                    errCode: 0,
                    newCoffeeShop,
                }
            }


        } else {
            console.log("Hoặc là sửa tiện ích cũ!");
            axios.put('/api/update-amenity', amenity);
        }
    }

    const deleteAmenities = coffeeShopData.deleteAmenities;
    console.log("deleteAmenities", deleteAmenities);
    for (const amenity of deleteAmenities) {
        axios.put('/api/remove-included-amenity', {
            aid: amenity,
            cid: coffeeShopData.cid,
        });
    }

    for (const service of services) {
        const response = await axios.get('/api/get-max-service-id');
        const maxId = response.maxId;
        console.log("maxServiceId", maxId);
        console.log("serviceId", service.sid);

        if (service.sid > maxId) {
            console.log("Tạo dịch vụ mới nè!");

            const serviceData1 = {
                name_eng: service.name_eng,
                name_jap: service.name_jap
            }
            const responseService1 = await addService(serviceData1);
            if (responseService1.errCode !== 0) {
                console.log('Failed to add service: ' + responseService1.errMessage);
                return {
                    errCode: 0,
                    newCoffeeShop,
                }
            }
            const serviceData2 = {
                cid: coffeeShopData.cid,
                sid: responseService1.newService.sid,
                price: service.Include_service.price,
            }
            const responseService2 = await addServiceToCoffeeShop(serviceData2);
            if (responseService2 !== 0) {
                console.log("Failed to add service to coffee shop: " + responseService2.errMessage);
                return {
                    errCode: 0,
                    newCoffeeShop,
                }
            }
        } else {
            console.log("Hoặc là sửa dịch vụ cũ!");
            axios.put('/api/update-service', service);
        }

    }

    const deleteServices = coffeeShopData.deleteServices;
    console.log("deleteServices", deleteServices);
    for (const service of deleteServices) {
        axios.put('/api/remove-included-service', {
            sid: service,
            cid: coffeeShopData.cid,
        });
    }

    return {
        errCode: 0,
        newCoffeeShop,
    }

}

const getUserPreference = (email) => {
    return axios.get('/api/get-user-preference', { params: { email: email } });
}

const getAllUserPreference = () => {
    return axios.get('/api/get-data-for-select-box-user-preference-page');
}

const updateUserPreference = (email, stylePreference, servicePreference, amenityPreference, drinkPreference, distancePreference, timePreference) => {
    return axios.post('/api/save-user-preference', 
        { 
            email: email, 
            stylePreference: stylePreference, 
            servicePreference: servicePreference,
            amenityPreference: amenityPreference,
            drinkPreference: drinkPreference,
            distancePreference: distancePreference,
            timePreference: timePreference
        });

}

const getRecent = (uid) => {
    return axios.get('/api/getrecent', { params: { uid: uid } });
}

export {
    handleLogin,
    handleSearch,
    handleSignUp,
    fetchCoffeeShopDetail,
    isFavoriteCoffeeShop,
    handleGetCoffeeShopForYou,
    getUserProfileData,
    addFavoriteCoffeeShop,
    removeFavoriteCoffeeShop,
    updateUserProfileData,
    getListFavoriteCoffeeShop,
    getDataForUserPreference,
    adminChangePasswordService,
    getAllCoffeeShopData,
    adminDeleteCoffeeShop,
    getMostFavoriteCoffeeShop,
    addCoffeeShop,
    getMaxCoffeeShopId,
    addDrinkToCoffeeShop,
    addAmenity,
    addAmenityToCoffeeShop,
    addService,
    addServiceToCoffeeShop,
    getAllUser,
    getCoffeeShopData,
    getMaxDrinkId,
    getMaxAmenityId,
    getMaxServiceId,
    updateCoffeeShop,
    getUserPreference,
    getAllUserPreference,
    updateUserPreference,
    getRecent,
};