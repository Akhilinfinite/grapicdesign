import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import InfiniteDropdown from "./InfiniteDropdown";

export default function Untitled1() {
  const baseURL = "http://192.168.0.65:8500/rest/gvRestApi/";
  const [District, setDistrict] = useState([]);
  const [School, setSchool] = useState([]);
  const [SelectedSchool, setSelectedSchool] = useState([]);
  const [Floor, setFloor] = useState([]);
  const [SelectedFloor, setSelectedFloor] = useState([]);
  const [Room, setRoom] = useState([]);
  const [SelectedRoom, setSelectedRoom] = useState([]);

  const [locationData, setLocationData] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState("Indoor");

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
          console.log(data);
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
      default:
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) => {
            if (location.id === locationId) {
              return { ...location, selectedOption: selectedOption };
            }
            return location;
          })
        ); break;
        
    }
  };

  // const handelLocationSearchDropDown = (e) => {
  //   const option = e.target.value;
  //   switch (option) {
  //     case "1":
  //       console.log(option);
  //       break;
  //     case "2":
  //       setDistrict([]);
  //       setSchool([]);
  //       setFloor([]);
  //       setRoom([]);
  //       setSelectedSchool([]);
  //       setSelectedFloor([]);
  //       setSelectedRoom([]);
  //       axios
  //         .post(`${baseURL}schedule/quickLocationLookup/`, {
  //           vlabel: 2,
  //           owner: 1,
  //           loctype_kir: 0,
  //           label_text: "School",
  //           is_DefLocation: 0,
  //           loctype: "0,0,0,0,0,0,0",
  //           def_LocID: 1,
  //         })
  //         .then(function (response) {
  //           const data = response.data.map((e) => ({
  //             id: e.KEY,
  //             value: e.KEY,
  //             label: e.VALUE,
  //           }));
  //           setSchool(data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //       break;
  //     case "3":
  //       setDistrict([]);
  //       setSchool([]);
  //       setFloor([]);
  //       setRoom([]);
  //       setSelectedSchool([]);
  //       setSelectedFloor([]);
  //       setSelectedRoom([]);
  //       axios
  //         .post(`${baseURL}schedule/quickLocationLookup/`, {
  //           vlabel: 3,
  //           owner: 1,
  //           loctype_kir: 0,
  //           label_text: "Floor",
  //           is_DefLocation: 0,
  //           loctype: "0,0,0,0,0,0,0",
  //           def_LocID: 1,
  //         })
  //         .then(function (response) {
  //           const data = response.data.map((e) => ({
  //             id: e.KEY,
  //             value: e.KEY,
  //             label: e.VALUE,
  //           }));
  //           setFloor(data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //       break;
  //     case "4":
  //       setDistrict([]);
  //       setSchool([]);
  //       setFloor([]);
  //       setRoom([]);
  //       setSelectedSchool([]);
  //       setSelectedFloor([]);
  //       setSelectedRoom([]);
  //       axios
  //         .post(`${baseURL}schedule/quickLocationLookup/`, {
  //           vlabel: 4,
  //           owner: 1,
  //           loctype_kir: 0,
  //           label_text: "Room",
  //           is_DefLocation: 0,
  //           loctype: "0,0,0,0,0,0,0",
  //           def_LocID: 1,
  //         })
  //         .then(function (response) {
  //           const data = response.data.map((e) => ({
  //             id: e.KEY,
  //             value: e.KEY,
  //             label: e.VALUE,
  //           }));
  //           setRoom(data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //       break;
  //     default:
  //       break;
  //   }
  // };
  const handleRoomClick = (selectedOption) => {
    setSelectedRoom([selectedOption]);
    const variable = selectedOption.value;
    //District
    axios
      .post(`${baseURL}schedule/LocationLookup/`, {
        h_value: "0,4",
        h_cvalue: variable,
        clabel: 1,
        loctype: "0,0,0,0,0,0,0",
        labelid: "1",
        quickloc: 4,
        lblcount: "4",
        deflab: 0,
      })
      .then(function (response) {
        const data = response.data.slice(2).map((e) => ({
          id: e.KEY,
          value: e.KEY,
          label: e.VALUE,
        }));
        setDistrict(data);
      })
      .catch(function (error) {
        console.log(error);
      });
    //School
    axios
      .post(`${baseURL}schedule/LocationLookup/`, {
        h_value: "0,4",
        h_cvalue: variable,
        clabel: 2,
        loctype: "0,0,0,0,0,0,0",
        labelid: "2",
        quickloc: 4,
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
        const selected = data.find((room) => room.value === selectedKey);
        setSchool(data);
        setSelectedSchool(selected);
      })
      .catch(function (error) {
        console.log(error);
      });
    //Floor
    axios
      .post(`${baseURL}schedule/LocationLookup/`, {
        h_value: "0,4",
        h_cvalue: variable,
        clabel: 3,
        loctype: "0,0,0,0,0,0,0",
        labelid: "3",
        quickloc: 4,
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
        const selected = data.find((room) => room.value === selectedKey);
        setFloor(data);
        setSelectedFloor(selected);
      })
      .catch(function (error) {
        console.log(error);
      });
    //Room
    axios
      .post(`${baseURL}schedule/LocationLookup/`, {
        h_value: "0,4",
        h_cvalue: variable,
        clabel: 4,
        loctype: "0,0,0,0,0,0,0",
        labelid: "4",
        quickloc: 4,
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
        const selected = data.find((room) => room.value === selectedKey);
        setSelectedRoom(selected);
        setRoom(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
          setFloor([]);
          setRoom([]);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getSchool();
  }, []);

  const handleSchoolClick = (selectedOption) => {
    const variable = selectedOption.value;
    if (District.length === 0) {
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,2",
          h_cvalue: variable,
          clabel: 1,
          loctype: "0,0,0,0,0,0,0",
          labelid: "1",
          quickloc: 2,
          lblcount: "4",
          deflab: 0,
        })
        .then(function (response) {
          const data = response.data.slice(2).map((e) => ({
            id: e.KEY,
            value: e.KEY,
            label: e.VALUE,
          }));
          setDistrict(data);
        })
        .catch(function (error) {
          console.log(error);
        });
      //School
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,2",
          h_cvalue: variable,
          clabel: 2,
          loctype: "0,0,0,0,0,0,0",
          labelid: "2",
          quickloc: 2,
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
          const selected = data.find((room) => room.value === selectedKey);
          setSchool(data);
          setSelectedSchool(selected);
        })
        .catch(function (error) {
          console.log(error);
        });
      //Floor
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,2",
          h_cvalue: variable,
          clabel: 3,
          loctype: "0,0,0,0,0,0,0",
          labelid: "3",
          quickloc: 2,
          lblcount: "4",
          deflab: 0,
        })
        .then(function (response) {
          const data = response.data.slice(2).map((e) => ({
            id: e.KEY,
            value: e.KEY,
            label: e.VALUE,
          }));
          setFloor(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setLocationData((prevLocationData) =>
        prevLocationData.map((location) => {
          if (location.id === 2) {
            // Set selected school
            return { ...location, selectedOption: selectedOption };
          } else if (location.id === 3) {
            // Clear Floor options and selected option
            return { ...location, options: [], selectedOption: [] };
          } else if (location.id === 4) {
            // Clear Room options
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
    if (SelectedSchool.length === 0) {
      //District
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,3",
          h_cvalue: variable,
          clabel: 1,
          loctype: "0,0,0,0,0,0,0",
          labelid: "1",
          quickloc: 3,
          lblcount: "4",
          deflab: 0,
        })
        .then(function (response) {
          const data = response.data.slice(2).map((e) => ({
            id: e.KEY,
            value: e.KEY,
            label: e.VALUE,
          }));
          setDistrict(data);
        })
        .catch(function (error) {
          console.log(error);
        });
      //School
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,3",
          h_cvalue: variable,
          clabel: 2,
          loctype: "0,0,0,0,0,0,0",
          labelid: "2",
          quickloc: 3,
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
          const selected = data.find((room) => room.value === selectedKey);
          setSchool(data);
          setSelectedSchool(selected);
        })
        .catch(function (error) {
          console.log(error);
        });
      //Floor
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,3",
          h_cvalue: variable,
          clabel: 3,
          loctype: "0,0,0,0,0,0,0",
          labelid: "3",
          quickloc: 3,
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
          const selected = data.find((room) => room.value === selectedKey);
          setFloor(data);
          setSelectedFloor(selected);
        })
        .catch(function (error) {
          console.log(error);
        });
      //Room
      axios
        .post(`${baseURL}schedule/LocationLookup/`, {
          h_value: "0,3",
          h_cvalue: variable,
          clabel: 4,
          loctype: "0,0,0,0,0,0,0",
          labelid: "4",
          quickloc: 3,
          lblcount: "4",
          deflab: 0,
        })
        .then(function (response) {
          const data = response.data.slice(2).map((e) => ({
            id: e.KEY,
            value: e.KEY,
            label: e.VALUE,
          }));
          setRoom(data);
        })
        .catch(function (error) {
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
  // const handleClickLocationSearch = () => {
  //   const option = document.getElementById("location_input_Select").value;
  //   const data = document.getElementById("location_input_Search").value;
  //   console.log(data, option);
  // };
  return (
    <div>
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
              <label htmlFor="Indoor" style={{ marginLeft: "8px" }}>
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
              <label htmlFor="Outdoor" style={{ marginLeft: "8px" }}>
                Outdoor
              </label>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {locationData.map((location) => (
          <Col xs={12} md={3} className="col-3 mb-3" key={location.id}>
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
      <div clas="selectedField-header">
        <p>Selected Fields</p>
      </div>
      <Row>
        <Col xs={12} md={3} className="col-3 mb-3">
          <div className="selectedField-value">
            <div className="title">District</div>
            <div className="dropdown">
              <InfiniteDropdown
                options={District}
                selectedValue={District[0] ? [District[0]] : []}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={3} className="col-3 mb-3">
          <div className="selectedField-value">
            <div className="title">School</div>
            <div className="dropdown">
              <InfiniteDropdown
                options={School}
                selectedValue={SelectedSchool}
                onChange={handleSchoolClick}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={3} className="col-3 mb-3">
          <div className="selectedField-value">
            <div className="title">Floor</div>
            <div className="dropdown">
              <InfiniteDropdown
                options={Floor}
                selectedValue={SelectedFloor}
                onChange={handleFloorClick}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} md={3} className="col-3 mb-3">
          <div className="selectedField-value">
            <div className="title">Room</div>
            <div className="dropdown">
              <InfiniteDropdown
                options={Room}
                selectedValue={SelectedRoom}
                onChange={handleRoomClick}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
