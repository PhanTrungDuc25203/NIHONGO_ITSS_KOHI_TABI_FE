import React, { Component } from 'react';
import './Settings.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";
import { LanguageUtils, languages } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { adminChangePasswordService } from "../../../services/userService";
import { toast } from 'react-toastify';

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: '',
            oldPassword: '',
            newPassword: '',
            retypePassword: '',
            showOldPassword: false,
            showNewPassword: false,
            showRetypePassword: false,
        };
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

    handleInputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    togglePasswordVisibility = (field) => {
        this.setState(prevState => ({
            [field]: !prevState[field]
        }))
    }

    handleChangePassword = async () => {
        const { oldPassword, newPassword, retypePassword } = this.state;

        // Check if newPassword and retypePassword match
        if (newPassword !== retypePassword) {
            alert(this.props.language === languages.EN ? "New Password and Retype Password do not match!" : "新しいパスワードと再入力したパスワードが一致しません！");
            return;
        }

        try {
            const response = await adminChangePasswordService(
                this.props.userInfo.email,
                oldPassword,
                newPassword
            );
            if (response && response.errCode && response.errCode === 0) {
                toast.success("Change password successfully!");
            } else if (response && response.errCode && response.errCode === 2) {
                alert(this.props.language === languages.EN ? "Old password is incorrect!" : "古いパスワードが間違っています！");
            }
        } catch (error) {
            alert(this.props.language === languages.EN ? "Failed to change password. Please try again." : "パスワードの変更に失敗しました。再試行してください。");
        }
    }

    handleLoginForUser = () => {
        this.props.processLogout();
        this.props.history.push(`/login`);
    }

    render() {
        let { showOldPassword, showNewPassword, showRetypePassword } = this.state;
        return (
            <div className="settings-container">
                <h1 className="settings-title"><FormattedMessage id="admin.settings-page.title" /></h1>
                <div className="settings-content">
                    {/* Interface Setting */}
                    <div className="interface-setting">
                        <h2 className="section-title"><FormattedMessage id="admin.settings-page.interface-section" /></h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="language"><FormattedMessage id="admin.settings-page.language" /></label>
                            <select
                                className="form-select"
                                id="language"
                                onChange={this.handleLanguageChange}
                                value={this.props.language}
                            >
                                <option value="en">{this.props.language === languages.JA ? '英語' : 'English'}</option>
                                <option value="ja">{this.props.language === languages.JA ? '日本語' : 'Japanese'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="theme"><FormattedMessage id="admin.settings-page.theme" /></label>
                            <select className="form-select" id="theme">
                                <option value="light">{this.props.language === languages.EN ? 'Light' : 'ライト'}</option>
                                <option value="dark">{this.props.language === languages.EN ? 'Dark' : 'ダーク'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="timezone"><FormattedMessage id="admin.settings-page.timezone" /></label>
                            <select className="form-select" id="timezone">
                                <option value="utc">{this.props.language === languages.EN ? 'UTC' : '協定世界時'}</option>
                                <option value="gmt">{this.props.language === languages.EN ? 'GMT' : 'グリニッジ標準時'}</option>
                            </select>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="change-password">
                        <h2 className="section-title"><FormattedMessage id="admin.settings-page.change-password" /></h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="old-password"><FormattedMessage id="admin.settings-page.old-pass" /></label>
                            <input
                                className="form-input"
                                type="password"
                                id="oldPassword"
                                value={this.state.oldPassword}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="new-password"><FormattedMessage id="admin.settings-page.new-pass" /></label>
                            <input
                                className="form-input"
                                type="password"
                                id="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="retype-password"><FormattedMessage id="admin.settings-page.retype-pass" /></label>
                            <input
                                className="form-input"
                                type="password"
                                id="retypePassword"
                                value={this.state.retypePassword}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <button className="submit-button" onClick={this.handleChangePassword}>
                            <FormattedMessage id="admin.settings-page.submit" />
                        </button>
                    </div>
                </div>

                {/* Logout */}
                <div className="logout-container">
                    <button className="logout-button" onClick={this.handleLoginForUser}><FormattedMessage id="admin.settings-page.logout" /></button>
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
