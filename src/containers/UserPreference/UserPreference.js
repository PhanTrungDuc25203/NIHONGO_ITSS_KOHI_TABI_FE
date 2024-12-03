import React, { Component } from 'react';
import Header from '../../components/Users/Header';
import './UserPreference.scss';
import { connect } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { languages } from "../../utils";

class UserPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preferences: this.getTranslatedPreferences(props.lang),
            distance: ''
        };
    }

    // Hàm dịch preferences dựa vào ngôn ngữ
    getTranslatedPreferences(lang) {
        const translations = {
            EN: [
                { title: "Style", items: ["Vintage"], options: ["Vintage", "Modern", "Eco-Friendly"] },
                { title: "Preferred Services", items: ["Table Service", "Takeaway"], options: ["Table Service", "Takeaway", "Outdoor Seating", "Event Hosting"] },
                { title: "Preferred Amenities", items: ["Wifi", "Parking"], options: ["Wifi", "Parking", "Air Conditioning", "Restroom"] },
                { title: "Preferred Drink", items: ["Black Coffee", "Milk Tea"], options: ["Black Coffee", "Milk Tea", "Ice Coffee with Milk", "Orange Juice"] }
            ],
            JA: [
                { title: "スタイル", items: ["ヴィンテージ"], options: ["ヴィンテージ", "モダン", "エコフレンドリー"] },
                { title: "サービスの好み", items: ["テーブルサービス", "テイクアウト"], options: ["テーブルサービス", "テイクアウト", "屋外席", "イベント開催"] },
                { title: "設備の好み", items: ["WiFi", "駐車場"], options: ["WiFi", "駐車場", "エアコン", "トイレ"] },
                { title: "飲み物の好み", items: ["ブラックコーヒー", "ミルクティー"], options: ["ブラックコーヒー", "ミルクティー", "ミルク入りアイスコーヒー", "オレンジジュース"] }
            ]
        };
        return lang === languages.JA ? translations.JA : translations.EN;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang !== this.props.lang) {
            this.setState({ preferences: this.getTranslatedPreferences(this.props.lang) });
        }
    }

    handleAdd = (category, newItem) => {
        if (newItem) {
            this.setState(prevState => ({
                preferences: prevState.preferences.map(group =>
                    group.title === category && !group.items.includes(newItem)
                        ? { ...group, items: [...group.items, newItem] }
                        : group
                )
            }));
        }
    };

    handleRemove = (item, category) => {
        this.setState(prevState => ({
            preferences: prevState.preferences.map(group =>
                group.title === category
                    ? { ...group, items: group.items.filter(i => i !== item) }
                    : group
            )
        }));
    };

    handleDistanceChange = (e) => {
        this.setState({ distance: e.target.value });
    };

    render() {
        const { preferences, distance } = this.state;

        return (
            <React.Fragment>
                <Header />
                <div className="user-preference-container">
                    <div className="content-area">
                        <h1 className="title">
                            {this.props.lang === languages.JA ? "パーソナライズ" : "Personalization"}
                        </h1>
                        <main className="preferences">
                            {preferences.map((group, index) => (
                                <div className="preference-group" key={index}>
                                    <h3 className="group-title">{group.title}</h3>
                                    <div className="items">
                                        {group.items.map((item, idx) => (
                                            <span className="item" key={idx}>
                                                {item}
                                                <button className="remove-button" onClick={() => this.handleRemove(item, group.title)}>−</button>
                                            </span>
                                        ))}
                                        <select
                                            className="add-dropdown"
                                            onChange={(e) => {
                                                this.handleAdd(group.title, e.target.value);
                                                e.target.value = ""; // Reset the dropdown after selection
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                {this.props.lang === languages.JA ? "項目を追加" : "Add an item"}
                                            </option>
                                            {group.options
                                                .filter(option => !group.items.includes(option)) // Filter out already selected options
                                                .map((option, idx) => (
                                                    <option key={idx} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                            <div className="preference-group">
                                <h3 className="group-title">
                                    {this.props.lang === languages.JA ? "距離" : "Distance"}
                                </h3>
                                <input
                                    type="text"
                                    className="distance-input"
                                    value={distance}
                                    onChange={this.handleDistanceChange}
                                    placeholder={this.props.lang === languages.JA ? "距離を入力" : "Enter distance"}
                                />
                                <select className="distance-unit">
                                    <option value="km">km</option>
                                    <option value="miles">miles</option>
                                </select>
                            </div>
                        </main>
                        <footer className="footer">
                            <button className="discard-button">
                                {this.props.lang === languages.JA ? "変更を破棄" : "Discard changes"}
                            </button>
                            <button className="save-button">
                                {this.props.lang === languages.JA ? "保存" : "Save"}
                            </button>
                        </footer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

export default connect(mapStateToProps)(UserPreference);
