import React, { Component } from 'react';
import './Settings.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";
import { LanguageUtils, languages } from "../../../utils";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: ''
        }
    }

    handleLanguageChange = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "en") {
            this.changeLanguage(languages.EN);
        } else if (selectedValue === "ja") {
            this.changeLanguage(languages.JA);
        }
    }

    changeLanguage(language) {
        this.props.switchLanguageOfWebsite(language);
    }

    render() {
        return (
            <div className="settings-container">
                <h1 className="settings-title">Setting</h1>
                <div className="settings-content">
                    {/* Interface Setting */}
                    <div className="interface-setting">
                        <h2 className="section-title">Interface setting</h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="language">Language Preferences:</label>
                            <select
                                className="form-select"
                                id="language"
                                onChange={this.handleLanguageChange}
                                value={this.props.language}
                            >
                                <option value="en">English</option>
                                <option value="ja">Japanese</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="theme">Theme:</label>
                            <select className="form-select" id="theme">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="timezone">Time Zone:</label>
                            <select className="form-select" id="timezone">
                                <option value="utc">UTC</option>
                                <option value="gmt">GMT</option>
                            </select>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="change-password">
                        <h2 className="section-title">Change password (admin)</h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="old-password">Old Password:</label>
                            <input className="form-input" type="password" id="old-password" />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="new-password">New Password:</label>
                            <input className="form-input" type="password" id="new-password" />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="retype-password">Retype Password:</label>
                            <input className="form-input" type="password" id="retype-password" />
                        </div>
                        <button className="submit-button">Submit</button>
                    </div>
                </div>

                {/* Logout */}
                <div className="logout-container">
                    <button className="logout-button">Logout</button>
                </div>
            </div>
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
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
