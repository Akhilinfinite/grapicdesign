import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss";
import "./LocationStyles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";

import Calender from "../../asserts/images/Icons/calendar-blank.svg";
import Profile from "../../asserts/images/Icons/profile.svg";
import UserCalender from "../../asserts/images/Icons/calendar people.svg";
import ContactCalender from "../../asserts/images/Icons/calendar right.svg";
import Edit from "../../asserts/images/Icons/edit-square-line-icon 1.svg";

//location
import Location from "../../asserts/images/Icons/map-marker.svg";
import MonthView from "../../asserts/images/Icons/location calendar.svg";
import DayView from "../../asserts/images/Icons/calendar day.svg";
import TimeView from "../../asserts/images/Icons/calendar time.svg";
import Filter from "../../asserts/images/Icons/filter.svg";

import Add from "../../asserts/images/Icons/add.svg";
import Down from "../../asserts/images/Icons/down_arrow.png";
import Up from "../../asserts/images/Icons/up_arrow.png";
export default function RightDashboard() {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [Owners, setOwners] = useState([]);
  const [Scheduler, setScheduler] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Contact, setContact] = useState([]);
  const [District, setDistrict] = useState([]);
  const [School, setSchool] = useState([]);
  const [Floor, setFloor] = useState([]);
  const [Room, setRoom] = useState([]);

  const [isIntervalTypeModalVisible, setIntervalTypeModalVisibility] =
    useState(false);

  const [isLocationFilterModalVisible, setLocationFilterModalVisibility] =
    useState(false);

  const handleIntervalTypeChange = (e) => {
    const value = e.target.value;
    if (value) {
      setIntervalTypeModalVisibility(true);
    }
  };

  const closeIntervalTypeModal = () => setIntervalTypeModalVisibility(false);

  const handleLocationFilterClick = () => {
    setLocationFilterModalVisibility(true);
  };

  const handleCloseLocationFilterModal = () => {
    setLocationFilterModalVisibility(false);
  };

  useEffect(() => {
    getOwner();
    getScheduler();
    getCustomer();
    getContact();
    getDistrict();
    getSchool();
  }, []);

  //API calls
  const getOwner = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getOwners/")
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[33],
          value: e[33],
          lable: e[16],
        }));
        setOwners(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getScheduler = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getRequestors/")
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          lable: e[1],
        }));
        setScheduler(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getCustomer = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getCustomers/")
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          lable: e[1],
        }));
        setCustomer(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getContact = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getContacts/")
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          lable: e[1],
        }));
        setContact(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getDistrict = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/master/getLocation/", {
        loc_id: "10000000",
        loc_parentid: "00000000",
      })
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          lable: e[16],
        }));
        setDistrict(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getSchool = () => {
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/master/getLocation/", {
        label_id: "2",
        loc_parentid: "10000000",
      })
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[14],
          lable: e[16],
        }));
        setSchool(data);
        setFloor([]);
        setRoom([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleSchoolClick = (e) => {
    const variable = e.target.value;
    const data1 = School.filter((e) => e.value === variable);
    setFloor([]);
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/master/getLocation/", {
        label_id: "3",
        loc_parentid: data1[0].value,
      })
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[14],
          lable: e[16],
        }));
        setFloor(data);
        setRoom([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFloorClick = (e) => {
    const variable = e.target.value;
    const data1 = Floor.filter((e) => e.value === variable);
    setRoom([]);
    axios
      .post("http://192.168.0.65:8500/rest/gvRestApi/master/getLocation/", {
        label_id: "4",
        loc_parentid: data1[0].value,
      })
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[14],
          lable: e[16],
        }));
        setRoom(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClick1 = () => {
    setIsOpen1(!isOpen1);
  };
  const handleClick2 = () => {
    setIsOpen2(!isOpen2);
  };
  const handleClick3 = () => {
    setIsOpen3(!isOpen3);
  };
  return (
    <div className="mainRightDashboard">
      <div className="topRightdashboard">
        <div className="scheduleSearch-header">
          <div className="search">Search</div>
          <div className="scheduleSearch-buttons">
            <div className="button">
              <button className="btnmodify">Modify/Cancel</button>
              <button className="btnrequest">Show Request</button>
            </div>
          </div>
        </div>
      </div>
      <div className="scheduleSearch">
        <div className="scheduleSearch-body">
          <div className="accordion-item">
            <button className="accordion-item-btn" onClick={handleClick1}>
              <div className="section-1">
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={Calender} alt="Calender" />
                  </div>
                  <div className="title">Date and Time</div>
                </div>
                <div className="button">
                  {isOpen1 ? (
                    <img src={Up} alt="icon" />
                  ) : (
                    <img src={Down} alt="icon" />
                  )}
                </div>
              </div>
            </button>
            {isOpen1 && (
              <div className="section-2">
                <div className="accordion-body">
                  <div className="datetime-setup">
                    <Row>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="startTime-container mb-3">
                          <div className="heading">Start Date and Time</div>
                          <div className="time">
                            <input
                              type="datetime-local"
                              name="scheduleStartTime"
                              className="form-control"
                              style={{ height: "40px" }}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="endTime-container mb-3">
                          <div className="heading">End Date and Time</div>
                          <div className="time">
                            <input
                              type="datetime-local"
                              name="scheduleEndTime"
                              className="form-control"
                              style={{ height: "40px" }}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="interval-container mb-3">
                          <div className="heading">Interval Type</div>
                          <div className="dropdown dropdown-wrapper search keyword">
                            <select
                              name="days"
                              className="custom-select"
                              onChange={handleIntervalTypeChange}
                            >
                              <option value="">select value</option>
                              <option value="Weekly">Every Wednesday</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                            </select>
                          </div>
                          <Modal
                            show={isIntervalTypeModalVisible}
                            onHide={closeIntervalTypeModal}
                            backdrop={false}
                            keyboard={true}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Interval Type</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="row intervalType-row1">
                                <div className="col-sm-6 mb-2">
                                  <label className="mr-2">Repeat every</label>
                                  <input
                                    type="number"
                                    className="form-control repeat-every-value"
                                    style={{
                                      width: "30%",
                                      display: "inline-block",
                                      marginLeft: "5px",
                                    }}
                                  />
                                </div>
                                <div className="col-sm-6">
                                  <div className="dropdown-wrapper">
                                    <select
                                      name="days"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="Weekly">
                                        Every Wednesday
                                      </option>
                                      <option value="Daily">Daily</option>
                                      <option value="Weekly">Weekly</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="row intervalType-row2 mt-3">
                                <div className="col-sm-3"></div>
                                <div className="col-sm-6">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <input
                                      type="radio"
                                      className="onday-radio"
                                      style={{ height: "20px", width: "20px" }}
                                    />
                                    <label className="onDay-section">
                                      On Day
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control onday-value"
                                      style={{
                                        width: "30%",
                                        display: "inline-block",
                                        marginRight: "10px",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-3"></div>
                              </div>

                              <div className="row intervalType-row3 mt-3">
                                <div className="col-sm-4 mb-2 intervalType-row3-col1">
                                  <input
                                    type="radio"
                                    className="onday-radio"
                                    style={{ height: "20px", width: "20px" }}
                                  />
                                  <label className="ml-2">On the</label>
                                </div>
                                <div className="col-sm-4 mb-2">
                                  <div className="dropdown-wrapper">
                                    <select
                                      name="days"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="Weekly">
                                        Every Wednesday
                                      </option>
                                      <option value="Daily">Daily</option>
                                      <option value="Weekly">Weekly</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-sm-4 mb-2">
                                  <div className="dropdown-wrapper">
                                    <select
                                      name="days"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="Weekly">
                                        Every Wednesday
                                      </option>
                                      <option value="Daily">Daily</option>
                                      <option value="Weekly">Weekly</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="row intervalType-row4 mt-3">
                                <div className="col-8">
                                  <label>End Date</label>
                                  <input
                                    type="datetime-local"
                                    name="date-select"
                                    className="form-control time"
                                    style={{
                                      width: "70%",
                                      display: "inline-block",
                                      marginLeft: "5px",
                                    }}
                                  />
                                </div>
                                <div className="col-4 text-center">
                                  <div>Remove</div>
                                </div>
                              </div>
                              <div className="row intervalType-row5 mt-3">
                                <div className="col">
                                  <p className="text-center">
                                    Occurs every month on the first Monday
                                    starting <span>10/11/23</span> until{" "}
                                    <span>15/11/23</span>
                                  </p>
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                className="intervalCloseBtn"
                                onClick={closeIntervalTypeModal}
                              >
                                Close
                              </Button>
                              <Button
                                variant="primary"
                                onClick={closeIntervalTypeModal}
                              >
                                Save
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="showConflict mt-4">
                          <div className="d-flex align-items-center">
                            <input
                              className="checkBox m-2"
                              type="checkbox"
                              style={{
                                height: "20px",
                              }}
                            />
                            <div className="conflict ml-2">Show Conflicts</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="scheduleSearch-body">
          <div className="accordion-item">
            <button className="accordion-item-btn" onClick={handleClick2}>
              <div className="section-1">
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={Profile} alt="Profile" />
                  </div>
                  <div className="title">People</div>
                </div>
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={UserCalender} alt="UserCalender" />
                  </div>
                  <div className="title">User Calender</div>
                </div>
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={ContactCalender} alt="Contact Calender" />
                  </div>
                  <div className="title">Contact Calender</div>
                </div>
                <div className="button">
                  {isOpen2 ? (
                    <img src={Up} alt="icon" />
                  ) : (
                    <img src={Down} alt="icon" />
                  )}
                </div>
              </div>
            </button>
            {isOpen2 && (
              <div className="section-2">
                <div className="accordion-body">
                  <div className="calender-setup">
                    <Row>
                      <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                        <div className="content">
                          <div className="title">Choose field to Search</div>
                          <div className="dropdown-wrapper">
                            <select name="days" className="custom-select">
                              <option value="">select value</option>
                              <option value="1">Owner</option>
                              <option value="2">Scheduler</option>
                              <option value="3">Customer</option>
                              <option value="4">Contact</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="seletedFeild">
                          <label>Selected Field</label>
                          <input
                            type="text"
                            placeholder="search key word"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="edit pt-4 text-center">
                          <img
                            src={Edit}
                            alt="edit"
                            style={{
                              marginRight: "10px",
                              verticalAlign: "middle",
                            }}
                          />
                          <p
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            Edit
                          </p>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="add pt-4 text-center">
                          <img
                            src={Add}
                            alt="Add"
                            style={{
                              marginRight: "10px",
                              verticalAlign: "middle",
                            }}
                          />
                          <p style={{ display: "inline-block" }}>Add</p>
                        </div>
                      </Col>
                    </Row>
                    <div className="selectedField-header">
                      <p>Selected Fields</p>
                    </div>
                    <div className="selectedField-dropdown">
                      <Row>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Owner</div>
                            <div className="dropdown">
                              <select name="owner" className="custom-select">
                                <option value="">Select value</option>
                                {Owners.map((e, id) => (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Scheduler</div>
                            <div className="dropdown">
                              <select
                                name="scheduler"
                                className="custom-select"
                              >
                                <option value="">Select value</option>
                                {Scheduler.map((e, id) => (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Customer</div>
                            <div className="dropdown">
                              <select name="customer" className="custom-select">
                                <option value="">Select value</option>
                                {Customer.map((e, id) => (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Contact</div>
                            <div className="dropdown">
                              <select name="contact" className="custom-select">
                                <option value="">Select value</option>
                                {Contact.map((e, id) => (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="scheduleSearch-body">
          <div className="accordion-item">
            <button className="accordion-item-btn" onClick={handleClick3}>
              <div className="section-1">
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={Location} alt="Location" />
                  </div>
                  <div className="title">Location</div>
                </div>
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={MonthView} alt="MonthView" />
                  </div>
                  <div className="title">Month View</div>
                </div>
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={DayView} alt="DayView" />
                  </div>
                  <div className="title">Day View</div>
                </div>
                <div className="title-icon">
                  <div className="icon-t">
                    <img src={TimeView} alt="TimeView" />
                  </div>
                  <div className="title">Time View</div>
                </div>
                <div className="button">
                  {isOpen3 ? (
                    <img src={Up} alt="icon" />
                  ) : (
                    <img src={Down} alt="icon" />
                  )}
                </div>
              </div>
            </button>
            {isOpen3 && (
              <div className="section-2">
                <div className="accordion-body">
                  <div className="calender-setup">
                    <Row>
                      <Col xs={12} className="mb-3 mr-3">
                        <p>Location Type :</p>
                        <div className="location-radio-btn d-flex flex-wrap">
                          <div className="list mr-3 mb-2">
                            <input
                              type="radio"
                              id="Indoor"
                              name="age"
                              value="Indoor"
                              defaultChecked={true}
                            />
                            <label
                              htmlFor="Indoor"
                              style={{ marginLeft: "8px" }}
                            >
                              Indoor
                            </label>
                          </div>
                          <div className="list mr-3 mb-2">
                            <input
                              type="radio"
                              id="Outdoor"
                              name="age"
                              value="Outdoor"
                            />
                            <label
                              htmlFor="Outdoor"
                              style={{ marginLeft: "8px" }}
                            >
                              Outdoor
                            </label>
                          </div>
                          <div className="list mr-3 mb-2">
                            <input
                              type="radio"
                              id="Equip"
                              name="age"
                              value="Equip"
                            />
                            <label
                              htmlFor="Equip"
                              style={{ marginLeft: "8px" }}
                            >
                              Equip
                            </label>
                          </div>
                          <div className="list mb-2">
                            <input
                              type="radio"
                              id="People"
                              name="age"
                              value="People"
                            />
                            <label
                              htmlFor="People"
                              style={{ marginLeft: "8px" }}
                            >
                              People
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4} className="col-4 mb-3">
                        <div className="content">
                          <div className="title">Choose field to Search</div>
                          <div className="dropdown">
                            <select name="days" className="custom-select">
                              <option value="">select value</option>
                              <option value="">District</option>
                              <option value="">School</option>
                              <option value="">Floor</option>
                              <option value="">Room</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} className="col-4 mb-3">
                        <div className="seletedFeild">
                          <label>Selected Field</label>
                          <input
                            type="text"
                            placeholder="search key word"
                            className="form-control" // Added Bootstrap class for input
                          />
                        </div>
                      </Col>
                      <Col xs={12} sm={4} className="col-4">
                        <div className="edit-add p-4">
                          <div className="edit">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={handleLocationFilterClick}
                              className="handleLocationFilter"
                            >
                              <img
                                src={Filter}
                                alt="Filter"
                                style={{ marginRight: "5px" }}
                              />
                              <p style={{ marginBottom: "0" }}>
                                Location Filter
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Modal
                        show={isLocationFilterModalVisible}
                        onHide={handleCloseLocationFilterModal}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Location Filters
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="row">
                            {/* First Column */}
                            <div className="col-md-6">
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">District:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="district1"
                                      className="custom-select"
                                    >
                                      {District.map((e, id) => {
                                        return (
                                          <option value={e.value} key={id}>
                                            {e.lable}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">School:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="school"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="Weekly">
                                        Every Wednesday
                                      </option>
                                      <option value="Daily">Daily</option>
                                      <option value="Weekly">Weekly</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Floor */}
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Floor:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="floor"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="Weekly">
                                        Every Wednesday
                                      </option>
                                      <option value="Daily">Daily</option>
                                      <option value="Weekly">Weekly</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Room */}
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Room:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="room"
                                      className="custom-select"
                                    >
                                      <option value=""></option>
                                      {Room.map((e, id) => {
                                        return (
                                          <option value={e.value} key={id}>
                                            {e.lable}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Capacity:</label>
                                </div>
                                <div className="col-9">
                                  <input
                                    type="number"
                                    className="form-control repeat-every-value"
                                  />
                                </div>
                              </div>

                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Handicap:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="handicap"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                      <option value="na">NA</option>
                                      <option value="yes">Yes</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Amenities:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <select
                                      name="amenities"
                                      className="custom-select"
                                    >
                                      <option value="">select value</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button className="filter-reset-btn">Reset</Button>
                          <Button
                            className="filter-close-btn"
                            onClick={handleCloseLocationFilterModal}
                          >
                            Close
                          </Button>
                          <Button className="filter-apply-btn">Close</Button>
                        </Modal.Footer>
                      </Modal>
                    </Row>
                    <div clas="selectedField-header">
                      <p>Selected Fields</p>
                    </div>
                    <Row>
                      <Col xs={12} md={3} className="col-3 mb-3">
                        <div className="selectedField-value">
                          <div className="title">District</div>
                          <div className="dropdown">
                            <select name="days" className="custom-select">
                              {District.map((e, id) => {
                                return (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={3} className="col-3 mb-3">
                        <div className="selectedField-value">
                          <div className="title">School</div>
                          <div className="dropdown">
                            <select
                              name="days"
                              className="custom-select"
                              onChange={(e) => handleSchoolClick(e)}
                            >
                              <option value=""></option>
                              {School.map((e, id) => {
                                return (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={3} className="col-3 mb-3">
                        <div className="selectedField-value">
                          <div className="title">Floor</div>
                          <div className="dropdown">
                            <select
                              name="days"
                              className="custom-select"
                              onChange={(e) => handleFloorClick(e)}
                            >
                              <option value=""></option>
                              {Floor.map((e, id) => {
                                return (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={3} className="col-3 mb-3">
                        <div className="selectedField-value">
                          <div className="title">Room</div>
                          <div className="dropdown">
                            <select name="days" className="custom-select">
                              <option value=""></option>
                              {Room.map((e, id) => {
                                return (
                                  <option value={e.value} key={id}>
                                    {e.lable}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row scheduleSearch_5">
        <div className="search-footer d-flex justify-content-end">
          <div className="button">
            <button className=" btn btn-clear">Clear/Reset</button>
            <button className="btn-schedule btn">Schedule</button>
            <button className="btn-search btn">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
