import axios from '../axios';

const handleLogin = (usernameOrEmail, password) => {
    return axios.post('/api/login', { usernameOrEmail: usernameOrEmail, password: password });
}

const handleSearch = (name, province, waiting_time,open_time,end_time,min_price,max_price,style,service,amenity) => {
    return axios.post('/api/search-coffeshop', {name : name, province : province, waiting_time : waiting_time,
         open_time : open_time , end_time : end_time, min_price : min_price, max_price : max_price, style : style, service : service, amenity : amenity });
}

const handleGetCoffeeShopForYou = (email) => {
    return axios.get('/api/get-coffee-shop-for-you', {
        params: { email: email }
    });
}

export {
    handleLogin,
    handleSearch,
    handleSignUp,
    fetchCoffeeShopDetail,
    handleGetCoffeeShopForYou
};