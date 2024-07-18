import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const InfiniteDropdown = ({ options, selectedValue, onChange }) => {
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
    const bottom = menuList.scrollHeight - menuList.scrollTop === menuList.clientHeight;

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
      height: '300px',
      overflowY: 'auto',
    }),
  };

  const handleInputChange = (inputValue) => {
    if (inputValue) {
      const newFilteredOptions = options.filter(option =>
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
        options={visibleData}
        value={selectedValue}
        onChange={onChange}
        onInputChange={handleInputChange}
        styles={customStyles}
        components={{
          MenuList: (props) => (
            <div
              {...props}
              ref={(ref) => {
                menuListRef.current = ref;
                props.innerRef(ref);
              }}
              onScroll={handleMenuScroll}
              style={{ height: '300px', overflowY: 'auto' }}
            ></div>
          ),
        }}
      />
    </div>
  );
};

export default InfiniteDropdown;
