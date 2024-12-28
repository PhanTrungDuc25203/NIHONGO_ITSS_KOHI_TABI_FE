import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import './AddCoffeeShop.scss';
import all_icons from '../../../assets/Icons/all_icons';
import { addCoffeeShop } from '../../../services/userService';
import e from 'cors';

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

const styles = ['Vintage', 'Modern', 'Eco-Friendly'];

class AddCoffeeShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            province_id: '',
            address: '',
            open_hour: '',
            close_hour: '',
            min_price: '',
            max_price: '',
            description_en: '',
            description_jp: '',
            style: '',
            picture: ''
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'province_id' || name === 'style') {
            this.setState({ [name]: parseInt(value) });
        } else {
            this.setState({ [name]: value });
        }
    }

    handleAddCoffeeShop = async () => {
        const {
            name, province_id, address, open_hour, close_hour,
            min_price, max_price, description_en, description_jp, style, picture
        } = this.state;

        const coffeeShopData = {
            name,
            province_id,
            address,
            open_hour,
            close_hour,
            min_price,
            max_price,
            description_en,
            description_jp,
            style,
            picture
        };

        try {
            const response = await addCoffeeShop(coffeeShopData);
            if (response.errCode === 0) {
                alert('Coffee shop added successfully!');
                this.props.history.push('/system/coffee-shop-manage');
                // Redirect or clear form
            } else {
                alert('Failed to add coffee shop: ' + response.errMessage);
                console.log(response);
            }
        } catch (error) {
            console.error('Error adding coffee shop:', error);
            alert('An error occurred while adding the coffee shop.');
        }
    }

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
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Province</label>
                                    <select
                                        name="province_id"
                                        value={this.state.province_id}
                                        onChange={this.handleChange}
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map((province, index) => (
                                            <option key={index} value={index + 1}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={this.state.address}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Price range</label>
                                    <div className="range-input">
                                        <input
                                            type="text"
                                            name="min_price"
                                            placeholder="Min price"
                                            value={this.state.min_price}
                                            onChange={this.handleChange}
                                        />
                                        to
                                        <input
                                            type="text"
                                            name="max_price"
                                            placeholder="Max price"
                                            value={this.state.max_price}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label>Open from</label>
                                    <div className="time-input">
                                        <input
                                            type="text"
                                            name="open_hour"
                                            placeholder="Open time"
                                            value={this.state.open_hour}
                                            onChange={this.handleChange}
                                        />
                                        to
                                        <input
                                            type="text"
                                            name="close_hour"
                                            placeholder="Close time"
                                            value={this.state.close_hour}
                                            onChange={this.handleChange}
                                        />
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
                                    <textarea
                                        name="description_en"
                                        placeholder="Description"
                                        value={this.state.description_en}
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div>
                                    <label>Description Japanese</label>
                                    <textarea
                                        name="description_jp"
                                        placeholder="Description Japanese"
                                        value={this.state.description_jp}
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div>
                                    <label>Style</label>
                                    <select
                                        name="style"
                                        value={this.state.style}
                                        onChange={this.handleChange}
                                    >
                                        <option value="">Select Style</option>
                                        {styles.map((style, index) => (
                                            <option key={index} value={index + 1}>{style}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Picture URL</label>
                                    <input
                                        type="text"
                                        name="picture"
                                        placeholder="Picture URL"
                                        value={this.state.picture}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className='add-button-container'>
                                    <button className="add-button" onClick={this.handleAddCoffeeShop}>+ Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AddCoffeeShop;