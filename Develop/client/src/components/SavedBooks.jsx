import React from 'react';

const SavedBooks = ({ savedBooks }) => {
  return (
    <div>
      <h2>Saved Books</h2>
      <ul>
        {savedBooks.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedBooks;