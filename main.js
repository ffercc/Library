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
var myLibrary = recoverLibraryFromLocalStorage();

//localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

// Desde JSON recuperamos objetos genéricos de tipo Object, no se guarda el tipo de objeto original (Book)
function recoverLibraryFromLocalStorage() {
	if (localStorage.getItem("myLibrary") === null) {
		return [];
	} else {
		myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
		for (let index in myLibrary) {
			myLibrary[index] = copyObjectToBook(myLibrary[index]);
		}
		return myLibrary;
	}
}

function addBookToLibrary() {
	
	let title = document.getElementById("titleForm").value;
	let author = document.getElementById("authorForm").value;
	let numberOfPages = document.getElementById("numberOfPagesForm").value;
	
	if (title == "" || author == "" || numberOfPages == "") {
		alert ("The fields cannot be empty");
		showAddBookForm();
		return;
	}
	
	let book = new Book(title, author, numberOfPages)
	myLibrary = recoverLibraryFromLocalStorage();
	myLibrary.push(book);
	
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
	
	document.getElementById("addBookForm").reset(); // reset form for next time
	
	showBooksInLibrary();
	
	/*let contentElement = document.getElementsByClassName("content")[0];
	contentElement.appendChild( book.createCard() );*/
}

// deprecated
function addBookToLibrary_old() {
	
	let title = prompt("title: ", "title");
	let author = prompt("author: ", "author");
	let numberOfPages = prompt("number of pages: ", "0");
	
	let book = new Book(title, author, numberOfPages)
	
	myLibrary = recoverLibraryFromLocalStorage();
	myLibrary.push(book);
	
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
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
	
	myLibrary = recoverLibraryFromLocalStorage();
	myLibrary.forEach(function(book, index, myLibrary) {
			if (book.id == bookId) myLibrary.splice(index, 1);
		});
	
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
	showBooksInLibrary(myLibrary);
}

function markBookAsRead(event) {
	
	// Buscar el antecedente de clase 'book'
	let bookDiv = event.currentTarget;
	while (! bookDiv.classList.contains("book")) {
		bookDiv = bookDiv.parentNode;
	}

	let bookId = bookDiv.dataset.id;
	
	myLibrary = recoverLibraryFromLocalStorage();

	myLibrary.forEach(function(book, index, myLibrary) {
		if (book.id == bookId) book.notReadYet = ! book.notReadYet;
	});
	bookDiv.classList.toggle("notReadYet");
	
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
	 
	showBooksInLibrary();
}

function showBooksInLibrary() {
	let contentElement = document.getElementsByClassName("content")[0];
	
	// borrar todos los hijos actuales (elementos HTML de cada libro)
	contentElement.innerHTML = '';
	
	myLibrary = recoverLibraryFromLocalStorage();
	
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

function copyObjectToBook(obj) {
	if (obj == null) {
		return null;
	} else {
		let returnValue = new Book(obj.title, obj.author, obj.numberOfPages, obj.notReadYet, obj.id);
		return returnValue;
	}
}

function Book(title, author, numberOfPages, notReadYet = true, id = null) {
	this.title = title;
	this.author = author;
	this.numberOfPages = numberOfPages;
	this.notReadYet = notReadYet;
	if (id === null) {  //si no le pasamos el id, crear uno nuevo
		Book.prototype.id = JSON.parse(localStorage.getItem("nextId"));
		if (Book.prototype.id === null) Book.prototype.id = 0;
		this.id = (Book.prototype.id++);
		localStorage.setItem("nextId", JSON.stringify(Book.prototype.id));
	} else {
		this.id = id;
	}
	
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
			max-width: 500px;\
			min-height: 120px;\
			background-image: url('./images/background_white.jpeg');\
			margin: 1px;\
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
	
	titleDiv.style = "word-wrap: break-word;";
	authorDiv.style = "word-wrap: break-word;";
	
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

// Add buttons Event listener
// let buttonElem = document.getElementById("addBook");
// buttonElem.addEventListener("click", addBookToLibrary);

/** Modal 'addBookModal'**/
function hideAddBookForm() {
	document.getElementById("addBookModal").style.display = "none";
}

function showAddBookForm(modalElement) {
	document.getElementById("addBookModal").style.display = "block";
}

// Get the modal
let addBookModal = document.getElementById("addBookModal");

// Get the button that opens the modal
let buttonElem = document.getElementById("addBook");
buttonElem.onclick = showAddBookForm; // When the user clicks on the button, open the modal

// OK button
let okButtonElem = document.getElementById("okButton");
okButtonElem.addEventListener("click", hideAddBookForm);
okButtonElem.addEventListener("click", addBookToLibrary);

// Cancel button
let  cancelButtonElem = document.getElementById("cancelButton");
cancelButtonElem.addEventListener("click", hideAddBookForm);

// Get the <span> element that closes the modal
let closeModal = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = hideAddBookForm;

/*
 * // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == addBookModal) {
		hideAddBookForm(addBookModal);
	}
}*/

/** Main **/
createStyleSheet()

showBooksInLibrary();

