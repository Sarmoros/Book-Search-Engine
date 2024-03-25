import { gql } from '@apollo/client';

export const SEARCH_BOOKS = gql`
 query SearchBooks($searchTerm: String!) {
    searchBooks(searchTerm: $searchTerm) {
      id
      title
      authors
      description
      image
      link
    }
 }
`;
