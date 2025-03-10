import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './UserPreference.scss';
import Header from '../../components/Users/Header';
import { getUserPreference, getAllUserPreference, updateUserPreference } from '../../services/userService';
import { languages } from "../../utils";
import { toast, ToastContainer } from 'react-toastify';

class UserPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favoriteStyle: [{
                name_fake_eng: 'Modern',
                name_fake_jap: 'モダン',
                name_eng: 'Co-Working',
                name_jap: 'コワーキング'
            }, {
                name_fake_eng: 'Vintage',
                name_fake_jap: 'ヴィンテージ',
                name_eng: 'Talking',
                name_jap: '話'
            }, {
                name_fake_eng: 'Eco-Friendly',
                name_fake_jap: 'エコフレンドリー',
                name_eng: 'Cat',
                name_jap: '猫'
            }],
            allPreferences: {
                favoriteStyle: [{
                    name_fake_eng: 'Modern',
                    name_fake_jap: 'モダン',
                    name_eng: 'Co-Working',
                    name_jap: 'コワーキング'
                }, {
                    name_fake_eng: 'Vintage',
                    name_fake_jap: 'ヴィンテージ',
                    name_eng: 'Talking',
                    name_jap: '話'
                }, {
                    name_fake_eng: 'Eco-Friendly',
                    name_fake_jap: 'エコフレンドリー',
                    name_eng: 'Cat',
                    name_jap: '猫'
                }],
                favoriteService: [],
                favoriteAmenity: [],
                favoriteDrink: [],
                favoriteTime: []
            },
            preferences: {
                favoriteStyle: [],
                favoriteService: [],
                favoriteAmenity: [],
                favoriteDrink: [],
                favoriteTime: [],
                distance: '',
            },
            availableOptions: [],
        };
    }

    componentDidMount() {
        this.handleGetUserPreference();
        this.handleGetAllUserPreferences();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.handleGetUserPreference();
            this.handleGetAllUserPreferences();
        }
    }

    handleGetAllUserPreferences = async () => {
        try {
            const response = await getAllUserPreference();
            if (response.errCode === 0) {
                const data = response.data;
                const mapAllPreferences = {
                    favoriteStyle: [{
                        name_fake_eng: 'Modern',
                        name_fake_jap: 'モダン',
                        name_eng: 'Co-Working',
                        name_jap: 'コワーキング'
                    }, {
                        name_fake_eng: 'Vintage',
                        name_fake_jap: 'ヴィンテージ',
                        name_eng: 'Talking',
                        name_jap: '話'
                    }, {
                        name_fake_eng: 'Eco-Friendly',
                        name_fake_jap: 'エコフレンドリー',
                        name_eng: 'Cat',
                        name_jap: '猫'
                    }],
                    favoriteService: data.services.map((item) => ({
                        id: item.sid,
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteAmenity: data.amenities.map((item) => ({
                        id: item.aid,
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteDrink: data.drinks.map((item) => ({
                        id: item.did,
                        name_eng: item.name_eng,
                        name_jap: item.name_ja,
                    })),
                    favoriteTime: data.time.map((item) => ({
                        id: item,
                        name_eng: item,
                        name_jap: item,
                    })),
                };
                this.setState({ allPreferences: mapAllPreferences });
            } else {
                console.error('Error fetching all preferences:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching all preferences:', error);
        }
    };

    handleGetUserPreference = async () => {
        const email = this.props.userInfo?.email;
        try {
            const response = await getUserPreference(email);
            if (response.errCode === 0) {
                const user = response.user;
                const mappedPreferences = {
                    favoriteStyle: user.favoriteStyle.flatMap((item) => {
                        return this.state.favoriteStyle
                            .filter((itemStyle) => itemStyle.name_fake_eng === item.style)
                            .map((itemStyle) => ({
                                id: itemStyle.name_fake_eng,
                                name_eng: itemStyle.name_eng,
                                name_jap: itemStyle.name_jap,
                            }));
                    }),
                    favoriteService: user.favoriteService.map((item) => ({
                        id: item.sid,
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteAmenity: user.favoriteAmenity.map((item) => ({
                        id: item.aid,
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteDrink: user.favoriteDrink.map((item) => ({
                        id: item.did,
                        name_eng: item.name_eng,
                        name_jap: item.name_ja,
                    })),
                    favoriteTime: user.favoriteTime.map((item) => ({
                        id: item.time,
                        name_eng: item.time,
                        name_jap: item.time,
                    })),
                    distance: user.favoriteDistance,
                };
                this.setState({ preferences: mappedPreferences });
            }
        } catch (error) {
        }
    };

    handleRemove = (category, item) => {
        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [category]: prevState.preferences[category].filter((i) => i !== item),
            },
        }), () => {
        });
    };

    handleAdd = (category, selectedItem) => {
        if (!selectedItem) return;

        const parsedItem = JSON.parse(selectedItem);

        const isItemAlreadyAdded = this.state.preferences[category].some(item =>
            typeof item === 'object'
                ? item.name_eng === parsedItem.name_eng || item.name_jap === parsedItem.name_jap
                : item === parsedItem
        );

        if (isItemAlreadyAdded) {
            return;
        }

        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [category]: [...prevState.preferences[category], parsedItem],
            },
            selectedOption: '',
        }), () => {
            console.log(this.state.preferences);
        });
    };

    handleSavePreferences = async () => {
        const { preferences } = this.state;
        const { email } = this.props.userInfo;

        console.log(preferences);

        const convertedPreferences = {
            email: email,
            stylePreference: preferences.favoriteStyle.map(item => String(item.id)),
            servicePreference: preferences.favoriteService.map(item => String(item.id)),
            amenityPreference: preferences.favoriteAmenity.map(item => String(item.id)),
            drinkPreference: preferences.favoriteDrink.map(item => String(item.id)),
            distancePreference: parseInt(preferences.distance, 10),
            timePreference: preferences.favoriteTime.map(item => String(item.id)),
        };

        console.log('convertedPreferences:', convertedPreferences);

        try {
            const response = await updateUserPreference(
                convertedPreferences.email,
                convertedPreferences.stylePreference,
                convertedPreferences.servicePreference,
                convertedPreferences.amenityPreference,
                convertedPreferences.drinkPreference,
                convertedPreferences.distancePreference,
                convertedPreferences.timePreference
            );
            toast.success(this.props.language === languages.JA ? '設定が正常に更新されました！' : 'Preference updated successfully!');
        } catch (error) {
            toast.error(this.props.language === languages.JA ? '設定の更新中にエラーが発生しました。もう一度お試しください。' : 'Error updating preference. Please try again.!');
        }
    };

    renderCategory = (titleEng, titleJap, category) => {
        const { language } = this.props;
        const title = language === languages.JA ? titleJap : titleEng;

        const availableOptions = this.state.allPreferences[category] || [];

        return (
            <div className='preference-category'>
                <ToastContainer />
                <h4>{title}</h4>
                <div className='preference-items'>
                    {this.state.preferences[category].map((item, index) => (
                        <span key={index} className='preference-item'>
                            {typeof item === 'object'
                                ? language === languages.JA
                                    ? item.name_jap || item.name_eng
                                    : item.name_eng
                                : item}
                            <button onClick={() => this.handleRemove(category, item)}>-</button>
                        </span>
                    ))}

                    <div className='flex'>
                        <select
                            className="add-select"
                            value={this.state.selectedOption}
                            onChange={(e) => this.setState({ selectedOption: e.target.value })}
                        >
                            <option value="">{this.props.language === languages.JA ? '項目を選択してください...' : 'Select an item...'}</option>
                            {availableOptions.map((item, index) => (
                                <option key={index} value={JSON.stringify(item)}>
                                    {language === languages.JA ? item.name_jap || item.name_eng : item.name_eng || item}
                                </option>
                            ))}
                        </select>
                        <button
                            className='add-button'
                            onClick={() => this.handleAdd(category, this.state.selectedOption)}
                        >
                            <p>+</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    render() {
        const { preferences } = this.state;

        return (
            <div className='user-preference'>
                <Header />
                <div className='preferences-container'>
                    <h1 className='preference-title'>{this.props.language === languages.JA ? 'パーソナライズ' : 'User Preference'}</h1>
                    {this.renderCategory('Style', 'スタイル', 'favoriteStyle')}
                    {this.renderCategory('Preferred Services', 'サービス', 'favoriteService')}
                    {this.renderCategory('Preferred Amenities', 'アメニティ', 'favoriteAmenity')}
                    {this.renderCategory('Preferred Drink', 'ドリンク', 'favoriteDrink')}
                    {this.renderCategory('Preferred Time', '時間帯', 'favoriteTime')}
                    <div className='preference-category'>
                        <h4>{this.props.language === languages.JA ? '距離' : 'Distance'}</h4>
                        <input
                            type='text'
                            value={preferences.distance}
                            onChange={(e) =>
                                this.setState({
                                    preferences: {
                                        ...preferences,
                                        distance: e.target.value,
                                    },
                                })
                            }
                            placeholder={this.props.language === languages.JA ? 'キロメートル' : 'km'}
                        />
                    </div>
                </div>
                <div className='actions'>
                    <button className='discard-button'>
                        {this.props.language === languages.JA ? '変更を破棄' : 'Discard change'}
                    </button>
                    <button className='save-button' onClick={this.handleSavePreferences}>
                        {this.props.language === languages.JA ? '保存' : 'Save'}
                    </button>
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

export default withRouter(connect(mapStateToProps)(UserPreference));
