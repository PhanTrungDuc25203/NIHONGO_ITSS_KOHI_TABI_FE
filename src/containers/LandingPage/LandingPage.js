import React, { Component } from "react";
import './LandingPage.scss';
import main_image from '../../assets/landing_page/main_image.png';

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
                                <h3>VIETNAM</h3>
                            </div>
                            <div className="right-text">
                                <h3>SINCE 2024</h3>
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
                            <button className="about-btn">About Us</button>
                        </div>
                        <div className="right-btns">
                            <button 
                            className="btn-signup"
                            onClick={this.handleSignupButtonClick}
                            >Sign Up</button>
                            <button 
                            className="btn-login"
                            onClick={this.handleLoginButtonClick}
                            >Log In</button>
                        </div>
                    </div>
                    <div className="about-text">
                        <p>
                            <b>Kohi Tabi – </b>
                            Ứng dụng tìm kiếm quán cafe theo nhu cầu cá nhân</p>
                        <p>Bạn đang tìm kiếm một không gian để thư giãn, làm việc, hoặc hẹn hò cùng bạn bè?</p>
                        <p>Với Kohi Tabi, bạn không chỉ tìm được quán cafe phù hợp mà còn khám phá phong cách riêng của mình!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;