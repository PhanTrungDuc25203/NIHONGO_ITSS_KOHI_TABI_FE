import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import { getCoffeeShopData, getMaxDrinkId, getMaxAmenityId, getMaxServiceId, updateCoffeeShop } from '../../../services/userService';
import all_icons from '../../../assets/Icons/all_icons';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { withRouter } from 'react-router-dom';

import './EditCoffeeShop.scss';

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

class EditCoffeeShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coffeeShopData: null,
            loading: true,
            error: null,
            drinks: [],
            amenities: [],
            services: [],
            deleteDrinks: [],
            deleteAmenities: [],
            deleteServices: []
        };
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        try {
            const coffeeShopData = await getCoffeeShopData(id);
            console.log("coffee shop data:", coffeeShopData);
            this.setState({
                coffeeShopData,
                drinks: coffeeShopData.data.drinks,
                amenities: coffeeShopData.data.amenities,
                services: coffeeShopData.data.services,
                loading: false
            });
        } catch (error) {
            console.error('Error getting coffee shop data:', error);
            this.setState({ error, loading: false });
        }
    }

    handleSaveButtonClick = async () => {
        const {
            cid,
            name,
            province_vie,
            address,
            open_hour,
            close_hour,
            min_price,
            max_price,
            description_eng,
            description_jap,
            style,
            picture
        } = this.state.coffeeShopData.data;

        const updatedData = {
            cid,
            name,
            province_id: province_vie,
            address,
            open_hour,
            close_hour,
            min_price,
            max_price,
            description_en: description_eng,
            description_jp: description_jap,
            style,
            picture,
            drinks: this.state.drinks,
            amenities: this.state.amenities,
            services: this.state.services,
            deleteDrinks: this.state.deleteDrinks,
            deleteAmenities: this.state.deleteAmenities,
            deleteServices: this.state.deleteServices
        };

        console.log('updatedData:', updatedData);

        try {
            const response = await updateCoffeeShop(updatedData);
            if (response.errCode === 0) {
                alert('Coffee shop updated successfully');
            } else {
                alert('Failed to update coffee shop: ' + response.errMessage);
            }
        } catch (error) {
            console.error('Error updating coffee shop:', error);
            alert('Error updating coffee shop: ' + error.message);
        }
    };

    handleAddDrink = async () => {
        const drinkId = await getMaxDrinkId();
        const maxExistingId = Math.max(...this.state.drinks.map(drink => drink.did), 0);
        const newId = Math.max(drinkId.maxId, maxExistingId) + 1;

        const newDrink = {
            did: newId,
            name_vi: '',
            name_eng: '',
            name_ja: '',
            price: '',
            picture: ''
        };
        this.setState((prevState) => ({
            drinks: [...prevState.drinks, newDrink]
        }));
    };

    handleDeleteDrink = (index) => {
        this.setState((prevState) => {
            const updatedDrinks = [...prevState.drinks];
            const deleteDrinks = [...prevState.deleteDrinks, updatedDrinks[index].did];
            updatedDrinks.splice(index, 1);
            return { drinks: updatedDrinks, deleteDrinks };
        });
    };

    handleAddAmenity = async () => {
        const amenityId = await getMaxAmenityId();
        const maxExistingId = Math.max(...this.state.amenities.map(amenity => amenity.aid), 0);
        const newId = Math.max(amenityId.maxId, maxExistingId) + 1;

        const newAmenity = {
            aid: newId,
            name_eng: '',
            name_jap: '',
            Include_amenity: { price: '' }
        };
        this.setState((prevState) => ({
            amenities: [...prevState.amenities, newAmenity]
        }));
    };

    handleDeleteAmenity = (index) => {
        this.setState((prevState) => {
            const updatedAmenities = [...prevState.amenities];
            const deleteAmenities = [...prevState.deleteAmenities, updatedAmenities[index].aid];
            updatedAmenities.splice(index, 1);
            return { amenities: updatedAmenities, deleteAmenities };
        });
    };

    handleAddService = async () => {
        const serviceId = await getMaxServiceId();
        const maxExistingId = Math.max(...this.state.services.map(service => service.sid), 0);
        const newId = Math.max(serviceId.maxId, maxExistingId) + 1;

        const newService = {
            sid: newId,
            name_eng: '',
            name_jap: '',
            Include_service: { price: '' }
        };
        this.setState((prevState) => ({
            services: [...prevState.services, newService]
        }));
    };

    handleDeleteService = (index) => {
        this.setState((prevState) => {
            const updatedServices = [...prevState.services];
            const deleteServices = [...prevState.deleteServices, updatedServices[index].sid];
            updatedServices.splice(index, 1);
            return { services: updatedServices, deleteServices };
        });
    };

    handleInputChange = (e, field, index, type) => {
        const value = e.target.value;
        this.setState((prevState) => {
            const updatedData = { ...prevState };
            if (type === 'drink') {
                updatedData.drinks[index][field] = value;
            } else if (type === 'amenity') {
                if (field === 'Include_amenity.price') {
                    updatedData.amenities[index].Include_amenity.price = value;
                } else {
                    updatedData.amenities[index][field] = value;
                }
            } else if (type === 'service') {
                if (field === 'Include_service.price') {
                    updatedData.services[index].Include_service.price = value;
                } else {
                    updatedData.services[index][field] = value;
                }
            }
            return updatedData;
        });
    };

    handleUploadImage = async (files, type, index) => {
        if (!files || files.length === 0) {
            alert('Please select an image to upload.');
            return;
        }

        const file = files[0];
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validFormats.includes(file.type)) {
            alert('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
            return;
        }

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
                body: formData,
            });
            const data = await response.json();

            if (type === 'shop') {
                this.setState((prevState) => ({
                    coffeeShopData: {
                        ...prevState.coffeeShopData,
                        data: {
                            ...prevState.coffeeShopData.data,
                            picture: data.secure_url,
                        },
                    },
                }));
            } else if (type === 'drink') {
                const updatedDrinks = [...this.state.coffeeShopData.data.drinks];
                updatedDrinks[index].picture = data.secure_url;
                this.setState((prevState) => ({
                    coffeeShopData: {
                        ...prevState.coffeeShopData,
                        data: {
                            ...prevState.coffeeShopData.data,
                            drinks: updatedDrinks,
                        },
                    },
                }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
        }
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            coffeeShopData: {
                ...prevState.coffeeShopData,
                data: {
                    ...prevState.coffeeShopData.data,
                    [name]: value,
                },
            },
        }));
    };

    handleBackButtonClick = () => {
        this.props.history.push('/system/coffee-shop-manage');
    };

    render() {
        const { id } = this.props.match.params;
        const { coffeeShopData, loading, error, drinks, amenities, services } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div>
                <Layout>
                    <div className="edit-coffee-shop">
                        <div className="edit-header">
                            <div>
                                <button className='back-btn'onClick={this.handleBackButtonClick}> 
                                &lt; Back to CafeList 
                                </button>
                                <div className='title'>
                                    <h5>New Cafe</h5>
                                </div>
                            </div>
                        </div>
                        <div className='edit-content'>
                            <div className='coffee-shop-image image-upload'>
                                <ImageUpload
                                    onUpload={(files) => this.handleUploadImage(files, 'shop')}
                                    uploadedImage={coffeeShopData.data.picture}
                                />
                            </div>
                            <div className='coffee-shop-info'>
                                <div className='coffee-shop-id'>
                                    <label>Cafe ID:</label>
                                    <input type='text' className='id-input' value={coffeeShopData.data.cid} readOnly />
                                </div>
                                <div className="coffee-shop-name">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.name = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }}
                                        value={coffeeShopData.data.name} />
                                </div>
                                <div className="coffee-shop-province">
                                    <label>Province:</label>
                                    <select
                                        value={coffeeShopData.data.province_vie || ''}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.province_vie = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }}
                                    >
                                        {provinces.map((province, index) => (
                                            <option key={index} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="coffee-shop-address">
                                    <label>Address:</label>
                                    <input
                                        type="text"
                                        value={coffeeShopData.data.address}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.address = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                </div>
                                <div className="price-range">
                                    <label>Price Range:</label>
                                    <input
                                        type="text"
                                        value={coffeeShopData.data.min_price}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.min_price = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                    <span>to</span>
                                    <input
                                        type="text"
                                        value={coffeeShopData.data.max_price}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.max_price = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                </div>
                                <div className="open-from">
                                    <label>Open From:</label>
                                    <input
                                        type="text"
                                        value={coffeeShopData.data.open_hour}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.open_hour = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                    <span>to</span>
                                    <input
                                        type="text"
                                        value={coffeeShopData.data.close_hour}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.close_hour = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                </div>
                                <div className='featured-drinks'>
                                    <div className='featured-drinks-header'>
                                        <label>Featured Drinks:</label>
                                        <button onClick={this.handleAddDrink}>+ New Drink</button>
                                    </div>
                                    <div className='drink-list'>
                                        {drinks.map((drink, index) => (
                                            <div key={index} className='drink-item'>
                                                <div className='id-input-container'>
                                                    <label>Drink ID</label>
                                                    <input className='id-input' type='text' value={drink.did} readOnly />
                                                </div>
                                                <div className='image-upload'>
                                                    <ImageUpload
                                                        onUpload={(files) => this.handleUploadImage(files, 'drink', index)}
                                                        uploadedImage={drink.picture}
                                                    />
                                                </div>
                                                <div>
                                                    <input type='text' placeholder='Vietnamese' value={drink.name_vi} onChange={(e) => this.handleInputChange(e, 'name_vi', index, 'drink')} />
                                                </div>
                                                <div>
                                                    <input type='text' placeholder='English' value={drink.name_eng} onChange={(e) => this.handleInputChange(e, 'name_eng', index, 'drink')} />
                                                </div>
                                                <div>
                                                    <input type='text' placeholder='Japanese' value={drink.name_ja} onChange={(e) => this.handleInputChange(e, 'name_ja', index, 'drink')} />
                                                </div>
                                                <div>
                                                    <input type='text' placeholder='Price' value={drink.price} onChange={(e) => this.handleInputChange(e, 'price', index, 'drink')} />
                                                </div>
                                                <button
                                                    className='delete-btn'
                                                    onClick={() => this.handleDeleteDrink(index)}
                                                >−</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='coffee-shop-description_eng'>
                                    <label>Description (English):</label>
                                    <textarea
                                        value={coffeeShopData.data.description_eng}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.description_eng = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                </div>
                                <div className='coffee-shop-description_jap'>
                                    <label>Description (Japanese):</label>
                                    <textarea
                                        value={coffeeShopData.data.description_jap}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.description_jap = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }} />
                                </div>

                                <div className="coffee-shop-style">
                                    <label>Style:</label>
                                    <select
                                        value={coffeeShopData.data.style || ''}
                                        onChange={(e) => {
                                            const updatedData = { ...coffeeShopData };
                                            updatedData.data.style = e.target.value;
                                            this.setState({ coffeeShopData: updatedData });
                                        }}
                                    >
                                        {styles.map((style, index) => (
                                            <option key={index} value={style}>{style}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='amenities'>
                                    <div className='amenities-header'>
                                        <label>Amenities:</label>
                                        <button
                                            className='amenity-item'
                                            onClick={this.handleAddAmenity}>
                                            + New Amenity
                                        </button>
                                    </div>
                                    <div className='amenity-list'>
                                        {amenities.map((amenity, index) => (
                                            <div key={index} className='amenity-item'>
                                                <input className='id-input-container' type='text' value={amenity.aid} readOnly />
                                                <input type='text' placeholder='English' value={amenity.name_eng} onChange={(e) => this.handleInputChange(e, 'name_eng', index, 'amenity')} />
                                                <input type='text' placeholder='Japanese' value={amenity.name_jap} onChange={(e) => this.handleInputChange(e, 'name_jap', index, 'amenity')} />
                                                <input type='text' placeholder='Price' value={amenity.Include_amenity.price} onChange={(e) => this.handleInputChange(e, 'Include_amenity.price', index, 'amenity')} />
                                                <button
                                                    className='delete-btn'
                                                    onClick={() => this.handleDeleteAmenity(index)}
                                                >−</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='services'>
                                    <div className='services-header'>
                                        <label>Services:</label>
                                        <button
                                            className='service-item'
                                            onClick={this.handleAddService}>
                                            + New Service
                                        </button>
                                    </div>
                                    <div className='service-list'>
                                        {services.map((service, index) => (
                                            <div key={index} className='service-item'>
                                                <input className='id-input-container' type='text' value={service.sid} readOnly />
                                                <input type='text' placeholder='English' value={service.name_eng} onChange={(e) => this.handleInputChange(e, 'name_eng', index, 'service')} />
                                                <input type='text' placeholder='Japanese' value={service.name_jap} onChange={(e) => this.handleInputChange(e, 'name_jap', index, 'service')} />
                                                <input type='text' placeholder='Price' value={service.Include_service.price} onChange={(e) => this.handleInputChange(e, 'Include_service.price', index, 'service')} />
                                                <button
                                                    className='delete-btn'
                                                    onClick={() => this.handleDeleteService(index)}
                                                >−
                                                </button>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className='save-button-container'>
                            <button onClick={this.handleSaveButtonClick}>Save</button>
                        </div>
                    </div>
                </Layout>
            </div>
        );
    }
}

export default withRouter(EditCoffeeShop);