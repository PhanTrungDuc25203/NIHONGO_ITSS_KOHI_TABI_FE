import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './UserPreference.scss';
import Header from '../../components/Users/Header';
import { getUserPreference, getAllUserPreference, updateUserPreference } from '../../services/userService';
import { languages } from "../../utils"; // Import languages

class UserPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allPreferences: {
                favoriteStyle: ['Modern', 'Vintage', 'Eco-Friendly'],
                favoriteService: [],
                favoriteAmenity: [],
                favoriteDrink: [],
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
                console.log('All User Preferences:', response.data);
                const data = response.data;
                const mapAllPreferences = {
                    favoriteStyle: ['Modern', 'Vintage', 'Eco-Friendly'],
                    favoriteService: data.services.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteAmenity: data.amenities.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteDrink: data.drinks.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_ja,
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
                    favoriteStyle: user.favoriteStyle.map((item) => item.style),
                    favoriteService: user.favoriteService.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteAmenity: user.favoriteAmenity.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_jap,
                    })),
                    favoriteDrink: user.favoriteDrink.map((item) => ({
                        name_eng: item.name_eng,
                        name_jap: item.name_ja,
                    })),
                    favoriteTime: user.favoriteTime.map((item) => item.time),
                    distance: user.favoriteDistance,
                };

                console.log('User Preferences:', mappedPreferences);
                this.setState({ preferences: mappedPreferences });
            } else {
                console.error('Error fetching preferences:', response);
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    };

    handleRemove = (category, item) => {
        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [category]: prevState.preferences[category].filter((i) => i !== item),
            },
        }), () => {
            console.log(`${item} removed from ${category}`);
        });
    };

    handleAdd = (category, selectedItem) => {
        if (!selectedItem) return;
        
        const parsedItem = JSON.parse(selectedItem); // Parse stringified object from <select>
        
        // Check if the item already exists in the category
        const isItemAlreadyAdded = this.state.preferences[category].some(item => 
            typeof item === 'object' 
            ? item.name_eng === parsedItem.name_eng || item.name_jap === parsedItem.name_jap 
            : item === parsedItem
        );
    
        if (isItemAlreadyAdded) {
            console.log(`${parsedItem.name_eng || parsedItem} is already added to ${category}`);
            return;
        }
    
        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [category]: [...prevState.preferences[category], parsedItem],
            },
            selectedOption: '',
        }), () => {
            console.log(`${parsedItem.name_eng || parsedItem} added to ${category}`);
            console.log(this.state.preferences);
        });
    };
    
    handleSavePreferences = async () => {
        const { preferences } = this.state;
        const { email } = this.props.userInfo;
    
        // Convert preferences to English before sending
        const convertedPreferences = {
            email: email,
            stylePreference: preferences.favoriteStyle, // Assuming styles are already in English
            servicePreference: preferences.favoriteService.map(item => item.name_eng),
            amenityPreference: preferences.favoriteAmenity.map(item => item.name_eng),
            drinkPreference: preferences.favoriteDrink.map(item => item.name_eng),
            distancePreference: preferences.distance,
            timePreference: preferences.favoriteTime, // Assuming time is already in English
        };
    
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
            
            if (response.data.errCode === 0) {
                console.log('Preferences saved successfully');
            } else {
                console.error('Error saving preferences:', response.data.errMessage);
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };    
    
    renderCategory = (titleEng, titleJap, category) => {
        const { language } = this.props;
        const title = language === languages.JA ? titleJap : titleEng;
    
        const availableOptions = this.state.allPreferences[category] || [];
    
        return (
            <div className='preference-category'>
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
    
                    <select
                        className="add-select"
                        value={this.state.selectedOption}
                        onChange={(e) => this.setState({ selectedOption: e.target.value })}
                    >
                        <option value="">Select an item...</option>
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
                        +
                    </button>
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
