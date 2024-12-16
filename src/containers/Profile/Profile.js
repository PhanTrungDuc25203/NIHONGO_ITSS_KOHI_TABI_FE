import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; // Import withRouter
import './Profile.scss';
import Header from '../../components/Users/Header';
import * as actions from "../../store/actions";
import { getUserProfileData, updateUserProfileData } from '../../services/userService';
import e from 'cors';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            name: '',
            phone: '',
            addresses: [],
            newAddress: '',
            selectedImage: '',
        };
    }

    componentDidMount() {
        this.handleGetProfile();
    }

    handleGetProfile = async () => {
        console.log('Get data profile');
        const email = this.props.match.params.email;

        try {
            const response = await getUserProfileData(email);
            const user = response.user || [];

            this.setState({
                username: user.userName || '',
                email: user.email || '',
                name: user.name || '',
                phone: user.phoneNumber || '',
                addresses: user.address || [],
            });
        } catch (error) {
            console.error('Error fetching proflie data:', error);
        }
    };

    handleInputChange = (e, field) => {
        this.setState({ [field]: e.target.value });
    };

    addAddress = () => {
        const { newAddress, addresses } = this.state;
        if (newAddress.trim()) {
            this.setState({ addresses: [...addresses, newAddress], newAddress: '' });
        }
    };

    handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.setState({ selectedImage: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    removeAddress = (index) => {
        const { addresses } = this.state;
        const newAddresses = addresses.filter((_, i) => i !== index);
        this.setState({ addresses: newAddresses });
    };

    handleLoginForUser = () => {
        this.props.processLogout();
        this.props.history.push(`/login`);
    }

    render() {
        const { username, name, email, phone, addresses, newAddress, selectedImage } = this.state;

        return (
            <div className='profile'>
                <Header />
                <div className="profile-container">
                    <h1 className="profile-title">Profile</h1>
                    <div className="profile-content">
                        <div className="profile-image">
                            <div className="image-placeholder">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Profile" />
                                ) : (
                                    <div className="placeholder">No Image</div>
                                )}
                            </div>
                            <label className="upload-button">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={this.handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <i className="icon-upload">Upload</i>
                            </label>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="label">Username:</span>
                                <span className="value">{username && username}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Email:</span>
                                <span className="value">{email && email}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Name:</span>
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="Placeholder"
                                    onChange={(e) => this.handleInputChange(e, 'name')}
                                />
                            </div>

                            <div className="detail-item">
                                <span className="label">Phone:</span>
                                <input
                                    type="text"
                                    value={phone}
                                    placeholder="Placeholder"
                                    onChange={(e) => this.handleInputChange(e, 'phone')}
                                />
                            </div>

                            <div className="detail-item">
                                <span className="label">Address:</span>
                                <div className="address-list">
                                    {addresses.map((address, index) => (
                                        <div key={index} className="address-item" >
                                            <button className="remove-button" onClick={() => this.removeAddress(index)}>−</button>
                                            <span>{address}</span>
                                        </div>
                                    ))}
                                    <div className="address-input">
                                        <input
                                            type="text"
                                            value={newAddress}
                                            placeholder="Placeholder"
                                            onChange={(e) => this.handleInputChange(e, 'newAddress')}
                                        />
                                        <button className="add-button" onClick={this.addAddress}>+</button>
                                    </div>
                                </div>
                            </div>

                            <button className="btn personalization-btn">Personalization Setting</button>
                            <div className="change-password">
                                <p>Change password</p>
                            </div>
                            <button className="btn logout-btn" onClick={this.handleLoginForUser}>Logout</button>

                            <div className="actions">
                                <button className="btn discard-btn">Discard change</button>
                                <button className="btn save-btn">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
