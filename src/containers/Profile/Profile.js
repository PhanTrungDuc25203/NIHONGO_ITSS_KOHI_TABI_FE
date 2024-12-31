import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; // Import withRouter
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.scss';
import Header from '../../components/Users/Header';
import * as actions from "../../store/actions";
import { getUserProfileData, updateUserProfileData } from '../../services/userService';
import e from 'cors';
import {languages} from '../../utils'

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
        const email = this.props.match.params.email;

        try {
            const response = await getUserProfileData(email);
            const user = response.user || [];

            this.setState({
                username: user.userName || '',
                email: user.email || '',
                name: user.name || '',
                phone: user.phoneNumber || '',
                addresses: user.address ? user.address.split('.') : [],
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Error fetching profile data');
        }
    };

    handleUpdateProfile = async () => {
        const { email, phone, name, addresses } = this.state;
        try {
            const formattedAddress = addresses.join('.');
            const response = await updateUserProfileData(email, phone, name, formattedAddress);
            toast.success(this.props.language === languages.JA ? 'プロフィールが正常に更新されました！' : 'Profile updated successfully!');
        } catch (error) {
            toast.error(this.props.language === languages.JA ? 'プロフィールの更新中にエラーが発生しました。もう一度お試しください。' : 'Error updating profile. Please try again.');
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
    };

    handleOpenUserPreference() {
        this.props.history.push(`/user-preference`);
    }

    handleOpenUserPreference() {
        this.props.history.push(`/user-preference`);
    }

    render() {
        const { username, name, email, phone, addresses, newAddress, selectedImage } = this.state;

        return (
            <div className='profile'>
                <Header />
                <ToastContainer />
                <div className="profile-container">
                    <h1 className="profile-title">{this.props.language === languages.JA ? 'プロファイル' : 'Profile'}</h1>
                    <div className="profile-content">
                        <div className="profile-image">
                            <div className="image-placeholder">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Profile" />
                                ) : (
                                    <div className="placeholder">{this.props.language === languages.JA ? '画像なし' : 'No Image'}</div>
                                )}
                            </div>
                            <label className="upload-button">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={this.handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <i className="icon-upload">{this.props.language === languages.JA ? 'アップロード' : 'Upload'}</i>
                            </label>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="label">{this.props.language === languages.JA ? 'ユーザー名' : 'Username'}</span>
                                <span className="value">{username && username}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">{this.props.language === languages.JA ? 'メールアドレス' : 'Email'}</span>
                                <span className="value">{email && email}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">{this.props.language === languages.JA ? '名前' : 'Name'}</span>
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="Placeholder"
                                    onChange={(e) => this.handleInputChange(e, 'name')}
                                />
                            </div>

                            <div className="detail-item">
                                <span className="label">{this.props.language === languages.JA ? '電話番号' : 'Phone'}</span>
                                <input
                                    type="text"
                                    value={phone}
                                    placeholder="Placeholder"
                                    onChange={(e) => this.handleInputChange(e, 'phone')}
                                />
                            </div>

                            <div className="detail-item">
                                <span className="label">{this.props.language === languages.JA ? '住所' : 'Address'}</span>
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

                            <div className='detail-item'>
                                <span className="label">{this.props.language === languages.JA ? '言語' : 'Language'}</span>
                                <div className='act-lang'>
                                    <button>{this.props.language === languages.JA ? '英語' : 'English'}</button>
                                    <button>{this.props.language === languages.JA ? '日本語' : 'Japanese'}</button>
                                </div>
                            </div>

                            <button className="btn personalization-btn" onClick={() => this.handleOpenUserPreference()}>{this.props.language === languages.JA ? 'パーソナライズ設定' : 'Personalization Setting'}</button>
                            <div className="change-password">
                                <p>{this.props.language === languages.JA ? 'パスワードの変更' : 'Change password'}</p>
                            </div>
                            <button className="btn logout-btn" onClick={this.handleLoginForUser}>{this.props.language === languages.JA ? 'ログアウト' : 'Logout'}</button>

                            <div className="actions">
                                <button className="btn save-btn" onClick={this.handleUpdateProfile}>{this.props.language === languages.JA ? '保存' : 'Save'}</button>
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
