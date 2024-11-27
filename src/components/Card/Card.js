import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './Card.scss';

class Card extends Component {
    render() {
        const { processLogout, imageUrl, title, location } = this.props;

        return (
            <div className="card">
                <img src={imageUrl} alt={title} />
                <div className='card-info'>
                    <h3>{title}</h3>
                    <p>{location}</p>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
