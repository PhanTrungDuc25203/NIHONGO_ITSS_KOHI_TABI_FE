import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import { connect } from 'react-redux';
import { withRouter, useNavigate, useHistory } from 'react-router-dom';
import './AddCoffeeShop.scss';
import all_icons from '../../../assets/Icons/all_icons';
import { addCoffeeShop, getMaxCoffeeShopId, addDrinkToCoffeeShop, addAmenity, addAmenityToCoffeeShop, addService, addServiceToCoffeeShop } from '../../../services/userService';
import { Cloudinary } from 'cloudinary-core';
import { KeyCodeUtils, LanguageUtils, languages } from "../../../utils";
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
            drinks: [],
            amenities: [],
            services: [],
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

    handleAmenityChange = (index, e) => {
        const { name, value } = e.target;
        const amenities = [...this.state.amenities];
        amenities[index][name] = value;
        this.setState({ amenities });
    }

    handleAddAmenity = () => {
        this.setState((prevState) => ({
            amenities: [...prevState.amenities, { name_eng: '', name_jap: '', price: '' }]
        }));
    }

    handleServiceChange = (index, e) => {
        const { name, value } = e.target;
        const services = [...this.state.services];
        services[index][name] = value;
        this.setState({ services });
    }

    handleAddService = () => {
        this.setState((prevState) => ({
            services: [...prevState.services, { name_eng: '', name_jap: '', price: '' }]
        }));
    }

    handleUploadImage = async (files, type, index) => {
        if (!files || files.length === 0) {
            alert('Please select an image to upload.');
            return;
        }

        const file = files[0];

        // Kiểm tra định dạng file
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
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
            min_price, max_price, description_en, description_jp, style, picture, drinks, amenities, services
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
                for (const amenity of amenities) {
                    const amenityData1 = {
                        name_eng: amenity.name_eng,
                        name_jap: amenity.name_jap
                    };
                    const responseAmenity1 = await addAmenity(amenityData1);
                    if (responseAmenity1.errCode !== 0) {
                        alert('Failed to add amenity: ' + responseAmenity1.errMessage);
                        return;
                    }
                    const amenityData2 = {
                        cid: cid,
                        aid: responseAmenity1.newAmenity.aid,
                        price: amenity.price
                    };
                    const responseAmenity2 = await addAmenityToCoffeeShop(amenityData2);
                    if (responseAmenity2.errCode !== 0) {
                        alert("Failed to add amenity to coffee shop: " + responseAmenity2.errMessage);
                        return;
                    }
                }

                for (const service of services) {
                    const serviceData1 = {
                        name_eng: service.name_eng,
                        name_jap: service.name_jap,
                    }
                    const responseService1 = await addService(serviceData1);
                    if (responseService1.errCode !== 0) {
                        alert('Failed to add service: ' + responseService1.errMessage);
                        return;
                    }
                    const serviceData2 = {
                        cid: cid,
                        sid: responseService1.newService.sid,
                        price: service.price
                    }
                    const responseService2 = await addServiceToCoffeeShop(serviceData2);
                    if (responseService2.errCode !== 0) {
                        alert("Failed to add service to coffee shop: " + responseService2.errMessage);
                        return;
                    }
                }

                alert('Coffee shop, drinks, amenities and services added successfully!');
                this.props.history.push('/system/coffee-shop-manage');
            } else {
                alert('Failed to add coffee shop: ' + response.errMessage);
            }
        } catch (error) {
            console.error('Error adding coffee shop, drinks, amenities and services:', error);
            alert('An error occurred while adding the coffee shop, drinks, amenities and services.');
        }
    }

    render() {
        return (
            <Layout>
                <div className="add-coffee-shop">
                    <div className="back-header">
                        <button className="back-button">
                            <b>&lt;</b> {this.props.language === languages.JA ? 'カフェリストに戻る' : 'Back to Cafe List'}
                        </button>
                        <h5>{this.props.language === languages.JA ? '新しいカフェ' : 'New Cafe'}</h5>
                    </div>
                    <div className="add-coffee-shop-content">
                        <div className="left-panel">
                            <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'shop')} uploadedImage={this.state.picture} />
                        </div>
                        <div className="right-panel">
                            <div className="add-coffee-shop-form">
                                <div>
                                    <label>{this.props.language === languages.JA ? '名前' : 'Name'}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={this.props.language === languages.JA ? '名前' : 'Name'}
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '県' : 'Province'}</label>
                                    <select
                                        name="province_id"
                                        value={this.state.province_id}
                                        onChange={this.handleChange}
                                    >
                                        <option value="">{this.props.language === languages.JA ? '県を選択' : 'Select Province'}</option>
                                        {provinces.map((province, index) => (
                                            <option key={index} value={index + 1}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '住所' : 'Address'}</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder={this.props.language === languages.JA ? '住所' : 'Address'}
                                        value={this.state.address}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '価格帯' : 'Price range'}</label>
                                    <div className="range-input">
                                        <input
                                            type="text"
                                            name="min_price"
                                            placeholder={this.props.language === languages.JA ? '最小価格' : 'Min price'}
                                            value={this.state.min_price}
                                            onChange={this.handleChange}
                                        />
                                        {this.props.language === languages.JA ? '~ ' : 'to '}
                                        <input
                                            type="text"
                                            name="max_price"
                                            placeholder={this.props.language === languages.JA ? '最大価格' : 'Max price'}
                                            value={this.state.max_price}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '営業時間' : 'Open from'}</label>
                                    <div className="time-input">
                                        <input
                                            type="text"
                                            name="open_hour"
                                            placeholder={this.props.language === languages.JA ? '開店時間' : 'Open time'}
                                            value={this.state.open_hour}
                                            onChange={this.handleChange}
                                        />
                                        {this.props.language === languages.JA ? '~ ' : 'to '}
                                        <input
                                            type="text"
                                            name="close_hour"
                                            placeholder={this.props.language === languages.JA ? '閉店時間' : 'Close time'}
                                            value={this.state.close_hour}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className='add-btn-ctn'>
                                        <label>{this.props.language === languages.JA ? 'おすすめドリンク' : 'Featured drinks'}</label>
                                        <div className='add-btn'>
                                            <button type="button" onClick={this.handleAddDrink}>{this.props.language === languages.JA ? '+ ドリンクを追加' : '+ Add Drink'}</button>
                                        </div>
                                    </div>
                                    <div className="featured-drinks">
                                        {this.state.drinks.map((drink, index) => (
                                            <div key={index} className="drink-item">
                                                <ImageUpload onUpload={(files) => this.handleUploadImage(files, 'drink', index)} uploadedImage={drink.picture} />
                                                <div className="drink-input">
                                                    <input
                                                        type="text"
                                                        name="name_vi"
                                                        placeholder={this.props.language === languages.JA ? '新しいドリンク (ベトナム語)' : 'New drink (Vietnamese)'}
                                                        value={drink.name_vi}
                                                        onChange={(e) => this.handleDrinkChange(index, e)}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="name_eng"
                                                        placeholder={this.props.language === languages.JA ? '新しいドリンク (英語)' : 'New drink (English)'}
                                                        value={drink.name_eng}
                                                        onChange={(e) => this.handleDrinkChange(index, e)}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="name_ja"
                                                        placeholder={this.props.language === languages.JA ? '新しいドリンク (日本語)' : 'New drink (Japanese)'}
                                                        value={drink.name_ja}
                                                        onChange={(e) => this.handleDrinkChange(index, e)}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="price"
                                                        placeholder={this.props.language === languages.JA ? '価格' : 'Price'}
                                                        value={drink.price}
                                                        onChange={(e) => this.handleDrinkChange(index, e)}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="picture"
                                                        placeholder={this.props.language === languages.JA ? 'ドリンク画像URL' : 'Drink Picture URL'}
                                                        value={drink.picture}
                                                        onChange={(e) => this.handleDrinkChange(index, e)}
                                                        className="coffee-shop-picture-url"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {/* <button type="button" onClick={this.handleAddDrink}>+ Add Drink</button> */}
                                    </div>
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '説明' : 'Description'}</label>
                                    <textarea
                                        name="description_en"
                                        placeholder={this.props.language === languages.JA ? '説明' : 'Description'}
                                        value={this.state.description_en}
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? '説明 (日本語)' : 'Description Japanese'}</label>
                                    <textarea
                                        name="description_jp"
                                        placeholder={this.props.language === languages.JA ? '説明 (日本語)' : 'Description Japanese'}
                                        value={this.state.description_jp}
                                        onChange={this.handleChange}
                                    ></textarea>
                                </div>
                                <div>
                                    <label>{this.props.language === languages.JA ? 'スタイル' : 'Style'}</label>
                                    <select
                                        name="style"
                                        value={this.state.style}
                                        onChange={this.handleChange}
                                    >
                                        <option value="">{this.props.language === languages.JA ? 'スタイルを選択' : 'Select Style'}</option>
                                        {styles.map((style, index) => (
                                            <option key={index} value={index + 1}>{style}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="amenities">
                                    <div className='add-btn-ctn'>
                                        <label>{this.props.language === languages.JA ? '設備' : 'Amenities'}</label>
                                        <div className='add-btn'>
                                            <button type="button" onClick={this.handleAddAmenity}>{this.props.language === languages.JA ? '+ 設備を追加' : '+ Add Amenity'}</button>
                                        </div>
                                    </div>

                                    <div className="amenities-list">
                                        {this.state.amenities.map((amenity, index) => (
                                            <div key={index} className="amenity-item">
                                                <input
                                                    type="text"
                                                    name="name_eng"
                                                    placeholder="Amenity (English)"
                                                    value={amenity.name_eng}
                                                    onChange={(e) => this.handleAmenityChange(index, e)}
                                                />
                                                <input
                                                    type="text"
                                                    name="name_jap"
                                                    placeholder="Amenity (Japanese)"
                                                    value={amenity.name_jap}
                                                    onChange={(e) => this.handleAmenityChange(index, e)}
                                                />
                                                <input
                                                    type="text"
                                                    name="price"
                                                    placeholder="Price"
                                                    value={amenity.price}
                                                    onChange={(e) => this.handleAmenityChange(index, e)}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="services">
                                    <div className='add-btn-ctn'>
                                        <label>{this.props.language === languages.JA ? 'サービス' : 'Services'}</label>
                                        <div className='add-btn'>
                                            <button type="button" onClick={this.handleAddService}>{this.props.language === languages.JA ? '+ サービスを追加' : '+ Add Service'}</button>
                                        </div>
                                    </div>

                                    <div className="services-list">
                                        {this.state.services.map((service, index) => (
                                            <div key={index} className="service-item">
                                                <input
                                                    type="text"
                                                    name="name_eng"
                                                    placeholder="Service (English)"
                                                    value={service.name_eng}
                                                    onChange={(e) => this.handleServiceChange(index, e)}
                                                />
                                                <input
                                                    type="text"
                                                    name="name_jap"
                                                    placeholder="Service (Japanese)"
                                                    value={service.name_jap}
                                                    onChange={(e) => this.handleServiceChange(index, e)}
                                                />
                                                <input
                                                    type="text"
                                                    name="price"
                                                    placeholder="Price"
                                                    value={service.price}
                                                    onChange={(e) => this.handleServiceChange(index, e)}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="coffee-shop-picture-url">
                                    <label>{this.props.language === languages.JA ? '画像URL' : 'Picture URL'}</label>
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

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddCoffeeShop));