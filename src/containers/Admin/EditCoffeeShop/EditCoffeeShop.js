import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import { getCoffeeShopData, getMaxDrinkId, getMaxAmenityId, getMaxServiceId } from '../../../services/userService';
import all_icons from '../../../assets/Icons/all_icons';

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
            error: null
        };
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        try {
            const coffeeShopData = await getCoffeeShopData(id);
            console.log("coffee shop data:", coffeeShopData);
            this.setState({ coffeeShopData, loading: false });
        } catch (error) {
            console.error('Error getting coffee shop data:', error);
            this.setState({ error, loading: false });
        }
    }

    handleAddDrink = async () => {

        const drinkId = await getMaxDrinkId();
        const maxExistingId = Math.max(...this.state.coffeeShopData.data.drinks.map(drink => drink.did), 0);
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
            coffeeShopData: {
                ...prevState.coffeeShopData,
                data: {
                    ...prevState.coffeeShopData.data,
                    drinks: [...prevState.coffeeShopData.data.drinks, newDrink]
                }
            }
        }));
    };

    handleDeleteDrink = (index) => {
        this.setState((prevState) => {
            const updatedDrinks = [...prevState.coffeeShopData.data.drinks];
            updatedDrinks.splice(index, 1);
            return {
                coffeeShopData: {
                    ...prevState.coffeeShopData,
                    data: {
                        ...prevState.coffeeShopData.data,
                        drinks: updatedDrinks
                    }
                }
            };
        });
    };

    handleAddAmenity = async () => {

        const amenityId = await getMaxAmenityId();
        const maxExistingId = Math.max(...this.state.coffeeShopData.data.amenities.map(amenity => amenity.aid), 0);
        const newId = Math.max(amenityId.maxId, maxExistingId) + 1;

        const newAmenity = {
            aid: newId,
            name_eng: '',
            name_jap: '',
            Include_amenity: { price: '' }
        };
        this.setState((prevState) => ({
            coffeeShopData: {
                ...prevState.coffeeShopData,
                data: {
                    ...prevState.coffeeShopData.data,
                    amenities: [...prevState.coffeeShopData.data.amenities, newAmenity]
                }
            }
        }));
    };

    handleAddService = async () => {

        const serviceId = await getMaxServiceId();
        const maxExistingId = Math.max(...this.state.coffeeShopData.data.services.map(service => service.sid), 0);
        const newId = Math.max(serviceId.maxId, maxExistingId) + 1;

        const newService = {
            sid: newId,
            name_eng: '',
            name_jap: '',
            Include_service: { price: '' }
        };
        this.setState((prevState) => ({
            coffeeShopData: {
                ...prevState.coffeeShopData,
                data: {
                    ...prevState.coffeeShopData.data,
                    services: [...prevState.coffeeShopData.data.services, newService]
                }
            }
        }))
    }

    handleDeleteAmenity = (index) => {
        this.setState((prevState) => {
            const updatedAmenities = [...prevState.coffeeShopData.data.amenities];
            updatedAmenities.splice(index, 1);
            return {
                coffeeShopData: {
                    ...prevState.coffeeShopData,
                    data: {
                        ...prevState.coffeeShopData.data,
                        amenities: updatedAmenities
                    }
                }
            };
        });
    };

    handleDeleteService = (index) => {
        this.setState((prevState) => {
            const updatedServices = [...prevState.coffeeShopData.data.services];
            updatedServices.splice(index, 1);
            return {
                coffeeShopData: {
                    ...prevState.coffeeShopData,
                    data: {
                        ...prevState.coffeeShopData.data,
                        services: updatedServices
                    }
                }
            };
        });
    };

    render() {
        const { id } = this.props.match.params;
        const { coffeeShopData, loading, error } = this.state;

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
                                <h2>Edit Coffee Shop {id}</h2>
                            </div>
                        </div>
                        <div className='edit-content'>
                            <div className='coffee-shop-image'>
                                <img src={this.state.coffeeShopData.data.picture} alt='coffee shop' />
                            </div>
                            <div className='coffee-shop-info'>
                                <div className='coffee-shop-id'>
                                    <label>Cafe ID:</label>
                                    <input type='text' className='id-input' readOnly value={this.state.coffeeShopData.data.cid} />
                                </div>
                                <div className="coffee-shop-name">
                                    <label>Name:</label>
                                    <input type="text" value={this.state.coffeeShopData.data.name} />
                                </div>
                                <div className="coffee-shop-province">
                                    <label>Province:</label>
                                    <select
                                        value={this.state.coffeeShopData.data.province_vie || ''}
                                        onChange={(e) => {
                                            const updatedData = { ...this.state.coffeeShopData };
                                            updatedData.data.province = e.target.value;
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
                                    <input type="text" value={this.state.coffeeShopData.data.address} />
                                </div>
                                <div className="price-range">
                                    <label>Price Range:</label>
                                    <input type="text" value={this.state.coffeeShopData.data.min_price} />
                                    <span>to</span>
                                    <input type="text" value={this.state.coffeeShopData.data.max_price} />
                                </div>
                                <div className="open-from">
                                    <label>Open From:</label>
                                    <input type="text" value={this.state.coffeeShopData.data.open_hour} />
                                    <span>to</span>
                                    <input type="text" value={this.state.coffeeShopData.data.close_hour} />
                                </div>
                                <div className='featured-drinks'>
                                    <div className='featured-drinks-header'>
                                        <label>Featured Drinks:</label>
                                        <button onClick={this.handleAddDrink}>+ New Drink</button>
                                    </div>
                                    <div className='drink-list'>
                                        {this.state.coffeeShopData.data.drinks.map((drink, index) => (
                                            <div key={index} className='drink-item'>
                                                <div>
                                                    <label>Drink ID</label>
                                                    <input className='id-input' type='text' value={drink.did} readOnly/>
                                                </div>
                                                <div>
                                                    <img src={drink.picture ? drink.picture : all_icons.imageUp} alt='drink' />
                                                </div>
                                                <div>
                                                    {/* <label>Drink Name (Vietnamese)</label> */}
                                                    <input type='text' placeholder='Vietnamese' value={drink.name_vi} />
                                                </div>
                                                <div>
                                                    {/* <label>Drink Name (English)</label> */}
                                                    <input type='text' placeholder='English' value={drink.name_eng} />
                                                </div>
                                                <div>
                                                    {/* <label>Drink Name (Japanese)</label> */}
                                                    <input type='text' placeholder='Japanese' value={drink.name_ja} />
                                                </div>
                                                <div>
                                                    {/* <label>Price</label> */}
                                                    <input type='text' placeholder='Price' value={drink.price} />
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
                                    <textarea value={this.state.coffeeShopData.data.description_eng} />
                                </div>
                                <div className='coffee-shop-description_jap'>
                                    <label>Description (Japanese):</label>
                                    <textarea value={this.state.coffeeShopData.data.description_jap} />
                                </div>

                                <div className="coffee-shop-style">
                                    <label>Style:</label>
                                    <select
                                        value={this.state.coffeeShopData.data.style || ''}
                                        onChange={(e) => {
                                            const updatedData = { ...this.state.coffeeShopData };
                                            updatedData.data.styles = e.target.value;
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
                                        {this.state.coffeeShopData.data.amenities.map((amenity, index) => (
                                            <div key={index} className='amenity-item'>
                                                <input type='text' value={amenity.aid} readOnly/>
                                                <input type='text' placeholder='English' value={amenity.name_eng} />
                                                <input type='text' placeholder='Japanese' value={amenity.name_jap} />
                                                <input type='text' placeholder='Price' value={amenity.Include_amenity.price} />
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
                                        {this.state.coffeeShopData.data.services.map((service, index) => (
                                            <div key={index} className='service-item'>
                                                <input type='text' value={service.sid} readOnly/>
                                                <input type='text' placeholder='English' value={service.name_eng} />
                                                <input type='text' placeholder='Japanese' value={service.name_jap} />
                                                <input type='text' placeholder='Price' value={service.Include_service.price} />
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
                            <button>Save</button>
                        </div>
                    </div>
                </Layout>
            </div>
        );
    }
}

export default EditCoffeeShop;