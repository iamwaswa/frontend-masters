const favoriteBooks = [];

function addFavoriteBook(bookName) {
  if (!bookName.includes(`Great`)) {
    favoriteBooks.push(bookName);
  }
}

function printFavoriteBooks() {
  console.log(`Favorite books: ${favoriteBooks.length}`);
  for (const favoriteBook of favoriteBooks) {
    console.log(favoriteBook);
  }
}

addFavoriteBook(`Great Gatsby`);
printFavoriteBooks();
addFavoriteBook(`GreatGatsby`);
printFavoriteBooks();
addFavoriteBook(`GreatestGatsby`);
printFavoriteBooks();
addFavoriteBook(`Gatsby`);
printFavoriteBooks();
addFavoriteBook(`Greaatsby`);
printFavoriteBooks();
