import React, { Component } from "react";
import './LandingPage.scss';
import main_image from '../../assets/landing_page/main_image.png';
import { FormattedMessage } from "react-intl";

class LandingPage extends Component {

    handleLoginButtonClick = () => {
        this.props.history.push('/login');
    };

    handleSignupButtonClick = () => {
        alert('Sign up');
    };

    render() {
        return (
            <div className="landing-page">
                <header className="landing-header">
                    <div className="logo">KOHI TABI</div>
                    <div className="line"></div>
                </header>
                <main className="main-content">
                    <div className="center-content">
                        <div className="text-1">
                            <div className="left-text">
                                <h3><FormattedMessage id="landing-page.vietnam" /></h3>
                            </div>
                            <div className="right-text">
                                <h3><FormattedMessage id="landing-page.since2024" /></h3>
                            </div>
                        </div>
                        <div className="main-title">
                            <h1>KOHI TABI</h1>
                        </div>
                        <img className="main-image" src={main_image} alt="Main" />
                    </div>
                </main>
                <div className="about-section">
                    <div className="about-btns">
                        <div className="left-btn">
                            <button className="about-btn"><FormattedMessage id="landing-page.about-us" /></button>
                        </div>
                        <div className="right-btns">
                            <button
                                className="btn-signup"
                                onClick={this.handleSignupButtonClick}
                            ><FormattedMessage id="landing-page.sign-up" /></button>
                            <button
                                className="btn-login"
                                onClick={this.handleLoginButtonClick}
                            ><FormattedMessage id="landing-page.login" /></button>
                        </div>
                    </div>
                    <div className="about-text">
                        <p>
                            <b><FormattedMessage id="landing-page.kohitabi" /></b>
                            <FormattedMessage id="landing-page.para1" /></p>
                        <p><FormattedMessage id="landing-page.para2" /></p>
                        <p><FormattedMessage id="landing-page.para3" /></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;