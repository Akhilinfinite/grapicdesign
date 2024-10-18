import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss";
import "./LocationStyles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import SearchIcon from "../../asserts/images/Icons/search.svg";

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
import InfiniteDropdown from "./components/InfiniteDropdown";
import CustomDateTimePicker from "./components/customDateTimeInput";

export default function RightDashboard() {
  const baseURL = "http://192.168.0.65:8500/rest/gvRestApi/";
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);
  const [Owners, setOwners] = useState([]);
  const [Scheduler, setScheduler] = useState([]);
  const [SelectedScheduler, setSelectedScheduler] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [SelectedCustomer, setSelectedCustomer] = useState([]);
  const [Contact, setContact] = useState([]);
  const [SelectedContact, setSelectedContact] = useState([]);

  const [District, setDistrict] = useState([]);
  const [School, setSchool] = useState([]);

  const [locationData, setLocationData] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState("Indoor");

  const [LFDistrict, setLFDistrict] = useState([]);
  const [LFSchool, setLFSchool] = useState([]);
  const [LFFloor, setLFFloor] = useState([]);
  const [LFRoom, setLFRoom] = useState([]);
  const [LFSelectedDistrict, setLFSelectedDistrict] = useState([]);
  const [LFSelectedSchool, setLFSelectedSchool] = useState([]);
  const [LFSelectedFloor, setLFSelectedFloor] = useState([]);
  const [LFSelectedRoom, setLFSelectedRoom] = useState([]);
  const [LFCapacity, setLFCapacity] = useState([]);
  const [LFvalues, setLFvalues] = useState({
    LFSelectedDistrict: "",
    LFSelectedSchool: "",
    LFSelectedFloor: "",
    LFSelectedRoom: "",
    LFCapacity: "",
  });

  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [intervalTime, setIntervalTime] = useState();

  const [isLocationFilterModalVisible, setLocationFilterModalVisibility] =
    useState(false);

  const handleLocationFilterClick = () => {
    setLocationFilterModalVisibility(true);
  };

  const handleCloseLocationFilterModal = () => {
    setLFSelectedDistrict(LFvalues.LFSelectedDistrict);
    setLFSelectedFloor(LFvalues.LFSelectedFloor);
    setLFSelectedSchool(LFvalues.LFSelectedSchool);
    setLFSelectedRoom(LFvalues.LFSelectedRoom);
    setLFCapacity(LFvalues.LFCapacity);
    setLocationFilterModalVisibility(false);
  };

  const handleApplyLocationFilterModal = () => {
    setLFvalues((prevData) => ({
      ...prevData,
      LFSelectedDistrict: LFSelectedDistrict,
      LFSelectedSchool: LFSelectedSchool,
      LFSelectedFloor: LFSelectedFloor,
      LFSelectedRoom: LFSelectedRoom,
      LFCapacity: LFCapacity,
    }));
    setLocationFilterModalVisibility(false);
  };

  //API calls
  useEffect(() => {
    const getOwner = () => {
      axios
        .post(`${baseURL}schedule/getOwners/`)
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[33],
            value: e[33],
            label: e[16],
            end: e[19],
            start: e[24],
            EVENTSLOTTIME: e[26],
          }));
          setOwners(data);
          const startDateTime = new Date(
            `${new Date().toISOString().split("T")[0]}T${
              data[0].start.split(" ")[3]
            }`
          );
          const endDateTime = new Date(
            `${new Date().toISOString().split("T")[0]}T${
              data[0].end.split(" ")[3]
            }`
          );

          setStartTime(startDateTime);
          setEndTime(endDateTime);
          setIntervalTime(data[0].EVENTSLOTTIME);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getOwner();
  }, []);
  useEffect(() => {
    const getScheduler = () => {
      axios
        .post(`${baseURL}schedule/getRequestors/`)
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          const selected = data.filter((e) => e.id === 2);
          setSelectedScheduler(selected);
          const updatedData = data.filter((e) => e.id !== 2);
          setScheduler(updatedData);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getScheduler();
  }, []);

  //customer API Implementation
  useEffect(() => {
    const getCustomer = () => {
      axios
        .post(`${baseURL}schedule/getCustomers/`)
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          const selected = data.filter((e) => e.id === 22);
          setSelectedCustomer(selected);
          setCustomer(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getCustomer();
  }, []);

  const handleCustomerClick = (selectedOption) => {
    const variable = selectedOption.value;
    let data1 = Customer.filter((e) => e.value === variable);
    if (!data1.length) {
      data1 = SelectedCustomer.filter((e) => e.value === variable);
    }
    setSelectedCustomer([selectedOption]);
    setSelectedContact([]);
    axios
      .post(`${baseURL}schedule/getContacts/`, {
        customer_id: data1[0].value,
        CUSTOMER_STATUS: 1,
      })
      .then(function (response) {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
          primaryContact: e[2],
        }));
        const selected = data.filter((e) => e.primaryContact === 1);
        setSelectedContact(selected);
        setContact(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //API Contact
  useEffect(() => {
    const getContact = () => {
      axios
        .post(`${baseURL}schedule/getContacts/`, {
          customer_id: 22,
          CUSTOMER_STATUS: 1,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
            primaryContact: e[2],
          }));
          const selected = data.filter((e) => e.primaryContact === 1);
          setSelectedContact(selected);
          setContact(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getContact();
  }, []);

  //API District
  useEffect(() => {
    const getDistrict = () => {
      axios
        .post(`${baseURL}master/getLocation/`, {
          loc_id: "10000000",
          loc_parentid: "00000000",
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[16],
          }));
          setDistrict(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getDistrict();
  }, []);
  //API School
  useEffect(() => {
    const getSchool = () => {
      axios
        .post(`${baseURL}master/getLocation/`, {
          label_id: "2",
          loc_parentid: "10000000",
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[14],
            label: e[16],
          }));
          setSchool(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getSchool();
  }, []);

  const handleSchoolClick = (selectedOption) => {
    const variable = selectedOption.value;
    if (locationData.find((loc) => loc.id === 1)?.options.length === 0) {
      // Fetch District, School, and Floor using fetchLocationData function

      Promise.all([
        fetchLocationData(variable, 1, "0,2", 2), // District
        fetchLocationData(variable, 2, "0,2", 2), // School
        fetchLocationData(variable, 3, "0,2", 2), // Floor
      ])
        .then(([districtRes, schoolRes, floorRes]) => {
          // Update locationData with new values
          setLocationData((prevLocationData) =>
            prevLocationData.map((location) => {
              if (location.id === 1) {
                return {
                  ...location,
                  options: districtRes.data,
                  selectedOption: districtRes.data[0],
                };
              }
              if (location.id === 2) {
                return {
                  ...location,
                  options: schoolRes.data,
                  selectedOption: schoolRes.selected,
                };
              }
              if (location.id === 3) {
                return {
                  ...location,
                  options: floorRes.data,
                  selectedOption: [],
                };
              }
              return location;
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLocationData((prevLocationData) =>
        prevLocationData.map((location) => {
          if (location.id === 2) {
            return { ...location, selectedOption: selectedOption };
          } else if (location.id === 3) {
            return { ...location, options: [], selectedOption: [] };
          } else if (location.id === 4) {
            return { ...location, options: [], selectedOption: [] };
          }
          return location;
        })
      );

      // Fetch Floor data from API
      axios
        .post(`${baseURL}master/getLocation/`, {
          label_id: "3",
          loc_parentid: variable,
        })
        .then(function (response) {
          const floorData = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[14],
            label: e[16],
          }));

          setLocationData((prevLocationData) =>
            prevLocationData.map((location) =>
              location.id === 3
                ? { ...location, options: floorData }
                : location.id === 4
                ? { ...location, options: [] }
                : location
            )
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleFloorClick = (selectedOption) => {
    const variable = selectedOption.value;
    if (locationData.find((loc) => loc.id === 1)?.options.length === 0) {
      Promise.all([
        fetchLocationData(variable, 1, "0,3", 3),
        fetchLocationData(variable, 2, "0,3", 3),
        fetchLocationData(variable, 3, "0,3", 3),
        fetchLocationData(variable, 4, "0,3", 3),
      ])
        .then(([districtRes, schoolRes, floorRes, roomRes]) => {
          setLocationData((prevLocationData) =>
            prevLocationData.map((location) => {
              if (location.id === 1) {
                return {
                  ...location,
                  options: districtRes.data,
                  selectedOption: districtRes.selected,
                };
              }
              if (location.id === 2) {
                return {
                  ...location,
                  options: schoolRes.data,
                  selectedOption: schoolRes.selected,
                };
              }
              if (location.id === 3) {
                return {
                  ...location,
                  options: floorRes.data,
                  selectedOption: floorRes.selected,
                };
              }
              if (location.id === 4) {
                return {
                  ...location,
                  options: roomRes.data,
                };
              }
              return location;
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLocationData((prevLocationData) =>
        prevLocationData.map((location) => {
          if (location.id === 3) {
            return { ...location, selectedOption: selectedOption };
          } else if (location.id === 4) {
            return { ...location, options: [], selectedOption: [] };
          }
          return location;
        })
      );
      axios
        .post(`${baseURL}master/getLocation/`, {
          label_id: "4",
          loc_parentid: variable,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[14],
            label: e[16],
          }));
          setLocationData((prevLocationData) =>
            prevLocationData.map((location) =>
              location.id === 4
                ? { ...location, options: data } // Set fetched Room data
                : location
            )
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleRoomClick = (selectedOption) => {
    const variable = selectedOption.value;
    setLocationData((prevLocationData) =>
      prevLocationData.map((location) =>
        location.id === 4
          ? { ...location, selectedOption: [selectedOption] }
          : location
      )
    );

    Promise.all([
      fetchLocationData(variable, 1, "0,4", 1),
      fetchLocationData(variable, 2, "0,4", 2),
      fetchLocationData(variable, 3, "0,4", 3),
      fetchLocationData(variable, 4, "0,4", 4),
    ])
      .then(([districtRes, schoolRes, floorRes, roomRes]) => {
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => {
            if (location.id === 1) {
              return {
                ...location,
                options: districtRes.data,
                selectedOption: districtRes.data[0],
              };
            }
            if (location.id === 2) {
              return {
                ...location,
                options: schoolRes.data,
                selectedOption: schoolRes.selected,
              };
            }
            if (location.id === 3) {
              return {
                ...location,
                options: floorRes.data,
                selectedOption: floorRes.selected,
              };
            }
            if (location.id === 4) {
              return {
                ...location,
                options: roomRes.data,
                selectedOption: roomRes.selected,
              };
            }
            return location;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLocationTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLocationType(selectedValue);
  };

  useEffect(() => {
    const handleLocationRadioBtnData = () => {
      const loctype_kir1 =
        selectedLocationType === "Indoor" ? 0 : "Outdoor" ? 1 : 2;
      const loctype_kir = loctype_kir1;
      axios
        .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getLabels/", {
          owner_id: "",
          loctype_kir: loctype_kir,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[1],
            options: e[0] === 1 ? District : e[0] === 2 ? School : [],
            selectedOption: e[0] === 1 ? District[0] : [],
          }));
          setLocationData(data);
        })
        .catch(function (error) {
          console.error("Error fetching labels:", error);
        });
    };
    if (District.length !== 0 || School.length !== 0) {
      handleLocationRadioBtnData();
    }
  }, [District, School, selectedLocationType]);

  const handleOptionSelect = (locationId, selectedOption) => {
    switch (locationId) {
      case 2: // School
        handleSchoolClick(selectedOption);
        break;
      case 3: // Floor
        handleFloorClick(selectedOption);
        break;
      case 4: // Room
        handleRoomClick(selectedOption);
        break;
      default:
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => {
            if (location.id === locationId) {
              return { ...location, selectedOption: selectedOption };
            }
            return location;
          })
        );
        break;
    }
  };

  const handelLocationSearchDropDown = (e) => {
    const option = e.target.value;

    switch (option) {
      case "1":
        console.log(option);
        break;

      case "2":
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => ({
            ...location,
            options: [],
            selectedOption: [],
          }))
        );
        axios
          .post(`${baseURL}schedule/quickLocationLookup/`, {
            vlabel: 2,
            owner: 1,
            loctype_kir: 0,
            label_text: "School",
            is_DefLocation: 0,
            loctype: "0,0,0,0,0,0,0",
            def_LocID: 1,
          })
          .then(function (response) {
            const schoolData = response.data.map((e) => ({
              id: e.KEY,
              value: e.KEY,
              label: e.VALUE,
            }));
            setLocationData((prevLocationData) =>
              prevLocationData.map((location) =>
                location.id === 2
                  ? { ...location, options: schoolData }
                  : location
              )
            );
          })
          .catch(function (error) {
            console.log(error);
          });
        break;

      case "3":
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => ({
            ...location,
            options: [],
            selectedOption: [],
          }))
        );
        axios
          .post(`${baseURL}schedule/quickLocationLookup/`, {
            vlabel: 3,
            owner: 1,
            loctype_kir: 0,
            label_text: "Floor",
            is_DefLocation: 0,
            loctype: "0,0,0,0,0,0,0",
            def_LocID: 1,
          })
          .then(function (response) {
            const floorData = response.data.map((e) => ({
              id: e.KEY,
              value: e.KEY,
              label: e.VALUE,
            }));
            setLocationData((prevLocationData) =>
              prevLocationData.map((location) =>
                location.id === 3
                  ? { ...location, options: floorData }
                  : location
              )
            );
          })
          .catch(function (error) {
            console.log(error);
          });
        break;

      case "4":
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => ({
            ...location,
            options: [],
            selectedOption: [],
          }))
        );
        axios
          .post(`${baseURL}schedule/quickLocationLookup/`, {
            vlabel: 4,
            owner: 1,
            loctype_kir: 0,
            label_text: "Room",
            is_DefLocation: 0,
            loctype: "0,0,0,0,0,0,0",
            def_LocID: 1,
          })
          .then(function (response) {
            const roomData = response.data.map((e) => ({
              id: e.KEY,
              value: e.KEY,
              label: e.VALUE,
            }));
            setLocationData((prevLocationData) =>
              prevLocationData.map((location) =>
                location.id === 4
                  ? { ...location, options: roomData }
                  : location
              )
            );
          })
          .catch(function (error) {
            console.log(error);
          });
        break;

      default:
        break;
    }
  };

  const fetchLocationData = (variable, clabel, h_value, quickloc) => {
    return axios
      .post(`${baseURL}schedule/LocationLookup/`, {
        h_value: h_value,
        h_cvalue: variable,
        clabel: clabel,
        loctype: "0,0,0,0,0,0,0",
        labelid: clabel.toString(),
        quickloc: quickloc,
        lblcount: "4",
        deflab: 0,
      })
      .then(function (response) {
        const data = response.data.slice(2).map((e) => ({
          id: e.KEY,
          value: e.KEY,
          label: e.VALUE,
        }));
        const selectedKey = response.data[1].VALUE;
        const selected = data.find((item) => item.value === selectedKey);

        return { data, selected };
      })
      .catch(function (error) {
        console.log(error);
        return { data: [], selected: null };
      });
  };

  //API Location filter District
  useEffect(() => {
    const getLFDistrict = () => {
      axios
        .get(`${baseURL}schedule/getLevelType/1`, {
          label_id: 1,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          setLFDistrict(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getLFDistrict();
  }, []);
  //API Location filter School
  useEffect(() => {
    const getLFSchool = () => {
      axios
        .get(`${baseURL}schedule/getLevelType/2`, {
          label_id: 1,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          setLFSchool(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getLFSchool();
  }, []);
  //API Location filter Floor
  useEffect(() => {
    const getLFFloor = () => {
      axios
        .get(`${baseURL}schedule/getLevelType/3`, {
          label_id: 1,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          setLFFloor(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getLFFloor();
  }, []);
  //API Location filter Room
  useEffect(() => {
    const getLFRoom = () => {
      axios
        .get(`${baseURL}schedule/getLevelType/4`, {
          label_id: 1,
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          setLFRoom(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getLFRoom();
  }, []);

  const handleClick1 = () => {
    setIsOpen1(!isOpen1);
  };
  const handleClick2 = () => {
    setIsOpen2(!isOpen2);
  };
  const handleClick3 = () => {
    setIsOpen3(!isOpen3);
  };

  const handleClickPeopleSearch = () => {
    const option = document.getElementById("people_input_Select").value;
    const data1 = document.getElementById("people_input_Search").value;
    switch (option) {
      case "1":
        console.log(data1);
        break;
      case "2":
        console.log(data1);
        break;
      case "3":
        console.log(data1);
        break;
      case "4":
        axios
          .post(`${baseURL}schedule/getContacts/`, {
            search_filter: data1,
          })
          .then(function (response) {
            const data = response.data.DATA.map((e) => ({
              id: e[0],
              value: e[0],
              label: e[1],
            }));
            setContact(data);
            setSelectedContact([]);
          })
          .catch(function (error) {
            console.log(error);
          });
        break;
      default:
        break;
    }
  };
  const handleClickLocationSearch = () => {
    const option = document.getElementById("location_input_Select").value;
    const data = document.getElementById("location_input_Search").value;
    console.log(data, option);
  };

  const [isIntervalTypeModalVisible, setIntervalTypeModalVisible] =
    useState(false);
  const [intervalType, setIntervalType] = useState("");

  // Function to close the modal
  const closeIntervalTypeModal = () => {
    setIntervalTypeModalVisible(false);
  };

  const handlePopUpOpen = () => {
    setIntervalTypeModalVisible(true);
  };

  // Function to handle dropdown change
  const handleIntervalTypeChange = (e) => {
    setIntervalType(e.target.value);
    setIntervalTypeModalVisible(true);
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
                            <CustomDateTimePicker
                              value={StartTime}
                              onChange={setStartTime}
                              interval={intervalTime}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="endTime-container mb-3">
                          <div className="heading" style={{ fontSize: "1em" }}>
                            End Date and Time
                          </div>
                          <div className="time">
                            <CustomDateTimePicker
                              value={EndTime}
                              onChange={setEndTime}
                              interval={intervalTime}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className="col-3">
                        <div className="interval-container mb-3">
                          <div className="heading">Interval Type</div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div className="dropdown dropdown-wrapper search keyword">
                              <select
                                name="intervalType"
                                className="custom-select"
                                onChange={handleIntervalTypeChange}
                              >
                                <option value="">select value</option>
                                <option value="Weekly">weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Recurring">Recurring</option>
                              </select>
                            </div>
                            {/* {intervalType !== "" && ( */}
                            <div onClick={handlePopUpOpen}>
                              <img
                                src={Edit}
                                alt="edit"
                                width={35}
                                height={35}
                              />
                            </div>
                            {/* )} */}

                            {/* Weekly Interval Modal */}
                            {intervalType === "Weekly" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Weekly Interval Type
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="row intervalType-row1">
                                    <div className="col-sm-6 mb-2">
                                      <label className="mr-2">
                                        Repeat every
                                      </label>
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
                                          <option value="Weekly">weekly</option>
                                          <option value="Monthly">
                                            Monthly
                                          </option>
                                          <option value="Recurring">
                                            Recurring
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row intervalType-row2 mt-3 one">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-6">
                                      <div className="d-flex align-items-center justify-content-center">
                                        <input
                                          type="radio"
                                          className="onday-radio"
                                          style={{
                                            height: "20px",
                                            width: "20px",
                                          }}
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
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
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
                                          <option value="Weekly">weekly</option>
                                          <option value="Monthly">
                                            Monthly
                                          </option>
                                          <option value="Recurring">
                                            Recurring
                                          </option>
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
                                          <option value="Weekly">weekly</option>
                                          <option value="Monthly">
                                            Monthly
                                          </option>
                                          <option value="Recurring">
                                            Recurring
                                          </option>
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
                                      <div>
                                        <a href="/"> Remove</a>
                                      </div>
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
                            )}

                            {/* Monthly Interval Modal */}
                            {intervalType === "Monthly" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Monthly Interval Type
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="row intervalType-row1">
                                    <div
                                      className="col-sm-6 mb-2"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                      }}
                                    >
                                      <label className="mr-2">
                                        Repeat every
                                      </label>
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
                                      <label>Month(s)</label>
                                    </div>
                                  </div>

                                  <div className="row intervalType-row2 mt-3 two">
                                    <div
                                      className="col-sm-5 mb-2"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="monthlyOption"
                                        className="onday-radio"
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
                                      />
                                      <label className="ml-2">On Day</label>
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
                                    <div
                                      className="col-sm-7 mb-2"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="monthlyOption"
                                        className="onday-radio"
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
                                      />
                                      <label
                                        className="ml-2"
                                        style={{
                                          whiteSpace: "nowrap",
                                          paddingRight: "10px",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        On the
                                      </label>
                                      <div
                                        className="dropdown-wrapper"
                                        style={{ display: "inline-block" }}
                                      >
                                        <select
                                          name="occurrence"
                                          className="custom-select mb-2"
                                          style={{ marginRight: "5px" }}
                                        >
                                          <option value="">select value</option>
                                          <option value="First">First</option>
                                          <option value="Second">Second</option>
                                          <option value="Third">Third</option>
                                          <option value="Fourth">Fourth</option>
                                          <option value="Last">Last</option>
                                        </select>
                                        <select
                                          name="weekday"
                                          className="custom-select"
                                        >
                                          <option value="">select value</option>
                                          <option value="Monday">Monday</option>
                                          <option value="Tuesday">
                                            Tuesday
                                          </option>
                                          <option value="Wednesday">
                                            Wednesday
                                          </option>
                                          <option value="Thursday">
                                            Thursday
                                          </option>
                                          <option value="Friday">Friday</option>
                                          <option value="Saturday">
                                            Saturday
                                          </option>
                                          <option value="Sunday">Sunday</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row intervalType-row3 mt-3">
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
                                      <div>
                                        <a href="/"> Remove</a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row intervalType-row4 mt-3">
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
                            )}

                            {/* Recurring Interval Modal */}
                            {intervalType === "Recurring" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Recurring Interval Type
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="row intervalType-row1">
                                    <div className="col-sm-6 mb-2">
                                      <label className="mr-2">
                                        Repeat every
                                      </label>
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
                                          name="interval"
                                          className="custom-select"
                                        >
                                          <option value="Day(s)">Day(s)</option>
                                          <option value="Week(s)">
                                            Week(s)
                                          </option>
                                          <option value="Month(s)">
                                            Month(s)
                                          </option>
                                          <option value="Year(s)">
                                            Year(s)
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row intervalType-row2 mt-3 three">
                                    <div className="col-sm-12">
                                      <div className="d-flex justify-content-between">
                                        {[
                                          "Monday",
                                          "Tuesday",
                                          "Wednesday",
                                          "Thursday",
                                          "Friday",
                                          "Saturday",
                                          "Sunday",
                                        ].map((day) => (
                                          <div
                                            key={day}
                                            className="custom-control custom-checkbox"
                                          >
                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id={`check${day}`}
                                            />
                                            <label
                                              className="custom-control-label"
                                              htmlFor={`check${day}`}
                                            >
                                              {day}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row intervalType-row3 mt-3">
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
                                      <div>
                                        <a href="/"> Remove</a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row intervalType-row4 mt-3">
                                    <div className="col">
                                      <p className="text-center">
                                        Occurs every <span>3</span> week(s) on
                                        the selected days starting{" "}
                                        <span>10/11/23</span> until{" "}
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
                            )}
                          </div>
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
                            <select
                              name="days"
                              id="people_input_Select"
                              className="custom-select"
                            >
                              <option value="">select value</option>
                              <option value="1">Owner</option>
                              <option value="2">Scheduler</option>
                              <option value="3">Customer</option>
                              <option value="4">Contact</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} sm={6} xs={12} className="col-3">
                        <div className="seletedFeild">
                          <label>Selected Field</label>
                          <div className="selectedSearchField">
                            <input
                              type="text"
                              id="people_input_Search"
                              placeholder="search key word"
                              className="form-control"
                            />
                            <img
                              src={SearchIcon}
                              alt="Search Icon"
                              className="search-icon"
                              onClick={handleClickPeopleSearch}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={2} sm={6} xs={12} className="col-2">
                        <div className="edit pt-4 text-center">
                          <img
                            src={Edit}
                            alt="edit"
                            style={{
                              marginRight: "10px",
                            }}
                          />
                          <p
                            style={{
                              display: "inline-block",
                            }}
                          >
                            Edit
                          </p>
                        </div>
                      </Col>
                      <Col md={2} sm={6} xs={12} className="col-2">
                        <div className="add pt-4 ">
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
                              <InfiniteDropdown
                                options={Owners}
                                selectedValue={Owners[0] ? [Owners[0]] : []}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Scheduler</div>
                            <div className="dropdown">
                              <InfiniteDropdown
                                options={Scheduler}
                                selectedValue={SelectedScheduler}
                                onChange={(selectedOption) =>
                                  setSelectedScheduler([selectedOption])
                                }
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Customer</div>
                            <div className="dropdown">
                              <InfiniteDropdown
                                options={Customer}
                                selectedValue={SelectedCustomer}
                                onChange={handleCustomerClick}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Contact</div>
                            <div className="dropdown">
                              <InfiniteDropdown
                                options={Contact}
                                selectedValue={SelectedContact}
                                onChange={(selectedOption) =>
                                  setSelectedContact([selectedOption])
                                }
                              />
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
                        <div className="location-radio-btn d-flex flex-wrap">
                          <p className="list mr-3 mb-2">Location Type :</p>
                          <div className="list mr-3 mb-2 mt-1">
                            <input
                              type="radio"
                              id="Indoor"
                              name="age"
                              value="Indoor"
                              defaultChecked={true}
                              onChange={handleLocationTypeChange}
                            />
                            <label
                              htmlFor="Indoor"
                              style={{ marginLeft: "8px" }}
                            >
                              Indoor
                            </label>
                          </div>
                          <div className="list mr-3 mb-2 mt-1">
                            <input
                              type="radio"
                              id="Outdoor"
                              name="age"
                              value="Outdoor"
                              onChange={handleLocationTypeChange}
                            />
                            <label
                              htmlFor="Outdoor"
                              style={{ marginLeft: "8px" }}
                            >
                              Outdoor
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
                            <select
                              name="days"
                              className="custom-select"
                              id="location_input_Select"
                              onChange={(e) => handelLocationSearchDropDown(e)}
                            >
                              {locationData.length !== 0 && (
                                <option value="">select value</option>
                              )}
                              {locationData.map((location) => (
                                <option key={location.id} value={location.id}>
                                  {location.value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} className="col-4 mb-3">
                        <div className="seletedFeild">
                          <label>Selected Field</label>
                          <div className="selectedSearchField">
                            <input
                              type="text"
                              id="location_input_Search"
                              placeholder="search key word"
                              className="form-control"
                            />
                            <img
                              src={SearchIcon}
                              alt="Search Icon"
                              className="search-icon"
                              onClick={handleClickLocationSearch}
                            />
                          </div>
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
                              {/* District */}
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">District:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <InfiniteDropdown
                                      options={LFDistrict}
                                      selectedValue={LFSelectedDistrict}
                                      onChange={(selectedOption) =>
                                        setLFSelectedDistrict(selectedOption)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* School */}
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">School:</label>
                                </div>
                                <div className="col-9">
                                  <div className="dropdown">
                                    <InfiniteDropdown
                                      options={LFSchool}
                                      selectedValue={LFSelectedSchool}
                                      onChange={(selectedOption) =>
                                        setLFSelectedSchool(selectedOption)
                                      }
                                    />
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
                                    <InfiniteDropdown
                                      options={LFFloor}
                                      selectedValue={LFSelectedFloor}
                                      onChange={(selectedOption) =>
                                        setLFSelectedFloor(selectedOption)
                                      }
                                    />
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
                                    <InfiniteDropdown
                                      options={LFRoom}
                                      selectedValue={LFSelectedRoom}
                                      onChange={(selectedOption) =>
                                        setLFSelectedRoom(selectedOption)
                                      }
                                    />
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
                                    value={LFCapacity}
                                    onChange={(e) => {
                                      setLFCapacity(e.target.value);
                                    }}
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
                          <Button
                            className="filter-reset-btn"
                            onClick={handleCloseLocationFilterModal}
                          >
                            Reset
                          </Button>
                          <Button
                            className="filter-close-btn"
                            onClick={handleCloseLocationFilterModal}
                          >
                            Close
                          </Button>
                          <Button
                            className="filter-apply-btn"
                            onClick={handleApplyLocationFilterModal}
                          >
                            Apply
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Row>
                    <div className="selectedField-header">
                      <p>Selected Fields</p>
                    </div>
                    <div className="selectedField-dropdown">
                      <Row>
                        {locationData.map((location) => (
                          <Col
                            xs={12}
                            md={3}
                            className="col-3 mb-3"
                            key={location.id}
                          >
                            <div className="selectedField-value">
                              <div className="title">{location.value}</div>
                              <div className="dropdown">
                                <InfiniteDropdown
                                  options={location.options}
                                  selectedValue={location.selectedOption}
                                  onChange={(selected) =>
                                    handleOptionSelect(location.id, selected)
                                  }
                                />
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
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
