import React from 'react';

import './AutocompleteApp.css';

const getResults = async (searchValue, updateResults) => {
  if (searchValue === '') return updateResults(null)
  const response = await fetch('/api/books?search=' + searchValue).then(res=>res.json())
  updateResults(response.result)
}

const AutocompleteApp = () => {
  const [results, updateResults] = React.useState(null)
  return (
    <form className="autocomplete-app">
      <input placeholder="Search Books" onChange={({target:{value}})=>getResults(value, updateResults)} type="text" autoFocus />
      <ul className="autocomplete-suggestions">
        {results && results.map(result => <li key={result.id}>{result.title} - {result.attribution}</li>)}
      </ul>
    </form>
  );
}

export default AutocompleteApp