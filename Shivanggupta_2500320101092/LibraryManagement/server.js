
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initial book records
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Validate book data
function validateBook(book) {
    return (
        book &&
        typeof book.title === "string" &&
        book.title.trim() !== "" &&
        typeof book.author === "string" &&
        book.author.trim() !== "" &&
        typeof book.genre === "string" &&
        book.genre.trim() !== "" &&
        Number.isInteger(book.publishedYear) &&
        book.publishedYear > 0 &&
        typeof book.available === "boolean"
    );
}

// GET: Retrieve all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// POST: Add a new book
app.post("/api/books", (req, res) => {
    const newBook = req.body;

    if (!validateBook(newBook)) {
        return res.status(400).json({
            message: "Invalid book data. Check all required fields."
        });
    }

    const book = {
        id: books.length
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        genre: newBook.genre.trim(),
        publishedYear: newBook.publishedYear,
        available: newBook.available
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book
    });
});

// GET: Filter books by author
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (!author) {
        return res.status(400).json({
            message: "Please provide an author query parameter."
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

// GET: Retrieve a book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// PUT: Update a book
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data. Check all required fields."
        });
    }

    books[index] = {
        id,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        genre: req.body.genre.trim(),
        publishedYear: req.body.publishedYear,
        available: req.body.available
    };

    res.status(200).json({
        message: "Book updated successfully",
        book: books[index]
    });
});

// DELETE: Remove a book
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    next(err);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
