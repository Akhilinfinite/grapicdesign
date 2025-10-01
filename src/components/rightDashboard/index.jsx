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
import { fetchOwnerData, setownerID } from "../../redux/slices/ownerSlice";
import {
  setEndDateF,
  setIntervalStateF,
  setLocationDataF,
  setOwnerF,
  setSelectedContactF,
  setSelectedCustomerF,
  setSelectedSchedulerF,
  setStartDateF,
} from "../../redux/slices/intervalSlice.js";

import { useSelector, useDispatch } from "react-redux";
import CustomCalendar from "./components/custumCalender/index.jsx";

export default function RightDashboard() {
  const dispatch = useDispatch();
  const baseURL = "http://192.168.0.65/rest/gvRestApi/";

  const [Owners, setOwners] = useState([]);
  const [OwnerID, setOwnerID] = useState();
  const sessionData = useSelector((state) => state.auth.sessionData);
  const data = useSelector((state) => state.sample.data);
  const loading = useSelector((state) => state.sample.loading);
  const clientname = useSelector((state) => state.client.clientname);
  const owner = useSelector((state) => state.owner.owner);
  const ownerID = useSelector((state) => state.owner.ownerID);
  const ownerLoad = useSelector((state) => state.owner.loading);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);
  const intervalState1 = useSelector((state) => state.interval);

  const [isScheduleSummaryVisible, setScheduleSummaryVisible] = useState(false);
  const [formattedScheduleSummary, setFormattedScheduleSummary] = useState("");

  const handleScheduleClick = () => {
    const intervalState = intervalState1;

    const formatData = (data) => {
      if (!data || data.length === 0) return "Not Selected";
      return Array.isArray(data)
        ? data.map((item) => ` **${item.label}**`).join(", ")
        : `**${data.label}**`;
    };

    const formatLocationData = () => {
      if (!intervalState.locationData.length) return "No locations selected.";
      return intervalState.locationData
        .map(({ label, selectedValue }) => {
          if (!selectedValue) return `**${label}**: Not Selected`;
          return `**${label}**: **(${selectedValue.id})** — **${selectedValue.label}**`;
        })
        .join("\n");
    };

    const formatIntervalSettings = () => {
      const { intervalState: dates } = intervalState;
      if (!Array.isArray(dates) || dates.length === 0)
        return "No interval dates selected.";
      return `**Scheduled Dates**:\n${dates.join(", ")}`;
    };

    const formattedText = `
  **Owner**: ${formatData(intervalState.owner)}
  **Scheduler**: ${formatData(intervalState.selectedScheduler)}
  **Customer**: ${formatData(intervalState.selectedCustomer)}
  **Contact**: ${formatData(intervalState.selectedContact)}
  **Start Date**: ${intervalState.startDate || "Not Set"}
  **End Date**: ${intervalState.endDate || "Not Set"}
  
  ${formatIntervalSettings()}
  
  **Location Data**:
  ${formatLocationData()}
    `;

    setFormattedScheduleSummary(formattedText);
    setScheduleSummaryVisible(true);
  };

  const [Scheduler, setScheduler] = useState([]);
  const [SelectedScheduler, setSelectedScheduler] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [SelectedCustomer, setSelectedCustomer] = useState([]);
  const [Contact, setContact] = useState([]);
  const [SelectedContact, setSelectedContact] = useState([]);

  const [radiobtn, setRadiobtn] = useState([]);

  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [intervalTime, setIntervalTime] = useState();
  useEffect(() => {
    dispatch(setStartDateF(String(StartTime)));
  }, [StartTime, dispatch]);
  useEffect(() => {
    dispatch(setEndDateF(String(EndTime)));
  }, [EndTime, dispatch]);
  useEffect(() => {
    if (clientname) {
      dispatch(fetchOwnerData());
    }
  }, [clientname, dispatch]);

  useEffect(() => {
    const setDefaultData = (selectedOwner) => {
      if (selectedOwner) {
        const extractTime = (dateTimeStr) => {
          if (!dateTimeStr || typeof dateTimeStr !== "string") {
            console.error("Invalid dateTimeStr:", dateTimeStr);
            return null;
          }
          const match = dateTimeStr.match(/(\d{2}:\d{2}:\d{2})/);
          if (!match) {
            console.error("Invalid time format:", dateTimeStr);
            return null;
          }

          return match[1];
        };
        const convertToUTC = (timeStr) => {
          if (!timeStr) {
            console.error("convertToUTC received invalid timeStr:", timeStr);
            return null;
          }

          const [hours, minutes, seconds] = timeStr.split(":").map(Number);

          if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            console.error(
              "convertToUTC received invalid time format:",
              timeStr
            );
            return null;
          }
          const now = new Date();
          const localDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes,
            seconds
          );
          const utcDate = new Date(
            localDate.getTime() - localDate.getTimezoneOffset() * 60000
          );

          return utcDate.toISOString();
        };
        const startTimeRaw = extractTime(selectedOwner.start);
        const endTimeRaw = extractTime(selectedOwner.end);

        if (!startTimeRaw || !endTimeRaw) {
          console.error("Invalid extracted time:", startTimeRaw, endTimeRaw);
        } else {
          const startTime = convertToUTC(startTimeRaw);
          const endTime = convertToUTC(endTimeRaw);
          if (startTime && endTime) {
            setStartTime(startTime);
            setEndTime(endTime);
            dispatch(setStartDateF(startTime));
            dispatch(setEndDateF(endTime));
            setIntervalTime(selectedOwner.EVENTSLOTTIME);
          }
        }
      }
    };
    if (!ownerLoad && Array.isArray(owner) && owner.length > 0) {
      setOwners(owner);
      const selectedOwner = owner.find((o) => o.id === ownerID);
      setDefaultData(selectedOwner);
      setOwnerID(ownerID);
      dispatch(fetchDefaultValues());
    }
  }, [owner, dispatch, ownerID, ownerLoad]);

  useEffect(() => {
    dispatch(fetchDefaultValues());
  }, [dispatch]);
  const handleOwnerChange = (selectedOption) => {
    if (selectedOption.length > 0) {
      dispatch(setownerID(selectedOption?.[0]?.id));
    }
  };

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

  //People

  useEffect(() => {
    const getScheduler = () => {
      axios
        .post(`${baseURL}schedule/getRequestors/`, {
          clientname: clientname,
          owner_id: String(OwnerID),
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          const own = Owners.filter((e) => e.id === OwnerID);
          if (own.length > 0) {
            const selected = data.filter((e) => e.id === own[0].Def_REQUESTOR);
            setSelectedScheduler(selected);
            setScheduler(data);
            dispatch(setOwnerF(own));
            dispatch(setSelectedSchedulerF(selected));
          } else {
            console.warn("No matching owner found!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    if (OwnerID) {
      getScheduler();
    }
  }, [clientname, Owners, OwnerID, dispatch]);

  //customer API Implementation
  useEffect(() => {
    const getCustomer = () => {
      axios
        .post(`${baseURL}schedule/getCustomers/`, {
          clientname: clientname,
          owner_id: String(OwnerID),
        })
        .then(function (response) {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));
          const own = Owners.filter((e) => e.id === OwnerID);
          if (own.length > 0) {
            const selected = data.filter((e) => e.id === own[0].Def_CUSTOMER);
            dispatch(setSelectedCustomerF(selected));
            setSelectedCustomer(selected);
          } else {
            console.warn("No matching owner found!");
          }
          setCustomer(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    if (OwnerID) {
      getCustomer();
    }
  }, [clientname, OwnerID, Owners, dispatch]);

  const handleCustomerClick = (selectedOption) => {
    const variable = selectedOption.value;
    let data1 = Customer.filter((e) => e.value === variable);
    if (!data1.length) {
      data1 = SelectedCustomer.filter((e) => e.value === variable);
      dispatch(setSelectedCustomerF(data1));
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
        dispatch(setSelectedContactF(selected));
        setContact(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //API Contact
  useEffect(() => {
    const getContact = () => {
      const own = Owners.filter((e) => e.id === OwnerID);
      const customer_id = String(own[0].Def_CUSTOMER);
      axios
        .post(`${baseURL}schedule/getContacts/`, {
          clientname: clientname,
          owner_id: String(OwnerID),
          customer_id: customer_id,
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
          dispatch(setSelectedContactF(selected));
          setContact(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    if (OwnerID) {
      getContact();
    }
  }, [clientname, Owners, OwnerID, dispatch]);

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
            dispatch(setSelectedContactF([]));
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
      locationFilters.levels.length > 1
    ) {
      const fetchLocationData = async (levelId) => {
        try {
          const response = await axios.post(`${baseURL}schedule/getLevelType`, {
            clientname: clientname,
            label_id: levelId,
          });

          const res = await axios.post(`${baseURL}master/getAmenityList`, {
            clientname: clientname,
            OWNER_ID: String(OwnerID),
          });

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
  }, [Count2, locationFilters, clientname, OwnerID]);


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
    if (Loctype && Count === 1) {
      intialdata();
      setCount(0);
    }
  }, [Loctype, Count, selectedLocationType, locationData]);

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
        .post(`${baseURL}schedule/getLabels/`, {
          clientname: clientname,
          owner_id: String(OwnerID),
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
  }, [selectedLocationType, clientname, OwnerID]);
  //421
  const intialdata = async () => {
    if (locationData && locationData.length >= 2) {
      const firstObjRes = await fetchLocationData(
        "00000000",
        1,
        "0,1",
        1,
        locationData[0].id
      );

      const selectedValueId =
        firstObjRes?.data?.length > 0 ? firstObjRes.data[0].id : null;

      if (!selectedValueId) {
        console.warn("No valid selected value ID found, skipping second call");
        return;
      }
      const secondObjRes = await fetchLocationData(
        String(selectedValueId),
        2,
        "0,2",
        2,
        locationData[1].id
      );
      dispatch(
        setLocationDataF([
          {
            label: locationData[0].value,
            selectedValue:
              firstObjRes.data.length > 0 ? firstObjRes.data[0] : null,
          },
        ])
      );
      setLocationData((prevLocationData) =>
        prevLocationData.map((location, index) => {
          if (index === 0) {
            return {
              ...location,
              options: firstObjRes.data,
              selectedOption:
                firstObjRes.data.length > 0 ? firstObjRes.data[0] : null,
            };
          }
          if (index === 1) {
            return {
              ...location,
              options: secondObjRes.data,
              selectedOption: [],
            };
          }
          if (index !== 1 && index !== 0) {
            return {
              ...location,
              options: [],
              selectedOption: null,
            };
          }
          return { ...location };
        })
      );
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
      setLocationData((prevLocationData) =>
        prevLocationData.map((location, index) => {
          if (location.id === locationId) {
            return {
              ...location,
              selectedOption: [selectedOption], // Set selected option for the current location
            };
          } else if (index > currentIndex) {
            return {
              ...location,
              options: [], // Clear options for all locations after the current selection
              selectedOption: [], // Clear selected options for all locations after the current selection
            };
          }
          return location;
        })
      );

      const objectsToFetch = locationData.slice(0, currentIndex + 2);
      console.log(objectsToFetch);
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

      Promise.all(fetchPromises)
        .then((responses) => {
          setLocationData((prevLocationData) =>
            prevLocationData.map((location) => {
              const responseIndex = objectsToFetch.findIndex(
                (obj) => obj.id === location.id
              );
              if (responseIndex !== -1) {
                const response = responses[responseIndex];
                console.log(response, "if condition");
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
      if (currentIndex === -1) return;

      setLocationData((prevLocationData) =>
        prevLocationData.map((location, index) => {
          if (location.id === locationId) {
            return {
              ...location,
              selectedOption: [selectedOption],
            };
          } else if (location.id > locationId) {
            return {
              ...location,
              options: [], // clear options for all future locations
              selectedOption: [], // clear selected options for all future locations
            };
          }
          return location;
        })
      );

      if (currentIndex + 1 < locationData.length) {
        const nextLocationId = locationData[currentIndex + 1].id;
        const range = `0,${currentIndex + 1}`;

        fetchLocationData(
          variable,
          currentIndex + 2,
          range,
          currentIndex + 2,
          nextLocationId
        )
          .then((response) => {
            setLocationData((prevLocationData) =>
              prevLocationData.map((location) =>
                location.id === nextLocationId
                  ? {
                      ...location,
                      options: response.data,
                      selectedOption: [], // Ensure selected option is empty
                    }
                  : location
              )
            );
          })
          .catch((error) => {
            console.error(
              `Error fetching data for location ${currentIndex + 1}:`,
              error
            );
          });
      }
    }

    const selectedLocation = locationData.find((loc) => loc.id === locationId);
    if (!selectedLocation) return;
    dispatch(
      setLocationDataF([
        {
          label: selectedLocation.value,
          selectedValue: selectedOption,
        },
      ])
    );
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
    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        options: [],
        selectedOption: null,
      }))
    );
    if (option === "0" || option === "1") {
      intialdata();
    } else {
      const selectElement = document.getElementById("location_input_Select");
      const optionId = selectElement.value;
      const index = locationData.findIndex(
        (loc) => loc.id === Number(optionId)
      );
      const vlabel = index + 1;
      const label = selectElement.options[selectElement.selectedIndex].text;
      fetchLocationDataDefault(vlabel, label);
    }
  };

  const fetchLocationDataDefault = (
    vlabel,
    labelText,
    additionalParams = {}
  ) => {
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
        vlabel: vlabel,
        owner: String(OwnerID),
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
        const id = locationData[vlabel - 1].id;
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
    setLocationData((prevLocationData) =>
      prevLocationData.map((location) => ({
        ...location,
        options: [],
        selectedOption: null,
      }))
    );
    if (option === "0" || option === "1") {
      intialdata();
    } else {
      const selectElement = document.getElementById("location_input_Select");
      const optionId = selectElement.value;
      const index = locationData.findIndex(
        (loc) => loc.id === Number(optionId)
      );
      const vlabel = index + 1;
      const label = selectElement.options[selectElement.selectedIndex].text;
      fetchLocationDataDefault(vlabel, label, { loc_name: data });
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
        owner: ownerID,
        h_value: h_value,
        clabel: clabel,
        h_cvalue: variable,
        loctype: Loctype,
        labelid: label_id ? label_id : clabel.toString(),
        quickloc: quickloc,
        lblcount: lblcount,
        deflab: 0,
        PAGE: sessionData?.PAGE,
        REQID: sessionData?.REQID,
      });
      const data = response.data.slice(2).map((e) => ({
        id: e.KEY,
        value: e.KEY,
        label: e.VALUE,
      }));
      const selectedKey = response.data[1].VALUE;
      const selected = data.find((item) => item.value === selectedKey);
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
    intervalType: "",
    repeatEvery: "",
    repeatDuration: "",
    endDate: "",
    weeklyOnDay: "",
    weeklyOnTheOccurrence: "",
    selectedDates: [],
    weeklyOnTheDay: "",
    monthlyOnDay: "",
    monthlyOccurrence: "",
    monthlyWeekDay: "",
    recurringInterval: "Day(s)",
    recurringDaysSelected: [],
  });
  const [GeneratedDates, setGeneratedDates] = useState([]);
  const [selectedIntervalState, setSelectedIntervalState] = useState({
    ...intervalState,
  });
  useEffect(() => {
    dispatch(setIntervalStateF(GeneratedDates));
  }, [GeneratedDates, dispatch]);

  // Function to update selected dates
  const updateSelectedDates = (newDates) => {
    setIntervalState((prevState) => ({
      ...prevState,
      selectedDates: newDates, // Update selected dates in the state
    }));
  };

  // Function to clear selected dates
  const handleClearDates = () => {
    setIntervalState((prevState) => ({
      ...prevState,
      selectedDates: [],
    }));
  };
  const getDayNumber = (dayName) => {
    const dayMap = {
      Sunday: 1,
      Monday: 2,
      Tuesday: 3,
      Wednesday: 4,
      Thursday: 5,
      Friday: 6,
      Saturday: 7,
    };
    return dayMap[dayName];
  };
  const getMonthPartNumber = (part) => {
    const map = {
      First: 1,
      Second: 2,
      Third: 3,
      Fourth: 4,
      Last: 5,
    };
    return map[part] || 0;
  };
  const formatDateMMDDYYYY = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const formatTimeHHMM = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toISOString().substr(11, 5); // Gets "HH:MM"
  };
  const handleSave = () => {
    setSelectedIntervalState({ ...intervalState });
    const { intervalType } = intervalState;

    switch (intervalType) {
      case "Weekly": {
        const daysArray = (intervalState.recurringDaysSelected || []).map(
          getDayNumber
        );
        const requestBody1 = {
          clientname: clientname,
          start_date: formatDateMMDDYYYY(StartTime),
          start_time: formatTimeHHMM(StartTime),
          enddate: formatDateMMDDYYYY(EndTime),
          end_time: formatTimeHHMM(EndTime),
          rptype: 1,
          DAYS: daysArray.join(","),
          EVERY_X_WEEKS: intervalState.repeatEvery,
          FOR_X_WEEKS: intervalState.repeatDuration,
        };
        axios
          .post(`${baseURL}schedule/getEventDates/`, requestBody1)
          .then((response) => {
            if (response.status === 200 && Array.isArray(response.data)) {
              setGeneratedDates(response.data);
              console.log("Dates stored:", response.data);
            } else {
              console.error("Unexpected response format:", response);
            }
          })
          .catch((error) => {
            console.error("API call failed:", error);
          });
        break;
      }

      case "Monthly":
        const requestBody2 = {
          clientname: clientname,
          start_date: formatDateMMDDYYYY(StartTime),
          start_time: formatTimeHHMM(StartTime),
          enddate: formatDateMMDDYYYY(EndTime),
          end_time: formatTimeHHMM(EndTime),
          rptype: 2,
          nummonth: intervalState.repeatEvery,
          monthpart: getMonthPartNumber(intervalState.monthlyOccurrence),
          weekpart: getDayNumber(intervalState.monthlyWeekDay),
        };
        axios
          .post(`${baseURL}schedule/getEventDates/`, requestBody2)
          .then((response) => {
            if (response.status === 200 && Array.isArray(response.data)) {
              setGeneratedDates(response.data);
            } else {
              console.error("Unexpected response format:", response);
            }
          })
          .catch((error) => {
            console.error("API call failed:", error);
          });
        break;

      case "Recurring":
        setGeneratedDates(intervalState.selectedDates);
        break;

      default:
        console.warn("Unknown interval type – no action taken.");
        break;
    }
    setIntervalTypeModalVisible(false);
  };

  const handleClose = () => {
    setIntervalState({ ...selectedIntervalState });
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
    const selectedValue = e.target.value;
    setIntervalState({
      intervalType: selectedValue,
      repeatEvery: "",
      endDate: "",
      weeklyOnDay: "",
      weeklyOnTheOccurrence: "",
      weeklyOnTheDay: "",
      monthlyOnDay: "",
      selectedDates: [],
      monthlyOccurrence: "",
      monthlyWeekDay: "",
      recurringInterval: "Day(s)",
      recurringDaysSelected: [],
    });

    setSelectedIntervalState({
      intervalType: selectedValue,
      repeatEvery: "",
      endDate: "",
      weeklyOnDay: "",
      weeklyOnTheOccurrence: "",
      selectedDates: [],
      weeklyOnTheDay: "",
      monthlyOnDay: "",
      monthlyOccurrence: "",
      monthlyWeekDay: "",
      recurringInterval: "Day(s)",
      recurringDaysSelected: [],
    });
    setIntervalType(selectedValue);
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
                              id="startDateTimePicker"
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
                              id="endDateTimePicker"
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
                                aria-label="interval Type"
                                onChange={handleIntervalTypeChange}
                              >
                                <option value="">select value</option>
                                <option value="Weekly">weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Recurring">Recurring</option>
                              </select>
                            </div>
                            <div onClick={handlePopUpOpen}>
                              <img
                                src={Edit}
                                alt="edit"
                                width={35}
                                height={35}
                              />
                            </div>
                            {/* Weekly Interval Modal */}
                            {intervalType === "Weekly" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                                role="dialog"
                                aria-labelledby="weekly-modal-title"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id="weekly-modal-title">
                                    Weekly Interval Type
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="row intervalType-row1">
                                    <div className="col-sm-10 mb-2 d-flex align-items-center">
                                      <label
                                        htmlFor="repeatEvery"
                                        className="mr-2"
                                      >
                                        Every
                                      </label>
                                      <input
                                        id="repeatEvery"
                                        type="number"
                                        className="form-control repeat-every-value"
                                        aria-label="Repeat every week"
                                        style={{ width: "20%" }}
                                        name="repeatEvery"
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
                                      />
                                      <span className="ml-2">Weeks for</span>
                                      <input
                                        type="number"
                                        className="form-control repeat-every-value"
                                        aria-label="Weeks duration"
                                        style={{ width: "20%" }}
                                        name="repeatDuration"
                                        value={intervalState.repeatDuration}
                                        onChange={handleInputChange}
                                      />
                                      <span className="ml-2">Weeks</span>
                                    </div>
                                  </div>

                                  {/* Day Selection with WCAG Fixes */}
                                  <div className="row intervalType-row2 mt-3">
                                    <div className="col-sm-12">
                                      <fieldset>
                                        <legend className="sr-only">
                                          Select Recurring Days
                                        </legend>
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
                                      </fieldset>
                                    </div>
                                  </div>

                                  {/* End Date */}
                                  <div className="row intervalType-row4 mt-3">
                                    <div className="col-8">
                                      <label htmlFor="endDate">End Date</label>
                                      <input
                                        id="endDate"
                                        type="datetime-local"
                                        name="endDate"
                                        className="form-control time"
                                        aria-label="End date"
                                        style={{ width: "70%" }}
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
                                role="dialog"
                                aria-labelledby="monthly-modal-title"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id="monthly-modal-title">
                                    Monthly Interval Type
                                  </Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                  {/* Repeat Every Section */}
                                  <div className="row intervalType-row1">
                                    <div className="col-sm-6 d-flex align-items-center">
                                      <label
                                        htmlFor="monthlyRepeatEvery"
                                        className="mr-2"
                                      >
                                        Repeat every
                                      </label>
                                      <input
                                        id="monthlyRepeatEvery"
                                        type="number"
                                        className="form-control repeat-every-value"
                                        aria-label="Repeat every months"
                                        style={{ width: "30%" }}
                                        name="repeatEvery"
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col-sm-6">
                                      <label>Month(s)</label>
                                    </div>
                                  </div>

                                  {/* Monthly Options - On Day or On The */}
                                  <fieldset className="row intervalType-row2 mt-3">
                                    <legend className="sr-only">
                                      Select Monthly Option
                                    </legend>

                                    {/* On Day Option */}
                                    {/* On Day Option */}
                                    <div className="col-sm-5 d-flex align-items-center">
                                      <input
                                        type="radio"
                                        id="onDay"
                                        name="monthlyOption"
                                        className="onday-radio"
                                        aria-labelledby="onDayLabel"
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
                                        checked={
                                          intervalState.monthlyOption ===
                                          "onDay"
                                        }
                                        onChange={() =>
                                          handleInputChange({
                                            target: {
                                              name: "monthlyOption",
                                              value: "onDay",
                                            },
                                          })
                                        }
                                      />
                                      <label
                                        id="onDayLabel"
                                        htmlFor="onDay"
                                        className="ml-2"
                                      >
                                        On Day
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control onday-value"
                                        aria-label="Day of the month"
                                        style={{
                                          width: "30%",
                                          marginLeft: "10px",
                                        }}
                                        name="monthlyOnDay"
                                        value={intervalState.monthlyOnDay}
                                        onChange={handleInputChange}
                                        disabled={
                                          intervalState.monthlyOption !==
                                          "onDay"
                                        } // 🔐 disable when not active
                                      />
                                    </div>

                                    {/* On The Option */}
                                    <div className="col-sm-7 d-flex align-items-center">
                                      <input
                                        type="radio"
                                        id="onThe"
                                        name="monthlyOption"
                                        className="onday-radio"
                                        aria-labelledby="onTheLabel"
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
                                        checked={
                                          intervalState.monthlyOption ===
                                          "onThe"
                                        }
                                        onChange={() =>
                                          handleInputChange({
                                            target: {
                                              name: "monthlyOption",
                                              value: "onThe",
                                            },
                                          })
                                        }
                                      />
                                      <label
                                        id="onTheLabel"
                                        htmlFor="onThe"
                                        className="ml-2"
                                      >
                                        On the
                                      </label>

                                      <div className="dropdown-wrapper ml-2">
                                        <select
                                          name="monthlyOccurrence"
                                          className="custom-select"
                                          aria-label="Select occurrence of the month"
                                          value={
                                            intervalState.monthlyOccurrence
                                          }
                                          onChange={handleInputChange}
                                          disabled={
                                            intervalState.monthlyOption !==
                                            "onThe"
                                          } // 🔐 disable when not active
                                        >
                                          <option value="">Select value</option>
                                          <option value="First">First</option>
                                          <option value="Second">Second</option>
                                          <option value="Third">Third</option>
                                          <option value="Fourth">Fourth</option>
                                          <option value="Last">Last</option>
                                        </select>

                                        <select
                                          name="monthlyWeekDay"
                                          className="custom-select ml-2"
                                          aria-label="Select day of the week"
                                          value={intervalState.monthlyWeekDay}
                                          onChange={handleInputChange}
                                          disabled={
                                            intervalState.monthlyOption !==
                                            "onThe"
                                          } // 🔐 disable when not active
                                        >
                                          <option value="">Select value</option>
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
                                  </fieldset>

                                  {/* End Date Section */}
                                  <div className="row intervalType-row3 mt-3">
                                    <div className="col-8">
                                      <label htmlFor="monthlyEndDate">
                                        End Date
                                      </label>
                                      <input
                                        id="monthlyEndDate"
                                        type="datetime-local"
                                        name="monthlyEndDate"
                                        className="form-control time"
                                        aria-label="Select end date"
                                        style={{ width: "70%" }}
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

                                  {/* Summary Section */}
                                  <div className="row intervalType-row4 mt-3">
                                    <div className="col text-center">
                                      <p>
                                        Occurs every month on the{" "}
                                        <strong>
                                          {intervalState.monthlyOccurrence}
                                        </strong>
                                        <strong>
                                          {" "}
                                          {intervalState.monthlyWeekDay}
                                        </strong>{" "}
                                        starting
                                        <span> 10/11/23</span> until{" "}
                                        <span>15/11/23</span>.
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
                                role="dialog"
                                aria-labelledby="recurring-modal-title"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id="recurring-modal-title">
                                    Recurring Interval Type
                                  </Modal.Title>
                                </Modal.Header>

                                <Modal.Body className="pt-3">
                                  <div className="container">
                                    <h5 className="text-center">
                                      Random Date Selection
                                    </h5>
                                    <div className="d-flex mt-3">
                                      <div style={{ width: "60%" }}>
                                        <CustomCalendar
                                          selectedDates={
                                            intervalState.selectedDates
                                          }
                                          setSelectedDates={updateSelectedDates}
                                          aria-label="Custom Calendar for selecting dates"
                                        />
                                      </div>
                                      <div
                                        className="ms-3 border p-3 rounded shadow-sm d-flex flex-column"
                                        style={{ width: "40%" }}
                                      >
                                        <h6 className="text-center">
                                          Selected Dates
                                        </h6>
                                        <textarea
                                          className="form-control flex-grow-1"
                                          style={{ maxHeight: "12em" }}
                                          rows="10"
                                          readOnly
                                          aria-label="Selected dates list"
                                          value={intervalState.selectedDates.join(
                                            "\n"
                                          )}
                                        />
                                        <button
                                          className="btn btn-danger mt-2 w-100"
                                          onClick={handleClearDates}
                                        >
                                          Clear Dates
                                        </button>
                                      </div>
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
                              aria-label="Conflicts"
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
                              aria-label="people  Select input"
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
                              aria-label="people  Search input"
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
                            <InfiniteDropdown
                              id="Owner"
                              options={Owners}
                              selectedValue={
                                Owners.find((owner) => owner.id === OwnerID)
                                  ? [
                                      Owners.find(
                                        (owner) => owner.id === OwnerID
                                      ),
                                    ]
                                  : []
                              }
                              onChange={(selectedOption) => {
                                handleOwnerChange([selectedOption]);
                                dispatch(setownerID(selectedOption.id));
                                setOwnerID(selectedOption.id);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Scheduler</div>
                            <div className="dropdown">
                              <InfiniteDropdown
                                id="Scheduler"
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
                                id="Customer"
                                options={Customer}
                                selectedValue={SelectedCustomer}
                                onChange={handleCustomerClick}
                              />
                            </div>
                          </div>
                        </Col>
                        {/* //434 */}
                        <Col md={3} sm={6} xs={12} className="col-3 mb-3">
                          <div className="selectedField-value">
                            <div className="title">Contact</div>
                            <div className="dropdown">
                              <InfiniteDropdown
                                id="Contact"
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
                                  aria-label="locationType"
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
                              aria-label="location Select input"
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
                              aria-label="location Search input"
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
                                        id={level.label}
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
                                    aria-label="Capacity"
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
                                      aria-label="handicap"
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
                                      id="Amenities"
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
                                  id={location.value}
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
            <button className="btn-schedule btn" onClick={handleScheduleClick}>
              Schedule
            </button>
            <Modal
              show={isScheduleSummaryVisible}
              onHide={() => setScheduleSummaryVisible(false)}
              backdrop="static"
              keyboard={true}
              aria-labelledby="schedule-summary-title"
            >
              <Modal.Header closeButton>
                <Modal.Title id="schedule-summary-title">
                  Scheduled Summary
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {formattedScheduleSummary}
                </pre>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setScheduleSummaryVisible(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <button className="btn-search btn">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
