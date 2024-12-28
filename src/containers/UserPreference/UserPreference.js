import React, { Component } from 'react';
import Header from '../../components/Users/Header';
import { Modal, Button, Input } from 'antd';
import './UserPreference.scss';
import { connect } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { languages } from "../../utils";
import { getDataForUserPreference } from '../../services/userService';

class UserPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preferences: {
                style: ['Modern', 'Vintage', 'Eco-Friendly'],
                services: [],
                amenities: [],
                drinks: [],
                time: [],
                distance: '',
            },
            isModalOpen: false,
            currentCategory: '',
            currentTitle: '',
            newItem: '',
        };
    }

    componentDidMount() {
        this.handleGetUserPreference();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.handleGetUserPreference();
        }
    }

    handleGetUserPreference = async () => {
        try {
            const response = await getDataForUserPreference();

            if (response && response.data) {
                const { services, amenities, drinks } = response.data;

                const preferences = {
                    ...this.state.preferences,
                    services: this.mapToPreferredItems(services, this.props.lang),
                    amenities: this.mapToPreferredItems(amenities, this.props.lang),
                    drinks: this.mapToPreferredItems(drinks, this.props.lang),
                };

                this.setState({ preferences });
            }
        } catch (error) {
            console.error('Error fetching user preferences:', error);
        }
    };

    mapToPreferredItems = (items, lang) => {
        return items.map(item => {
            if (lang === languages.JA) {
                return item.name_jap || item.name_ja;
            } else {
                return item.name_eng;
            }
        });
    };

    openModal = (category, title) => {
        this.setState({ isModalOpen: true, currentCategory: category, currentTitle: title, newItem: '' });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false, currentCategory: '', currentTitle: '', newItem: '' });
    };

    handleAdd = () => {
        const { currentCategory, newItem } = this.state;
        if (newItem.trim()) {
            this.setState((prevState) => ({
                preferences: {
                    ...prevState.preferences,
                    [currentCategory]: [...prevState.preferences[currentCategory], newItem],
                },
                isModalOpen: false,
                currentCategory: '',
                currentTitle: '',
                newItem: '',
            }));
        }
    };

    handleRemove = (category, item) => {
        this.setState((prevState) => ({
            preferences: {
                ...prevState.preferences,
                [category]: prevState.preferences[category].filter((i) => i !== item),
            },
        }));
    };

    renderCategory = (title, category) => {
        return (
            <div className='preference-category'>
                <h4>{title}</h4>
                <div className='preference-items'>
                    {this.state.preferences[category].map((item, index) => (
                        <span key={index} className='preference-item'>
                            {item} <button onClick={() => this.handleRemove(category, item)}>-</button>
                        </span>
                    ))}
                    <button className='add-button' onClick={() => this.openModal(category, title)}>+</button>
                </div>
            </div>
        );
    };

    render() {
        const { preferences, isModalOpen, currentTitle, newItem } = this.state;

        return (
            <div className='user-preference'>
                <Header />
                <div className='preferences-container'>
                    {this.renderCategory('Style', 'style')}
                    {this.renderCategory('Preferred Services', 'services')}
                    {this.renderCategory('Preferred Amenities', 'amenities')}
                    {this.renderCategory('Preferred Drinks', 'drinks')}
                    {this.renderCategory('Preferred Time', 'time')}
                    <div className='preference-category'>
                        <h4>Distance</h4>
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
                            placeholder='km'
                        />
                    </div>
                </div>
                <div className='actions'>
                    <button className='discard-button'>Discard change</button>
                    <button className='save-button'>Save</button>
                </div>

                {/* Modal */}
                <Modal
                    title={`Add a new item to ${currentTitle}`}
                    visible={isModalOpen}
                    onOk={this.handleAdd}
                    onCancel={this.closeModal}
                    okText="Add"
                    cancelText="Cancel"
                    okButtonProps={{
                        style: {
                            backgroundColor: '#ffa16c',
                            borderColor: '#ffa16c',
                            color: '#fff',
                        },
                    }}
                >
                    <Input
                        value={newItem}
                        onChange={(e) => this.setState({ newItem: e.target.value })}
                        placeholder="Enter new item"
                    />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.app.language,
    };
};

export default connect(mapStateToProps)(UserPreference);
