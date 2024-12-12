import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './DetailCoffeeShop.scss';
import Header from '../../components/Users/Header';
import { fetchCoffeeShopDetail } from '../../services/userService';
import defaultCoffeeShop from '../../assets/images/coffee_shop/default.jpg';
import defaultMap from '../../assets/images/map/default.png';
import defaultDrink from '../../assets/images/drinks/default.png';
import * as actions from "../../store/actions";


class DetailCoffeeShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coffeeShop: null,
            loading: true,
            error: null,
        }
    }

    async componentDidMount() {
        let { id } = this.props.match.params;
        let res = await fetchCoffeeShopDetail(id);
        if (res.errCode === 0) {
            this.setState({
                coffeeShop: res.data,
                loading: false,
            })
        }
    }

    render() {
        let { coffeeShop, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div className="coffee-shop-detail">
                <Header />
                <div className='navigation'>
                    <div className="back-button" onClick={() => this.props.history.goBack()}>&lt;</div>
                    <div className='title'>Cafe Details</div>
                </div>
                <div className="coffee-shop-header">
                    <img
                        src={coffeeShop && coffeeShop.picture ? coffeeShop.picture : defaultCoffeeShop}
                        alt={coffeeShop && coffeeShop.name ? coffeeShop.name : 'Tên quán không có sẵn'}
                        className="main-image"
                        onError={(e) => { e.target.src = defaultCoffeeShop; }}
                    />
                    <div className="info">
                        <h1>{coffeeShop && coffeeShop.name ? coffeeShop.name : 'Tên quán không có sẵn'}</h1>
                        <div className='info-item'>
                            <div><p><strong>Price range:</strong></p></div>
                            <div><p> {coffeeShop && coffeeShop.min_price} - {coffeeShop && coffeeShop.max_price} VND</p></div>
                            <div><p><strong>Address:</strong></p></div>
                            <div><p> {coffeeShop && coffeeShop.address}</p></div>
                            <div><p><strong>Open from:</strong></p></div>
                            <div><p> {coffeeShop && coffeeShop.open_hour} - {coffeeShop && coffeeShop.close_hour}</p></div>
                        </div>
                        <div className="featured-drinks">
                            <h2>Featured drinks:</h2>
                            <div className="drink-list">
                                {coffeeShop && coffeeShop.drinks && coffeeShop.drinks.slice(0, 4).map((drink, index) => ( // Hiển thị tối đa 3 drinks
                                    <div className="drink-item" key={index}>
                                        <img src={drink.image || defaultDrink}
                                            alt={drink.name_eng}
                                            onError={(e) => { e.target.src = defaultDrink; }} />
                                        <p>{drink.name_eng}</p>
                                        <p>{drink.price} VND</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="description">
                            <h2>Description:</h2>
                            <p>{coffeeShop && coffeeShop.description_eng}</p>
                            <p>{this.props.isLoggedIn ?
                                this.props.userInfo.name
                                :
                                'Mèo Béo'}</p>
                        </div>
                    </div>
                </div>

                <div>

                </div>

                <div className="map">
                    <img src={defaultMap} alt="Map" />
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

export default connect()(DetailCoffeeShop);