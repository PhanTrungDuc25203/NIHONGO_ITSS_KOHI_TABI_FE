import axios from '../axios';

const handleLogin = (usernameOrEmail, password) => {
    return axios.post('/api/login', { usernameOrEmail: usernameOrEmail, password: password });
}

const handleSearch = (name, province, waiting_time, open_time, end_time, min_price, max_price, style, service, amenity) => {
    return axios.get('/api/search-coffeshop', {
        params: {
            name: name,
            province: province,
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

export {
    handleLogin,
    handleSearch,
    handleSignUp,
    fetchCoffeeShopDetail,
    isFavoriteCoffeeShop,
};