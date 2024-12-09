import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { KeyCodeUtils, LanguageUtils, languages } from "../../utils";
import './Homepage.scss';
import './../../components/Card/Card'
import { FormattedMessage } from "react-intl";
import Header from '../../components/Users/Header';
import Card from './../../components/Card/Card';
import { handleSearch } from '../../services/userService';

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
            showSearchResults: false,
            namesAndProvinces: [],
        };
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
        console.log('Search clicked');
        this.setState((prevState) => ({
            showSearchResults: !prevState.showSearchResults,
        }));
        const { name, selectedLocation, selectedWaitingTime, selectedStyle, selectedAmenityTags, selectedServiceTags, minPrice, maxPrice, openingStartHour, openingStartMinute, closingStartHour, closingStartMinute } = this.state;
        try {
            let response = await handleSearch(name, selectedLocation, selectedWaitingTime, openingStartHour + ':' + openingStartMinute + ':0', closingStartHour + ':' + closingStartMinute + ':0', minPrice, maxPrice, selectedStyle, selectedServiceTags[0], selectedAmenityTags[0]);
            console.log('Search data: ', response);
            const coffeeShops = response.coffeShops || [];
            console.log('hihi:', coffeeShops);
            const namesAndProvinces = coffeeShops.map(shop => ({
                name: shop.name,
                provinceVie: shop.province_vie,
                provinceJap: shop.province_jap
            }));
            console.log('Names and Provinces:', namesAndProvinces);
            this.setState({namesAndProvinces});
            console.log('haha: ', this.state.namesAndProvinces);
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

    render() {
        const provinces = [
                'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
                'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau',
                'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai',
                'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương',
                'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang',
                'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
                'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
                'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La',
                'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
                'TP Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
        ];

        const { selectedLocation, isPasswordVisible, showSearchResults, namesAndProvinces = [] } = this.state;

        return (
            <div className="homepage">
                <Header></Header>
                <div className='homepage-container'>
                    <aside className="sidebar">
                        <div className="search">
                            <input 
                            type="text" 
                            placeholder="Search by name" 
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                            />
                            <button className='homepage-btn' onClick={this.handleSearchClick}>Search</button>
                        </div>
                        <div className="filters">
                            <div className="filter-group select-container">
                                <h4>Province</h4>
                                <select
                                    value={selectedLocation || ''}
                                    onChange={this.handleLocationSelect}
                                >
                                    <option value="">Select a province</option>
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
                                    >5m</button>
                                    <button
                                        className={this.state.selectedWaitingTime === WaitingTime.FIFTEEN_MINUTES ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('FIFTEEN_MINUTES')}
                                    >15m</button>
                                    <button
                                        className={this.state.selectedWaitingTime === WaitingTime.THIRTY_MINUTES ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('THIRTY_MINUTES')}
                                    >30m</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.style.title" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedStyle === 'Vintage' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Vintage')}
                                    >Vintage</button>
                                    <button
                                        className={this.state.selectedStyle === 'Modern' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Modern')}
                                    >Modern</button>
                                    <button
                                        className={this.state.selectedStyle === 'Eco-Friendly' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Eco-Friendly')}
                                    >Eco-Friendly</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Amenity tags</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.WIFI) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.WIFI)}
                                    >Wifi</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.PARKING) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.PARKING)}
                                    >Parking</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.AIR_CONDITIONING) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.AIR_CONDITIONING)}
                                    >Air Conditioning</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes(Amenity.RESTROOM) ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect(Amenity.RESTROOM)}
                                    >Restroom</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Service tags</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.TABLE_SERVICE) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.TABLE_SERVICE)}
                                    >Table Service</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.TAKEAWAY) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.TAKEAWAY)}
                                    >Takeaway</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.OUTDOOR_SEATING) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.OUTDOOR_SEATING)}
                                    >Outdoor Seating</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes(Service.EVENT_HOSTING) ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect(Service.EVENT_HOSTING)}
                                    >Event Hosting</button>
                                </div>
                            </div>
                        </div>
                        <button className='homepage-btn'><FormattedMessage id="homepage.sidebar.filters.open-map" /></button>
                    </aside>
                    <main className="content">
                        {showSearchResults && (
                        <section className="card-section">
                            <h4>Search Result</h4>
                            <div className="cards">
                            {namesAndProvinces.map((shop, idx) => (
                                <Card
                                    key={idx}
                                    imageUrl="https://images.pexels.com/photos/26545646/pexels-photo-26545646/free-photo-of-xay-d-ng-m-u-k-t-c-u-tr-u-t-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title={shop.name}
                                    location={shop.provinceVie || shop.provinceJap}
                                />
                            ))}
                            </div>
                        </section>
                        )}
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.for-you" /></h4>
                            <div className="cards">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                <Card
                                    key={idx}
                                    imageUrl="https://images.pexels.com/photos/26545646/pexels-photo-26545646/free-photo-of-xay-d-ng-m-u-k-t-c-u-tr-u-t-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title="Đông Tây Cafe sách"
                                    location="Hanoi"
                                ></Card>
                                ))}
                            </div>
                        </section>
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.recent" /></h4>
                            <div className="cards">
                                {Array.from({ length: 6 }).map((_, idx) => (
                                <Card
                                key={idx}
                                imageUrl="https://images.pexels.com/photos/26545646/pexels-photo-26545646/free-photo-of-xay-d-ng-m-u-k-t-c-u-tr-u-t-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                title="Đông Tây Cafe sách"
                                location="Hanoi"
                            ></Card>
                                ))}
                            </div>
                        </section>
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.favorite" /></h4>
                            <div className="cards">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Card
                                        key={idx}
                                        imageUrl="https://images.pexels.com/photos/26545646/pexels-photo-26545646/free-photo-of-xay-d-ng-m-u-k-t-c-u-tr-u-t-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        title="Đông Tây Cafe sách"
                                        location="Hanoi"
                                    ></Card>
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
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
