import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import './AddCoffeeShop.scss';
import all_icons from '../../../assets/Icons/all_icons';
import { addCoffeeShop, getMaxCoffeeShopId, addDrinkToCoffeeShop } from '../../../services/userService';
import { Cloudinary } from 'cloudinary-core';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';

const cloudinary = new Cloudinary({ cloud_name: 'digakeefg', secure: true });

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
            picture: '',
            drinkNameVi: '',
            drinkNameEng: '',
            drinkNameJa: '',
            drinkPrice: '',
            drinkPicture: ''
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleAddCoffeeShop = async () => {
        const {
            name, province_id, address, open_hour, close_hour,
            min_price, max_price, description_en, description_jp, style, picture,
            drinkNameVi, drinkNameEng, drinkNameJa, drinkPrice, drinkPicture
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
                let cid = await getMaxCoffeeShopId();
                const drinkData = {
                    cid: cid.maxId,
                    name_vi: drinkNameVi,
                    name_eng: drinkNameEng,
                    name_ja: drinkNameJa,
                    price: drinkPrice,
                    picture: drinkPicture
                };
                const responseDrink = await addDrinkToCoffeeShop(drinkData);
                if (responseDrink.errCode === 0) {
                    alert('Coffee shop and drink added successfully!');
                    this.props.history.push('/system/coffee-shop-manage');
                } else {
                    alert('Failed to add drink: ' + responseDrink.errMessage);
                }
            } else {
                alert('Failed to add coffee shop: ' + response.errMessage);
            }
        } catch (error) {
            console.error('Error adding coffee shop and drink:', error);
            alert('An error occurred while adding the coffee shop and drink.');
        }
    }

    handleUploadImage = async (files, type) => {
        if (!files || files.length === 0) {
            alert('Please select an image to upload.');
            return;
        }
    
        const file = files[0];
    
        // Kiểm tra định dạng file
        const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validFormats.includes(file.type)) {
            alert('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
            return;
        }
    
        // Kiểm tra kích thước file (giới hạn 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size exceeds 5MB. Please choose a smaller image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'kohitabi'); // Replace with your upload preset

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/digakeefg/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (type === 'shop') {
                this.setState({ picture: data.secure_url });
            } else if (type === 'drink') {
                this.setState({ drinkPicture: data.secure_url });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
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
                            <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'shop')} imageUrl={this.state.picture} />
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
                                        <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'drink')} imageUrl={this.state.drinkPicture} />
                                        <div className="drink-input">
                                            <input
                                                type="text"
                                                name="drinkNameVi"
                                                placeholder="New drink (Vietnamese)"
                                                value={this.state.drinkNameVi}
                                                onChange={this.handleChange}
                                            />
                                            <input
                                                type="text"
                                                name="drinkNameEng"
                                                placeholder="New drink (English)"
                                                value={this.state.drinkNameEng}
                                                onChange={this.handleChange}
                                            />
                                            <input
                                                type="text"
                                                name="drinkNameJa"
                                                placeholder="New drink (Japanese)"
                                                value={this.state.drinkNameJa}
                                                onChange={this.handleChange}
                                            />
                                            <input
                                                type="text"
                                                name="drinkPrice"
                                                placeholder="Price"
                                                value={this.state.drinkPrice}
                                                onChange={this.handleChange}
                                            />
                                            <input
                                                type="text"
                                                name="drinkPicture"
                                                placeholder="Drink Picture URL"
                                                value={this.state.drinkPicture}
                                                onChange={this.handleChange}
                                                className="coffee-shop-picture-url"
                                            />
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
                                        className="coffee-shop-picture-url"
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