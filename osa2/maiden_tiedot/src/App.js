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

const Weather = ({ capital }) => {
  const [ weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('effect')
    const api_key = process.env.REACT_APP_API_KEY
    axios
      .get('http://api.weatherstack.com/current?access_key=' + api_key + '&query=' + capital)
      .then(response => {
        console.log('promise fulfilled')
        setWeather(response.data.current)
      })
  }, [])
  console.log(weather)
  const weatherInfo = weather ? (
    <div>
      <b>temperature:</b> {weather.temperature} Celsius<br/>
      <img src={weather.weather_icons[0]} alt='weather icon' width="100" height="100"></img><br/>
      <b>wind:</b> {weather.wind_speed} mph direction {weather.wind_dir}</div>
  ) : <div>loading...</div>
  return (
    <div>
      <h2>Weather in {capital}</h2>
      {weatherInfo}
    </div>
  )
}

const OneCountry = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      capital {country.capital}<br/>
      population {country.population}
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map(lang =>
          <li key={lang.name}>{lang.name}</li>
        )}
      </ul>
      <img src={country.flag} alt={country.name} width="350" height="200"></img>
      <Weather capital={country.capital} />
    </div>
  )
}

const Country = ({ country, handleClick }) => {
  return (
    <div key={country.name}>
      {country.name}<button type="button" onClick={handleClick}>show</button>
    </div>
  )
}

const Countries = ({ countriesToShow }) => {
  const [ oneCountry, setCountry ] = useState(null)

  const handleClick = (country) => {
    setCountry(country)
  }

  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length === 1) {
    return (
      <OneCountry country={countriesToShow[0]} />
    )
  } else if (oneCountry) {
    return (
      <OneCountry country={oneCountry} />
    )
  }
  return (
    <ul>
      {countriesToShow.map(country =>
        <Country key={country.name} country={country} handleClick={() => handleClick(country)} />
      )}
    </ul>
  )
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ newFilter, setFilter ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
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
