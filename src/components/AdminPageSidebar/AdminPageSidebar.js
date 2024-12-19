import React, { Component } from 'react';
import './AdminPageSidebar.scss';

class AdminPageSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Dashboard', // Item mặc định được active
        };
    }

    handleMenuClick = (menuName) => {
        this.setState({ activeItem: menuName });
    };

    render() {
        const { activeItem } = this.state;

        return (
            <div className="admin-sidebar">
                <ul className="menu">
                    <li
                        className={`menu-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => this.handleMenuClick('Dashboard')}
                    >
                        <a href="#" className="menu-link">
                            <span className="icon">🏠</span>
                            <span className="text">Dashboard</span>
                        </a>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'Cafe List' ? 'active' : ''}`}
                        onClick={() => this.handleMenuClick('Cafe List')}
                    >
                        <a href="#" className="menu-link">
                            <span className="icon">📋</span>
                            <span className="text">Cafe List</span>
                        </a>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'Users' ? 'active' : ''}`}
                        onClick={() => this.handleMenuClick('Users')}
                    >
                        <a href="#" className="menu-link">
                            <span className="icon">🧑‍🤝‍🧑</span>
                            <span className="text">Users</span>
                        </a>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'Reports' ? 'active' : ''}`}
                        onClick={() => this.handleMenuClick('Reports')}
                    >
                        <a href="#" className="menu-link">
                            <span className="icon">📝</span>
                            <span className="text">Reports</span>
                        </a>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'Settings' ? 'active' : ''}`}
                        onClick={() => this.handleMenuClick('Settings')}
                    >
                        <a href="#" className="menu-link">
                            <span className="icon">⚙️</span>
                            <span className="text">Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default AdminPageSidebar;
