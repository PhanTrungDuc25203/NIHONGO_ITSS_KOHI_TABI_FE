import React, { Component } from 'react';
import "./Layout.scss";
import UsersHeader from '../../../components/Users/Header';
import AdminPageSidebar from '../../../components/AdminPageSidebar/AdminPageSidebar';

class Layout extends Component {
    render() {
        const { children } = this.props;
        return (
            <div className="layout">
                {/* Header */}
                <header className="layout-header">
                    <UsersHeader />
                </header>

                {/* Main content area */}
                <div className="layout-main">
                    {/* Navbar */}
                    <nav className="layout-navbar">
                        <AdminPageSidebar />
                    </nav>

                    {/* Content */}
                    <div className="layout-content">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;