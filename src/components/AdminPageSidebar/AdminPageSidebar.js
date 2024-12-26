import React, { Component } from 'react';
import './AdminPageSidebar.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../store/actions";
import { FormattedMessage } from "react-intl";
import Header from '../../components/Users/Header';

class AdminPageSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.getActiveItemFromUrl(props.location.pathname),
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({ activeItem: this.getActiveItemFromUrl(this.props.location.pathname) });
        }
    }

    getActiveItemFromUrl = (pathname) => {
        if (pathname.includes('/system/coffee-shop-manage')) {
            return 'Cafe List';
        } else if (pathname.includes('/system/settings')) {
            return 'Settings';
        } else if (pathname.includes('/system/reports')) {
            return 'Reports';
        } else if (pathname.includes('/system/users')) {
            return 'Users';
        } else {
            return 'Dashboard';
        }
    }

    handleMenuClick = (menuName) => {
        this.setState({ activeItem: menuName });
    }

    render() {
        const { activeItem } = this.state;

        return (
            <>
                <Header></Header>
                <div className="admin-sidebar">
                    <ul className="menu">
                        <li
                            className={`menu-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
                            onClick={() => this.handleMenuClick('Dashboard')}
                        >
                            <a href="#" className="menu-link">
                                <span className="icon">🏠</span>
                                <span className="text"><FormattedMessage id="admin.side-bar.dashboard" /></span>
                            </a>
                        </li>
                        <li
                            className={`menu-item ${activeItem === 'Cafe List' ? 'active' : ''}`}
                            onClick={() => this.handleMenuClick('Cafe List')}
                        >
                            <a href="/system/coffee-shop-manage" className="menu-link">
                                <span className="icon">📋</span>
                                <span className="text"><FormattedMessage id="admin.side-bar.coffee-list" /></span>
                            </a>
                        </li>
                        <li
                            className={`menu-item ${activeItem === 'Users' ? 'active' : ''}`}
                            onClick={() => this.handleMenuClick('Users')}
                        >
                            <a href="#" className="menu-link">
                                <span className="icon">🧑‍🤝‍🧑</span>
                                <span className="text"><FormattedMessage id="admin.side-bar.users" /></span>
                            </a>
                        </li>
                        <li
                            className={`menu-item ${activeItem === 'Reports' ? 'active' : ''}`}
                            onClick={() => this.handleMenuClick('Reports')}
                        >
                            <a href="#" className="menu-link">
                                <span className="icon">📝</span>
                                <span className="text"><FormattedMessage id="admin.side-bar.reports" /></span>
                            </a>
                        </li>
                        <li
                            className={`menu-item ${activeItem === 'Settings' ? 'active' : ''}`}
                            onClick={() => this.handleMenuClick('Settings')}
                        >
                            <a href="/system/settings" className="menu-link">
                                <span className="icon">⚙️</span>
                                <span className="text"><FormattedMessage id="admin.side-bar.settings" /></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminPageSidebar));
