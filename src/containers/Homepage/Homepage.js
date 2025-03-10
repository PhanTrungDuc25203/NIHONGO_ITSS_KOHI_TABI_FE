import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { withRouter, useNavigate, useHistory } from 'react-router-dom';
import { KeyCodeUtils, LanguageUtils, languages } from "../../utils";
import './Homepage.scss';
import './../../components/Card/Card'
import { FormattedMessage } from "react-intl";
import Header from '../../components/Users/Header';
import Card from './../../components/Card/Card';
import { handleSearch, handleGetCoffeeShopForYou, getListFavoriteCoffeeShop, getRecent } from '../../services/userService';

const WaitingTime = {
    FIVE_MINUTES: '1',
    FIFTEEN_MINUTES: '2',
    THIRTY_MINUTES: '3'
};

const Service = {
    TABLE_SERVICE: 1,
    TAKEAWAY: 2,
    OUTDOOR_SEATING: 3,
    EVENT_HOSTING: 4
};

const Amenity = {
    WIFI: 1,
    PARKING: 2,
    AIR_CONDITIONING: 3,
    RESTROOM: 4
};



class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            selectedLocation: null,
            selectedWaitingTime: null,
            selectedStyle: null,
            selectedAmenityTags: [],
            selectedServiceTags: [],
            minPrice: null,
            maxPrice: null,
            openingStartHour: null,
            openingStartMinute: null,
            closingStartHour: null,
            closingStartMinute: null,
            resultSearch: [],
            resultForYou: [],
            resultFavorite: [],
            resultRecent: [],
        };
    }

    componentDidMount() {
        this.handleGetDataForYou();
        this.handleGetDataFavorite();
        this.handleGetDataRecent();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.handleGetDataForYou();
            this.handleGetDataFavorite();
            this.handleGetDataRecent();
        }
    }

    handleLocationSelect = (event) => {
        this.setState({ selectedLocation: event.target.value });
    };

    handleWaitingTimeSelect = (waitingTime) => {
        const { selectedWaitingTime } = this.state;
        const updatedValue = WaitingTime[waitingTime];
        if (updatedValue !== selectedWaitingTime) {
            this.setState({ selectedWaitingTime: updatedValue });
        }
    };

    handleStyleSelect = (style) => {
        this.setState({ selectedStyle: style });
    };

    handleAmenityTagsSelect = (tag) => {
        this.setState((prevState) => {
            const selectedAmenityTags = [...prevState.selectedAmenityTags];
            const tagIndex = selectedAmenityTags.indexOf(tag);
            if (tagIndex === -1) {
                selectedAmenityTags.push(tag);
            } else {
                selectedAmenityTags.splice(tagIndex, 1);
            }
            return { selectedAmenityTags };
        });
    };

    handleServiceTagsSelect = (tag) => {
        this.setState((prevState) => {
            const selectedServiceTags = [...prevState.selectedServiceTags];
            const tagIndex = selectedServiceTags.indexOf(tag);
            if (tagIndex === -1) {
                selectedServiceTags.push(tag);
            } else {
                selectedServiceTags.splice(tagIndex, 1);
            }
            return { selectedServiceTags };
        });
    };

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            isPasswordVisible: !prevState.isPasswordVisible,
        }));
    };

    handleMinPriceChange = (value) => {
        const numericValue = value.replace(/\D/g, "");
        this.setState({ minPrice: numericValue ? parseInt(numericValue, 10) : null });
    };

    handleMaxPriceChange = (value) => {
        const numericValue = value.replace(/\D/g, "");
        this.setState({ maxPrice: numericValue ? parseInt(numericValue, 10) : null });
    };

    handleSearchClick = async () => {
        const { name, selectedWaitingTime, selectedStyle, selectedAmenityTags, selectedServiceTags, minPrice, maxPrice, openingStartHour, openingStartMinute, closingStartHour, closingStartMinute } = this.state;
        try {
            let response = await handleSearch(
                name,
                selectedWaitingTime,
                (openingStartHour === null || openingStartMinute === null) ? null : openingStartHour + ':' + openingStartMinute + ':0',
                (closingStartHour === null || closingStartMinute === null) ? null : closingStartHour + ':' + closingStartMinute + ':0',
                minPrice,
                maxPrice,
                selectedStyle,
                selectedServiceTags[0],
                selectedAmenityTags[0],
                this.props.userInfo?.id);
            const coffeeShops = response.coffeShops || [];
            const resultSearch = coffeeShops.map(shop => ({
                picture: shop.picture,
                cid: shop.cid,
                name: shop.name,
                provinceVie: shop.province_vie,
                provinceJap: shop.province_jap
            }));
            this.setState({ resultSearch });
        } catch (e) {
            console.log('Error searching: ', e);
        }
    };

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            isPasswordVisible: !prevState.isPasswordVisible,
        }));
    };

    formatPrice = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat().format(value);
    };

    handleGetDataForYou = async () => {
        const email = this.props.userInfo?.email;

        try {
            const response = await handleGetCoffeeShopForYou(email);

            if (response.errCode === 0) {
                const coffeeShops = response?.coffeeShops || [];

                const resultForYou = coffeeShops.map(shop => ({
                    picture: shop.picture,
                    cid: shop.cid,
                    name: shop.name,
                    provinceVie: shop.province_vie,
                    provinceJap: shop.province_jap
                }));

                this.setState({ resultForYou });
            }
        } catch (error) {
            console.error('Error fetching coffee shop data:', error);
        }
    };

    handleGetDataFavorite = async () => {
        const id = this.props.userInfo?.id;

        try {
            const response = await getListFavoriteCoffeeShop(id);

            if (response.errCode === 0) {

                const datas = response?.data || [];

                const resultFavorite = datas.map(data => ({
                    picture: data.coffeeShop.picture,
                    cid: data.coffeeShop.cid,
                    name: data.coffeeShop.name,
                    provinceVie: data.coffeeShop.province_vie,
                    provinceJap: data.coffeeShop.province_jap
                }))

                this.setState({ resultFavorite });
            }
        } catch (error) {
            console.error('Error fetching coffee shop data:', error);
        }
    };

    handleGetDataRecent = async () => {
        const id = this.props.userInfo?.id;

        try {
            const response = await getRecent(id);

            if (response.errCode === 0) {

                const coffeeShops = response?.coffeeShops || [];

                const resultRecent = coffeeShops.map(data => ({
                    picture: data.picture,
                    cid: data.cid,
                    name: data.name,
                    provinceVie: data.province_vie,
                    provinceJap: data.province_jap
                }))

                this.setState({ resultRecent });
            }
        } catch (error) {
            console.error('Error fetching coffee shop data:', error);
        }
    };

    handleNavigateToDetail(shopId) {
        this.props.history.push(`/detail-coffee-shop/${shopId}`);
    }

    handleOpenMap() {
        this.props.history.push(`/find-map/`);
    }


    render() {
        const provinces = [
            '< 1km', '< 2km', '< 3km', '< 5km', '< 10km', '< 15km', '>= 15km'
        ];


        const { selectedLocation, isPasswordVisible, resultSearch, resultForYou, resultFavorite, resultRecent = [] } = this.state;

        return (
            <div className="homepage">
                <Header></Header>
                <div className='homepage-container'>
                    <aside className="sidebar">
                        <div className="search">
                            <FormattedMessage id="homepage.sidebar.search-box" >
                                {
                                    (placeholderText) => (
                                        <input
                                            type="text"
                                            placeholder={placeholderText}
                                            value={this.state.name}
                                            onChange={(e) => this.setState({ name: e.target.value })}
                                        />
                                    )
                                }
                            </FormattedMessage>
                            <button className='homepage-btn' onClick={this.handleSearchClick}><FormattedMessage id="homepage.sidebar.search" /></button>
                        </div>
                        <div className="filters">
                            <div className="filter-group select-container">
                                <h4><FormattedMessage id="homepage.sidebar.filters.location" /></h4>
                                <select
                                    value={selectedLocation || ''}
                                    onChange={this.handleLocationSelect}
                                >
                                    <option value="">
                                        {this.props.language === languages.JA ? '距離を選んでください' : 'Select distance'}
                                    </option>
                                    {provinces.map((province, index) => (
                                        <option key={index} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.price-range" /></h4>
                                <div className='price-range-input'>
                                    <FormattedMessage id="homepage.sidebar.filters.minprice" >
                                        {
                                            (placeholderText) => (
                                                <input
                                                    type="text"
                                                    className="input-price"
                                                    placeholder={placeholderText}
                                                    value={this.formatPrice(this.state.minPrice)}
                                                    onChange={(e) => this.handleMinPriceChange(e.target.value)}
                                                />
                                            )
                                        }
                                    </FormattedMessage>
                                    <p><FormattedMessage id="homepage.sidebar.filters.to" /></p>
                                    <FormattedMessage id="homepage.sidebar.filters.maxprice" >
                                        {
                                            (placeholderText) => (
                                                <input
                                                    type="text"
                                                    className="input-price"
                                                    placeholder={placeholderText}
                                                    value={this.formatPrice(this.state.maxPrice)}
                                                    onChange={(e) => this.handleMaxPriceChange(e.target.value)}
                                                />
                                            )
                                        }
                                    </FormattedMessage>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.opening-time" /></h4>
                                <div className='opening-time-input'>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="7"
                                        value={this.state.openingStartHour || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value === '' || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 24)) {
                                                this.setState({ openingStartHour: value });
                                            }
                                        }}
                                    />
                                    <p>:</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="30"
                                        value={this.state.openingStartMinute || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 60)) {
                                                this.setState({ openingStartMinute: value });
                                            }
                                        }}
                                    />
                                    <p>-</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="21"
                                        value={this.state.closingStartHour || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value === '' || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 24)) {
                                                this.setState({ closingStartHour: value });
                                            }
                                        }}
                                    />
                                    <p>:</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="30"
                                        value={this.state.closingStartMinute || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 60)) {
                                                this.setState({ closingStartMinute: value });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.waiting-time" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedWaitingTime === WaitingTime.FIVE_MINUTES ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('FIVE_MINUTES')}
                                    >{this.props.language === languages.JA ? '５分' : '5m'}</button>
                                    <button
                                        className={this.state.selectedWaitingTime === WaitingTime.FIFTEEN_MINUTES ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('FIFTEEN_MINUTES')}
                                    >{this.props.language === languages.JA ? '１５分' : '15m'}</button>
                                    <button
                                        className={this.state.selectedWaitingTime === WaitingTime.THIRTY_MINUTES ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('THIRTY_MINUTES')}
                                    >{this.props.language === languages.JA ? '３０分' : '30m'}</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.style.title" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedStyle === 'Vintage' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Vintage')}
                                    >{this.props.language === languages.JA ? 'コワーキング' : 'Co-Working'}</button>
                                    <button
                                        className={this.state.selectedStyle === 'Modern' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Modern')}
                                    >{this.props.language === languages.JA ? '話' : 'Talking'}</button>
                                    <button
                                        className={this.state.selectedStyle === 'Eco-Friendly' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Eco-Friendly')}
                                    >{this.props.language === languages.JA ? '猫' : 'Cat'}</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>{this.props.language === languages.JA ? 'アメニティ' : 'Amenity tags'}</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.WIFI) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.WIFI)}
                                    >{this.props.language === languages.JA ? 'ワイファイ' : 'Wifi'}</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.PARKING) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.PARKING)}
                                    >{this.props.language === languages.JA ? '駐車場' : 'Parking'}</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.AIR_CONDITIONING) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.AIR_CONDITIONING)}
                                    >{this.props.language === languages.JA ? 'エアコン' : 'Air Conditioning'}</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.RESTROOM) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.RESTROOM)}
                                    >{this.props.language === languages.JA ? 'トイレ' : 'Restroom'}</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>{this.props.language === languages.JA ? 'サービスタグ' : 'Serviece tags'}</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.TABLE_SERVICE) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.TABLE_SERVICE)}
                                    >{this.props.language === languages.JA ? 'テーブルサービス' : 'Table Service'}</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.TAKEAWAY) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.TAKEAWAY)}
                                    >{this.props.language === languages.JA ? 'テイクアウト' : 'Takeaway'}</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.OUTDOOR_SEATING) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.OUTDOOR_SEATING)}
                                    >{this.props.language === languages.JA ? '屋外座席' : 'Outdoor Seating'}</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.EVENT_HOSTING) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.EVENT_HOSTING)}
                                    >{this.props.language === languages.JA ? 'イベント開催' : 'Event Hosting'}</button>
                                </div>
                            </div>
                        </div>
                        <button className='homepage-btn'
                            onClick={() => this.handleOpenMap()}
                        ><FormattedMessage id="homepage.sidebar.filters.open-map" /></button>
                    </aside>
                    <main className="content">
                        {(resultSearch.length > 0) && (
                            <section className="card-section">
                                <h4>{this.props.language === languages.JA ? '結果' : 'Search result'}</h4>
                                <div className="cards">
                                    {resultSearch.map((shop, idx) => (
                                        <Card
                                            key={idx}
                                            imageUrl={shop.picture}
                                            title={shop.name}
                                            location={shop.provinceVie || shop.provinceJap}
                                            onClick={() => this.handleNavigateToDetail(shop.cid)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.for-you" /></h4>
                            <div className="cards">
                                {resultForYou.map((shop, idx) => (
                                    <Card
                                        key={idx}
                                        imageUrl={shop.picture}
                                        title={shop.name}
                                        location={shop.provinceVie || shop.provinceJap}
                                        onClick={() => this.handleNavigateToDetail(shop.cid)}
                                    />
                                ))}
                            </div>
                        </section>
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.recent" /></h4>
                            <div className="cards">
                                {resultRecent.map((shop, idx) => (
                                    <Card
                                        key={idx}
                                        imageUrl={shop.picture}
                                        title={shop.name}
                                        location={shop.provinceVie || shop.provinceJap}
                                        onClick={() => this.handleNavigateToDetail(shop.cid)}
                                    />
                                ))}
                            </div>
                        </section>
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.favorite" /></h4>
                            <div className="cards">
                                {resultFavorite.map((shop, idx) => (
                                    <Card
                                        key={idx}
                                        imageUrl={shop.picture}
                                        title={shop.name}
                                        location={shop.provinceVie || shop.provinceJap}
                                        onClick={() => this.handleNavigateToDetail(shop.cid)}
                                    />
                                ))}
                            </div>
                        </section>
                    </main>
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));