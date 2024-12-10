import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { handleLogin } from '../../services/userService';
import * as actions from "../../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../../utils";
import './Signup.scss';
import { FormattedMessage } from 'react-intl';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isPasswordVisible: false, // Trạng thái mặc định là ẩn mật khẩu
            errMessage: '',
        };
    }

    

    render() {
        const { isPasswordVisible } = this.state;

        return (
            <div className="website-login-form">
                <div className="login-container">
                    <div className="logo">
                        <span className="logo-text-1">KOHI</span>
                        <span className="logo-text-2">TABI</span>
                    </div>
                    <h2 className="login-title">Login</h2>
                    <p className="login-subtitle">Discover a new world of coffee</p>
                    <div className="login-form">
                        <div className="input-group">
                            <label htmlFor="username" className="input-label">Email</label>
                            <input
                                type="text"
                                value={this.state.username}
                                id="username"
                                onChange={(event) => { this.handleOnChangeUsername(event) }}
                                name="username"
                                placeholder="Enter your username"
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={isPasswordVisible ? "text" : "password"} // Thay đổi type dựa vào state
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={(event) => { this.handleOnChangePassword(event) }}
                                    placeholder="Enter your password"
                                    className="input-field"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={this.togglePasswordVisibility}
                                >
                                    <span role="img" aria-label="toggle-password">
                                        {isPasswordVisible ? "🙈" : "👁️"}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="warning-text">
                            {this.state.errMessage}
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                        <button className="login-button"
                            onClick={() => { this.handleLoginButtonClicked() }}
                        >Login</button>
                    </div>
                    <p className="signup-text">
                        Not a member? <a href="#" className="signup-link">Sign up now</a>
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
