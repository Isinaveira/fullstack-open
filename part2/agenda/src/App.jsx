import { useEffect, useState } from "react";
import phoneBookService from "./services/phoneBookService";

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
            <button onClick={() => props.deleteNumber(person.id)}>delete</button>
          </li>
        );
      })}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");

  //hook
  useEffect(() => {
    phoneBookService.getAllNumbers().then((persons) => {
      setPersons(persons);
    });
  }, []);

  //functions & handlers
  const onNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const onNewPhone = (event) => {
    setNewPhone(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const exist = () => {
      return persons.some(
        (p) => p.name.toLowerCase() === newName.toLowerCase(),
      );
    };

    if (exist()) {
      alert(`${newName} is already added to phonebook`);
      return;
    } else {
      
      phoneBookService.createNumber({ 
        name: newName, 
        number: newPhone 
      }).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewPhone("");
      })
    }
    setNewName("");
    setNewPhone("");
  };

  const deleteNumber = (id) => {
    const person = persons.find(p => p.id === id);

    if(window.confirm(`Delete ${person.name}`)){
      phoneBookService
        .deleteNumber(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  }

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
      <PersonsList 
        persons={peopleToShow} 
        deleteNumber={deleteNumber}
      />
    </div>
  );
};

export default App;
