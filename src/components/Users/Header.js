import { Component } from "react";
import './Header.scss';
import avatar from '../../assets/header/avatar.jpg';

class UsersHeader extends Component {
    render() {
        return (
            <div className="header">
                <div className="logo">
                    <span className="logoKohi">KOHI</span>
                    <span className="logoTabi">TABI</span>
                </div>
                <div className="userInfo">
                    <div className="userAvatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="userText">
                        <span className="userName">Đỗ Thùy Dương</span>
                        <span className="userEmail">dothuyduong25022003@gmail.com</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default UsersHeader;