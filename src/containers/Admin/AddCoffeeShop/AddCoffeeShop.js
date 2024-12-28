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
            drinks: []
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleDrinkChange = (index, e) => {
        const { name, value } = e.target;
        const drinks = [...this.state.drinks];
        drinks[index][name] = value;
        this.setState({ drinks });
    }

    handleAddDrink = () => {
        this.setState((prevState) => ({
            drinks: [...prevState.drinks, { name_vi: '', name_eng: '', name_ja: '', price: '', picture: '' }]
        }));
    }

    handleUploadImage = async (files, type, index) => {
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
                const drinks = [...this.state.drinks];
                drinks[index].picture = data.secure_url;
                this.setState({ drinks });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
        }
    }

    handleAddCoffeeShop = async () => {
        const {
            name, province_id, address, open_hour, close_hour,
            min_price, max_price, description_en, description_jp, style, picture, drinks
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
                let cidResponse = await getMaxCoffeeShopId();
                let cid = cidResponse.maxId;
                for (const drink of drinks) {
                    const drinkData = {
                        cid: cid,
                        name_vi: drink.name_vi,
                        name_eng: drink.name_eng,
                        name_ja: drink.name_ja,
                        price: drink.price,
                        picture: drink.picture
                    };
                    const responseDrink = await addDrinkToCoffeeShop(drinkData);
                    if (responseDrink.errCode !== 0) {
                        alert('Failed to add drink: ' + responseDrink.errMessage);
                        return;
                    }
                }
                alert('Coffee shop and drinks added successfully!');
                this.props.history.push('/system/coffee-shop-manage');
            } else {
                alert('Failed to add coffee shop: ' + response.errMessage);
            }
        } catch (error) {
            console.error('Error adding coffee shop and drinks:', error);
            alert('An error occurred while adding the coffee shop and drinks.');
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
                            <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'shop')} uploadedImage={this.state.picture} />
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
                                        <div className='drink'>
                                            {this.state.drinks.map((drink, index) => (
                                                <div key={index} className="drink-item">
                                                    <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'drink', index)} uploadedImage={drink.picture} />
                                                    <div className="drink-input">
                                                        <input
                                                            type="text"
                                                            name="name_vi"
                                                            placeholder="New drink (Vietnamese)"
                                                            value={drink.name_vi}
                                                            onChange={(e) => this.handleDrinkChange(index, e)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="name_eng"
                                                            placeholder="New drink (English)"
                                                            value={drink.name_eng}
                                                            onChange={(e) => this.handleDrinkChange(index, e)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="name_ja"
                                                            placeholder="New drink (Japanese)"
                                                            value={drink.name_ja}
                                                            onChange={(e) => this.handleDrinkChange(index, e)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            placeholder="Price"
                                                            value={drink.price}
                                                            onChange={(e) => this.handleDrinkChange(index, e)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="picture"
                                                            placeholder="Drink Picture URL"
                                                            value={drink.picture}
                                                            onChange={(e) => this.handleDrinkChange(index, e)}
                                                            className="coffee-shop-picture-url"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={this.handleAddDrink}>+ Add Drink</button>

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
                                <div className="coffee-shop-picture-url">
                                    <label>Picture URL</label>
                                    <input
                                        type="text"
                                        name="picture"
                                        placeholder="Picture URL"
                                        value={this.state.picture}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className='tag-container'>
                                    <div>
                                        <label>Tag</label>
                                    </div>
                                    <div>
                                        <button>+ New Amenity</button>
                                    </div>
                                    <div>
                                        <button>+ New Service</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='add-button-container'>
                        <button className="add-button" onClick={this.handleAddCoffeeShop}>+ Add</button>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AddCoffeeShop;