import React, { Component } from "react";
import './LandingPage.scss';

class LandingPage extends Component {
    render() {
        return (
            <div className="landing-page">
                <header className="header">
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
                        <img className="main-image" src="path/to/your/image.jpg" alt="Main" />
                    </div>
                    <div className="about-section">
                        <h2>About Us</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo nec magna.</p>
                        <div className="buttons">
                            <button className="btn signup">Sign Up</button>
                            <button className="btn login">Log In</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default LandingPage;