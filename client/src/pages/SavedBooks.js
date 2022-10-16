import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// import useMutation and useQuery hook
import { useMutation, useQuery } from '@apollo/client'
// import REMOVE_BOOK mutation
import { REMOVE_BOOK } from '../utils/mutations'
// import GET_ME query
import { GET_ME } from '../utils/queries'


const SavedBooks = () => {
  // destructure data and loading boolean from GET_ME graphql query
  const { data, loading } = useQuery(GET_ME)

  // define userData as a variable that can be changed
  let userData

  if(data) {
    // if data exists, change userData value to data.me
    userData = data.me
  } else {
    // if data does not exist, make userData an empty object
    userData = {}
  }

  // destructure removeBook function from REMOVE_BOOK graphql mutation
  const [removeBook] = useMutation(REMOVE_BOOK)

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) return false

    try {
      const { data } = await removeBook({ variables: { bookId } })

      if (data == null) throw new Error('something went wrong!')

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // this is the loading screen, when loading is true, this h2 element will be returned
  if (loading) return <h2>LOADING...</h2>

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;