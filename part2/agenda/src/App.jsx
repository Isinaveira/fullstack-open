import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      phone: '040-1234567'
    }
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const onNewName = (event) => {
    setNewName(event.target.value);
  }

  const onNewPhone = (event) => {
    setNewPhone(event.target.value);
  }

  const checkNewPerson = () => {
    return persons.some(p => p.name === newName);
  }
  const addPerson = (event) => {
    event.preventDefault();
    checkNewPerson() 
    ? window.alert(`${newName} is already added to phonebook`) 
      : setPersons([...persons, {name: newName, phone: newPhone}]);
    setNewName("");
    setNewPhone("");
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map((person, index) =>  {
          return <li key={index}>{person.name} {person.phone}</li>
        })}
      </div>
    </div>
  );
}

export default App
