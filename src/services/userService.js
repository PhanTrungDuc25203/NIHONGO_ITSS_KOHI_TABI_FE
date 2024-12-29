import { add } from 'lodash';
import axios from '../axios';

const handleLogin = (usernameOrEmail, password) => {
    return axios.post('/api/login', { usernameOrEmail: usernameOrEmail, password: password });
}

const handleSearch = (name, waiting_time, open_time, end_time, min_price, max_price, style, service, amenity) => {
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
            amenity: amenity
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
    const amenityData = coffeeShopData.amenities;
    const serviceData = coffeeShopData.services
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
    return {
        errCode: 0,
        newCoffeeShop,
    }
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
};