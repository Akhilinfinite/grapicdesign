import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";

const InfiniteDropdown = ({ id, options, selectedValue, onChange }) => {
  const [visibleData, setVisibleData] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [offset, setOffset] = useState(0);
  const menuListRef = useRef(null);
  const batchSize = 100;
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    setVisibleData(options.slice(0, batchSize));
    setFilteredOptions(options);
    setOffset(batchSize);
  }, [options, batchSize]);

  const loadMoreData = () => {
    if (offset < filteredOptions.length) {
      const newOffset = offset + batchSize;
      const newData = filteredOptions.slice(offset, newOffset);
      setVisibleData((prevData) => [...prevData, ...newData]);
      setOffset(newOffset);
    }
  };

  const handleMenuScroll = (event) => {
    const menuList = event.target;
    const bottom =
      menuList.scrollHeight - menuList.scrollTop === menuList.clientHeight;

    if (bottom) {
      scrollPositionRef.current = menuList.scrollTop;
      loadMoreData();
    }
  };

  useEffect(() => {
    if (menuListRef.current) {
      menuListRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [visibleData]);

  const customStyles = {
    menuList: (provided) => ({
      ...provided,
      height: "200px",
      overflowY: "auto",
      backgroundColor: "#FFFFFF", // High contrast background
      fontWeight: "bold",
    }),
    control: (provided) => ({
      ...provided,
      color: "#2B2B2B", // Darker text for better contrast
      fontWeight: "bold",
      backgroundColor: "#FFFFFF", // Ensure contrast against border
      border: "2px solid #000000", // Strong black border for highest contrast
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#2B2B2B", // Ensure selected text is readable
      fontWeight: "bold",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#2B2B2B", // Ensures placeholder text has enough contrast
    }),
  };

  const handleInputChange = (inputValue) => {
    if (inputValue) {
      const newFilteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(newFilteredOptions);
      setVisibleData(newFilteredOptions.slice(0, batchSize));
      setOffset(batchSize);
    } else {
      setFilteredOptions(options);
      setVisibleData(options.slice(0, batchSize));
      setOffset(batchSize);
    }
  };

  return (
    <div className="dropdown">
      <Select
        inputId={id}
        options={visibleData}
        value={selectedValue}
        onChange={onChange}
        onInputChange={handleInputChange}
        styles={customStyles}
        aria-live="polite"
        aria-label="Infinite scrolling dropdown"
        components={{
          MenuList: (props) => (
            <div
              {...props}
              ref={(ref) => {
                menuListRef.current = ref;
                props.innerRef(ref);
              }}
              onScroll={handleMenuScroll}
              style={{ height: "200px", overflowY: "auto" }}
              role="listbox"
              aria-label="Dropdown menu with infinite scrolling"
            ></div>
          ),
        }}
      />
    </div>
  );
};

export default InfiniteDropdown;
