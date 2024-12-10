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

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null,
            selectedWaitingTime: null,
            selectedStyles: [],
            selectedAmenityTags: [],
            selectedServiceTags: [],
            minPrice: null,
            maxPrice: null,
            openingStartHour: null,
            openingStartMinute: null,
            closingStartHour: null,
            closingStartMinute: null,
            showSearchResults: false,
        };
    }

    handleLocationSelect = (event) => {
        this.setState({ selectedLocation: event.target.value });
    };

    handleWaitingTimeSelect = (waitingTime) => {
        this.setState({ selectedWaitingTime: waitingTime });
    };

    handleStyleSelect = (style) => {
        this.setState((prevState) => {
            const selectedStyles = [...prevState.selectedStyles];
            const styleIndex = selectedStyles.indexOf(style);
            if (styleIndex === -1) {
                selectedStyles.push(style);
            } else {
                selectedStyles.splice(styleIndex, 1);
            }
            return { selectedStyles };
        });
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

    handleSearchClick = () => {
        console.log('Search clicked');
        this.setState((prevState) => ({
            showSearchResults: !prevState.showSearchResults,
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

        const { selectedLocation, isPasswordVisible, showSearchResults } = this.state;

        return (
            <div className="homepage">
                <Header></Header>
                <div className='homepage-container'>
                    <aside className="sidebar">
                        <div className="search">
                            <input type="text" placeholder="Search by name" />
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
                                                    value={this.formatPrice(this.state.maxPrice)}
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
                                            if (value === '' || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 60)) {
                                                this.setState({ openingStartHour: value });
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
                                            this.setState({ openingStartHour: value });
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
                                        if (value === '' || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 60)) {
                                            this.setState({ openingStartHour: value });
                                        }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.waiting-time" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedWaitingTime === '5m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('5m')}
                                    >5m</button>
                                    <button
                                        className={this.state.selectedWaitingTime === '15m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('15m')}
                                    >15m</button>
                                    <button
                                        className={this.state.selectedWaitingTime === '30m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('30m')}
                                    >30m</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.style.title" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedStyles.includes('Vintage') ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Vintage')}
                                    >Vintage</button>
                                    <button
                                        className={this.state.selectedStyles.includes('Modern') ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Modern')}
                                    >Modern</button>
                                    <button
                                        className={this.state.selectedStyles.includes('Eco-Friendly') ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('Eco-Friendly')}
                                    >Eco-Friendly</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Amenity tags</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedAmenityTags.includes('Wifi') ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect('Wifi')}
                                    >Wifi</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes('Parking') ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect('Parking')}
                                    >Parking</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes('Air Conditioning') ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect('Air Conditioning')}
                                    >Air Conditioning</button>
                                    <button
                                        className={this.state.selectedAmenityTags.includes('Restroom') ? 'active' : ''}
                                        onClick={() => this.handleAmenityTagsSelect('Restroom')}
                                    >Restroom</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Service tags</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedServiceTags.includes('Table Service') ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect('Table Service')}
                                    >Table Service</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes('Takeaway') ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect('Takeaway')}
                                    >Takeaway</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes('Outdoor Seating') ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect('Outdoor Seating')}
                                    >Outdoor Seating</button>
                                    <button
                                        className={this.state.selectedServiceTags.includes('Event Hosting') ? 'active' : ''}
                                        onClick={() => this.handleServiceTagsSelect('Event Hosting')}
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
                                {Array.from({ length: 1 }).map((_, idx) => (
                                <Card
                                    key={idx}
                                    imageUrl="https://images.pexels.com/photos/26545646/pexels-photo-26545646/free-photo-of-xay-d-ng-m-u-k-t-c-u-tr-u-t-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title="Đông Tây Cafe sách"
                                    location="Hanoi"
                                ></Card>
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
