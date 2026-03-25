import { useEffect, useState } from "react";
import phoneBookService from "./services/phoneBookService";
import './App.css'

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
    <form onSubmit={props.handleSubmit}>
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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  // Combina la clase base 'notification' con el tipo ('success' o 'error')
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");
  // CORRECCIÓN 1: Inicializar en null para que no aparezca al principio
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    phoneBookService.getAllNumbers().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const onNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const onNewPhone = (event) => {
    setNewPhone(event.target.value);
  };

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newPhone };

        phoneBookService
          .updateNumber(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setNewName("");
            setNewPhone("");
            // ÉXITO: Mensaje verde
            showNotification(`Updated ${returnedPerson.name}'s number`, 'success');
          })
          .catch(error => {
            // ERROR: Mensaje rojo (aquí es donde manejas el 404)
            showNotification(
              `Information of '${existingPerson.name}' has already been removed from server`,
              'error'
            );
            // Sincronizamos el estado local eliminando a la persona fantasma
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      phoneBookService
        .createNumber({ name: newName, number: newPhone })
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewPhone("");
          showNotification(`Added ${returnedPerson.name}`, 'success');
        })
        .catch(error => {
           showNotification(error.response.data.error, 'error');
        });
    }
  };

  const deleteNumber = (id) => {
    const person = persons.find(p => p.id === id);
    if(window.confirm(`Delete ${person.name}`)){
      phoneBookService
        .deleteNumber(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          showNotification(`Deleted ${person.name}`, 'success');
        })
        .catch(error => {
           showNotification(
              `Information of '${person.name}' has already been removed from server`,
              'error'
            );
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
      <Notification message={notificationMessage} type={notificationType} />
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h3>Add a new person</h3>
      <PersonForm
        handleSubmit={handleSubmit}
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