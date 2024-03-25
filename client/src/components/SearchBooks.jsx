import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_BOOKS } from '../graphql/queries';
import { SAVE_BOOK } from '../utils/mutations';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { loading, error, data } = useQuery( SEARCH_BOOKS, {
    variables: { searchTerm },
    skip: !searchTerm,
  });

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.items);
      setSearchLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for books..."
      />
      <button onClick={handleSearch} disabled={searchLoading}>
        {searchLoading ? 'Searching...' : 'Search'}
      </button>
      <ul>
        {searchResults.map((book) => (
          <li key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBooks;
