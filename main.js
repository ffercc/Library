"use strict"

function createStyleSheet() {
	let styleSheet = document.createElement("style");
	styleSheet.type = 'text/css';
	styleSheet.innerText = "\
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
			justify-content: flex-start;\
			flex-wrap: wrap;\
			border-style: solid;\
			border-color: black;\
			border-width: 2px;\
			border-radius: 10px;\
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
	
	let contentElement = document.getElementsByClassName("content")[0];
	contentElement.appendChild( book.createCard() );
}


// Esta funcion sobra
function showBooksInLibrary(library) {
	let contentElement = document.getElementsByClassName("content")[0];
	
	for (let index in library) {
		contentElement.appendChild( library[index].createCard() );
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
	cardElement.style = "\
			display: flex;\
			flex-direction: column;\
			align.items: center;\
			justify-content: flex-start;\
			border-style: solid;\
			border-color: black;\
			border-width: 1px;\
			border-radius: 10px;\
			padding: 10px;\
			width: 250px;\
			height: 120px;\
	"
	
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
	idDiv.innerText = "Id: " + this.id;
	
	/* Buttons */
	buttonsDiv.className = "buttons";
	buttonsDiv.style = "\
			display: flex;\
			align-items: center;\
			justify-content: start-flex;\
			gap: 2px;\
			width: 250px;\
			height: 20px;\
	"
	
	/* Delete Button */
	let delButtonDiv = document.createElement("div");
	let delButtonText = document.createElement("p");
	
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
	"
	delButtonText.style = "\
			text-align: center;\
			color: white;\
			margin: auto;\
			width: 100px;\
			height: 20px;\
			padding: 1px;\
	"
	
	delButtonDiv.appendChild(delButtonText);
	buttonsDiv.appendChild(delButtonDiv);

/* Read Button */
	let readButtonDiv = document.createElement("div");
	let readButtonText = document.createElement("p");
	
	readButtonText.innerText = "Mark as Read";

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
	"

	readButtonText.style = "\
			text-align: center;\
			color: white;\
			margin: auto;\
			width: 100px;\
			height: 20px;\
			padding: 1px;\
	"

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

