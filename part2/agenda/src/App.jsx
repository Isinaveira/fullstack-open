import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');


  const onNewName = (event) => {
    setNewName(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  } 


  const onNewPhone = (event) => {
    setNewPhone(event.target.value);
  }

  const checkNewPerson = () => {
    return persons.some(p => p.name.toLowerCase() === newName.toLowerCase());
  }
  const addPerson = (event) => {
    event.preventDefault();
    checkNewPerson() 
    ? window.alert(`${newName} is already added to phonebook`) 
      : setPersons([...persons, {name: newName, number: newPhone}]);
    setNewName("");
    setNewPhone("");
  }

  const peopleToShow = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input type="text" value={filter} onChange={handleFilterChange} />
      </div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={onNewName}/>
        </div>
        <div>
          number: <input value={newPhone} onChange={onNewPhone}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {peopleToShow.map((person, index) =>  {
          return <li key={index}>{person.name} {person.number}</li>
        })}
      </div>
    </div>
  );
}

export default App
