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

class DetailCoffeeShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coffeeShop: null,
            loading: true,
            error: null,
            isFavorite: false,
        }
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
            });

            let isFav = await this.checkIfFavorite(id);
            this.setState({
                isFavorite: isFav,
            }, () => {
                console.log("isFavorite sau khi cập nhật:", this.state.isFavorite);
            });
        }
    }

    handleFavoriteButtonClick = async () => {
        let { id } = this.props.match.params;
        let userId = this.props.isLoggedIn ? this.props.userInfo.id : 0;

        console.log("id = " + id);
        console.log("userId = " + userId);

        console.log("isFavorite trước khi cập nhật:", this.state.isFavorite);

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
                            <div className="featured-drinks">
                                <h2><FormattedMessage id="detail-coffee-shop.featured-drink" /></h2>
                                <div className="drink-list">
                                    <div className="drink-list" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        {coffeeShop && coffeeShop.drinks && coffeeShop.drinks.map((drink, index) => (
                                            <div className="drink-item" key={index} style={{ display: 'inline-block', marginRight: '25px' }}>
                                                <img src={drink.image || defaultDrink}
                                                    alt={drink.name_eng}
                                                    onError={(e) => { e.target.src = defaultDrink; }} />
                                                <p>{drink.name_eng}</p>
                                                <p>{drink.price} VND</p>
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

                    <div>
                        <button>Ấn vào đây để vào trang tìm đường</button>
                    </div>

                    <div className="map">
                        <img src={defaultMap} alt="Map" />
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