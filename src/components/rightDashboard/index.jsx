import { useState, useEffect } from "react";
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
import { setUsername } from "../../redux/slices/clientSlice.js";
import { resetScheduleInit } from "../../redux/slices/scheduleInitSlice";

import {
  markOwnerDefaultsApplied,
  markSchedulerLoaded,
  markCustomerLoaded,
  markContactLoaded,
  markLocationLabelsLoaded,
  markDefaultsLoaded,
} from "../../redux/slices/scheduleInitSlice";
import {
  setEndDateF,
  setGeneratedDatesF,
  setIntervalConfigF,
  setSelectedContactF,
  setSelectedCustomerF,
  setSelectedSchedulerF,
  setStartDateF,
  setSchedulerOptionsF, // ✅ ADD
  setCustomerOptionsF, // ✅ ADD
  setContactOptionsF, // ✅ ADD
} from "../../redux/slices/intervalSlice.js";
import {
  setSelectedLocationType,
  setLocationData,
  selectLocationOption,
  setSearchScope,
  setLoctype,
} from "../../redux/slices/locationSlice";

import {
  getDayNumber,
  getMonthPartNumber,
  formatDateMMDDYYYY,
  formatTimeHHMM,
} from "../../api/dateUtils";
import { generateDates } from "../../api/getEventDates.js";

import { useSelector, useDispatch } from "react-redux";
import CustomCalendar from "./components/custumCalender/index.jsx";
import { useNavigate } from "react-router-dom";
import {
  setSearchResults,
  setShowConflict,
  setSearchPayload,
} from "../../redux/slices/scheduleSlice";

