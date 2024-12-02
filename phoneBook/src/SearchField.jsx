import React from 'react';

const SearchField = ({ setShowAll, filter, setFilter }) => {
  const handleFormChange = (event) => {
    setFilter(event.target.value);
    event.target.value ? setShowAll(false) : setShowAll(true);
  };
  return (
    <div>
      Filter Shown With:
      <input
        value={filter}
        onChange={handleFormChange}></input>
    </div>
  );
};

export default SearchField;
