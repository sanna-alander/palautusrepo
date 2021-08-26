import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ newFilter, handleFilter }) => {
  return (
    <div>
      filter shown with<input 
        value={newFilter}
        onChange={handleFilter}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input 
          value={props.newName}
          onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input 
          value={props.newNumber}
          onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ personsToShow, setPersons, persons }) => {

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        setPersons(persons.filter(p => p.id !== id))
    }
  }
  
  return (
    <ul>
      {personsToShow.map(person =>
         <li key={person.name}> 
          {person.name} {person.number}
          <button type="button" onClick={
            () => removePerson(person.id, person.name)
          }>delete</button>
         </li>
      )}
    </ul>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setFilter ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    if (persons.some(p => p.name.includes(newName))) {
      if (window.confirm(`${newName} is already added in the phonebook. Do you want to replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedNote = { ...person, number: newNumber }
        const id = person.id
        
        personService.update(id, changedNote).then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response.data))
          setNewName('')
          setNewNumber('')
        }) 
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      personService
        .create(personObject)
        .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })  
    }
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  
  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Person personsToShow={personsToShow} setPersons={setPersons} persons={persons} />
    </div>
  )

}

export default App