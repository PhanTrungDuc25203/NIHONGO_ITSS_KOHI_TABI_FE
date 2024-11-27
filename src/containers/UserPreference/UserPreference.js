import React, { useState } from 'react';
import Header from '../../components/Users/Header';
import './UserPreference.scss';

const UserPreference = () => {
    const [preferences, setPreferences] = useState([
        { title: "Style", items: ["Vintage"], options: ["Vintage", "Modern", "Eco-Friendly"] },
        { title: "Preferred Services", items: ["Table Service", "Takeaway"], options: ["Table Service", "Takeaway", "Outdoor Seating", "Event Hosting"] },
        { title: "Preferred Amenities", items: ["Wifi", "Parking"], options: ["Wifi", "Parking", "Air Conditioning", "Restroom"] },
        { title: "Preferred Drink", items: ["Black Coffee", "Milk Tea"], options: ["Black Coffee", "Milk Tea", "Ice Coffee with Milk", "Orange Juice"] }
    ]);

    const [distance, setDistance] = useState('');

    const handleAdd = (category, newItem) => {
        if (newItem) {
            setPreferences(prev =>
                prev.map(group =>
                    group.title === category && !group.items.includes(newItem)
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
            <Header />
            <div className="user-preference-container">
                <div className="content-area">
                    <h1 className="title">Personalization</h1>
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
                                    <select
                                        className="add-dropdown"
                                        onChange={(e) => {
                                            handleAdd(group.title, e.target.value);
                                            e.target.value = ""; // Reset the dropdown after selection
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Add an item</option>
                                        {group.options
                                            .filter(option => !group.items.includes(option)) // Filter out already selected options
                                            .map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                    </select>
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
            </div>
        </React.Fragment>
    );
};

export default UserPreference;