export default function RightDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConflicts, setShowConflicts] = useState(true);
  const sessionData = useSelector((state) => state.auth.sessionData);
  const data = useSelector((state) => state.sample.data);
  const loading = useSelector((state) => state.sample.loading);
  const clientname = useSelector((state) => state.client.clientname);
  const owner = useSelector((state) => state.owner.owner);
  const ownerID = useSelector((state) => state.owner.ownerID);
  const ownerLoad = useSelector((state) => state.owner.loading);
  const intervalRedux = useSelector((state) => state.interval);
  const {
    schedulerOptions,
    selectedScheduler,
    customerOptions,
    selectedCustomer,
    contactOptions,
    selectedContact,
  } = useSelector((state) => state.interval);
  const {
    locationData,
    selectedLocationType,
    searchScope,
    Loctype,
    selectedLocationDetails,
  } = useSelector((state) => state.location);
  const skipLocationInit = useSelector(
    (state) => state.location.skipLocationInit,
  );
  const generatedDates = useSelector((state) => state.interval.generatedDates);
  const {
    ownerDefaultsApplied,
    schedulerLoaded,
    customerLoaded,
    contactLoaded,
    locationLabelsLoaded,
    defaultsLoaded,
  } = useSelector((state) => state.scheduleInit);
  const isLegacyOwner = String(ownerID) === "1";
  const startDate = useSelector((state) => state.interval.startDate);
  const endDate = useSelector((state) => state.interval.endDate);

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);
  const baseURL = "http://192.168.0.65/rest/gvRestApi/";

  const formatToApiDate = (isoString) => {
    if (!isoString) return "";

    // Expecting something like "2025-12-07T17:00:00.000Z"
    const [datePart, timePartWithMs] = isoString.split("T");
    if (!datePart || !timePartWithMs) return "";

    const [yyyy, mm, dd] = datePart.split("-");
    const timePart = timePartWithMs.split(".")[0]; // "17:00:00.000Z" -> "17:00:00"

    return `${yyyy}/${mm}/${dd} ${timePart}`;
  };

  const buildDateLists = () => {
    if (!generatedDates || generatedDates.length === 0) {
      return { startList: "", endList: "" };
    }

    const startList = generatedDates
      .map((item) => formatToApiDate(item.start))
      .join(",");

    const endList = generatedDates
      .map((item) => formatToApiDate(item.end))
      .join(",");

    return { startList, endList };
  };

  const [scheduleError, setScheduleError] = useState("");

  const getSelectedLoclist = () => {
    if (!Array.isArray(locationData) || locationData.length === 0) return "";

    // Find the deepest selected location
    const lastSelected = [...locationData]
      .reverse()
      .find(
        (loc) =>
          Array.isArray(loc.selectedOption) && loc.selectedOption.length > 0,
      );

    return lastSelected ? lastSelected.selectedOption[0].value : "";
  };

  const handleSearchClick = async () => {
    const { startList, endList } = buildDateLists();
    // const loclist = selectedLocationDetails.locationId || "";
    const loclist = getSelectedLoclist();

    // 🔒 Search scope validation
    if (!searchScope) {
      setScheduleError("Search scope has to be selected.");
      return;
    }
    // ✅ Clear error before API call
    setScheduleError("");
    const payload = {
      clientname: clientname?.toUpperCase() || "",
      start_dateList: startList,
      end_dateList: endList,
      loclist: loclist || "",
      owner: String(ownerID),
      loctype_kir:
        selectedLocationType === "indoor"
          ? "0"
          : selectedLocationType === "outdoor"
            ? "1"
            : selectedLocationType === "equip"
              ? "2"
              : "3",
      lfastopt: String(searchScope),
      schedule: "no",
      customer_id: selectedCustomer?.[0]?.id || "",

      function_id: "0",
      showconflict: showConflicts ? "1" : "0",
    };

    dispatch(setShowConflict(showConflicts));
    dispatch(setSearchPayload(payload));
    setScheduleError("");

    try {
      const response = await axios.post(
        `${baseURL}schedule/searchSchedules/`,
        payload,
      );
      if (response.data?.success === false) {
        if (response.data?.detail?.includes("2100")) {
          setScheduleError(
            "Too many dates selected. Please reduce the date range and try again.",
          );
        } else {
          setScheduleError(
            response.data?.detail ||
              response.data?.message ||
              "Unable to process search. Please refine your criteria.",
          );
        }
        return; // 🚫 STOP navigation
      }

      // ✅ SUCCESS PATH ONLY
      dispatch(setSearchResults(response.data));
      navigate(`/${clientname}/ScheduleResult`);
    } catch (error) {
      console.error("Search API failed:", error);
    }
  };

  const handleScheduleClick = async () => {
    if (!showConflicts) return;

    const { startList, endList } = buildDateLists();
    const loclist = getSelectedLoclist();
    axios
      .post(`${baseURL}schedule/searchSchedules/`, {
        clientname: clientname?.toUpperCase() || "",
        start_dateList: startList,
        end_dateList: endList,
        loclist: loclist || "",
        owner: String(ownerID),
        loctype_kir:
          selectedLocationType === "indoor"
            ? "0"
            : selectedLocationType === "outdoor"
              ? "1"
              : selectedLocationType === "equip"
                ? "2"
                : "3",
        lfastopt: String(searchScope),
        schedule: "yes",
        customer_id: selectedCustomer?.[0]?.id || "",

        function_id: "0",
        showconflict: showConflicts ? "1" : "0",
      })
      .then(function (response) {
        dispatch(setSearchResults(response.data));
        navigate(`/${clientname}/ScheduleConfirmation`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [radiobtn, setRadiobtn] = useState([]);
  const [intervalTime, setIntervalTime] = useState();

  // useEffect(() => {
  //   dispatch(setStartDateF(String(StartTime)));
  // }, [StartTime, dispatch]);
  // useEffect(() => {
  //   dispatch(setEndDateF(String(EndTime)));
  // }, [EndTime, dispatch]);
  useEffect(() => {
    if (!clientname) return;

    dispatch(fetchOwnerData());
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
              timeStr,
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
            seconds,
          );
          const utcDate = new Date(
            localDate.getTime() - localDate.getTimezoneOffset() * 60000,
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
            dispatch(setStartDateF(startTime));
            dispatch(setEndDateF(endTime));
            setIntervalTime(selectedOwner.EVENTSLOTTIME);
            dispatch(
              setGeneratedDatesF([
                {
                  start: startTime,
                  end: endTime,
                },
              ]),
            );
          }
        }
      }
    };
    if (
      ownerDefaultsApplied ||
      ownerLoad ||
      !Array.isArray(owner) ||
      owner.length === 0 ||
      !ownerID
    ) {
      return;
    } else {
      const selectedOwner = owner.find((o) => o.id === ownerID);
      setDefaultData(selectedOwner);
      dispatch(markOwnerDefaultsApplied());
    }
  }, [owner, ownerID, ownerLoad, ownerDefaultsApplied, dispatch]);

  const handleOwnerChange = (selectedOption) => {
    if (!selectedOption) return;

    const newOwnerId = selectedOption.id;

    // 1️⃣ Set owner
    dispatch(setownerID(newOwnerId));

    // 2️⃣ Reset all init flags
    dispatch(resetScheduleInit());

    // 3️⃣ Clear dependent dropdown data
    dispatch(setSchedulerOptionsF([]));
    dispatch(setSelectedSchedulerF([]));

    dispatch(setCustomerOptionsF([]));
    dispatch(setSelectedCustomerF([]));

    dispatch(setContactOptionsF([]));
    dispatch(setSelectedContactF([]));

    dispatch(setLocationData([]));
  };

  useEffect(() => {
    if (!ownerID || defaultsLoaded) return;
    dispatch(fetchDefaultValues());
    dispatch(markDefaultsLoaded());
  }, [dispatch, ownerID]);

  /* eslint-disable react-hooks/exhaustive-deps */
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
          item.VARNAME.startsWith("disp_") && (item.VARVALUE === "Yes" || "No"),
      );
      const optimisedData = filteredData.map((item, index) => ({
        id: index + 1,
        value: item.VARVALUE === "Yes" ? 1 : 0,
        lable: item.VARNAME.replace("disp_", ""),
      }));

      labelData.forEach((labelItem) => {
        const matchingItem = optimisedData.find(
          (optItem) => optItem.lable === labelItem.value,
        );
        if (matchingItem) {
          labelItem.enable = matchingItem.value;
        }
      });
      setRadiobtn(labelData);
    }
  }, [loading]);
  /* eslint-disable react-hooks/exhaustive-deps */
  //People

  //Scheduler API Implementation
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!ownerID || schedulerLoaded) return;

    // 🟡 LEGACY OWNER (ID = 1)
    if (isLegacyOwner) {
      const username = sessionData?.UNAME || null;

      const request1 = axios.post(`${baseURL}schedule/getRequestors/`, {
        clientname,
        owner_id: String(ownerID),
      });

      const request2 = axios.post(`${baseURL}schedule/getRequestors/`, {
        clientname,
        username,
      });

      Promise.all([request1, request2])
        .then(([res1, res2]) => {
          const options = res1.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));

          const selected = res2.data.DATA.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          }));

          dispatch(setSchedulerOptionsF(options));
          dispatch(setSelectedSchedulerF(selected));
          dispatch(markSchedulerLoaded());
        })
        .catch(console.error);

      return;
    }

    // 🟢 NEW OWNER FLOW
    if (!Array.isArray(owner) || owner.length === 0) return;

    const selectedOwner = owner.find((o) => String(o.id) === String(ownerID));
    if (!selectedOwner) return;

    const defRequestorId = selectedOwner.Def_REQUESTOR;

    axios
      .post(`${baseURL}schedule/getRequestors/`, {
        clientname,
        owner_id: String(ownerID),
      })
      .then((response) => {
        const options = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
        }));

        const selected = defRequestorId
          ? options.filter((o) => String(o.id) === String(defRequestorId))
          : [];

        dispatch(setSchedulerOptionsF(options));
        dispatch(setSelectedSchedulerF(selected));
        dispatch(markSchedulerLoaded());
      })
      .catch(console.error);
  }, [ownerID, owner, schedulerLoaded, sessionData, dispatch]);

  //customer API Implementation

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!ownerID || customerLoaded) return;

    axios
      .post(`${baseURL}schedule/getCustomers/`, {
        clientname,
        owner_id: String(ownerID),
      })
      .then((response) => {
        const options = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
        }));

        // 🟡 LEGACY
        if (isLegacyOwner) {
          const defCustomerId = sessionData?.V_CUS;
          const selected = defCustomerId
            ? options.filter((c) => String(c.id) === String(defCustomerId))
            : [];

          dispatch(setCustomerOptionsF(options));
          dispatch(setSelectedCustomerF(selected));
          dispatch(markCustomerLoaded());
          return;
        }

        // 🟢 NEW
        if (!Array.isArray(owner) || owner.length === 0) return;
        const selectedOwner = owner.find(
          (o) => String(o.id) === String(ownerID),
        );
        if (!selectedOwner) return;

        const selected = selectedOwner.Def_CUSTOMER
          ? options.filter(
              (c) => String(c.id) === String(selectedOwner.Def_CUSTOMER),
            )
          : [];

        dispatch(setCustomerOptionsF(options));
        dispatch(setSelectedCustomerF(selected));
        dispatch(markCustomerLoaded());
      })
      .catch(console.error);
  }, [ownerID, owner, customerLoaded, sessionData, dispatch]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const handleCustomerClick = (selectedOption) => {
    dispatch(setSelectedCustomerF([selectedOption]));
    dispatch(setSelectedContactF([]));

    axios
      .post(`${baseURL}schedule/getContacts/`, {
        clientname,
        customer_id: selectedOption.id,
        CUSTOMER_STATUS: 1,
      })
      .then((response) => {
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
          primaryContact: e[2],
        }));

        const selected = data.filter((e) => e.primaryContact === 1);

        dispatch(setContactOptionsF(data));
        dispatch(setSelectedContactF(selected));
      });
  };

  //API Contact
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!ownerID || contactLoaded) return;
    if (!selectedCustomer || selectedCustomer.length === 0) return;

    const customerId = selectedCustomer[0].id;

    axios
      .post(`${baseURL}schedule/getContacts/`, {
        clientname,
        owner_id: String(ownerID),
        customer_id: customerId,
      })
      .then((response) => {
        const options = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
          primaryContact: e[2],
          NAME_FIRST: e[8] || "",
          NAME_LAST: e[9] || "",
        }));

        const primary = options.find((o) => o.primaryContact === 1);
        const username = primary
          ? `${primary.NAME_FIRST} ${primary.NAME_LAST}`.trim()
          : "";

        dispatch(setContactOptionsF(options));
        dispatch(setSelectedContactF(primary ? [primary] : []));
        dispatch(setUsername(username));
        dispatch(markContactLoaded());
      })
      .catch(console.error);
  }, [ownerID, selectedCustomer, contactLoaded, dispatch]);

  /* eslint-disable react-hooks/exhaustive-deps */

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

            dispatch(setContactOptionsF(data));
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
    dispatch(setSelectedLocationType(selectedValue));
  };

  const [Count, setCount] = useState(0);
  const [Count2, setCount2] = useState(0);

  const [intialDataLoad, setintialDataLoad] = useState(0);

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const shouldRun =
      Count2 === 1 &&
      locationFilters.levels &&
      locationFilters.levels.length > 1 &&
      locationFilters.levels[0].options;

    if (!shouldRun) return;

    const fetchAmenityList = async () => {
      try {
        const res = await axios.post(`${baseURL}master/getAmenityList`, {
          clientname,
          OWNER_ID: String(ownerID),
        });

        const amenityArray = Array.isArray(res?.data?.DATA)
          ? res.data.DATA
          : [];
        const Amenitydata = [
          { id: "", value: "", label: "---Select---" },
          ...amenityArray.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          })),
        ];

        return Amenitydata;
      } catch (error) {
        console.error("❌ Error fetching amenities:", error);
        return [
          { id: "", value: "", label: "---Select---" }, // fallback
        ];
      }
    };

    const fetchLevelData = async (levelId) => {
      try {
        const response = await axios.post(`${baseURL}schedule/getLevelType`, {
          clientname,
          label_id: levelId,
        });

        const levelArray = Array.isArray(response?.data?.DATA)
          ? response.data.DATA
          : [];

        const data = [
          { id: "0", value: "0", label: "---Select---" },
          ...levelArray.map((e) => ({
            id: e[0],
            value: e[0],
            label: e[1],
          })),
        ];

        return { levelId, data };
      } catch (error) {
        console.error(`❌ Error fetching data for level ${levelId}:`, error);
        return {
          levelId,
          data: [{ id: "0", value: "0", label: "---Select---" }],
        };
      }
    };

    const run = async () => {
      try {
        const [Amenitydata, levelResults] = await Promise.all([
          fetchAmenityList(),
          Promise.all(
            locationFilters.levels.map((level) => fetchLevelData(level.id)),
          ),
        ]);

        // Update all levels and amenities once
        setlocationFilters((prevFilters) => ({
          ...prevFilters,
          levels: prevFilters.levels.map((level) => {
            const found = levelResults.find((res) => res.levelId === level.id);
            return found
              ? { ...level, options: found.data, selectedValue: null }
              : level;
          }),
          LFAmenities: prevFilters.LFAmenities.map((amenity) => ({
            ...amenity,
            options: Amenitydata,
            selectedValue: null,
          })),
        }));

        // Sync local LF values
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

        setCount2(0);
      } catch (error) {
        console.error("❌ Error in combined fetch:", error);
      }
    };

    run();
  }, [Count2]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const handleSelectChange = (selectedOption, levelId) => {
    setlocationFilters((prevFilters) => ({
      ...prevFilters,
      levels: prevFilters.levels.map((level) =>
        level.id === levelId
          ? { ...level, selectedValue: selectedOption }
          : level,
      ),
    }));
  };
  //423
  const fetchLocationData = async (
    variable,
    clabel,
    h_value,
    quickloc,
    label_id,
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

    dispatch(setLoctype("0,0,0,0,0,0,0"));
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
          (l) => l.id === level.id,
        );
        const ctype = `type${levelIndex + 1}`;
        const loctype =
          results.length > 0
            ? results[results.length - 1].data[2]
            : "0,0,0,0,0,0,0";

        const res = await CriteriaLookup(ctype_value, ctype, loctype);
        results.push(res);
      }
      dispatch(setLoctype(results[results.length - 1].data[2]));
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (Count === 1) {
      if (skipLocationInit) return;
      intialdata();
      setCount(0);
    }
  }, [Count]);
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!skipLocationInit) return;

    // Find the deepest selected location
    const lastSelectedIndex = locationData
      .map((loc, index) => (loc.selectedOption?.length ? index : -1))
      .filter((i) => i !== -1)
      .pop();

    if (lastSelectedIndex === undefined) return;

    const selectedLoc = locationData[lastSelectedIndex];
    const selectedValue = selectedLoc.selectedOption[0];

    // Trigger cascade manually
    fetchLocationData(
      selectedValue.value,
      lastSelectedIndex + 2,
      `0,${lastSelectedIndex + 1}`,
      lastSelectedIndex + 2,
      locationData[lastSelectedIndex + 1]?.id,
    ).then((response) => {
      const updated = locationData.map((loc, index) =>
        index === lastSelectedIndex + 1
          ? { ...loc, options: response.data, selectedOption: [] }
          : loc,
      );

      dispatch(setLocationData(updated));
    });
  }, [skipLocationInit]);

  //Location
  //420
  /* eslint-disable react-hooks/exhaustive-deps */
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
          owner_id: String(ownerID),
          loctype_kir: loctype_kir,
        })
        .then((response) => {
          const data = response.data.DATA.map((e) => ({
            id: e[0],
            value: e[1],
            options: [],
            selectedOption: [],
            dropdownSelected: false,
          }));

          const data1 = response.data.DATA.map((e) => ({
            id: e[0],
            label: e[1],
            options: [],
            selectedValue: [],
          }));
          dispatch(setLocationData(data));
          setlocationFilters((prevFilters) => ({
            ...prevFilters,
            levels: data1,
          }));
          setintialDataLoad(1);
          setCount2(1);
          dispatch(markLocationLabelsLoaded());
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    };
    if (!ownerID || locationLabelsLoaded) return;
    fetchLocationData();
  }, [selectedLocationType, ownerID]);
  /* eslint-disable react-hooks/exhaustive-deps */
  //421
  const intialdata = async () => {
    if (locationData && locationData.length >= 2) {
      const firstObjRes = await fetchLocationData(
        "00000000",
        1,
        "0,1",
        1,
        locationData[0].id,
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
        locationData[1].id,
      );
      const updatedLocationData = locationData.map((location, index) => {
        if (index === 0) {
          return {
            ...location,
            options: firstObjRes.data,
            selectedOption:
              firstObjRes.data.length > 0 ? firstObjRes.data[0] : [],
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
            selectedOption: [],
          };
        }
        return { ...location };
      });
      dispatch(setLocationData(updatedLocationData));
    }
  };
  useEffect(() => {
    if (intialDataLoad === 1 && locationData.length > 0) {
      intialdata();
      setintialDataLoad(0);
    }
  }, [locationData, intialDataLoad]);

  //422
  const handleOptionSelect = (locationId, selectedOption) => {
    const variable = selectedOption.value;
    const currentIndex = locationData.findIndex((loc) => loc.id === locationId);

    const needsCascadeRebuild =
      currentIndex > 0 &&
      locationData
        .slice(0, currentIndex)
        .some(
          (loc) =>
            !loc.options ||
            !loc.selectedOption ||
            loc.selectedOption.length === 0,
        );
    if (needsCascadeRebuild) {
      const currentIndex = locationData.findIndex(
        (loc) => loc.id === locationId,
      );
      if (currentIndex === -1) return;
      const updatedLocationData = locationData.map((location, index) => {
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
      });
      dispatch(setLocationData(updatedLocationData));

      const objectsToFetch = locationData.slice(0, currentIndex + 2);
      const fetchPromises = objectsToFetch.map((location, index) => {
        const range = `0,${currentIndex + 1}`;
        return fetchLocationData(
          variable,
          index + 1,
          range,
          index + 1,
          location.id,
        );
      });

      Promise.all(fetchPromises)
        .then((responses) => {
          const rebuiltLocationData = locationData.map((location) => {
            const responseIndex = objectsToFetch.findIndex(
              (obj) => obj.id === location.id,
            );

            if (responseIndex !== -1) {
              const response = responses[responseIndex];

              return {
                ...location,
                options: response.data,
                selectedOption: response.selected ? [response.selected] : [],
              };
            }

            return location;
          });

          dispatch(setLocationData(rebuiltLocationData));
        })
        .catch((error) => {
          console.error("Error in Promise.all:", error);
        })

        .catch((error) => {
          console.error("Error in Promise.all:", error);
        });
    } else {
      const currentIndex = locationData.findIndex(
        (loc) => loc.id === locationId,
      );
      if (currentIndex === -1) return;

      // 🔹 STEP 1: Clear all future dropdowns BEFORE API call
      const clearedLocationData = locationData.map((location, index) => {
        if (location.id === locationId) {
          return {
            ...location,
            selectedOption: [selectedOption],
          };
        }

        if (index > currentIndex) {
          return {
            ...location,
            options: [],
            selectedOption: [],
          };
        }

        return location;
      });

      dispatch(setLocationData(clearedLocationData));

      // 🔹 STEP 2: Fetch next dropdown options
      if (currentIndex + 1 < locationData.length) {
        const nextLocationId = locationData[currentIndex + 1].id;
        const range = `0,${currentIndex + 1}`;

        fetchLocationData(
          selectedOption.value,
          currentIndex + 2,
          range,
          currentIndex + 2,
          nextLocationId,
        )
          .then((response) => {
            const updatedLocationData = clearedLocationData.map((location) =>
              location.id === nextLocationId
                ? {
                    ...location,
                    options: response.data,
                    selectedOption: [], // must remain empty
                  }
                : location,
            );

            dispatch(setLocationData(updatedLocationData));
          })
          .catch((error) => {
            console.error(
              `Error fetching data for location ${currentIndex + 1}:`,
              error,
            );
          });
      }
    }
  };

  const handelLocationSearchDropDown = (e) => {
    const option = e.target.value;

    const updatedLocationData = locationData.map((location) => ({
      ...location,
      dropdownSelected: location.id.toString() === option,
    }));

    dispatch(setLocationData(updatedLocationData));

    handleLocationOption(option);
  };

  const handleLocationOption = (option) => {
    const updatedLocationData = locationData.map((location) => ({
      ...location,
      options: [],
      selectedOption: [],
    }));

    dispatch(setLocationData(updatedLocationData));

    if (option === "0" || option === "1") {
      intialdata();
    } else {
      const selectElement = document.getElementById("location_input_Select");
      const optionId = selectElement.value;
      const index = locationData.findIndex(
        (loc) => loc.id === Number(optionId),
      );
      const vlabel = index + 1;
      const label = selectElement.options[selectElement.selectedIndex].text;
      fetchLocationDataDefault(vlabel, label);
    }
  };

  const fetchLocationDataDefault = (
    vlabel,
    labelText,
    additionalParams = {},
  ) => {
    const loctype_kir =
      selectedLocationType === "indoor"
        ? 0
        : selectedLocationType === "outdoor"
          ? 1
          : selectedLocationType === "equip"
            ? 2
            : 3;

    const clearedLocationData = locationData.map((location) => ({
      ...location,
      options: [],
      selectedOption: [],
    }));

    dispatch(setLocationData(clearedLocationData));

    axios
      .post(`${baseURL}schedule/quickLocationLookup/`, {
        clientname: clientname,
        vlabel: vlabel,
        owner: String(ownerID),
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

        const id = clearedLocationData[vlabel - 1].id;

        const updatedLocationData = clearedLocationData.map((location) =>
          location.id === id
            ? {
                ...location,
                options: fetchedData,
                selectedOption: [], // keep clean
              }
            : location,
        );

        dispatch(setLocationData(updatedLocationData));
      })

      .catch((error) => console.error(error));
  };

  const handleClickLocationSearch = () => {
    const option = document.getElementById("location_input_Select").value;
    const data = document.getElementById("location_input_Search").value;
    const clearedLocationData = locationData.map((location) => ({
      ...location,
      options: [],
      selectedOption: [],
    }));

    dispatch(setLocationData(clearedLocationData));

    if (option === "0" || option === "1") {
      intialdata();
    } else {
      const selectElement = document.getElementById("location_input_Select");
      const optionId = selectElement.value;
      const index = locationData.findIndex(
        (loc) => loc.id === Number(optionId),
      );
      const vlabel = index + 1;
      const label = selectElement.options[selectElement.selectedIndex].text;
      fetchLocationDataDefault(vlabel, label, { loc_name: data });
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
  const DAY_LABEL_MAP = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
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
    RandomInterval: "Day(s)",
    RandomDaysSelected: [],
  });
  const intervalNote = (() => {
    const cfg = intervalRedux.intervalConfig;
    if (!cfg || !cfg.intervalType) return "";

    switch (cfg.intervalType) {
      case "Weekly": {
        const days =
          cfg.RandomDaysSelected?.map((day) => DAY_LABEL_MAP[day] || day).join(
            ", ",
          ) || "";

        return `Weekly interval: every ${cfg.repeatEvery} week(s) for ${cfg.repeatDuration} week(s) on ${days}`;
      }
      case "Monthly": {
        if (cfg.monthlyOption === "onThe") {
          const fullDay =
            DAY_LABEL_MAP[cfg.monthlyWeekDay] || cfg.monthlyWeekDay;

          return `Monthly interval: every ${cfg.repeatEvery} month(s) on the ${cfg.monthlyOccurrence} ${fullDay}`;
        }
        return "Monthly interval selected.";
      }
      case "Random":
        return `Random interval: ${cfg.selectedDates?.length || 0} date(s) selected.`;

      case "Single":
        return "Single day selected.";

      default:
        return "";
    }
  })();

  const [isStartDateReadonly, setStartDateReadonly] = useState(false);
  const [isEndDateReadonly, setEndDateReadonly] = useState(false);

  useEffect(() => {
    if (!intervalRedux.intervalConfig) return;

    setIntervalState({
      intervalType: intervalRedux.intervalConfig.intervalType || "",
      repeatEvery: intervalRedux.intervalConfig.repeatEvery ?? "",
      repeatDuration: intervalRedux.intervalConfig.repeatDuration ?? "",
      endDate: intervalRedux.intervalConfig.endDate ?? "",
      weeklyOnDay: intervalRedux.intervalConfig.weeklyOnDay ?? "",
      weeklyOnTheOccurrence:
        intervalRedux.intervalConfig.weeklyOnTheOccurrence ?? "",
      weeklyOnTheDay: intervalRedux.intervalConfig.weeklyOnTheDay ?? "",
      monthlyOnDay: intervalRedux.intervalConfig.monthlyOnDay ?? "",
      monthlyOccurrence: intervalRedux.intervalConfig.monthlyOccurrence ?? "",
      monthlyWeekDay: intervalRedux.intervalConfig.monthlyWeekDay ?? "",
      selectedDates: intervalRedux.intervalConfig.selectedDates ?? [],
      RandomInterval: intervalRedux.intervalConfig.RandomInterval ?? "Day(s)",
      RandomDaysSelected: intervalRedux.intervalConfig.RandomDaysSelected ?? [],
    });
  }, [intervalRedux.intervalConfig]);

  // Function to update selected dates
  const updateSelectedDates = (newDates) => {
    setIntervalState((prevState) => ({
      ...prevState,
      selectedDates: newDates,
    }));
  };

  // Function to clear selected dates
  const handleClearDates = () => {
    setIntervalState((prevState) => ({
      ...prevState,
      selectedDates: [],
    }));
  };

  const handleSave = async () => {
    const type = intervalState.intervalType;

    if (!startDate || !endDate) {
      console.warn("⛔ StartTime or EndTime missing:", startDate, endDate);
      return;
    }

    try {
      let requestBody = {};
      let response = [];

      switch (type) {
        case "Weekly": {
          const daysArray = (intervalState.RandomDaysSelected || []).map(
            getDayNumber,
          );

          requestBody = {
            type: "weekly",
            startDate: formatDateMMDDYYYY(startDate),
            endDate: formatDateMMDDYYYY(endDate),
            startTime: formatTimeHHMM(startDate),
            endTime: formatTimeHHMM(endDate),
            days: daysArray,
            durationWeeks: intervalState.repeatDuration,
            everyXWeeks: intervalState.repeatEvery,
          };

          response = generateDates(requestBody);
          console.log("Weekly generation response:", response);
          break;
        }

        case "Monthly": {
          const baseParams = {
            type: "monthly",
            startDate: formatDateMMDDYYYY(startDate),
            startTime: formatTimeHHMM(startDate),
            endTime: formatTimeHHMM(endDate),
            repeatEvery: intervalState.repeatEvery,
          };

          if (intervalState.monthlyOption === "onDay") {
            requestBody = {
              ...baseParams,
              mode: "daynumber",
              dayNumber: intervalState.monthlyOnDay,
            };
          } else if (intervalState.monthlyOption === "onThe") {
            requestBody = {
              ...baseParams,
              mode: "weekday",
              weekNumber: getMonthPartNumber(intervalState.monthlyOccurrence),
              weekDay: getDayNumber(intervalState.monthlyWeekDay),
            };
          }

          response = generateDates(requestBody);
          break;
        }

        case "Random": {
          requestBody = {
            type: "random",
            randomDates: intervalState.selectedDates || [],
            startTime: formatTimeHHMM(startDate),
            endTime: formatTimeHHMM(endDate),
          };
          response = generateDates(requestBody);
          break;
        }

        default:
          console.warn("⚠️ Unknown interval type:", intervalState.intervalType);
          return;
      }

      if (Array.isArray(response) && response.length > 0) {
        response.sort((a, b) => new Date(a.start) - new Date(b.start));
        // setGeneratedDates(response);
        const firstDate = response[0];
        const lastDate = response[response.length - 1];

        dispatch(setStartDateF(firstDate.start));
        dispatch(setEndDateF(lastDate.end));
        // Commit FINAL config
        dispatch(setIntervalConfigF(intervalState));

        // Commit generated dates
        dispatch(setGeneratedDatesF(response));

        // Weekly & Monthly: start editable, end readonly; Random: both readonly
        if (type === "Weekly" || type === "Monthly") {
          setStartDateReadonly(false);
          setEndDateReadonly(true);
        } else if (type === "Random") {
          setStartDateReadonly(true);
          setEndDateReadonly(true);
        }
      } else {
        console.warn("⚠️ No valid dates generated for type:", type);
      }
    } catch (error) {
      console.error("❌ Error while generating event dates:", error);
    } finally {
      setIntervalTypeModalVisible(false); // 🔐 ALWAYS CLOSE
    }
  };

  // useEffect(() => {
  //   if (intervalState.intervalType === "Single") {
  //     try {
  //       const today = new Date();
  //       const todayStr = formatDateMMDDYYYY(today);

  //       const singleRequest = {
  //         type: "single",
  //         startDate: todayStr,
  //         endDate: todayStr,
  //         startTime: formatTimeHHMM(startDate),
  //         endTime: formatTimeHHMM(endDate),
  //       };

  //       const response = generateDates(singleRequest);

  //       if (Array.isArray(response) && response.length > 0) {
  //         const firstDate = response[0];
  //         const lastDate = response[response.length - 1];

  //         // Update states
  //         // setGeneratedDates(response);
  //         dispatch(setGeneratedDatesF(response))
  //         dispatch(setStartDateF(firstDate.start));
  //         dispatch(setEndDateF(lastDate.end));

  //         // Single interval: both fields editable
  //         setStartDateReadonly(false);
  //         setEndDateReadonly(false);
  //       } else {
  //         console.warn("⚠️ No dates generated for Single interval");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error generating Single interval dates:", error);
  //     }
  //   }
  // }, [intervalState.intervalType]);

  const handleClose = () => {
    if (intervalRedux.intervalConfig) {
      setIntervalState(intervalRedux.intervalConfig);
    }
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

    // Prepare default state
    const newState = {
      intervalType: selectedValue,
      repeatEvery: "",
      endDate: "",
      weeklyOnDay: "",
      weeklyOnTheOccurrence: "",
      weeklyOnTheDay: "",
      monthlyOnDay: "",
      selectedDates: [],
      monthlyOption: "onThe",
      monthlyOccurrence: "",
      monthlyWeekDay: "",
      RandomInterval: "Day(s)",
      RandomDaysSelected: [],
    };

    setIntervalState(newState);

    // ✅ If Single, call handleSave() directly (no modal)
    if (selectedValue !== "Single") {
      setIntervalTypeModalVisible(true);
    }
  };

  useEffect(() => {
    if (
      intervalState.intervalType === "Weekly" ||
      intervalState.intervalType === "Monthly"
    ) {
      setStartDateReadonly(false);
      setEndDateReadonly(true);
    } else if (intervalState.intervalType === "Random") {
      setStartDateReadonly(true);
      setEndDateReadonly(true);
    } else {
      setStartDateReadonly(false);
      setEndDateReadonly(false);
    }
  }, [intervalState.intervalType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkbox values
      setIntervalState((prevState) => {
        let updatedDays = [...prevState.RandomDaysSelected];
        if (checked) {
          if (!updatedDays.includes(name)) updatedDays.push(name);
        } else {
          updatedDays = updatedDays.filter((day) => day !== name);
        }

        return { ...prevState, RandomDaysSelected: updatedDays };
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
    <div className='mainRightDashboard'>
      <div className='topRightdashboard'>
        <div className='scheduleSearch-header'>
          <div className='search'>Search</div>
          <div className='scheduleSearch-buttons'>
            <div className='button'>
              <button type='button' className='btnmodify'>
                Modify/Cancel
              </button>
              <button type='button' className='btnrequest'>
                Show Request
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='scheduleSearch'>
        <div className='scheduleSearch-body'>
          <div className='accordion-item'>
            <button
              type='button'
              className='accordion-item-btn'
              onClick={handleClick1}
            >
              <div className='section-1'>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={Calender} alt='Calender' />
                  </div>
                  <div className='title'>Date and Time</div>
                </div>
                <div className='button'>
                  {isOpen1 ? (
                    <img src={Up} alt='icon' />
                  ) : (
                    <img src={Down} alt='icon' />
                  )}
                </div>
              </div>
            </button>
            {isOpen1 && (
              <div className='section-2'>
                <div className='accordion-body'>
                  <div className='datetime-setup'>
                    <Row>
                      <Col md={3} sm={6} xs={12} className='col-3'>
                        <div className='startTime-container mb-3'>
                          <div className='heading'>Start Date and Time</div>
                          <div className='time'>
                            <CustomDateTimePicker
                              id='startDateTimePicker'
                              value={startDate}
                              onChange={(val) => dispatch(setStartDateF(val))}
                              interval={intervalTime}
                              readOnly={isStartDateReadonly}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className='col-3'>
                        <div className='endTime-container mb-3'>
                          <div className='heading' style={{ fontSize: "1em" }}>
                            End Date and Time
                          </div>
                          <div className='time'>
                            <CustomDateTimePicker
                              id='endDateTimePicker'
                              value={endDate}
                              onChange={(val) => dispatch(setEndDateF(val))}
                              interval={intervalTime}
                              readOnly={isEndDateReadonly}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} xs={12} className='col-3'>
                        <div className='interval-container mb-3'>
                          <div className='heading'>Interval Type</div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div className='dropdown dropdown-wrapper search keyword'>
                              <select
                                name='intervalType'
                                className='custom-select'
                                aria-label='interval Type'
                                value={intervalState.intervalType || "Single"}
                                onChange={handleIntervalTypeChange}
                              >
                                <option value='Single'>Single Day</option>
                                <option value='Weekly'>Weekly</option>
                                <option value='Monthly'>Monthly</option>
                                <option value='Random'>Random</option>
                              </select>
                            </div>
                            <div
                              onClick={handlePopUpOpen}
                              style={{
                                cursor: "pointer",
                                marginLeft: "0.5rem",
                              }}
                            >
                              <img
                                src={Edit}
                                alt='edit'
                                width={35}
                                height={35}
                              />
                            </div>
                            {/* Weekly Interval Modal */}
                            {intervalState.intervalType === "Weekly" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                                role='dialog'
                                aria-labelledby='weekly-modal-title'
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id='weekly-modal-title'>
                                    Weekly Interval Type
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className='row intervalType-row1'>
                                    <div className='col-sm-10 mb-2 d-flex align-items-center'>
                                      <label
                                        htmlFor='repeatEvery'
                                        className='mr-2'
                                      >
                                        Every
                                      </label>
                                      <input
                                        id='repeatEvery'
                                        type='number'
                                        className='form-control repeat-every-value'
                                        aria-label='Repeat every week'
                                        style={{ width: "20%" }}
                                        name='repeatEvery'
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
                                      />
                                      <span className='ml-2'>Weeks for</span>
                                      <input
                                        type='number'
                                        className='form-control repeat-every-value'
                                        aria-label='Weeks duration'
                                        style={{ width: "20%" }}
                                        name='repeatDuration'
                                        value={intervalState.repeatDuration}
                                        onChange={handleInputChange}
                                      />
                                      <span className='ml-2'>Weeks</span>
                                    </div>
                                  </div>

                                  {/* Day Selection with WCAG Fixes */}
                                  <div className='row intervalType-row2 mt-3'>
                                    <div className='col-sm-12'>
                                      <fieldset>
                                        <legend className='sr-only'>
                                          Select Days
                                        </legend>
                                        <div className='d-flex justify-content-between'>
                                          {[
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat",
                                            "Sun",
                                          ].map((day) => (
                                            <div
                                              key={day}
                                              className='custom-control custom-checkbox'
                                            >
                                              <input
                                                type='checkbox'
                                                className='custom-control-input'
                                                id={`check${day}`}
                                                name={day}
                                                checked={intervalState.RandomDaysSelected.includes(
                                                  day,
                                                )}
                                                onChange={handleInputChange}
                                              />
                                              <label
                                                className='custom-control-label ms-1'
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
                                  {/* <div className="row intervalType-row4 mt-3">
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
                                  </div> */}
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    type='button'
                                    className='intervalCloseBtn'
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='primary'
                                    onClick={handleSave}
                                  >
                                    Save
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            )}
                            {/* Monthly Interval Modal */}
                            {intervalState.intervalType === "Monthly" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                                role='dialog'
                                aria-labelledby='monthly-modal-title'
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id='monthly-modal-title'>
                                    Monthly Interval Type
                                  </Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                  {/* Repeat Every Section */}
                                  <div className='row intervalType-row1'>
                                    <div className='col-sm-6 d-flex align-items-center div-month'>
                                      <label
                                        htmlFor='monthlyRepeatEvery'
                                        className='mr-2'
                                      >
                                        Repeat for
                                      </label>
                                      <input
                                        id='monthlyRepeatEvery'
                                        type='number'
                                        className='form-control repeat-every-value'
                                        aria-label='Repeat every months'
                                        style={{ width: "30%" }}
                                        name='repeatEvery'
                                        value={intervalState.repeatEvery}
                                        onChange={handleInputChange}
                                      />
                                      <label>Month(s)</label>
                                    </div>
                                  </div>

                                  {/* Monthly Options - On Day or On The */}
                                  <fieldset className='row intervalType-row2 mt-3'>
                                    <legend className='sr-only'>
                                      Select Monthly Option
                                    </legend>

                                    {/* On Day Option */}
                                    {/* <div className="col-sm-5 d-flex align-items-center">
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
                                    </div> */}

                                    {/* On The Option */}
                                    <div className='d-flex align-items-center'>
                                      <input
                                        type='radio'
                                        id='onThe'
                                        name='monthlyOption'
                                        className='onday-radio'
                                        aria-labelledby='onTheLabel'
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
                                        id='onTheLabel'
                                        htmlFor='onThe'
                                        className='ml-2 ms-2'
                                      >
                                        On the
                                      </label>

                                      <div className='dropdown-wrapper ml-2 d-flex dropdown-month'>
                                        <select
                                          name='monthlyOccurrence'
                                          className='custom-select ml-2'
                                          aria-label='Select occurrence of the month'
                                          value={
                                            intervalState.monthlyOccurrence
                                          }
                                          onChange={handleInputChange}
                                          disabled={
                                            intervalState.monthlyOption !==
                                            "onThe"
                                          } // 🔐 disable when not active
                                        >
                                          <option value=''>Select value</option>
                                          <option value='First'>First</option>
                                          <option value='Second'>Second</option>
                                          <option value='Third'>Third</option>
                                          <option value='Fourth'>Fourth</option>
                                          <option value='Last'>Last</option>
                                        </select>

                                        <select
                                          name='monthlyWeekDay'
                                          className='custom-select ml-2 mr-2'
                                          aria-label='Select day of the week'
                                          value={intervalState.monthlyWeekDay}
                                          onChange={handleInputChange}
                                          disabled={
                                            intervalState.monthlyOption !==
                                            "onThe"
                                          } // 🔐 disable when not active
                                        >
                                          <option value=''>Select value</option>
                                          <option value='Mon'>Monday</option>
                                          <option value='Tue'>Tuesday</option>
                                          <option value='Wed'>Wednesday</option>
                                          <option value='Thu'>Thursday</option>
                                          <option value='Fri'>Friday</option>
                                          <option value='Sat'>Saturday</option>
                                          <option value='Sun'>Sunday</option>
                                        </select>
                                      </div>
                                    </div>
                                  </fieldset>

                                  {/* End Date Section */}
                                  {/* <div className="row intervalType-row3 mt-3">
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
                                  </div> */}

                                  {/* Summary Section */}
                                  <div className='row intervalType-row4 mt-3'>
                                    <div className='col text-center'>
                                      <p>
                                        Occurs every month on the
                                        {intervalState.monthlyOccurrence ? (
                                          <> &nbsp;</>
                                        ) : (
                                          <></>
                                        )}
                                        <strong>
                                          {intervalState.monthlyOccurrence}
                                        </strong>
                                        {intervalState.monthlyOccurrence ? (
                                          <> &nbsp;</>
                                        ) : (
                                          <></>
                                        )}
                                        <strong>
                                          {DAY_LABEL_MAP[
                                            intervalState.monthlyWeekDay
                                          ] || intervalState.monthlyWeekDay}
                                        </strong>
                                        {intervalState.monthlyWeekDay ? (
                                          <> &nbsp;</>
                                        ) : (
                                          <></>
                                        )}{" "}
                                        starting<br></br>
                                        <span>{startDate}</span>
                                      </p>
                                    </div>
                                  </div>
                                </Modal.Body>

                                <Modal.Footer>
                                  <Button
                                    type='button'
                                    className='intervalCloseBtn'
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='primary'
                                    onClick={handleSave}
                                  >
                                    Save
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            )}
                            {/* Random Interval Modal */}
                            {intervalState.intervalType === "Random" && (
                              <Modal
                                show={isIntervalTypeModalVisible}
                                onHide={closeIntervalTypeModal}
                                backdrop={false}
                                keyboard={true}
                                role='dialog'
                                aria-labelledby='Random-modal-title'
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title id='Random-modal-title'>
                                    Random Interval Type
                                  </Modal.Title>
                                </Modal.Header>

                                <Modal.Body className='pt-3'>
                                  <div className='container'>
                                    <h5 className='text-center'>
                                      Random Date Selection
                                    </h5>
                                    <div className='d-flex mt-3'>
                                      <div style={{ width: "60%" }}>
                                        <CustomCalendar
                                          selectedDates={
                                            intervalState.selectedDates
                                          }
                                          setSelectedDates={updateSelectedDates}
                                          aria-label='Custom Calendar for selecting dates'
                                        />
                                      </div>
                                      <div
                                        className='ms-3 border p-3 rounded shadow-sm d-flex flex-column'
                                        style={{ width: "40%" }}
                                      >
                                        <h6 className='text-center'>
                                          Selected Dates
                                        </h6>
                                        <textarea
                                          className='form-control flex-grow-1'
                                          style={{ maxHeight: "12em" }}
                                          rows='10'
                                          readOnly
                                          aria-label='Selected dates list'
                                          value={intervalState.selectedDates.join(
                                            "\n",
                                          )}
                                        />
                                        <button
                                          type='button'
                                          className='btn btn-danger mt-2 w-100'
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
                                    type='button'
                                    className='intervalCloseBtn'
                                    onClick={handleClose}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='primary'
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
                      <Col md={3} sm={6} xs={12} className='col-3'>
                        <div className='showConflict mt-4'>
                          <div className='d-flex align-items-center'>
                            <input
                              className='checkBox m-2'
                              type='checkbox'
                              checked={showConflicts}
                              onChange={(e) =>
                                setShowConflicts(e.target.checked)
                              }
                              aria-label='Conflicts'
                              style={{ height: "20px" }}
                            />
                            <div className='conflict ml-2'>Show Conflicts</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {intervalNote && (
                      <Row className='mt-2'>
                        <Col xs={12}>
                          <div className='schedule_note'>{intervalNote}</div>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='scheduleSearch-body'>
          <div className='accordion-item'>
            <button
              type='button'
              className='accordion-item-btn'
              onClick={handleClick2}
            >
              <div className='section-1'>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={Profile} alt='Profile' />
                  </div>
                  <div className='title'>People</div>
                </div>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={UserCalender} alt='UserCalender' />
                  </div>
                  <div className='title'>User Calender</div>
                </div>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={ContactCalender} alt='Contact Calender' />
                  </div>
                  <div className='title'>Contact Calender</div>
                </div>
                <div className='button'>
                  {isOpen2 ? (
                    <img src={Up} alt='icon' />
                  ) : (
                    <img src={Down} alt='icon' />
                  )}
                </div>
              </div>
            </button>
            {isOpen2 && (
              <div className='section-2'>
                <div className='accordion-body'>
                  <div className='calender-setup'>
                    <Row>
                      <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                        <div className='content'>
                          <div className='title'>Choose field to Search</div>
                          <div className='dropdown-wrapper'>
                            <select
                              name='days'
                              id='people_input_Select'
                              aria-label='people  Select input'
                              className='custom-select'
                            >
                              <option value=''>select value</option>
                              <option value='1'>Owner</option>
                              <option value='2'>Scheduler</option>
                              <option value='3'>Customer</option>
                              <option value='4'>Contact</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} sm={6} xs={12} className='col-3'>
                        <div className='seletedFeild'>
                          <label>Search key word</label>
                          <div className='selectedSearchField'>
                            <input
                              type='text'
                              id='people_input_Search'
                              aria-label='people  Search input'
                              placeholder='Enter Search key word'
                              className='form-control'
                            />
                            <img
                              src={SearchIcon}
                              alt='Search Icon'
                              className='search-icon'
                              onClick={handleClickPeopleSearch}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col md={2} sm={6} xs={12} className='col-2'>
                        <div className='edit pt-4 text-center'>
                          <img
                            src={Edit}
                            alt='edit'
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
                      <Col md={2} sm={6} xs={12} className='col-2'>
                        <div className='add pt-4 '>
                          <img
                            src={Add}
                            alt='Add'
                            style={{
                              marginRight: "10px",
                              verticalAlign: "middle",
                            }}
                          />
                          <p style={{ display: "inline-block" }}>Add</p>
                        </div>
                      </Col>
                    </Row>
                    <div className='selectedField-header'>
                      <p>Selected Fields</p>
                    </div>
                    <div className='selectedField-dropdown'>
                      <Row>
                        <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                          <div className='selectedField-value'>
                            <div className='title'>Owner</div>
                            <InfiniteDropdown
                              id='Owner'
                              options={owner}
                              selectedValue={
                                owner.find((o) => o.id === ownerID)
                                  ? [owner.find((o) => o.id === ownerID)]
                                  : []
                              }
                              onChange={(selectedOption) => {
                                handleOwnerChange(selectedOption);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                          <div className='selectedField-value'>
                            <div className='title'>Scheduler</div>
                            <div className='dropdown'>
                              <InfiniteDropdown
                                id='Scheduler'
                                options={schedulerOptions}
                                selectedValue={selectedScheduler}
                                onChange={(selectedOption) =>
                                  dispatch(
                                    setSelectedSchedulerF([selectedOption]),
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                          <div className='selectedField-value'>
                            <div className='title'>Customer</div>
                            <div className='dropdown'>
                              <InfiniteDropdown
                                id='Customer'
                                options={customerOptions}
                                selectedValue={selectedCustomer}
                                onChange={handleCustomerClick}
                              />
                            </div>
                          </div>
                        </Col>
                        {/* //434 */}
                        <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                          <div className='selectedField-value'>
                            <div className='title'>Contact</div>
                            <div className='dropdown'>
                              <InfiniteDropdown
                                id='Contact'
                                options={contactOptions}
                                selectedValue={selectedContact}
                                onChange={(selectedOption) =>
                                  dispatch(
                                    setSelectedContactF([selectedOption]),
                                  )
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
        <div className='scheduleSearch-body'>
          <div className='accordion-item'>
            <button
              type='button'
              className='accordion-item-btn'
              onClick={handleClick3}
            >
              <div className='section-1'>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={Location} alt='Location' />
                  </div>
                  <div className='title'>Location</div>
                </div>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={MonthView} alt='MonthView' />
                  </div>
                  <div className='title'>Month View</div>
                </div>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={DayView} alt='DayView' />
                  </div>
                  <div className='title'>Day View</div>
                </div>
                <div className='title-icon'>
                  <div className='icon-t'>
                    <img src={TimeView} alt='TimeView' />
                  </div>
                  <div className='title'>Time View</div>
                </div>
                <div className='button'>
                  {isOpen3 ? (
                    <img src={Up} alt='icon' />
                  ) : (
                    <img src={Down} alt='icon' />
                  )}
                </div>
              </div>
            </button>
            {isOpen3 && (
              <div className='section-2'>
                <div className='accordion-body'>
                  <div className='calender-setup'>
                    <Row>
                      <Col
                        xs={12}
                        md={3}
                        sm={6}
                        className=' col-3 mr-3 d-flex justify-content-center align-items-center'
                      >
                        <div className='location-radio-btn d-flex flex-wrap '>
                          <p className='list mr-3 mb-2'>Location Type :</p>
                          {radiobtn
                            .filter((item) => item.enable === 1)
                            .map((item, index) => (
                              <div
                                key={item.id}
                                className='list mr-3 mb-2 mt-1'
                              >
                                <input
                                  type='radio'
                                  id={item.value}
                                  name='locationType'
                                  aria-label='locationType'
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
                      <Col xs={12} sm={4}></Col>
                      <Col xs={12} sm={4} className='col-4'>
                        <div className='edit-add p-4'>
                          <div className='edit'>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={handleLocationFilterClick}
                              className='handleLocationFilter'
                            >
                              <img
                                src={Filter}
                                alt='Filter'
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
                        size='lg'
                        aria-labelledby='contained-modal-title-vcenter'
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id='contained-modal-title-vcenter'>
                            Location Filters
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className='row'>
                            {/* Dynamic Dropdowns */}
                            <div className='col-md-6'>
                              {locationFilters.levels.map((level) => (
                                <div
                                  className='row mb-3 filtersrow'
                                  key={level.id}
                                >
                                  <div className='col-3'>
                                    <label className='title'>
                                      {level.label}:
                                    </label>
                                  </div>
                                  <div className='col-9'>
                                    <div className='dropdown'>
                                      <InfiniteDropdown
                                        id={level.label}
                                        options={level.options}
                                        selectedValue={level.selectedValue}
                                        onChange={(selectedOption) =>
                                          handleSelectChange(
                                            selectedOption,
                                            level.id,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className='col-md-6'>
                              <div className='row mb-3 filtersrow'>
                                <div className='col-3'>
                                  <label className='title'>Capacity:</label>
                                </div>
                                <div className='col-9'>
                                  <input
                                    type='number'
                                    className='form-control'
                                    aria-label='Capacity'
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

                              <div className='row mb-3 filtersrow'>
                                <div className='col-3'>
                                  <label className='title'>Handicap:</label>
                                </div>
                                <div className='col-9'>
                                  <div className='dropdown'>
                                    <select
                                      name='handicap'
                                      className='custom-select'
                                      aria-label='handicap'
                                      value={locationFilters.LFHandicap}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setlocationFilters((prevFilters) => ({
                                          ...prevFilters,
                                          LFHandicap: value,
                                        }));
                                      }}
                                    >
                                      <option value=''>Select value</option>
                                      <option value='0'>NA</option>
                                      <option value='1'>Yes</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className='row mb-3 filtersrow'>
                                <div className='col-3'>
                                  <label className='title'>Amenities:</label>
                                </div>
                                <div className='col-9'>
                                  <div className='dropdown'>
                                    <InfiniteDropdown
                                      id='Amenities'
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
                                                  : amenity,
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
                            type='button'
                            className='filter-reset-btn'
                            onClick={handleResetLocationFilterModal}
                          >
                            Reset
                          </Button>
                          <Button
                            type='button'
                            className='filter-close-btn'
                            onClick={handleCloseLocationFilterModal}
                          >
                            Close
                          </Button>
                          <Button
                            type='button'
                            className='filter-apply-btn'
                            onClick={handleApplyLocationFilterModal}
                          >
                            Apply
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Row>
                    <Row>
                      <Col md={3} sm={6} xs={12} className='col-3 mb-3'>
                        <div className='content'>
                          <div className='title'>Choose field to Search</div>
                          <div className='dropdown-wrapper'>
                            <select
                              name='days'
                              className='custom-select'
                              id='location_input_Select'
                              aria-label='location Select input'
                              onChange={(e) => handelLocationSearchDropDown(e)}
                            >
                              {locationData.length !== 0 && (
                                <option value='0'>Defalt</option>
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
                      <Col xs={12} sm={4} className='col-4 mb-3'>
                        <div className='seletedFeild'>
                          <label>Search key word</label>
                          <div className='selectedSearchField'>
                            <input
                              type='text'
                              id='location_input_Search'
                              aria-label='location Search input'
                              placeholder='Enter Search key word'
                              className='form-control'
                            />
                            <img
                              src={SearchIcon}
                              alt='Search Icon'
                              className='search-icon'
                              onClick={handleClickLocationSearch}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} className='col-4'>
                        <div className='content'>
                          <div className='title'>Search scope</div>
                          <div className='dropdown-wrapper'>
                            <select
                              name='days'
                              className='custom-select w-75 '
                              id='search_scope_select'
                              aria-label='search scope select'
                              onChange={(e) =>
                                dispatch(setSearchScope(e.target.value))
                              }
                            >
                              {locationData.length !== 0 && (
                                <option value='0'>Defalt</option>
                              )}
                              {/* Dynamic scopes with sequential values */}
                              {locationData.map((location, index) => (
                                <option key={location.id} value={index + 1}>
                                  {location.value}
                                </option>
                              ))}
                              {/* {locationData.map((location) => (
                                <option key={location.id} value={location.id}>
                                  {location.value}
                                </option>
                              ))} */}
                            </select>
                          </div>
                        </div>
                        {/* <div className="edit-add p-4">
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
                        </div> */}
                      </Col>
                    </Row>
                    <div className='selectedField-header'>
                      <p>Selected Fields</p>
                    </div>
                    <div className='selectedField-dropdown'>
                      <Row>
                        {locationData.map((location) => (
                          <Col
                            xs={12}
                            md={3}
                            className='col-3 mb-3'
                            key={location.id}
                          >
                            <div className='selectedField-value'>
                              <div className='title'>{location.value}</div>
                              <div className='dropdown'>
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
      {scheduleError && (
        <div className='schedule_error' role='alert'>
          {scheduleError}
        </div>
      )}
      <div className='row scheduleSearch_5'>
        <div className='search-footer d-flex justify-content-end'>
          <div className='button'>
            <button type='button' className=' btn btn-clear'>
              Clear/Reset
            </button>
            <button
              type='button'
              className='btn-schedule btn'
              onClick={handleSearchClick}
            >
              Search
            </button>
            <button
              type='button'
              className='btn-schedule btn'
              onClick={handleScheduleClick}
              disabled={!showConflicts}
              style={{
                opacity: showConflicts ? 1 : 0.5,
                cursor: showConflicts ? "pointer" : "not-allowed",
              }}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
