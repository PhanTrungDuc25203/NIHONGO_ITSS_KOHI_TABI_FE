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
            selectedStyle: null,
            selectedOtherTags: [],
            minPrice: null,
            maxPrice: null,
            openingStartHour: null,
            openingStartMinute: null,
            closingStartHour: null,
            closingStartMinute: null,
        };
    }

    handleLocationSelect = (location) => {
        this.setState({ selectedLocation: location });
    };

    handleWaitingTimeSelect = (waitingTime) => {
        this.setState({ selectedWaitingTime: waitingTime });
    };

    handleStyleSelect = (style) => {
        this.setState({ selectedStyle: style });
    };

    handleOtherTagsSelect = (tag) => {
        this.setState((prevState) => {
            const selectedOtherTags = [...prevState.selectedOtherTags];
            const tagIndex = selectedOtherTags.indexOf(tag);
            if (tagIndex === -1) {
                selectedOtherTags.push(tag);
            } else {
                selectedOtherTags.splice(tagIndex, 1);
            }
            return { selectedOtherTags };
        });
    };

    handleMinPriceChange = (minPrice) => {
        this.setState({ minPrice: minPrice });
    };

    handleMaxPriceChange = (maxPrice) => {
        this.setState({ maxPrice: maxPrice });
    };

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            isPasswordVisible: !prevState.isPasswordVisible,
        }));
    };

    render() {
        const { isPasswordVisible } = this.state;

        return (
            <div className="homepage">
                <Header></Header>
                <div className='homepage-container'>
                    <aside className="sidebar">
                        <div className="search">
                            <FormattedMessage id="homepage.sidebar.search-box" >
                                {
                                    (placeholderText) => (
                                        <input type="text" placeholder={placeholderText} />
                                    )
                                }
                            </FormattedMessage>
                            <button className='homepage-btn'><FormattedMessage id="homepage.sidebar.search" /></button>
                        </div>
                        <div className="filters">
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.location" /></h4>
                                <div className="btn-group">
                                    <button
                                        className={this.state.selectedLocation === 'hanoi' ? 'active' : ''}
                                        onClick={() => this.handleLocationSelect('hanoi')}
                                    >Hanoi</button>
                                    <button
                                        className={this.state.selectedLocation === 'hochiminh' ? 'active' : ''}
                                        onClick={() => this.handleLocationSelect('hochiminh')}
                                    >Ho Chi Minh</button>
                                    <button
                                        className={this.state.selectedLocation === 'danang' ? 'active' : ''}
                                        onClick={() => this.handleLocationSelect('danang')}
                                    >Da Nang</button>
                                </div>
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
                                                    value={this.state.minPrice || ''}
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
                                                    value={this.state.maxPrice || ''}
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
                                                console.log(value);
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
                                                console.log(value);
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
                                                console.log(value);
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
                                                console.log(value);
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
                                        className={this.state.selectedWaitingTime === '15m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('15m')}
                                    ><FormattedMessage id="homepage.sidebar.filters.2h" /></button>
                                    <button
                                        className={this.state.selectedWaitingTime === '30m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('30m')}
                                    ><FormattedMessage id="homepage.sidebar.filters.30m" /></button>
                                    <button
                                        className={this.state.selectedWaitingTime === '1h' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('1h')}
                                    ><FormattedMessage id="homepage.sidebar.filters.3h" /></button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.style.title" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedStyle === 'modern' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('modern')}
                                    ><FormattedMessage id="homepage.sidebar.filters.style.modern" /></button>
                                    <button
                                        className={this.state.selectedStyle === 'vintage' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('vintage')}
                                    ><FormattedMessage id="homepage.sidebar.filters.style.vintage" /></button>
                                    <button
                                        className={this.state.selectedStyle === 'freestyle' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('freestyle')}
                                    ><FormattedMessage id="homepage.sidebar.filters.style.freestyle" /></button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4><FormattedMessage id="homepage.sidebar.filters.other-tags.title" /></h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedOtherTags.includes('cat') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('cat')}
                                    ><FormattedMessage id="homepage.sidebar.filters.other-tags.cat" /></button>
                                    <button
                                        className={this.state.selectedOtherTags.includes('dog') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('dog')}
                                    ><FormattedMessage id="homepage.sidebar.filters.other-tags.dog" /></button>
                                    <button
                                        className={this.state.selectedOtherTags.includes('for-kids') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('for-kids')}
                                    ><FormattedMessage id="homepage.sidebar.filters.other-tags.for-kids" /></button>
                                </div>
                            </div>
                        </div>
                        <button className='homepage-btn'><FormattedMessage id="homepage.sidebar.filters.open-map" /></button>
                    </aside>
                    <main className="content">
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.for-you" /></h4>
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
                        <section className="card-section">
                            <h4><FormattedMessage id="homepage.sidebar.filters.recent" /></h4>
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
