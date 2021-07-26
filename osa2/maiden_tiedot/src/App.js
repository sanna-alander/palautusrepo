import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ newFilter, handleFilter }) => {
  return (
    <div>
      find countries<input 
        value={newFilter}
        onChange={handleFilter}/>
    </div>
  )
}

const Country = ({ country, handleClick, buttonClicked }) => {
  if (buttonClicked) {
    return (
      <div>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p> 
        <p>population {country.population}</p>
        <h2>languages</h2>
        <ul>
          {country.languages.map(lang =>
            <li key={lang.name}>{lang.name}</li>
          )}
        </ul>
        <img src={country.flag} alt={country.name} width="350" height="200"></img>
      </div>
    )
  }
  return (
    <div key={country.name}>
      {country.name}<button type="button" onClick={handleClick}>show</button>
    </div>
  )
}

const Countries = ({ countriesToShow}) => {
  const oneCountry = countriesToShow[0]
  const [ buttonClicked, setClicked ] = useState(false)

  const handleClick = () => {
    setClicked(true)
  }

  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length === 1) {
    return (
      <div>
        <h1>{oneCountry.name}</h1>
        <p>capital {oneCountry.capital}</p> 
        <p>population {oneCountry.population}</p>
        <h2>languages</h2>
        <ul>
          {oneCountry.languages.map(lang =>
            <li key={lang.name}>{lang.name}</li>
          )}
        </ul>
        <img src={oneCountry.flag} alt={oneCountry.name} width="350" height="200"></img>
      </div>
    )
  }
  
  return (
      <ul>
        {countriesToShow.map(country =>
          <Country key={country.name} country={country} handleClick={handleClick} buttonClicked={buttonClicked} />
        )}
      </ul>
  )
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ newFilter, setFilter ] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = countries.filter(
    country => country.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <Countries countriesToShow={countriesToShow} />
    </div>
  );
}

export default App;
