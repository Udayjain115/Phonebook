import React from 'react';

const PersonField = ({ persons, handleDeleteClick }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <p key={person.name}>
            {person.name} {person.number}
            <button onClick={() => handleDeleteClick(person.id)}>Delete</button>
          </p>
        );
      })}
    </div>
  );
};

export default PersonField;
