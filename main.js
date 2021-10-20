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

/** Class Book **/
class Book {

	static id = 0;
	title = "";
	author = "";
	numberOfPages = 0;
	notReadYet = true;

	constructor(title = "", author = "", numberOfPages = 0, notReadYet = true, id = null) {
		this.title = title;
		this.author = author;
		this.numberOfPages = numberOfPages;
		this.notReadYet = notReadYet;
		if (id === null) { //si no le pasamos el id, crear uno nuevo
			this.id = JSON.parse(localStorage.getItem("nextId"));
			if (this.id === null) { this.id = 0; }
			this.id++;
			localStorage.setItem("nextId", JSON.stringify(this.id));
		} else {
			this.id = id;
		}
		
	}

	static copyObjectToBook(obj) {
		if (obj == null) {
			return null;
		} else {
			let returnValue = new Book(obj.title, obj.author, obj.numberOfPages, obj.notReadYet, obj.id);
			return returnValue;
		}
	}
	
	/*
	setTitle(_id) { this.title = _title; }
	setAuthor(_id) { this.author = _author; }
	setNumberOfPage(_numberOfPages) { this.numberOfPages = _numberOfPages; }
	setNotReadYet(_notReadYet) { this.notReadYet = _notReadYet; }
	
	getId() { return id; }
	getTitle() { return title; }
	getAuthor() { return author; }
	getNumberOfPage() { return numberOfPages; }
	getNotReadYet() { return notReadYet; }
	*/
}


/** Class Library: Array of books **/
class Library {
	
	myLibrary;
	
	contructor() {
		this.myLibrary = [];
	}
	
	static {
		this.myLibrary = Library.recoverLibraryFromLocalStorage();
	}
	
	// Desde JSON recuperamos objetos genéricos de tipo Object, no se guarda el tipo de objeto original (Book)
	static recoverLibraryFromLocalStorage() {
		let returnedLibrary = null;
		if (localStorage.getItem("myLibrary") === null) {
			returnedLibrary = [];
		} else {
			returnedLibrary = JSON.parse(localStorage.getItem("myLibrary"));
			for (let index in returnedLibrary) {
				returnedLibrary[index] = Book.copyObjectToBook(returnedLibrary[index]);
			}
		}
		return returnedLibrary;
	}
	
	addBookToLibrary() {
		let thisLibrary = this;
		
		let title = document.getElementById("titleForm").value;
		let author = document.getElementById("authorForm").value;
		let numberOfPages = document.getElementById("numberOfPagesForm").value;
		
		if (title == "" || author == "" || numberOfPages == "") {
			alert ("The fields cannot be empty");
			showAddBookForm();
			return;
		}
		
		let book = new Book(title, author, numberOfPages)
		thisLibrary.myLibrary = Library.recoverLibraryFromLocalStorage();
		thisLibrary.myLibrary.push(book);
		
		localStorage.setItem("myLibrary", JSON.stringify(thisLibrary.myLibrary));
		
		document.getElementById("addBookForm").reset(); // reset form for next time
		
		thisLibrary.showBooksInLibrary();
		
		/*let contentElement = document.getElementsByClassName("content")[0];
		contentElement.appendChild( book.createCard() );*/
	}

	removeBookFromLibrary(event) {
		let thisLibrary = this;
		
		// Buscar el antecedente de clase 'book'
		let bookDiv = event.currentTarget;
		while (! bookDiv.classList.contains("book")) {
			bookDiv = bookDiv.parentNode;
		}

		let bookId = bookDiv.dataset.id;
		
		thisLibrary.myLibrary = Library.recoverLibraryFromLocalStorage();
		thisLibrary.myLibrary.forEach(function(book, index, myLibrary) {
				if (book.id == bookId) myLibrary.splice(index, 1);
			});
		
		localStorage.setItem("myLibrary", JSON.stringify(thisLibrary.myLibrary));
		thisLibrary.showBooksInLibrary();
	}

	markBookAsRead(event) {
		let thisLibrary = this;
		
		// Buscar el antecedente de clase 'book'
		let bookDiv = event.currentTarget;
		while (! bookDiv.classList.contains("book")) {
			bookDiv = bookDiv.parentNode;
		}

		let bookId = bookDiv.dataset.id;
		
		thisLibrary.myLibrary = Library.recoverLibraryFromLocalStorage();

		thisLibrary.myLibrary.forEach(function(book, index, myLibrary) {
			if (book.id == bookId) { book.notReadYet = ! book.notReadYet; }
		});
		bookDiv.classList.toggle("notReadYet");
		
		localStorage.setItem("myLibrary", JSON.stringify(thisLibrary.myLibrary));
		 
		thisLibrary.showBooksInLibrary();
	}

	showBooksInLibrary() {
		let thisLibrary = this;
		
		let contentElement = document.getElementsByClassName("content")[0];
		
		// borrar todos los hijos actuales (elementos HTML de cada libro)
		contentElement.innerHTML = '';
		
		thisLibrary.myLibrary = Library.recoverLibraryFromLocalStorage();
		
		if (thisLibrary.myLibrary.length == 0) {
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
			contentElement.appendChild(libEmpty);
		} else {
			// volver a generar los hijos en funcion de la libreria
			for (let index in thisLibrary.myLibrary) {
				contentElement.appendChild( thisLibrary.createCard(thisLibrary.myLibrary[index]) );
			}
		}
	}

	createCard(book) {
		let thisLibrary = this;
		
		let cardElement = document.createElement("div");
		cardElement.setAttribute("data-id", book.id);
		cardElement.className = "book";
		if (book.notReadYet) cardElement.classList.add("notReadYet");
		cardElement.style = "\
				display: flex;\
				flex-direction: column;\
				align-items: center;\
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
		if (! book.notReadYet) {
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
		
		titleDiv.innerText = "Title: " + book.title;
		authorDiv.innerText = "Author: " + book.author;
		numberOfPagesDiv.innerText = "Pages: " + book.numberOfPages;
		notReadYetDiv.innerText = book.notReadYet ? "Not read yet." : "Already read.";
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
		
		delButtonDiv.addEventListener("click", thisLibrary.removeBookFromLibrary.bind(thisLibrary));
		
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
		
		readButtonDiv.addEventListener("click", thisLibrary.markBookAsRead.bind(thisLibrary));
		
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
}

/** Main **/
createStyleSheet();
var myLibrary = new Library();
setupModal(myLibrary);
myLibrary.showBooksInLibrary();

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

function setupModal(myLibrary) {
	// Get the modal
	let addBookModal = document.getElementById("addBookModal");

	// Get the button that opens the modal
	let buttonElem = document.getElementById("addBook");
	buttonElem.onclick = showAddBookForm; // When the user clicks on the button, open the modal

	// OK button
	let okButtonElem = document.getElementById("okButton");
	okButtonElem.addEventListener("click", hideAddBookForm);
	okButtonElem.addEventListener("click", myLibrary.addBookToLibrary.bind(myLibrary));

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

}

