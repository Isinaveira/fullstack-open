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

  const handleSubmit = (event) => {
    event.preventDefault();

    // Usamos .find() porque queremos EL objeto, no un array con el objeto
    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      // Si el nombre existe, preguntamos si queremos actualizar el número
      if (
        window.confirm(
          `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...existingPerson, number: newPhone };

        // Asumiendo que tu servicio updateNumber espera (id, objeto_nuevo)
        // Si tu servicio está hecho distinto, ajusta los argumentos.
        phoneBookService
          .updateNumber(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            // Aquí está la clave: Actualizamos el estado recorriendo el array
            // y reemplazando solo el que coincide con el ID.
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            setNewName("");
            setNewPhone("");
          })
          
      }
    } else {
      // Creación normal
      phoneBookService
        .createNumber({
          name: newName,
          number: newPhone,
        })
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewPhone("");
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
