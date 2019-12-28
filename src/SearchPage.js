import React from 'react';
import { Link } from 'react-router-dom';
import './SearchPage.css';

const getResults = async (searchValue, updateResults) => {
  if (searchValue === '') return updateResults(null);
  const response = await fetch('/api/books?search=' + searchValue).then(res => res.json());
  updateResults(response.result);
};

const SearchPage = () => {
  const [results, updateResults] = React.useState(null);
  return (
    <form className="autocomplete">
      <input
        placeholder="Search Books"
        onChange={({ target: { value } }) => getResults(value, updateResults)}
        type="text"
        autoFocus
      />
      <ul className="autocomplete-suggestions">
        {results &&
          results.map(result => (
            <li key={result.id}>
              <Link to={`/${result.id}`}>
                {result.title} - {result.attribution}
              </Link>
            </li>
          ))}
      </ul>
    </form>
  );
};

export default SearchPage;
