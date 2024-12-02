import { useState, useEffect } from 'react';
import SearchField from './SearchField';
import PersonForm from './PersonForm';
import PersonField from './PersonField';
import peopleService from './services/people';
import Notification from './notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [classN, setClassN] = useState(null);

  const handleDeleteClick = (id) => {
    const personToDelete = persons.find((person) => id === person.id);
    if (window.confirm(`Delete ${personToDelete.name}`)) {
      const person = persons.filter((person) => {
        return person.id !== id;
      });
      peopleService.deletePerson(id);
      setPersons(person);
    }
  };

  useEffect(() => {
    peopleService.getAll().then((initalPeople) => setPersons(initalPeople));
  }, []);

  const peopleToShow = showAll
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  const handleButtonClick = (event) => {
    event.preventDefault();

    const foundDuplicate = persons.find((person) => {
      return newName === person.name;
    });

    if (!foundDuplicate && newName !== '' && number != '') {
      const newPerson = {
        name: newName,
        number: number,
      };
      peopleService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setClassN('success');
        setNewName('');
        setNumber('');
      });
    }

    if (foundDuplicate.number != number) {
      const updatedPerson = { ...foundDuplicate, number: number };
      peopleService
        .update(updatedPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setMessage(
            `Updated ${returnedPerson.name}'s Phone Number to ${returnedPerson.number}`
          );
          setClassN('success');

          setTimeout(() => {
            setMessage(null);
            setClassN(null);
          }, 5000);
          setPersons(
            persons.map((p) => (p.id === updatedPerson.id ? returnedPerson : p))
          );
          setNewName('');
          setNumber('');
        })
        .catch(
          setMessage(
            `Information of ${updatedPerson.name} has already been removed from the server`
          ),
          setClassN('error'),
          setTimeout(() => {
            setMessage(null);
          }, 5000)
        );
    }
  };

  const handleFormChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={message}
        classN={classN}
      />

      <SearchField
        persons={persons}
        showAll={showAll}
        setShowAll={setShowAll}
        filter={filter}
        setFilter={setFilter}
      />
      <h1>Add A New</h1>
      <PersonForm
        name={'name:'}
        onChange={handleFormChange}
        value={newName}
      />
      <PersonForm
        name={'number:'}
        onChange={handleNumberChange}
        value={number}
      />

      <button
        onClick={handleButtonClick}
        type="submit">
        add
      </button>

      <h2>Numbers</h2>

      <PersonField
        persons={peopleToShow}
        handleDeleteClick={handleDeleteClick}
      />
    </div>
  );
};

export default App;
