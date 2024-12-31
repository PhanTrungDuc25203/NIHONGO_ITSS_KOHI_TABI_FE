import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './FindMap.scss';
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import all_icons from "../../assets/Icons/all_icons";
import Header from '../../components/Users/Header';
import { fetchCoffeeShopDetail } from '../../services/userService';
import { IoIosArrowBack } from "react-icons/io";
import { languages } from "../../utils";

class FindMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startPoint: null,
            endPoint: null,
            startAddress: '',
            endAddress: '',
            activeInput: null,
            coffeeShop: null,
        };
        this.mapRef = React.createRef();
    }

    async componentDidMount() {
        this.initializeMap();
        this.handleGetCurrentLocation();

        let { id } = this.props.match.params || {};
        if (id) {
            let res = await fetchCoffeeShopDetail(id);
            if (res && res.errCode === 0) {
                this.setState({ coffeeShop: res.data });
                this.setState({ endAddress: res.data.address }, () => {
                    this.handleAddressChangeDirect(res.data.address, "endAddress", "endPoint", "endMarker");
                });
            }
            console.log("Fetched Coffee Shop:", this.state.coffeeShop);
        }
    }

    componentWillUnmount() {
        if (this.map) {
            this.map.remove();
        }
    }

    initializeMap = () => {
        const map = L.map("map").setView([21.006, 105.843], 15);
        this.map = map;

        const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";

        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: "Leaflet &copy; " + mapLink + ", contribution",
            maxZoom: 18,
        }).addTo(map);

        map.on("click", this.handleMapClick);
    };

    handleMapClick = (e) => {
        const { activeInput } = this.state;
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        const icon = L.icon({
            iconUrl: activeInput === "start" ? all_icons.start : all_icons.end,
            iconSize: [30, 30],
        });

        if (activeInput === "start") {
            this.setState({ startPoint: [lat, lng] }, () => {
                this.fetchAddress(lat, lng, 'startAddress');
                if (this.startMarker) this.map.removeLayer(this.startMarker);
                this.startMarker = L.marker([lat, lng], { icon }).addTo(this.map);
            });
        } else if (activeInput === "end") {
            this.setState({ endPoint: [lat, lng] }, () => {
                this.fetchAddress(lat, lng, 'endAddress');
                if (this.endMarker) this.map.removeLayer(this.endMarker);
                this.endMarker = L.marker([lat, lng], { icon }).addTo(this.map);
            });
        }
    };

    handleAddressChangeDirect = async (address, addressKey, pointKey, markerKey) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            if (!response.ok) throw new Error("Failed to fetch geocoding data");
            const data = await response.json();

            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                this.setState({ [pointKey]: [lat, lon] });

                const icon = L.icon({
                    iconUrl: addressKey === "startAddress" ? all_icons.start : all_icons.end,
                    iconSize: [30, 30],
                });

                if (this[markerKey]) this.map.removeLayer(this[markerKey]);
                this[markerKey] = L.marker([lat, lon], { icon }).addTo(this.map);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };


    handleAddressChange = async (e, addressKey, pointKey, markerKey) => {
        const value = e.target.value;
        this.setState({ [addressKey]: value });

        if (this.geocodeTimeout) clearTimeout(this.geocodeTimeout);

        this.geocodeTimeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
                );
                if (!response.ok) throw new Error("Failed to fetch geocoding data");
                const data = await response.json();

                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    this.setState({ [pointKey]: [lat, lon] });

                    const icon = L.icon({
                        iconUrl: addressKey === "startAddress" ? all_icons.start : all_icons.end,
                        iconSize: [30, 30],
                    });

                    if (this[markerKey]) this.map.removeLayer(this[markerKey]);
                    this[markerKey] = L.marker([lat, lon], { icon }).addTo(this.map);
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        }, 500);
    };

    fetchAddress = async (lat, lng, addressKey) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (!response.ok) throw new Error("Failed to fetch address");
            const data = await response.json();
            this.setState({ [addressKey]: data.display_name || "Không xác định" });
        } catch (error) {
            console.error("Error fetching address:", error);
            this.setState({ [addressKey]: "Không xác định" });
        }
    };

    handleFindRoute = () => {
        const { startPoint, endPoint } = this.state;
        if (!startPoint || !endPoint) return;

        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        const startIcon = L.icon({
            iconUrl: all_icons.start,
            iconSize: [30, 30],
        });

        const endIcon = L.icon({
            iconUrl: all_icons.end,
            iconSize: [30, 30],
        });

        this.routingControl = L.Routing.control({
            waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
            createMarker: function (i, waypoint) {
                const icon = i === 0 ? startIcon : endIcon;
                return L.marker(waypoint.latLng, { icon });
            },
            routeOptions: {
                styles: [
                    {
                        color: '#000000',
                        weight: 6,
                        opacity: 0.8
                    }
                ]
            }
        }).addTo(this.map);
    };

    handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Trình duyệt của bạn không hỗ trợ định vị địa lý.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                this.setState({ startPoint: [latitude, longitude] }, () => {
                    this.fetchAddress(latitude, longitude, 'startAddress');

                    const icon = L.icon({
                        iconUrl: all_icons.start,
                        iconSize: [30, 30],
                    });

                    if (this.startMarker) this.map.removeLayer(this.startMarker);
                    this.startMarker = L.marker([latitude, longitude], { icon }).addTo(this.map);
                });
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Bạn đã từ chối quyền truy cập vị trí. Vui lòng cấp quyền trong cài đặt trình duyệt.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Không thể xác định vị trí. Hãy kiểm tra lại kết nối hoặc GPS của bạn.");
                        break;
                    case error.TIMEOUT:
                        alert("Yêu cầu lấy vị trí đã hết thời gian chờ. Vui lòng thử lại.");
                        break;
                    default:
                        alert("Đã xảy ra lỗi không xác định khi lấy vị trí.");
                }
            }
        );
    };


    render() {
        const { startAddress, endAddress, startPoint, endPoint } = this.state;

        return (
            <div className='find-map'>
                <Header />
                <div className="find-map-container">
                    <div className="find-map-container-left">
                        <IoIosArrowBack
                            size={50}
                            color="#ffa16c"
                            onClick={() => this.props.history.goBack()}
                            style={{ cursor: "pointer" }}
                        />
                        <form className="form">
                            <div className="form-group">
                                <label htmlFor="startPoint">{this.props.language === languages.JA ? '出発地点' : 'Starting point'}</label>
                                <input
                                    type="text"
                                    id="startPoint"
                                    value={startAddress}
                                    onChange={(e) => this.handleAddressChange(e, "startAddress", "startPoint", "startMarker")}
                                    onClick={() => this.setState({ activeInput: "start" })}
                                />
                                {/* <button
                                    className="btn btn-location"
                                    type="button"
                                    onClick={this.handleGetCurrentLocation}
                                >
                                    Lấy địa điểm hiện tại
                                </button> */}
                            </div>
                            <div className="form-group">
                                <label htmlFor="endPoint">{this.props.language === languages.JA ? '目的地' : 'Destination'}</label>
                                <input
                                    type="text"
                                    id="endPoint"
                                    value={endAddress}
                                    onChange={(e) => this.handleAddressChange(e, "endAddress", "endPoint", "endMarker")}
                                    onClick={() => this.setState({ activeInput: "end" })}
                                />
                            </div>
                        </form>
                        <button className="btn" onClick={this.handleFindRoute}>
                            {this.props.language === languages.JA ? '道順を調べる' : 'Find the way'}
                        </button>
                    </div>
                    <div className="find-map-container-right">
                        <div id="map"></div>
                    </div>
                </div>
            </div>
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
        // processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FindMap));
