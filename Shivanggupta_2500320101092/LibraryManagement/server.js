
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
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
function validateBook(data) {
    return (
        data &&
        typeof data.title === "string" && data.title.trim() !== "" &&
        typeof data.author === "string" && data.author.trim() !== "" &&
        typeof data.genre === "string" && data.genre.trim() !== "" &&
        typeof data.publishedYear === "number" &&
        Number.isInteger(data.publishedYear) &&
        data.publishedYear > 0 &&
        typeof data.available === "boolean"
    );
}

// 1. GET ALL BOOKS
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// 2. POST - ADD NEW BOOK
app.post("/api/books", (req, res) => {
    const data = req.body;

    if (!validateBook(data)) {
        return res.status(400).json({
            message: "Invalid book data. Please provide all required fields."
        });
    }

    const newId = Math.max(100, ...books.map(book => book.id)) + 1;

    const newBook = {
        id: newId,
        title: data.title.trim(),
        author: data.author.trim(),
        genre: data.genre.trim(),
        publishedYear: data.publishedYear,
        available: data.available
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 3. FILTER BOOKS BY AUTHOR
// This route must come before /:id
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (typeof author !== "string" || author.trim() === "") {
        return res.status(400).json({
            message: "Author query parameter is required"
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase() === author.trim().toLowerCase()
    );

    res.status(200).json(filteredBooks);
});

// 4. GET BOOK BY ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!Number.isInteger(id) || !book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 5. PUT - UPDATE BOOK
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    books[index] = {
        id: id,
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

// 6. DELETE BOOK
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Handle invalid JSON bodies
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
    console.log(`Library API running at http://localhost:${PORT}`);
});
