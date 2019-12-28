const app = require('express')();
const Fuse = require('fuse.js');

const books = require('./books.js');

const fuseOptions = {
  keys: ['edition', 'briefDescription', 'primaryCategory', 'title', 'attribution', 'description', 'publisher'],
  shouldSort: true,
  threshold: 0.4,
  distance: 40,
};

const PAGE_SIZE = 50;

const pageSizeMiddleware = (req, res, next) => {
  const count = Number.parseInt(req.query.count, 10) || PAGE_SIZE;
  if (count < 0 || count > PAGE_SIZE) {
    return res.status(400).json({
      info: {},
      status: {
        statusMsg: `Value of count must be a positive integer less than ${PAGE_SIZE}; got '${count}'.`,
        statusCode: 'InvalidRequest',
      },
      result: null,
    });
  }
  req.count = count
  next();
};

app.use('*', (_, res, next) => res.set('Content-Type', 'application/json') && next());

app.get('/api/books', pageSizeMiddleware, (req, res) => {
  const start = Number.parseInt(req.query.start, 10) || 0;
  const end = start + req.count;
  let bookData = books.data;
  if (req.query.search) {
    const fuse = new Fuse(bookData, fuseOptions);
    bookData = fuse.search(req.query.search);
  }
  const result = bookData.slice(start, end);
  const moreResults = end < bookData.length;

  return res.json({
    info: {
      paging: {
        count: result.length,
        total: books.data.length,
        pageNext: moreResults ? end : undefined,
        moreResults,
      },
    },
    status: {
      statusMsg: 'Ok',
      statusCode: 'HTTPOk',
    },
    result,
  });
});

app.get('/api/books/:id', (req, res) => {
  const result = books.data.find(book => book.id === req.params.id);
  if (typeof result === 'undefined') {
    return res
      .status(404)
      .end()
      .json({
        info: {},
        status: {
          statusMsg: `Unable to find book with id of '${req.params.id}'.`,
          statusDetails: {},
          statusCode: 'NotFound',
        },
        result: null,
      });
  }
  return res.json({
    info: {},
    status: {
      statusMsg: 'Ok',
      statusDetails: {},
      statusCode: 'HTTPOk',
    },
    result,
  });
});

app.get('/api/books-by/:key/:value', pageSizeMiddleware, (req, res) => {
  const bookData = books.data.filter(book => book[req.params.key] === req.params.value);
  const start = Number.parseInt(req.query.start, 10) || 0;
  const end = start + req.count;
  const result = bookData.slice(start, end);
  res.json({
    info: {},
    status: {
      statusMsg: 'Ok',
      statusDetails: {},
      statusCode: 'HTTPOk',
    },
    result,
  });
});

app.use('*', () => res.status(404).end());

app.listen(4000, () => {
  console.log('Server is running');
});
