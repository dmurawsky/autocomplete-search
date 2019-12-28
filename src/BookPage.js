import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { format as currencyFormatter } from 'currency-formatter';

import './BookPage.css';

const getBook = async (bookId, updateBookData) => {
  const response = await fetch('/api/books/' + bookId).then(res => res.json());
  updateBookData(response.result);
  return response.result;
};

const getBooksBy = async (key, value, updateCallback) => {
  const response = await fetch(`/api/books-by/${key}/${value}?count=9`).then(res => res.json());
  updateCallback(response.result);
};

const BookPage = () => {
  const { id } = useParams();
  const [bookData, updateBookData] = React.useState(null);
  const [booksByPrimaryCategory, updateBooksByPrimaryCategory] = React.useState(null);
  React.useEffect(() => {
    getBook(id, updateBookData).then(book => {
      if (book.primaryCategory) {
        getBooksBy('primaryCategory', book.primaryCategory, updateBooksByPrimaryCategory);
      }
    });
  }, [id]);

  return (
    <div id="bookPage">
      <div id="backBtn">
        <Link to="/">Back to search</Link>
      </div>
      {bookData && (
        <div className="card">
          <div className="price">
            Book Price: {currencyFormatter(bookData.price, { code: 'USD' })}
            <br />
            <br />
            <small>Chapter Price: {currencyFormatter(bookData.chapterPrice, { code: 'USD' })}</small>
          </div>
          <h1>
            <a href={bookData.url} target="_blank" rel="noopener noreferrer">
              {bookData.title}
            </a>
            <br />
            <span className="subtitle">{bookData.subtitle}</span>
            <br />
            <span className="attribution"> By {bookData.attribution}</span>
            <br />
            <span className="published">
              Published {bookData.copyrightYear} by {bookData.publisher}
            </span>
          </h1>
          <img src={bookData.thumbnail} alt={`thumbnail for ${bookData.title}`} />
          <div className="description">{bookData.description}</div>
        </div>
      )}
      {bookData && bookData.primaryCategory && (
        <h3>
          Other Books from <strong>"{bookData.primaryCategory}"</strong>
        </h3>
      )}
      {booksByPrimaryCategory &&
        booksByPrimaryCategory
          .filter(book => book.id !== bookData.id)
          .map(book => (
            <div key={book.id} className="other-books">
              <Link to={`/${book.id}`}>
                <h1>{book.title}</h1>
              </Link>
              <img src={book.thumbnail} alt={`thumbnail for ${book.title}`} />
              <div className="price">{currencyFormatter(book.price, { code: 'USD' })}</div>
              <p className="attribution">By {book.attribution}</p>
            </div>
          ))}
    </div>
  );
};

export default BookPage;
