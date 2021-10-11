"use strict"

function createStyleSheet() {
	let styleSheet = document.createElement("style");
	styleSheet.type = 'text/css';
	styleSheet.innerText = "\
		html {\
			background-image: url('./images/background_wood.jpeg');\
		}\
		body {\
			padding: 20px;\
			}\		p {\
			font-size: 16px;\
			font-weight: normal;\
			height: 100px;\
			width:400px;\
			color: black;\
			padding: 10px;\
			}\
		.content {\
			display: flex;\
			align-items: flex-start;\
			justify-content: center;\
			flex-wrap: wrap;\
			padding: 20px;\
			}\
		#addBook {\
			text-align: center;\
			color: white;\
			background-color: green;\
			border-style: solid;\
			border-color: gray;\
			border-width: 1px;\
			border-radius: 10px;\
			width: 160px;\
			max-height: 44px;\
			font-size: 24px;\
			padding: 10px ;\
			cursor:pointer;\
			}\
		";
	document.head.appendChild(styleSheet);
}

/** Library: Array of books **/
var myLibrary = [];

function addBookToLibrary() {
	let title = prompt("title: ", "title");
	let author = prompt("author: ", "author");
	let numberOfPages = prompt("number of pages: ", "0");
	
	let book = new Book(title, author, numberOfPages)
	myLibrary.push(book);
	
	showBooksInLibrary();
	
	/*let contentElement = document.getElementsByClassName("content")[0];
	contentElement.appendChild( book.createCard() );*/
}

function removeBookFromLibrary(event) {

	// Buscar el antecedente de clase 'book'
	let bookDiv = event.currentTarget;
	while (! bookDiv.classList.contains("book")) {
		bookDiv = bookDiv.parentNode;
	}

	let bookId = bookDiv.dataset.id;
	
	myLibrary.forEach(function(book, index, myLibrary) {
			if (book.id == bookId) myLibrary.splice(index, 1);
		});
	
	showBooksInLibrary(myLibrary);
}

function markBookAsRead(event) {
	
	// Buscar el antecedente de clase 'book'
	let bookDiv = event.currentTarget;
	while (! bookDiv.classList.contains("book")) {
		bookDiv = bookDiv.parentNode;
	}

	let bookId = bookDiv.dataset.id;
	
	myLibrary.forEach(function(book, index, myLibrary) {
			if (book.id == bookId) book.notReadYet = ! book.notReadYet;
		});
	bookDiv.classList.toggle("notReadYet");
	 
	showBooksInLibrary(myLibrary);
}


function showBooksInLibrary() {
	let contentElement = document.getElementsByClassName("content")[0];
	
	// borrar todos los hijos actuales (elementos HTML de cada libro)
	contentElement.innerHTML = '';
	
	if (myLibrary.length == 0) {
		let libEmpty = document.createElement("p");
		libEmpty.innerText = "The Library Is Empty";
		libEmpty.style = "\
			padding: 0px;\
			text-align: center;\
			font-family: cursive;\
			font-size: 26px;\
			color: white;\
			margin: 0;\
		"
		contentElement.appendChild( libEmpty );
	} else {
		// volver a generar los hijos en funcion de la libreria
		for (let index in myLibrary) {
			contentElement.appendChild( myLibrary[index].createCard() );
		}
	}
}

/** Class Book **/
function Book(title, author, numberOfPages, notReadYet = true) {
	this.title = title;
	this.author = author;
	this.numberOfPages = numberOfPages;
	this.notReadYet = notReadYet;
	this.id = (Book.prototype.id++)
}

Book.prototype.id = 0;

