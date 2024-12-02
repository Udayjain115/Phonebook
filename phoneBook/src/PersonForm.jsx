import React from 'react';

const PersonForm = ({ name, onChange, value }) => {
  return (
    <>
      <form>
        <div>
          {name}
          <input
            onChange={onChange}
            value={value}
          />
        </div>
      </form>
    </>
  );
};

export default PersonForm;
