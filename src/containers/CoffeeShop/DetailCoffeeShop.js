import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios'; 

import './DetailCoffeeShop.scss';
import Header from '../../components/Users/Header';
import { addFavoriteCoffeeShop, removeFavoriteCoffeeShop, fetchCoffeeShopDetail, isFavoriteCoffeeShop } from '../../services/userService';
import defaultCoffeeShop from '../../assets/images/coffee_shop/default.jpg';
import defaultMap from '../../assets/images/map/default.png';
import defaultDrink from '../../assets/images/drinks/default.png';
import * as actions from "../../store/actions";
import { FormattedMessage } from "react-intl";
import  likedHeart  from '../../assets/Icons/heart-liked.png';
import  likeHeart  from '../../assets/Icons/like.png';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import all_icons from '../../assets/Icons/all_icons';

class DetailCoffeeShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coffeeShop: null,
            loading: true,
            error: null,
            isFavorite: false,
            point: null,
            address: null,
        }
        this.coffeeShopMapRef = React.createRef();
    }

    checkIfFavorite = async (coffeeShopId) => {
        const userId = this.props.isLoggedIn ? this.props.userInfo.id : 0;
        const result = await isFavoriteCoffeeShop(userId, coffeeShopId);
        return result.isFavorite; // Chỉ trả về giá trị boolean
    };

    async componentDidMount() {
        let { id } = this.props.match.params;
        let res = await fetchCoffeeShopDetail(id);
        if (res.errCode === 0) {
            this.setState({
                coffeeShop: res.data,
                loading: false,
                address: res.data.address,
            });

            console.log("Address:", this.state.address);
            await this.initializeMap(res.data.address);

            let isFav = await this.checkIfFavorite(id);
            this.setState({
                isFavorite: isFav,
            }, () => {
                console.log("isFavorite:", this.state.isFavorite);
            });
        }
    }

    handleFavoriteButtonClick = async () => {
        let { id } = this.props.match.params;
        let userId = this.props.isLoggedIn ? this.props.userInfo.id : 0;

        if (this.state.isFavorite) {
            await removeFavoriteCoffeeShop(userId, id);
        } else {
            await addFavoriteCoffeeShop(userId, id);
        }

        const isFav = await this.checkIfFavorite(id);
        this.setState({
            isFavorite: isFav,
        });
    };

    componentWillUnmount() {
        if(this.coffeeShopMap) {
            this.coffeeShopMap.remove();
        }
    }

    initializeMap = async (address) => {
        let coordinates = [17.10, 5.2]; // Default coordinates
        if (address) {
            coordinates = await this.fetchCoordinates(address);
        }

        const coffeeShopMap = L.map("coffee-shop-map").setView(coordinates, 18);
        this.coffeeShopMap = coffeeShopMap;

        const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: "Leaflet &copy; " + mapLink + ", contribution",
            maxZoom: 25,
        }).addTo(coffeeShopMap);

        if (coordinates) {
            const icon = L.icon({
                iconUrl: all_icons.coffeeShop,
                iconSize: [80, 80],
            });
            this.marker = L.marker(coordinates, { icon }).addTo(coffeeShopMap);
            this.marker.on('click', this.handleIconClick); // Thêm sự kiện click vào icon
        }
    
    };

    fetchCoordinates = async (address) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`          
            );

            if (!response.ok) throw new Error("Failed to fetch geocoding data");
            const data = await response.json();

            if (data.length > 0) {

                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                return [lat, lon];

            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return [17.10, 5.2];
        }
    }

    handleIconClick = () => {
        let { id } = this.props.match.params;
        this.props.history.push('/find-map/' + id);
    }

    render() {
        let { coffeeShop, loading, error, isFavorite } = this.state;
        let { isLoggedIn, userInfo } = this.props;

        if (loading) {
            return <div><FormattedMessage id="detail-coffee-shop.loading" /></div>;
        }

        if (error) {
            return <div><FormattedMessage id="detail-coffee-shop.error" />{error}</div>;
        }

        return (
            <div className="coffee-shop-detail">
                <Header />
                <div className='content'>
                    <div className='navigation'>
                        <div className="back-button" onClick={() => this.props.history.goBack()}>&lt;</div>
                        <div className='title'><FormattedMessage id="detail-coffee-shop.cafe-detail" /></div>
                    </div>
                    <div className="coffee-shop-header">
                        <img
                            src={coffeeShop && coffeeShop.picture ? coffeeShop.picture : defaultCoffeeShop}
                            alt={coffeeShop && coffeeShop.name ? coffeeShop.name : 'Tên quán không có sẵn'}
                            className="main-image"
                            onError={(e) => { e.target.src = defaultCoffeeShop; }}
                        />
                        <div className="info">
                            <div className='info-header'>
                                <h1>{coffeeShop && coffeeShop.name ? coffeeShop.name : 'Tên quán không có sẵn'}</h1>
                                <div className='is-favorite-button'>
                                    {isFavorite ? (
                                        <button
                                            onClick={this.handleFavoriteButtonClick}
                                            className='liked-btn'
                                        >
                                            <img src={likedHeart} alt="liked" />
                                            {/* <FormattedMessage id="detail-coffee-shop.liked" /> */}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={this.handleFavoriteButtonClick}
                                            className='like-btn'
                                        >
                                            {/* <FormattedMessage id="detail-coffee-shop.like" /> */}
                                            <img src={likeHeart} alt="like" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='info-item'>
                                <div><p><strong><FormattedMessage id="detail-coffee-shop.price-range" /></strong></p></div>
                                <div><p> {coffeeShop && coffeeShop.min_price} - {coffeeShop && coffeeShop.max_price} VND</p></div>
                                <div><p><strong><FormattedMessage id="detail-coffee-shop.address" /></strong></p></div>
                                <div><p> {coffeeShop && coffeeShop.address}</p></div>
                                <div><p><strong><FormattedMessage id="detail-coffee-shop.open-from" /></strong></p></div>
                                <div><p> {coffeeShop && coffeeShop.open_hour} - {coffeeShop && coffeeShop.close_hour}</p></div>
                            </div>
                            <div className="featured-drinks-users">
                                <h2><FormattedMessage id="detail-coffee-shop.featured-drink" /></h2>
                                <div className="drink-list">
                                    <div className="drink-list" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        {coffeeShop && coffeeShop.drinks && coffeeShop.drinks.map((drink, index) => (
                                            <div className="drink-item" key={index} style={{ display: 'inline-block', marginRight: '25px' }}>
                                                <img src={drink?.picture || defaultDrink}
                                                    alt={drink?.name_eng}
                                                    onError={(e) => { e.target.src = defaultDrink; }} />
                                                <p>{drink?.name_eng}</p>
                                                <p>{drink?.Include_drink?.price} VND</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="description">
                                <h2><FormattedMessage id="detail-coffee-shop.desc" /></h2>
                                <p>{coffeeShop && coffeeShop.description_eng}</p>
                                {/* <p>{isLoggedIn && userInfo ? userInfo.name : 'Mèo Béo'}</p> */}
                            </div>
                        </div>
                    </div>


                    <div className="coffee-shop-map">
                        <div className='address-content'>
                            <input
                                type="text"
                                value={this.state.address}
                            />
                        </div>
                        <div id="coffee-shop-map" className='coffee-shop-map-container'>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailCoffeeShop));