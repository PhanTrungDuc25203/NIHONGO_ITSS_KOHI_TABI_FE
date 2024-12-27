import React from 'react';
import Layout from '../Layout/Layout';
import './AddCoffeeShop.scss';
import all_icons from '../../../assets/Icons/all_icons';

class AddCoffeeShop extends Layout {
    render() {
        return (
            <Layout>
                <div className="add-coffee-shop">
                    <div className="back-header">
                        <button className="back-button">
                            <b>&lt;</b> Back to Cafe List
                        </button>
                        <h5>New Cafe</h5>
                    </div>
                    <div className="add-coffee-shop-content">
                        <div className="left-panel">
                            <div className="image-upload">
                                <img src={all_icons.imageUp} alt="Placeholder" />
                                <button className="upload-button">Upload Image</button>
                            </div>
                        </div>
                        <div className="right-panel">
                            <div className="add-coffee-shop-form">
                                <div>
                                    <label>Name</label>
                                    <input type="text" placeholder="Placeholder" />
                                </div>
                                <div>
                                    <label>Price range</label>
                                    <div className="range-input">
                                        <input type="text" placeholder="Placeholder" />
                                        to
                                        <input type="text" placeholder="Placeholder" />
                                    </div>
                                </div>
                                <div>
                                    <label>Open from</label>
                                    <div className="time-input">
                                        <input type="time" placeholder="Placeholder" /> to <input type="time" placeholder="Placeholder" />
                                    </div>
                                </div>
                                <div>
                                    <label>Featured drinks</label>
                                    <div className="featured-drinks">
                                        <div className="image-upload">
                                            <img src={all_icons.imageUp} alt="Placeholder" />
                                            <button className="upload-button">Upload Image</button>
                                        </div>
                                        <div className="drink-input">
                                            <input type="text" placeholder="New drink" />
                                            <input type="text" placeholder="Price" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label>Description</label>
                                    <textarea placeholder="Placeholder"></textarea>
                                </div>
                                <label>Tags</label>
                                <div>
                                    <div className="tags">
                                        <button className="tag-button">+ New Amenity</button>
                                        <button className="tag-button">+ New Service</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className='add-button-container'>
                        <button className="add-button">+ Add</button>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AddCoffeeShop;
