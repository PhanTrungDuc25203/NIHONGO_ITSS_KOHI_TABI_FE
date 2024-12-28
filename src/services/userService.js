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

const getAllUser = () => {
    return axios.get('/api/getalluser');
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
    getAllUser
};