import React, { Component } from 'react';
import './CoffeeShopManage.scss';
import { getAllCoffeeShopData, adminDeleteCoffeeShop, getMostFavoriteCoffeeShop } from '../../../services/userService';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";
import { KeyCodeUtils, LanguageUtils, languages } from "../../../utils";

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
            showDeletePopup: false,
            shopToDelete: null,
            mostFavoriteCoffeeShop: '',
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

        try {
            let response = await getMostFavoriteCoffeeShop();
            if (response.errCode === 0) {
                this.setState({
                    mostFavoriteCoffeeShop: response.favoriteShop.name,
                })
            } else {
                console.error('Error fetching most favorite coffee shop data:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching most favorite coffee shop data:', error);
        }
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    }

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

        this.setState({
            searchTerm,
            filteredShops,
            currentPage: 1
        });
    }

    handleFilterChange = (event) => {
        this.setState({
            searchFilter: event.target.value
        }, this.handleSearch);
    }

    handleDeleteClick = (shop) => {
        this.setState({
            showDeletePopup: true,
            shopToDelete: shop
        });
    }

    handleEditClick = (shop) => {
        this.props.history.push('/admin/edit-coffee-shop/' + shop.cid);
    }

    handleConfirmDelete = async () => {
        const { shopToDelete, coffeeShops } = this.state;

        if (!shopToDelete) return;

        try {
            const response = await adminDeleteCoffeeShop(shopToDelete.cid);

            if (response.errCode === 0) {
                const updatedShops = coffeeShops.filter(shop => shop.cid !== shopToDelete.cid);

                this.setState({
                    coffeeShops: updatedShops,
                    filteredShops: updatedShops,
                    showDeletePopup: false,
                    shopToDelete: null,
                });

                alert(`Successfully deleted shop: ${shopToDelete.name}`);
            } else {
                alert(`Error deleting shop: ${response.data.errMessage}`);
            }
        } catch (error) {
            console.error('Error deleting coffee shop:', error);
            alert('An unexpected error occurred while trying to delete the coffee shop.');
        }
    }

    handleCancelDelete = () => {
        this.setState({
            showDeletePopup: false,
            shopToDelete: null
        });
    }

    renderDeletePopup = () => {
        const { showDeletePopup, shopToDelete } = this.state;

        if (!showDeletePopup || !shopToDelete) return null;

        return (
            <div className="popup-overlay">
                <div className="popup">
                    <p>Are you sure you want to delete <strong>{shopToDelete.name}</strong>?</p>
                    <div className="popup-actions">
                        <button onClick={this.handleConfirmDelete} className="confirm-button">Yes</button>
                        <button onClick={this.handleCancelDelete} className="cancel-button">No</button>
                    </div>
                </div>
            </div>
        );
    }

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
    }

    handleAddNewCoffeeShop = () => {
        this.props.history.push('/admin/add-coffee-shop');
    }

    render() {
        const { filteredShops, currentPage, itemsPerPage, mostFavoriteCoffeeShop } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentCoffeeShops = filteredShops.slice(startIndex, startIndex + itemsPerPage);

        return (
            <div className="coffee-shop-manage">
                <div className="title">{this.props.language === languages.JA ? 'コーヒー管理' : 'Coffee Management'}</div>
                <div className="sub-title">{this.props.language === languages.JA ? 'コーヒーリスト' : 'Coffee list'}</div>

                <div className="header">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder={this.props.language === languages.JA ? '検索' : 'Search'}
                            className="search-input"
                            onChange={(event) => { this.handleSearch(event) }}
                        />
                        <select
                            className="search-filter"
                            onChange={(event) => { this.handleFilterChange(event) }}
                            defaultValue="name"
                        >
                            <option value="name">{this.props.language === languages.JA ? '名前' : 'Name'}</option>
                            <option value="id">{this.props.language === languages.JA ? 'カフェID' : 'Cafe ID'}</option>
                            <option value="address">{this.props.language === languages.JA ? 'アドレス' : 'Address'}</option>
                        </select>
                    </div>
                    <div className="add-button-container">
                        <button onClick={this.handleAddNewCoffeeShop}>{this.props.language === languages.JA ? '新規追加 +' : 'Add new +'}</button>
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-item">
                        <p>{this.props.language === languages.JA ? '合計' : 'Total'}</p>
                        <h3>{filteredShops.length}</h3>
                    </div>
                    <div className="summary-item">
                        <p>{this.props.language === languages.JA ? '最もお気に入り' : 'Most Favorited'}</p>
                        <h3>{mostFavoriteCoffeeShop && mostFavoriteCoffeeShop}</h3>
                    </div>
                    <div className="summary-item">
                        <p>{this.props.language === languages.JA ? '最も検索された' : 'Most Searched'}</p>
                        <h3>Lena Page</h3>
                    </div>
                </div>

                <div className="cafe-list">
                    <table>
                        <thead>
                            <tr>
                                <th>{this.props.language === languages.JA ? '名前' : 'Name'}</th>
                                <th>{this.props.language === languages.JA ? 'カフェID' : 'Cafe ID'}</th>
                                <th>{this.props.language === languages.JA ? 'アドレス' : 'Address'}</th>
                                <th>{this.props.language === languages.JA ? '価格' : 'Price'}</th>
                                <th>{this.props.language === languages.JA ? '説明' : 'Description'}</th>
                                <th>{this.props.language === languages.JA ? '操作 (アクション)' : 'Action'}</th>
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
                                        <button
                                            onClick={() => this.handleEditClick(shop)}
                                            className="edit-button">✎</button>
                                        <button
                                            className="delete-button"
                                            onClick={() => this.handleDeleteClick(shop)}
                                        >🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {this.renderPagination()}
                {this.renderDeletePopup()}
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
