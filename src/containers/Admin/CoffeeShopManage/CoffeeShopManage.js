import React, { Component } from 'react';
import './CoffeeShopManage.scss';

class CoffeeShopManage extends Component {
    render() {
        return (
            <div className="coffee-shop-manage">
                <div className="title">Coffee Shop Management</div>
                <div className="header">
                    <div className="search-bar">
                        <input type="text" placeholder="Search" className="search-input" />
                        <button className="add-cafe-button">Add cafe</button>
                        <select className="search-filter">
                            <option value="">Search by</option>
                            <option value="name">Name</option>
                            <option value="id">Cafe ID</option>
                        </select>
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-item">
                        <p>Total</p>
                        <h3>614</h3>
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
                            <tr>
                                <td>Victoria Perez</td>
                                <td>LA-0234</td>
                                <td>1 ABC Street</td>
                                <td>30000 - 40000</td>
                                <td>...</td>
                                <td>
                                    <button className="edit-button">✎</button>
                                    <button className="delete-button">🗑</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Lena Page</td>
                                <td>LA-0234</td>
                                <td>1 ABC Street</td>
                                <td>30000 - 40000</td>
                                <td>...</td>
                                <td>
                                    <button className="edit-button">✎</button>
                                    <button className="delete-button">🗑</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Devin Harmon</td>
                                <td>LA-0234</td>
                                <td>1 ABC Street</td>
                                <td>30000 - 40000</td>
                                <td>...</td>
                                <td>
                                    <button className="edit-button">✎</button>
                                    <button className="delete-button">🗑</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Rena Paul</td>
                                <td>LA-0234</td>
                                <td>1 ABC Street</td>
                                <td>30000 - 40000</td>
                                <td>...</td>
                                <td>
                                    <button className="edit-button">✎</button>
                                    <button className="delete-button">🗑</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default CoffeeShopManage;