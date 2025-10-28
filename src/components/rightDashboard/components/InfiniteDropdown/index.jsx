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
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f8f8f8",
      color: "#000",
      border: state.isFocused ? "1px solid #000" : "1px solid #222",
      boxShadow: state.isFocused ? "0 0 6px #000" : "none",
      "&:hover": {
        border: "2px solid #005fcc",
      },
      minHeight: "40px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      border: "2px solid #222",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
      minWidth: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#005fcc"
        : state.isFocused
        ? "#b3d7ff"
        : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#000",
      "&:hover": {
        backgroundColor: "#b3d7ff",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#444",
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
    <Select
      inputId={id}
      options={visibleData}
      value={selectedValue}
      onChange={onChange}
      onInputChange={handleInputChange}
      styles={customStyles}
      aria-live="polite"
      aria-label="Infinite scrolling dropdown"
      aria-expanded={Boolean(visibleData.length)}
      aria-haspopup="listbox"
      components={{
        MenuList: (props) => {
          const { innerRef, children } = props; // ✅ only use what’s safe
          return (
            <div
              ref={(ref) => {
                menuListRef.current = ref;
                innerRef?.(ref);
              }}
              onScroll={handleMenuScroll}
              style={{ height: "200px", overflowY: "auto" }}
              role="listbox"
              aria-label="Dropdown menu with infinite scrolling"
              aria-activedescendant={selectedValue?.value || ""}
              tabIndex={0}
            >
              {children}
            </div>
          );
        },
      }}
    />
  );
};

export default InfiniteDropdown;
