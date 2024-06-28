class BookShelf {
  constructor() {
    this.favoriteBooks = [];
  }

  addFavoriteBook(bookName) {
    if (!String(bookName).includes(`Great`)) {
      this.favoriteBooks.push(bookName);
    }
  }

  printFavoriteBooks() {
    console.log(`Favorite books: ${String(this.favoriteBooks.length)}`);
    for (const favoriteBook of this.favoriteBooks) {
      console.log(favoriteBook);
    }
  }
}

function loadBooks(bookShelfInstance) {
  fakeAjax(`https://some.url/api`, function onBooksFetched(books) {
    for (const book of books) {
      bookShelfInstance.addFavoriteBook(book);
    }
    bookShelfInstance.printFavoriteBooks();
  });
}

function fakeAjax(url, cb) {
  setTimeout(function onTimeoutComplete() {
    return cb([
      `A Song of Ice and Fire`,
      `The Great Gatsby`,
      `Crime & Punishment`,
      `Great Expectations`,
      `You Don't Know JS`,
    ]);
  }, 500);
}

const bookShelf = new BookShelf();
loadBooks(bookShelf);
