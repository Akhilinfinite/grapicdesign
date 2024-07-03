// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import data1 from "./data.json";
// import "./index.scss"; // Import the SCSS file

// export default function InfiniteDropdown() {
//   const [data, setData] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState([]);
//   const [visibleData, setVisibleData] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [load, setLoad] = useState(false);

//   const BATCH_SIZE = 900;

//   useEffect(() => {
//     // const fetchData = async () => {
//     //   try {
//     //     const response = await axios.post(
//     //       "http://192.168.0.65:8500/rest/gvRestApi/schedule/getCustomers/"
//     //     );
//     //     const data = response.data.DATA.map((e) => ({
//     //       id: e[0],
//     //       value: e[0],
//     //       label: e[1],
//     //     }));
//     //     const selected = data.filter((e) => e.id === 22);
//     //     setSelectedCustomer(selected);
//     //     const updatedData = data.filter((e) => e.id !== 22);
//     //     setData(updatedData);
//     //     setVisibleData(updatedData.slice(0, BATCH_SIZE));
//     //     setLoad(true);
//     //     setOffset(BATCH_SIZE);
//     //   } catch (error) {
//     //     console.error(error);
//     //   }
//     // };

//     setData(data1);
//     setVisibleData(data.slice(0, BATCH_SIZE));
//     setLoad(true);
//     setOffset(BATCH_SIZE);
//     // fetchData();
//   }, []);

//   const loadMoreData = () => {
//     if (offset < data.length) {
//       const newOffset = offset + BATCH_SIZE;
//       setVisibleData((prevData) => [
//         ...prevData,
//         ...data.slice(offset, newOffset),
//       ]);
//       setOffset(newOffset);
//       if (newOffset <= data.length) {
//         setLoad(false);
//       }
//     }
//   };

//   return (
//     <select>
//       {selectedCustomer.map((e) => (
//         <option key={e.id}>{e.label}</option>
//       ))}
//       {visibleData.map((e) => (
//         <option key={e.id}>{e.label}</option>
//       ))}
//       {load && (
//         <option>
//           <button onClick={loadMoreData}>Load more...</button>
//         </option>
//       )}
//     </select>
//   );
// }

import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

export default function InfiniteDropdown() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [visibleData, setVisibleData] = useState([]);
  const [offset, setOffset] = useState(0);
    const [data, setData] = useState([]);
  const BATCH_SIZE = 900;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.65:8500/rest/gvRestApi/schedule/getCustomers/"
        );
        const data = response.data.DATA.map((e) => ({
          id: e[0],
          value: e[0],
          label: e[1],
        }));
        const selected = data.filter((e) => e.id === 22);
        setSelectedCustomer(selected);
        const updatedData = data.filter((e) => e.id !== 22);
        setData(updatedData);
        setVisibleData(data.slice(0, BATCH_SIZE));
        setOffset(BATCH_SIZE);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (offset < data.length) {
      const newOffset = offset + BATCH_SIZE;
      setVisibleData((prevData) => [
        ...prevData,
        ...data.slice(offset, newOffset),
      ]);
      setOffset(newOffset);
    }
  };

  const customStyles = {
    menuList: (provided) => ({
      ...provided,
      height: "400px",
      overflowY: "auto",
    }),
  };

  const handleMenuScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      loadMoreData();
    }
  };

  return (
    <Select
      options={visibleData}
      value={selectedCustomer}
      onChange={setSelectedCustomer}
      styles={customStyles}
      onMenuScrollToBottom={handleMenuScroll}
    />
  );
}
