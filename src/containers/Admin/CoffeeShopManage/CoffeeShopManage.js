import React, { Component } from 'react';
import './CoffeeShopManage.scss';
import { getAllCoffeeShopData } from '../../../services/userService';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";

class CoffeeShopManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coffeeShops: [],
            filteredShops: [],
            currentPage: 1,
            itemsPerPage: 6,
            searchTerm: '',
            searchFilter: 'name',
        };
    }

    async componentDidMount() {
        try {
            let response = await getAllCoffeeShopData();
            if (response.errCode === 0) {
                this.setState({
                    coffeeShops: response.shop,
                    filteredShops: response.shop
                });
            } else {
                console.error('Error fetching coffee shop data:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching coffee shop data:', error);
        }
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    handleSearch = (event) => {
        const searchTerm = event?.target?.value?.toLowerCase();
        const { coffeeShops, searchFilter } = this.state;

        const filteredShops = coffeeShops.filter(shop => {
            if (searchFilter === 'name') {
                return shop.name.toLowerCase().includes(searchTerm);
            } else if (searchFilter === 'id') {
                return shop.cid.toString().toLowerCase().includes(searchTerm);
            } else if (searchFilter === 'address') {
                return shop.address.toLowerCase().includes(searchTerm);
            }
            return false;
        });

        this.setState({ searchTerm, filteredShops, currentPage: 1 });
    };

    handleFilterChange = (event) => {
        this.setState({ searchFilter: event.target.value }, this.handleSearch);
    };

    renderPagination = () => {
        const { filteredShops, currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

        if (totalPages <= 1) return null;

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
        const pages = [];

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination">
                <button
                    className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => this.handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ←
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        className={`page-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => this.handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => this.handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    →
                </button>
            </div>
        );
    };

    render() {
        const { filteredShops, currentPage, itemsPerPage } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentCoffeeShops = filteredShops.slice(startIndex, startIndex + itemsPerPage);

        return (
            <div className="coffee-shop-manage">
                <div className="title">Coffee Shop Management</div>

                <div className="header">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            onChange={(event) => { this.handleSearch(event) }}
                        />
                        <select
                            className="search-filter"
                            onChange={(event) => { this.handleFilterChange(event) }}
                            defaultValue="name"
                        >
                            <option value="name">Name</option>
                            <option value="id">Cafe ID</option>
                            <option value="address">Address</option>
                        </select>
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-item">
                        <p>Total</p>
                        <h3>{filteredShops.length}</h3>
                    </div>
                    <div className="summary-item">
                        <p>Most Favorited</p>
                        <h3>Victoria Perez</h3>
                    </div>
                    <div className="summary-item">
                        <p>Most Searched</p>
                        <h3>Lena Page</h3>
                    </div>
                </div>

                <div className="cafe-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Cafe ID</th>
                                <th>Address</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCoffeeShops.map((shop) => (
                                <tr key={shop.cid}>
                                    <td>{shop.name}</td>
                                    <td>{shop.cid}</td>
                                    <td>{shop.address}</td>
                                    <td>{`${shop.min_price} - ${shop.max_price}`}</td>
                                    <td>{shop.description_eng}</td>
                                    <td>
                                        <button className="edit-button">✎</button>
                                        <button className="delete-button">🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {this.renderPagination()}
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoffeeShopManage));
