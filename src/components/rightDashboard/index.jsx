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
import { fetchDefaultValues } from "../../redux/slices/sampleSlice.js";

import { useSelector, useDispatch } from "react-redux";

export default function RightDashboard() {
  const baseURL = "http://192.168.0.65:8500/rest/gvRestApi/";
  const clientname = useSelector((state) => state.client.clientname);
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

  const [Loctype, setLoctype] = useState("0,0,0,0,0,0,0");
  const [Count, setCount] = useState(0);
  const [Count2, setCount2] = useState(0);

  const [locationData, setLocationData] = useState([]);
  const [intialDataLoad, setintialDataLoad] = useState(0);
  const [selectedLocationType, setSelectedLocationType] = useState("indoor");

  const [locationFilters, setlocationFilters] = useState({
    levels: [],
    LFCapacity: null,
    LFHandicap: "",
    LFAmenities: [
      { id: 1, lable: "Amenities", options: null, selectedValue: null },
    ],
  });
  const [LFvalues, setLFvalues] = useState({
    levels: [],
    LFCapacity: null,
    LFHandicap: "",
    LFAmenities: "",
  });

  useEffect(() => {
    if (
      Count2 === 1 &&
      locationFilters.levels &&
      locationFilters.levels.length > 0
    ) {
      const fetchLocationData = async (levelId) => {
        try {
          const response = await axios.post(`${baseURL}schedule/getLevelType`, {
            clientname: clientname,
            label_id: levelId,
          });

          const res = await axios.post(`${baseURL}master/getAmenityList`, {
            clientname: clientname,
            OWNER_ID: "1",
          });
          console.log(response, res, "responce triggered");

          const Amenitydata = [
            { id: "", value: "", label: "---Select---" },
            ...res.data.DATA.map((e) => ({
              id: e[0],
              value: e[0],
              label: e[1],
            })),
          ];

          const data = [
            { id: "0", value: "0", label: "---Select---" },
            ...response.data.DATA.map((e) => ({
              id: e[0],
              value: e[0],
              label: e[1],
            })),
          ];

          // Update the options for the level
          setlocationFilters((prevFilters) => ({
            ...prevFilters,
            levels: prevFilters.levels.map((level) =>
              level.id === levelId
                ? { ...level, options: data, selectedValue: null }
                : level
            ),
            LFAmenities: prevFilters.LFAmenities.map((amenity) => ({
              ...amenity,
              options: Amenitydata,
              selectedValue: null,
            })),
          }));
        } catch (error) {
          console.error(`Error fetching data for level ${levelId}:`, error);
        }
      };

      const levelIds = locationFilters.levels.map((level) => level.id);

      // Fetch data for each level
      Promise.all(levelIds.map(fetchLocationData)).then(() => {
        setLFvalues(() => ({
          levels: locationFilters.levels.map((level) => ({
            id: level.id,
            label: level.label,
            selectedValue: level.selectedValue,
            options: level.options,
          })),
          LFCapacity: locationFilters.LFCapacity,
          LFHandicap: locationFilters.LFHandicap,
          LFAmenities: locationFilters.LFAmenities,
        }));
      });
      setCount2(0);
    }
  }, [Count2, clientname]);

  const handleSelectChange = (selectedOption, levelId) => {
    setlocationFilters((prevFilters) => ({
      ...prevFilters,
      levels: prevFilters.levels.map((level) =>
        level.id === levelId
          ? { ...level, selectedValue: selectedOption }
          : level
      ),
    }));
  };

  const [isLocationFilterModalVisible, setLocationFilterModalVisibility] =
    useState(false);

  const handleLocationFilterClick = () => {
    setLocationFilterModalVisibility(true);
  };

  const handleResetLocationFilterModal = () => {
    setlocationFilters((prevFilters) => {
      const resetLevels = (levels) =>
        levels.map((level) => ({
          ...level,
          selectedValue: null,
        }));

      return {
        ...prevFilters,
        levels: resetLevels(prevFilters.levels),
        LFCapacity: null,
        LFHandicap: "",
        LFAmenities: prevFilters.LFAmenities.map((amenity) => ({
          ...amenity,
          selectedValue: null,
        })),
      };
    });

    setLFvalues({
      levels: locationFilters.levels.map((level) => ({
        ...level,
        selectedValue: null,
        options: level.options,
      })),
      LFCapacity: null,
      LFHandicap: "",
      LFAmenities: locationFilters.LFAmenities.map((amenity) => ({
        ...amenity,
        selectedValue: null,
      })),
    });

    setLoctype("0,0,0,0,0,0,0");
    setCount(0);
  };
  const handleCloseLocationFilterModal = () => {
    setlocationFilters((prevFilters) => {
      const updateSelectedValues = (levels) =>
        levels.map((level) => {
          const matchedValue = LFvalues.levels.find((lf) => lf.id === level.id);
          return matchedValue
            ? { ...level, selectedValue: matchedValue.selectedValue }
            : level;
        });

      return {
        ...prevFilters,
        levels: updateSelectedValues(prevFilters.levels),
        LFCapacity: LFvalues.LFCapacity,
        LFHandicap: LFvalues.LFHandicap,
        LFAmenities: LFvalues.LFAmenities,
      };
    });
    setLocationFilterModalVisibility(false);
  };
  const CriteriaLookup = async (ctype_value, ctype, loctype) => {
    try {
      const response = await axios.post(`${baseURL}schedule/CriteriaLookup/`, {
        clientname: clientname,
        h_value: "0,1,0",
        clabel: "1",
        h_cvalue: "0",
        h_chkvalue: "1",
        ctype_value: ctype_value,
        ctype: ctype,
        loctype: loctype ? loctype : "0,0,0,0,0,0,0",
        loclevel: "0",
        quickloc: "0",
      });
      return response;
    } catch (error) {
      console.log(error);
      return { data: [], selected: null };
    }
  };
  const handleApplyLocationFilterModal = async () => {
    try {
      const results = [];
      for (const level of locationFilters.levels) {
        const ctype_value = level.selectedValue?.value || "0";
        const levelIndex = locationFilters.levels.findIndex(
          (l) => l.id === level.id
        );
        const ctype = `type${levelIndex + 1}`;
        const loctype =
          results.length > 0
            ? results[results.length - 1].data[2]
            : "0,0,0,0,0,0,0";

        const res = await CriteriaLookup(ctype_value, ctype, loctype);
        results.push(res);
      }
      setLoctype(results[results.length - 1].data[2]);
      setCount(1);

      setLFvalues({
        levels: locationFilters.levels.map((level) => ({
          id: level.id,
          label: level.label,
          selectedValue: level.selectedValue,
          options: level.options,
        })),
        LFCapacity: locationFilters.LFCapacity,
        LFHandicap: locationFilters.LFHandicap,
        LFAmenities: locationFilters.LFAmenities,
      });

      // Close the modal
      setLocationFilterModalVisibility(false);
    } catch (error) {
      console.error("Error while applying location filters:", error);
    }
  };

  useEffect(() => {
    const resetLocationData = async () => {
      try {
        Promise.all([
          fetchLocationData("00000000", locationData[0].id, "0,2", 2),
          selectedLocationType === "outdoor"
            ? fetchLocationData("10000000", 2, "0,2", 2, locationData[1].id)
            : fetchLocationData("10000000", 2, "0,2", 2),
        ])
          .then(([firstObjRes, secondObjRes]) => {
            setLocationData((prevLocationData) =>
              prevLocationData.map((location, index) => {
                if (index === 0) {
                  return {
                    ...location,
                    options: firstObjRes.data,
                    selectedOption: firstObjRes.data[0],
                  };
                }
                if (index === 1) {
                  return {
                    ...location,
                    options: secondObjRes.data,
                    selectedOption: [],
                  };
                }
                return { ...location, options: [], selectedOption: null };
              })
            );
          })
          .catch((error) => {
            console.error("Error in Promise.all:", error);
          });
      } catch (error) {
        console.error("Error resetting location data:", error);
      }
    };
    if (Loctype && Count === 1) {
      resetLocationData();
    }
  }, [Loctype, Count, selectedLocationType]);

  const [radiobtn, setRadiobtn] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.sample.data);
  const loading = useSelector((state) => state.sample.loading);

  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [intervalTime, setIntervalTime] = useState();

  useEffect(() => {
    dispatch(fetchDefaultValues());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && Array.isArray(data)) {
      const labelData = [
        {
          id: 0,
          value: "indoor",
          label: "Indoor",
          enable: "",
        },
        {
          id: 1,
          value: "outdoor",
          label: "Outdoor",
          enable: "",
        },
        {
          id: 2,
          value: "equip",
          label: "Equip",
          enable: "",
        },
        {
          id: 3,
          value: "people",
          label: "People",
          enable: "",
        },
      ];
      const filteredData1 = data.map((e) => ({
        CATEGORY: e[0],
        DESCRIPTION: e[1],
        OWNER_ID: e[2],
        VARNAME: e[3],
        VARVALUE: e[4],
      }));
      const filteredData = filteredData1.filter(
        (item) =>
          item.VARNAME.startsWith("disp_") && (item.VARVALUE === "Yes" || "No")
      );
      const optimisedData = filteredData.map((item, index) => ({
        id: index + 1,
        value: item.VARVALUE === "Yes" ? 1 : 0,
        lable: item.VARNAME.replace("disp_", ""),
      }));

      labelData.forEach((labelItem) => {
        const matchingItem = optimisedData.find(
          (optItem) => optItem.lable === labelItem.value
        );
        if (matchingItem) {
          labelItem.enable = matchingItem.value;
        }
      });
      setRadiobtn(labelData);
    }
  }, [data, loading]);

  //API calls
  //People

  useEffect(() => {
    const getOwner = () => {
      axios
        .post(`${baseURL}schedule/getOwners/`, { clientname: clientname })
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
  }, [clientname]);
  useEffect(() => {
    const getScheduler = () => {
      axios
        .post(`${baseURL}schedule/getRequestors/`, { clientname: clientname })
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
  }, [clientname]);

  //customer API Implementation
  useEffect(() => {
    const getCustomer = () => {
      axios
        .post(`${baseURL}schedule/getCustomers/`, { clientname: clientname })
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
  }, [clientname]);

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
        clientname: clientname,
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
          clientname: clientname,
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
  }, [clientname]);

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
            clientname: clientname,
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

  const handleLocationTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLocationType(selectedValue);
    setLoctype("0,0,0,0,0,0,0");
  };

  //Location
  //420
  useEffect(() => {
    const fetchLocationData = () => {
      const loctype_kir =
        selectedLocationType === "indoor"
          ? 0
          : selectedLocationType === "outdoor"
          ? 1
          : selectedLocationType === "equip"
          ? 2
          : 3;

      axios
        .post("http://192.168.0.65:8500/rest/gvRestApi/schedule/getLabels/", {
          clientname: clientname,
          owner_id: "1",
          loctype_kir: loctype_kir,
        })
        .then((response) => {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[1],
            options: [],
            selectedOption: null,
            dropdownSelected: false,
          }));
          const data1 = response.data.DATA.map((e) => ({
            id: e[0],
            label: e[1],
            options: [],
            selectedValue: [],
          }));
          setLocationData(data);
          setlocationFilters((prevFilters) => ({
            ...prevFilters,
            levels: data1,
          }));
          setintialDataLoad(1);
          setCount2(1);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    };

    fetchLocationData();
  }, [selectedLocationType, clientname]);
  //421
  const intialdata = () => {
    if (locationData && locationData.length >= 2) {
      Promise.all([
        fetchLocationData("00000000", locationData[0].id, "0,2", 2),
        selectedLocationType === "outdoor"
          ? fetchLocationData("10000000", 2, "0,2", 2, locationData[1].id)
          : fetchLocationData("10000000", 2, "0,2", 2),
      ])
        .then(([firstObjRes, secondObjRes]) => {
          setLocationData((prevLocationData) =>
            prevLocationData.map((location, index) => {
              if (index === 0) {
                return {
                  ...location,
                  options: firstObjRes.data,
                  selectedOption: firstObjRes.data[0],
                };
              }
              if (index === 1) {
                return {
                  ...location,
                  options: secondObjRes.data,
                  selectedOption: [],
                };
              }
              return location;
            })
          );
        })
        .catch((error) => {
          console.error("Error in Promise.all:", error);
        });
    }
  };
  useEffect(() => {
    if (locationData && locationData.length > 0 && intialDataLoad === 1) {
      intialdata();
      setintialDataLoad(0);
    }
  }, [locationData]);

  //422
  const handleOptionSelect = (locationId, selectedOption) => {
    const variable = selectedOption.value;
    const locationOne = locationData.find((loc) => loc.id === 1);
    if (
      !locationOne ||
      !locationOne.options ||
      locationOne.options.length === 0
    ) {
      const currentIndex = locationData.findIndex(
        (loc) => loc.id === locationId
      );
      if (currentIndex === -1) return;
      const objectsToFetch = locationData.slice(0, currentIndex + 2);
      const fetchPromises = objectsToFetch.map((location, index) => {
        const range = `0,${currentIndex + 1}`;
        return fetchLocationData(
          variable,
          index + 1,
          range,
          index + 1,
          location.id
        );
      });

      // Handle API responses
      Promise.all(fetchPromises)
        .then((responses) => {
          setLocationData((prevLocationData) =>
            prevLocationData.map((location) => {
              const responseIndex = objectsToFetch.findIndex(
                (obj) => obj.id === location.id
              );
              if (responseIndex !== -1) {
                const response = responses[responseIndex];
                return {
                  ...location,
                  options: response.data,
                  selectedOption: response.selected ?? null,
                };
              }
              return location;
            })
          );
        })
        .catch((error) => {
          console.error("Error in Promise.all:", error);
        });
    } else {
      const currentIndex = locationData.findIndex(
        (loc) => loc.id === locationId
      );
      const isLastObject = currentIndex + 1 === locationData.length;
      setLocationData((prevLocationData) =>
        prevLocationData.map((location, index) => {
          if (location.id === locationId) {
            return {
              ...location,
              selectedOption: [selectedOption],
            };
          } else if (index > locationId - 1) {
            return {
              ...location,
              options: [],
              selectedOption: [],
            };
          }
          return location;
        })
      );

      if (!isLastObject) {
        const currentID = locationData[currentIndex + 1].id;
        const range = `0,${currentIndex + 1}`;
        fetchLocationData(
          variable,
          currentIndex + 2,
          range,
          currentIndex + 2,
          currentID
        )
          .then((response) => {
            console.log(response);
            setLocationData((prevLocationData) =>
              prevLocationData.map((location) =>
                location.id === currentID
                  ? {
                      ...location,
                      options: response.data,
                      selectedOption: [],
                    }
                  : location
              )
            );
          })
          .catch((error) => {
            console.error(
              `Error fetching data for indoor location ${currentIndex + 1}:`,
              error
            );
          });
      }
    }
  };

  const handelLocationSearchDropDown = (e) => {
    const option = e.target.value;

    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        dropdownSelected: location.id.toString() === option,
      }))
    );
    handleLocationOption(option);
  };

  const handleLocationOption = (option) => {
    switch (option) {
      case "0":
      case "1":
        intialdata();
        break;

      case "2":
        fetchLocationDataDefault(2, "School");
        break;

      case "3":
        fetchLocationDataDefault(3, "Floor");
        break;

      case "4":
        fetchLocationDataDefault(4, "Room");
        break;

      case "5":
        fetchLocationDataDefault(5, "Site", {
          vlabel: "2",
          loctype_kir: "1",
          label_text: "Site",
        });
        break;

      case "6":
        fetchLocationDataDefault(6, "Site Amenity", {
          vlabel: "3",
          loctype_kir: "1",
          label_text: "Site Amenity",
        });
        break;

      default:
        console.warn("Invalid option:", option);
        break;
    }
  };

  const fetchLocationDataDefault = (id, labelText, additionalParams = {}) => {
    const loctype_kir =
        selectedLocationType === "indoor"
          ? 0
          : selectedLocationType === "outdoor"
          ? 1
          : selectedLocationType === "equip"
          ? 2
          : 3;

    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        options: [],
        selectedOption: [],
      }))
    );

    axios
      .post(`${baseURL}schedule/quickLocationLookup/`, {
        clientname: clientname,
        vlabel: id,
        owner: 1,
        loctype_kir: loctype_kir,
        label_text: labelText,
        is_DefLocation: 0,
        loctype: Loctype,
        def_LocID: 1,
        amenity: locationFilters.LFAmenities[0]?.selected?.Value || "",
        v_cap: locationFilters.LFCapacity ? locationFilters.LFCapacity : "0",
        v_hdcap: locationFilters.LFHandicap ? locationFilters.LFHandicap : "0",
        ...additionalParams,
      })
      .then((response) => {
        const fetchedData = response.data.map((e) => ({
          id: e.KEY,
          value: e.KEY,
          label: e.VALUE,
        }));
        setLocationData((prevLocationData) =>
          prevLocationData.map((location) =>
            location.id === id
              ? { ...location, options: fetchedData }
              : location
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const handleClickLocationSearch = () => {
    const option = document.getElementById("location_input_Select").value;
    const data = document.getElementById("location_input_Search").value;
    // document.getElementById("location_input_Search").value = "";
    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        dropdownSelected: location.id.toString() === option,
      }))
    );
    switch (option) {
      case "0":
      case "1":
        intialdata();
        break;

      case "2":
        fetchLocationDataDefault(2, "School", { loc_name: data });
        break;

      case "3":
        fetchLocationDataDefault(3, "Floor", { loc_name: data });
        break;

      case "4":
        fetchLocationDataDefault(4, "Room", { loc_name: data });
        break;

      case "5":
        fetchLocationDataDefault(5, "Site", {
          vlabel: "2",
          label_text: "Site",
          loc_name: data,
        });
        break;

      case "6":
        fetchLocationDataDefault(6, "Site Amenity", {
          vlabel: "3",
          loctype_kir: "1",
          label_text: "Site Amenity",
          loc_name: data,
        });
        break;

      default:
        console.warn("Invalid option:", option);
        break;
    }
  };
  //423
  const fetchLocationData = async (
    variable,
    clabel,
    h_value,
    quickloc,
    label_id
  ) => {
    try {
      const lblcount = locationData.length;
      const response = await axios.post(`${baseURL}schedule/LocationLookup/`, {
        clientname: clientname,
        h_value: h_value,
        h_cvalue: variable,
        clabel: clabel,
        loctype: Loctype,
        labelid: label_id ? label_id : clabel.toString(),
        quickloc: quickloc,
        lblcount: lblcount,
        deflab: 0,
      });
      const data1 = {
        clientname: clientname,
        h_value: h_value,
        h_cvalue: variable,
        clabel: clabel,
        loctype: Loctype,
        labelid: label_id ? label_id : clabel.toString(),
        quickloc: quickloc,
        lblcount: lblcount,
        deflab: 0,
      };
      console.log(data1);
      const data = response.data.slice(2).map((e) => ({
        id: e.KEY,
        value: e.KEY,
        label: e.VALUE,
      }));
      const selectedKey = response.data[1].VALUE;
      const selected = data.find((item) => item.value === selectedKey);
      console.log(response.data, "response");
      console.log(data, "data");
      console.log(selected, "selected");
      return { data, selected };
    } catch (error) {
      console.log(error);
      return { data: [], selected: null };
    }
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

  const [isIntervalTypeModalVisible, setIntervalTypeModalVisible] =
    useState(false);
  const [intervalType, setIntervalType] = useState("");
  const [intervalState, setIntervalState] = useState({
    // Common properties
    intervalType: "",
    repeatEvery: "",
    endDate: "",

    // Weekly modal specific
    weeklyOnDay: "",
    weeklyOnTheOccurrence: "",
    weeklyOnTheDay: "",

    // Monthly modal specific
    monthlyOnDay: "",
    monthlyOccurrence: "",
    monthlyWeekDay: "",

    // Recurring modal specific
    recurringInterval: "Day(s)",
    recurringDaysSelected: [],
  });

  const [selectedIntervalState, setSelectedIntervalState] = useState({
    ...intervalState,
  });
  const handleSave = () => {
    setSelectedIntervalState({ ...intervalState });
    console.log("Saved State:", selectedIntervalState);

    setIntervalTypeModalVisible(false);
  };

  const handleClose = () => {
    setIntervalState({ ...selectedIntervalState });
    console.log("State reverted to saved values:", selectedIntervalState);
    setIntervalTypeModalVisible(false);
  };

  // Function to close the modal
  const closeIntervalTypeModal = () => {
    setIntervalTypeModalVisible(false);
  };

  const handlePopUpOpen = () => {
    setIntervalTypeModalVisible(true);
  };

  // Function to handle dropdown change
  const handleIntervalTypeChange = (e) => {
    setIntervalState({
      intervalType: "",
      repeatEvery: "",
      endDate: "",
      weeklyOnDay: "",
      weeklyOnTheOccurrence: "",
      weeklyOnTheDay: "",
      monthlyOnDay: "",
      monthlyOccurrence: "",
      monthlyWeekDay: "",
      recurringInterval: "Day(s)",
      recurringDaysSelected: [],
    });

    setSelectedIntervalState({
      intervalType: "",
      repeatEvery: "",
      endDate: "",
      weeklyOnDay: "",
      weeklyOnTheOccurrence: "",
      weeklyOnTheDay: "",
      monthlyOnDay: "",
      monthlyOccurrence: "",
      monthlyWeekDay: "",
      recurringInterval: "Day(s)",
      recurringDaysSelected: [],
    });
    setIntervalType(e.target.value);
    setIntervalTypeModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkbox values
      setIntervalState((prevState) => {
        let updatedDays = [...prevState.recurringDaysSelected];
        if (checked) {
          if (!updatedDays.includes(name)) updatedDays.push(name);
        } else {
          updatedDays = updatedDays.filter((day) => day !== name);
        }

        return { ...prevState, recurringDaysSelected: updatedDays };
      });
    } else if (type === "number") {
      // Handle number inputs (ensuring valid numeric values)
      setIntervalState((prevState) => ({
        ...prevState,
        [name]: value !== "" ? parseInt(value, 10) : "",
      }));
    } else if (type === "datetime-local" || type === "date") {
      // Handle date/datetime-local inputs
      setIntervalState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      // Handle text, radio, and other inputs
      setIntervalState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
                                        name="repeatEvery"
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col-sm-6">
                                      <div className="dropdown-wrapper">
                                        <select
                                          name="intervalType"
                                          className="custom-select"
                                          value={intervalState.intervalType}
                                          onChange={handleInputChange}
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
                                          name="onDayRadio"
                                          checked={
                                            intervalState.onDayRadio === true
                                          }
                                          onChange={(e) =>
                                            handleInputChange({
                                              target: {
                                                name: "onDayRadio",
                                                value: true,
                                              },
                                            })
                                          }
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
                                          name="weeklyOnDay"
                                          value={intervalState.weeklyOnDay}
                                          onChange={handleInputChange}
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
                                        name="onTheRadio"
                                        checked={
                                          intervalState.onTheRadio === true
                                        }
                                        onChange={(e) =>
                                          handleInputChange({
                                            target: {
                                              name: "onTheRadio",
                                              value: true,
                                            },
                                          })
                                        }
                                      />
                                      <label className="ml-2">On the</label>
                                    </div>
                                    <div className="col-sm-4 mb-2">
                                      <div className="dropdown-wrapper">
                                        <select
                                          name="weeklyOnTheOccurrence"
                                          className="custom-select"
                                          value={
                                            intervalState.weeklyOnTheOccurrence
                                          }
                                          onChange={handleInputChange}
                                        >
                                          <option value="">select value</option>
                                          <option value="First">First</option>
                                          <option value="Second">Second</option>
                                          <option value="Third">Third</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-sm-4 mb-2">
                                      <div className="dropdown-wrapper">
                                        <select
                                          name="weeklyOnTheDay"
                                          className="custom-select"
                                          value={intervalState.weeklyOnTheDay}
                                          onChange={handleInputChange}
                                        >
                                          <option value="">select value</option>
                                          <option value="Monday">Monday</option>
                                          <option value="Tuesday">
                                            Tuesday
                                          </option>
                                          <option value="Wednesday">
                                            Wednesday
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
                                        name="endDate"
                                        className="form-control time"
                                        style={{
                                          width: "70%",
                                          display: "inline-block",
                                          marginLeft: "5px",
                                        }}
                                        value={intervalState.endDate}
                                        onChange={handleInputChange}
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
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleSave}
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
                                        name="monthlyRepeatEvery"
                                        value={intervalState.monthlyRepeatEvery}
                                        onChange={handleInputChange}
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
                                        checked={
                                          intervalState.monthlyOption ===
                                          "onDay"
                                        }
                                        onChange={(e) =>
                                          handleInputChange({
                                            target: {
                                              name: "monthlyOption",
                                              value: "onDay",
                                            },
                                          })
                                        }
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
                                        name="monthlyOnDay"
                                        value={intervalState.monthlyOnDay}
                                        onChange={handleInputChange}
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
                                        checked={
                                          intervalState.monthlyOption ===
                                          "onThe"
                                        }
                                        onChange={(e) =>
                                          handleInputChange({
                                            target: {
                                              name: "monthlyOption",
                                              value: "onThe",
                                            },
                                          })
                                        }
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
                                          name="monthlyOccurrence"
                                          className="custom-select mb-2"
                                          style={{ marginRight: "5px" }}
                                          value={
                                            intervalState.monthlyOccurrence
                                          }
                                          onChange={handleInputChange}
                                        >
                                          <option value="">select value</option>
                                          <option value="First">First</option>
                                          <option value="Second">Second</option>
                                          <option value="Third">Third</option>
                                          <option value="Fourth">Fourth</option>
                                          <option value="Last">Last</option>
                                        </select>
                                        <select
                                          name="monthlyWeekday"
                                          className="custom-select"
                                          value={intervalState.monthlyWeekday}
                                          onChange={handleInputChange}
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
                                        name="monthlyEndDate"
                                        className="form-control time"
                                        style={{
                                          width: "70%",
                                          display: "inline-block",
                                          marginLeft: "5px",
                                        }}
                                        value={intervalState.monthlyEndDate}
                                        onChange={handleInputChange}
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
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleSave}
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
                                        name="repeatEvery"
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
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
                                          value={intervalState.interval}
                                          onChange={handleInputChange}
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
                                              name={day}
                                              checked={intervalState.recurringDaysSelected.includes(
                                                day
                                              )}
                                              onChange={handleInputChange}
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
                                        name="endDate"
                                        value={intervalState.endDate}
                                        onChange={handleInputChange}
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
                                        Occurs every{" "}
                                        <span>
                                          {intervalState.repeatEvery || 0}
                                        </span>{" "}
                                        {intervalState.interval} on the selected
                                        days starting{" "}
                                        <span>
                                          {intervalState.startDate ||
                                            "10/11/23"}
                                        </span>{" "}
                                        until{" "}
                                        <span>
                                          {intervalState.endDate || "15/11/23"}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    className="intervalCloseBtn"
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleSave}
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
                          {radiobtn
                            .filter((item) => item.enable === 1)
                            .map((item, index) => (
                              <div
                                key={item.id}
                                className="list mr-3 mb-2 mt-1"
                              >
                                <input
                                  type="radio"
                                  id={item.value}
                                  name="locationType"
                                  value={item.value}
                                  defaultChecked={index === 0} // Only check the first enabled item
                                  onChange={handleLocationTypeChange}
                                />
                                <label
                                  htmlFor={item.value}
                                  style={{ marginLeft: "8px" }}
                                >
                                  {item.label}
                                </label>
                              </div>
                            ))}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                        <div className="content">
                          <div className="title">Choose field to Search</div>
                          <div className="dropdown-wrapper">
                            <select
                              name="days"
                              className="custom-select"
                              id="location_input_Select"
                              onChange={(e) => handelLocationSearchDropDown(e)}
                            >
                              {locationData.length !== 0 && (
                                <option value="0">Defalt</option>
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
                            {/* Dynamic Dropdowns */}
                            <div className="col-md-6">
                              {locationFilters.levels.map((level) => (
                                <div
                                  className="row mb-3 filtersrow"
                                  key={level.id}
                                >
                                  <div className="col-3">
                                    <label className="title">
                                      {level.label}:
                                    </label>
                                  </div>
                                  <div className="col-9">
                                    <div className="dropdown">
                                      <InfiniteDropdown
                                        options={level.options}
                                        selectedValue={level.selectedValue}
                                        onChange={(selectedOption) =>
                                          handleSelectChange(
                                            selectedOption,
                                            level.id
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3 filtersrow">
                                <div className="col-3">
                                  <label className="title">Capacity:</label>
                                </div>
                                <div className="col-9">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={locationFilters.LFCapacity}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setlocationFilters((prevFilters) => ({
                                        ...prevFilters,
                                        LFCapacity: value,
                                      }));
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
                                      value={locationFilters.LFHandicap}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setlocationFilters((prevFilters) => ({
                                          ...prevFilters,
                                          LFHandicap: value,
                                        }));
                                      }}
                                    >
                                      <option value="">Select value</option>
                                      <option value="0">NA</option>
                                      <option value="1">Yes</option>
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
                                    <InfiniteDropdown
                                      options={
                                        locationFilters.LFAmenities[0]
                                          ?.options || []
                                      } // Dropdown options
                                      selectedValue={
                                        locationFilters.LFAmenities[0]
                                          ?.selectedValue || ""
                                      } // Current selected value
                                      onChange={(selectedOption) => {
                                        setlocationFilters((prevFilters) => ({
                                          ...prevFilters,
                                          LFAmenities:
                                            prevFilters.LFAmenities.map(
                                              (amenity, index) =>
                                                index === 0 // Assuming the first amenity is the one being updated
                                                  ? {
                                                      ...amenity,
                                                      selectedValue:
                                                        selectedOption,
                                                    }
                                                  : amenity
                                            ),
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            className="filter-reset-btn"
                            onClick={handleResetLocationFilterModal}
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
