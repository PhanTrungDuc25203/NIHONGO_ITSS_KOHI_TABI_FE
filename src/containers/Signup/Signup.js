import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { handleSignUp } from '../../services/userService';
import * as actions from "../../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../../utils";
import './Signup.scss';
import { FormattedMessage } from 'react-intl';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            phone: '',
            isPasswordVisible: false, // Trạng thái mặc định là ẩn mật khẩu
            isConfirmPasswordVisible: false,
            errMessage: '',
        };
    }


    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePhone = (event) => {
        this.setState({
            phone: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleOnChangeConfirmPassword = (event) => {
        this.setState({
            confirmPassword: event.target.value
        })
    }

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            isPasswordVisible: !prevState.isPasswordVisible,
        }));
    }

    toggleConfirmPasswordVisibility = () => {
        this.setState((prevState) => ({
            isConfirmPasswordVisible: !prevState.isConfirmPasswordVisible,
        }));
    }

    handleSignUpButtonClicked = async () => {
        this.setState({
            errMessage: '',
        });
        try {
            let data = await handleSignUp(this.state.email, this.state.username, this.state.password, this.state.confirmPassword, this.state.phone);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                //cần sử dụng tới redux'
                // console.log("CHeck user: ", data.user);
                //this.props.userLoginSuccess(data.user);
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message,
                    })
                }
            }
        }

    }

    render() {
        const { isPasswordVisible, isConfirmPasswordVisible } = this.state;

        return (
            <div className="website-login-form">
                <div className="login-container">
                    <div className="logo">
                        <span className="logo-text-1">KOHI</span>
                        <span className="logo-text-2">TABI</span>
                    </div>
                    <h2 className="login-title">Sign Up</h2>
                    <p className="login-subtitle">Discover a new world of coffee</p>
                    <div className="login-form">
                        <div className="input-group">
                            <label htmlFor="username" className="input-label">Email</label>
                            <input
                                type="text"
                                value={this.state.email}
                                id="email"
                                onChange={(event) => { this.handleOnChangeEmail(event) }}
                                name="email"
                                placeholder="Enter your email"
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username" className="input-label">Username</label>
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
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={isPasswordVisible ? "text" : "password"} // Thay đổi type dựa vào state
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    value={this.state.confirmPassword}
                                    onChange={(event) => { this.handleOnChangeConfirmPassword(event) }}
                                    placeholder="Retype your password"
                                    className="input-field"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={this.toggleConfirmPasswordVisibility}
                                >
                                    <span role="img" aria-label="toggle-password">
                                        {isConfirmPasswordVisible ? "🙈" : "👁️"}
                                    </span>
                                </button>
                            </div>



                        </div>

                        <div className="input-group">
                            <label htmlFor="username" className="input-label">Phone</label>
                            <input
                                type="text"
                                value={this.state.phone}
                                id="phone"
                                onChange={(event) => { this.handleOnChangePhone(event) }}
                                name="phone"
                                placeholder="Enter your phone number"
                                className="input-field"
                            />
                        </div>

                        <div className="warning-text">
                            {this.state.errMessage}
                        </div>
                        <button className="login-button"
                            onClick={() => { this.handleSignUpButtonClicked() }}
                        >Sign Up</button>
                    </div>
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
