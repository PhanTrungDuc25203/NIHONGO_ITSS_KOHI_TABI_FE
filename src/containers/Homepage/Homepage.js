import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../../utils";
import './Homepage.scss';
import './../../components/Card/Card'
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
                            <input type="text" placeholder="Search by name" />
                            <button className='homepage-btn'>Search</button>
                        </div>
                        <div className="filters">
                            <div className="filter-group">
                                <h4>Location</h4>
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
                                <h4>Price range</h4>
                                <div className='price-range-input'>
                                    <input
                                        type="text"
                                        className="input-price"
                                        placeholder="Min Price"
                                        value={this.state.minPrice || ''}
                                        onChange={(e) => this.handleMinPriceChange(e.target.value)}
                                    />
                                    <p>to</p>
                                    <input
                                        type="text"
                                        className="input-price"
                                        placeholder="Max Price"
                                        value={this.state.maxPrice || ''}
                                        onChange={(e) => this.handleMaxPriceChange(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Opening time</h4>
                                <div className='opening-time-input'>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="7"
                                        value={this.state.openingStartHour || ''}
                                        onChange={(e) => this.setState({ openingStartHour: e.target.value })}
                                    />
                                    <p>:</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="30"
                                        value={this.state.openingStartMinute || ''}
                                        onChange={(e) => this.setState({ openingStartMinute: e.target.value })}
                                    />
                                    <p>-</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="21"
                                        value={this.state.closingStartHour || ''}
                                        onChange={(e) => this.setState({ closingStartHour: e.target.value })}
                                    />
                                    <p>:</p>
                                    <input
                                        type="text"
                                        className="input-time"
                                        placeholder="30"
                                        value={this.state.closingStartMinute || ''}
                                        onChange={(e) => this.setState({ closingStartMinute: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Waiting time</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedWaitingTime === '15m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('15m')}
                                    >2h</button>
                                    <button
                                        className={this.state.selectedWaitingTime === '30m' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('30m')}
                                    >30m</button>
                                    <button
                                        className={this.state.selectedWaitingTime === '1h' ? 'active' : ''}
                                        onClick={() => this.handleWaitingTimeSelect('1h')}
                                    >3h</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Style</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedStyle === 'modern' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('modern')}
                                    >Modern</button>
                                    <button
                                        className={this.state.selectedStyle === 'vintage' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('vintage')}
                                    >Vintage</button>
                                    <button
                                        className={this.state.selectedStyle === 'freestyle' ? 'active' : ''}
                                        onClick={() => this.handleStyleSelect('freestyle')}
                                    >Freestyle</button>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h4>Other tags</h4>
                                <div className='btn-group'>
                                    <button
                                        className={this.state.selectedOtherTags.includes('cat') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('cat')}
                                    >Cat</button>
                                    <button
                                        className={this.state.selectedOtherTags.includes('dog') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('dog')}
                                    >Dog</button>
                                    <button
                                        className={this.state.selectedOtherTags.includes('for-kids') ? 'active' : ''}
                                        onClick={() => this.handleOtherTagsSelect('for-kids')}
                                    >For kids</button>
                                </div>
                            </div>
                        </div>
                        <button className='homepage-btn'>Open map</button>
                    </aside>
                    <main className="content">
                        <section className="card-section">
                            <h4>For you</h4>
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
                            <h4>Recent</h4>
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
                            <h4>Favorite</h4>
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
