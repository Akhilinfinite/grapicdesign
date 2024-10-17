import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import InfiniteDropdown from "./InfiniteDropdown";

export default function Untitled1() {
  const baseURL = "http://192.168.0.65:8500/rest/gvRestApi/";
  const [District, setDistrict] = useState([]);
  const [School, setSchool] = useState([]);

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

    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        options: [],
        selectedOption: [],
      }))
    );
    switch (option) {
      case "1":
        console.log(option);
        break;

      case "2":
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
      {/* <Row>
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
      </Row> */}
    </div>
  );
}
