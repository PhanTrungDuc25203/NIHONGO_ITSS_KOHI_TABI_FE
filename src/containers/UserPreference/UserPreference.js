import React, { useState } from 'react';
import Header from '../../components/Users/Header';
import './UserPreference.scss';

const UserPreference = () => {
    const [preferences, setPreferences] = useState([
        { title: "Type", items: ["Cafe", "Breakfast", "Cat", "Brunch", "Classic"] },
        { title: "Style", items: ["Cafe Bakery", "Modern", "Pop-up Cafe", "Themed Cafe"] },
        { title: "Special Services", items: ["Books", "Laptop"] },
        { title: "Preferred Amenities", items: ["Bed", "Sofa", "TV"] },
        { title: "Black List", items: ["Aha Coffee", "Phúc Long", "Constrast", "TocoToco"] },
        { title: "Favorite Drink", items: ["Mojito", "Daiquiri", "Margarita", "Comospolitan"] },
        { title: "Favorite Time", items: ["7:30", "14:30", "20:00"] }
    ]);

    const [distance, setDistance] = useState('');


    const handleAdd = (category) => {
        const newItem = prompt(`Add a new item to "${category}":`);
        if (newItem) {
            setPreferences(prev =>
                prev.map(group =>
                    group.title === category
                        ? { ...group, items: [...group.items, newItem] }
                        : group
                )
            );
        }
    };


    const handleRemove = (item, category) => {
        setPreferences(prev =>
            prev.map(group =>
                group.title === category
                    ? { ...group, items: group.items.filter(i => i !== item) }
                    : group
            )
        );
    };

    return (
        <React.Fragment>
            <Header/>
            <div className="user-preference-container">
                <header className="header">
                    <button className="back-button">←</button>
                    <h1 className="title">Personalization</h1>
                </header>
                <main className="preferences">
                    {preferences.map((group, index) => (
                        <div className="preference-group" key={index}>
                            <h3 className="group-title">{group.title}</h3>
                            <div className="items">
                                {group.items.map((item, idx) => (
                                    <span className="item" key={idx}>
                                        {item}
                                        <button className="remove-button" onClick={() => handleRemove(item, group.title)}>−</button>
                                    </span>
                                ))}
                                <button className="add-button" onClick={() => handleAdd(group.title)}>+</button>
                            </div>
                        </div>
                    ))}
                    <div className="preference-group">
                        <h3 className="group-title">Distance</h3>
                        <input
                            type="text"
                            className="distance-input"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Enter distance"
                        />
                        <select className="distance-unit">
                            <option value="km">km</option>
                            <option value="miles">miles</option>
                        </select>
                    </div>
                </main>
                <footer className="footer">
                    <button className="discard-button">Discard change</button>
                    <button className="save-button">Save</button>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default UserPreference;
