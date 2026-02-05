import { useState } from "react";

const Filter = (props) => {
  return (
    <div>
      filter shown with
      <input
        type="text"
        value={props.filter}
        onChange={props.handleFilterChange}
      />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.onNewName} />
      </div>
      <div>
        number: <input value={props.newPhone} onChange={props.onNewPhone} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const PersonsList = (props) => {
  return (
    <div>
      {props.persons.map((person) => {
        return (
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        );
      })}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");

  const onNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const onNewPhone = (event) => {
    setNewPhone(event.target.value);
  };

  const checkNewPerson = () => {
    return persons.some((p) => p.name.toLowerCase() === newName.toLowerCase());
  };
  const addPerson = (event) => {
    event.preventDefault();
    checkNewPerson()
      ? window.alert(`${newName} is already added to phonebook`)
      : setPersons([...persons, { name: newName, number: newPhone, id: persons.length + 1 }]);
    setNewName("");
    setNewPhone("");
  };

  const peopleToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h3>Add a new person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        onNewName={onNewName}
        newPhone={newPhone}
        onNewPhone={onNewPhone}
      />
      <h3>Numbers</h3>
      <PersonsList persons={peopleToShow} />
    </div>
  );
};

export default App;