Book.prototype.createCard = function() {
	let cardElement = document.createElement("div");
	cardElement.setAttribute("data-id", this.id);
	cardElement.className = "book";
	if (this.notReadYet) cardElement.classList.add("notReadYet");
	cardElement.style = "\
			display: flex;\
			flex-direction: column;\
			align.items: center;\
			justify-content: flex-start;\
			color: white;\
			font-size: 20px;\
			border-style: solid;\
			border-color: yellow;\
			border-width: 2px;\
			border-radius: 10px;\
			padding: 10px;\
			width: 250px;\
			height: 120px;\
			background-image: url('./images/background_white.jpeg');\
	"
	if (! this.notReadYet) {
		cardElement.style.color = "gray";
		cardElement.style.border = "1px solid black";
	}
	
	let titleDiv = document.createElement("div");
	let authorDiv = document.createElement("div");
	let numberOfPagesDiv = document.createElement("div");
	let notReadYetDiv = document.createElement("div");
	let idDiv = document.createElement("div");
	let buttonsDiv = document.createElement("div");
	
	titleDiv.innerText = "Title: " + this.title;
	authorDiv.innerText = "Author: " + this.author;
	numberOfPagesDiv.innerText = "Pages: " + this.numberOfPages;
	notReadYetDiv.innerText = this.notReadYet ? "Not read yet." : "Already read.";
	//idDiv.innerText = "Id: " + this.id;
	
	/* Buttons */
	buttonsDiv.className = "buttons";
	buttonsDiv.style = "\
			display: flex;\
			align-items: center;\
			justify-content: start-flex;\
			margin: 10px;\
			gap: 2px;\
			width: 250px;\
			height: 20px;\
	"
	
	/* Delete Button */
	let delButtonDiv = document.createElement("div");
	let delButtonText = document.createElement("p");
	
	delButtonText.id = "delButton";
	
	delButtonText.innerText = "Remove Book";

	delButtonDiv.style = "\
			display: flex;\
			align-items: center;\
			justify-content: center;\
			background-color: red;\
			border-style: solid;\
			border-color: gray;\
			border-width: 1px;\
			border-radius: 10px;\
			width: 110px;\
			height: 20px;\
			cursor:pointer;\
	"
	delButtonText.style = "\
			text-align: center;\
			color: white;\
			margin: auto;\
			width: 100px;\
			height: 20px;\
			padding: 1px;\
	"
	
	delButtonDiv.addEventListener("click", removeBookFromLibrary);
	
	delButtonDiv.appendChild(delButtonText);
	buttonsDiv.appendChild(delButtonDiv);

/* Read Button */
	let readButtonDiv = document.createElement("div");
	let readButtonText = document.createElement("p");
	
	readButtonText.innerText = "Toggle Read";

	readButtonText.id = "readButton";

	readButtonDiv.style = "\
			display: flex;\
			align-items: center;\
			justify-content: center;\
			background-color: blue;\
			border-style: solid;\
			border-color: gray;\
			border-width: 1px;\
			border-radius: 10px;\
			width: 110px;\
			height: 20px;\
			cursor:pointer;\
	"

	readButtonText.style = "\
			text-align: center;\
			color: white;\
			margin: auto;\
			width: 100px;\
			height: 20px;\
			padding: 1px;\
	"
	
	readButtonDiv.addEventListener("click", markBookAsRead);
	
	readButtonDiv.appendChild(readButtonText);
	buttonsDiv.appendChild(readButtonDiv);

/* Append all */

	cardElement.appendChild(titleDiv);
	cardElement.appendChild(authorDiv);
	cardElement.appendChild(numberOfPagesDiv);
	cardElement.appendChild(notReadYetDiv);
	cardElement.appendChild(idDiv);
	cardElement.appendChild(buttonsDiv);
	
	return cardElement;

}

// Add Book button Event listener
let buttonElem = document.getElementById("addBook");
buttonElem.addEventListener("click", addBookToLibrary);

/** Main **/
createStyleSheet()

/*
addBookToLibrary ( myLibrary, new Book("The Hobbit", "Tolkien", 300, true) );
addBookToLibrary ( myLibrary, new Book("A Game of Thrones", "George R. R. Martin", 700, true) );
addBookToLibrary ( myLibrary, new Book("The First Man in Rome", "McCullough", 879, true) );
addBookToLibrary ( myLibrary, new Book("Manon Lescaut", "Antoine François Prévost", 240, true) );
addBookToLibrary ( myLibrary, new Book("La Dame aux Camélias", "Alexandre Dumas fils", 278, true) );
*/

showBooksInLibrary(myLibrary);

