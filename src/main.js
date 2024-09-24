import "../style.css";
import NotesWall from "./notes-wall.js";

class StickyNotesApp {
  #inputNewNote;
  #notesWall;
  #stickyList;

  constructor() {
    this.#inputNewNote = document.getElementById("new-note");
    this.#notesWall = document.getElementById("notes-wall");
    this.#stickyList = new NotesWall();

    this.#inputNewNote.addEventListener(
      "keydown",
      this.#handleNewInput.bind(this),
    );
    this.#notesWall.addEventListener(
      "click",
      this.#handleClickDelete.bind(this),
    ); // event delegation for each note: delete
    this.#notesWall.addEventListener(
      "dblclick",
      this.#handleDblClickNote.bind(this),
    ); // event delegation for each note: edit
    document.addEventListener(
      "DOMContentLoaded",
      this.#renderStickyNotes.bind(this),
    );
  }

  // Helper function: create textarea of sticky note element
  #createStickyNoteTextarea(sticky) {
    const stickyNoteTextArea = document.createElement("textarea");
    stickyNoteTextArea.setAttribute("id", `textarea${sticky.id}`);
    stickyNoteTextArea.classList.add(
      "absolute",
      "whitespace-pre-wrap",
      "top-0",
      "hidden",
      "w-full",
      "h-full",
      "p-4",
      "transition-transform",
      "transform",
      "bg-yellow-300",
      "shadow-xl",
      "resize-none",
      "outline-rose-700",
      "outline-offset-0",
      "note-edit",
      "note",
      "hover:scale-105",
    );
    stickyNoteTextArea.textContent = sticky.text;
    return stickyNoteTextArea;
  }

  // Helper function: create inner div of class "note-text" of sticky note element
  #createStickyNoteInnerDiv(sticky) {
    const stickyNoteInnerDiv = document.createElement("div");
    stickyNoteInnerDiv.classList.add("p-4", "note-text", "whitespace-pre-wrap");
    stickyNoteInnerDiv.innerHTML = sticky.text;
    return stickyNoteInnerDiv;
  }

  // Helper function: create trash button at top right of sticky note element
  #createStickyNoteButton(sticky) {
    const stickyNoteButton = document.createElement("button");
    stickyNoteButton.setAttribute("id", `button${sticky.id}`);
    stickyNoteButton.classList.add(
      "absolute",
      "w-5",
      "h-5",
      "leading-5",
      "text-center",
      "transition-opacity",
      "opacity-0",
      "cursor-pointer",
      "delete-btn",
      "top-1",
      "right-1",
      "hover:opacity-100",
    );
    stickyNoteButton.innerHTML = "🗑";
    return stickyNoteButton;
  }

  // Helper function: create new sticky note element
  #createStickyNote(sticky) {
    const stickyNoteDiv = document.createElement("div");
    stickyNoteDiv.setAttribute("id", `${sticky.id}`);
    stickyNoteDiv.classList.add(
      "relative",
      "w-40",
      "h-40",
      "p-0",
      "m-2",
      "overflow-y-auto",
      "transition-transform",
      "transform",
      "bg-yellow-200",
      "shadow-lg",
      "note",
      "hover:scale-105",
    );

    const stickyNoteButton = this.#createStickyNoteButton(sticky);
    const stickyNoteInnerDiv = this.#createStickyNoteInnerDiv(sticky);
    const stickyNoteTextArea = this.#createStickyNoteTextarea(sticky);

    stickyNoteDiv.append(
      stickyNoteButton,
      stickyNoteInnerDiv,
      stickyNoteTextArea,
    );
    return stickyNoteDiv;
  }

  // Render sticky notes based on current stickies in this.#stickyList
  #renderStickyNotes() {
    this.#notesWall.innerHTML = ""; // clear stickies on the notes wall currently
    const stickyElements = this.#stickyList.stickies.map(
      this.#createStickyNote.bind(this),
    );

    this.#notesWall.append(...stickyElements);
  }

  // Event handler to create a new sticky note
  #handleNewInput(event) {
    if (event.key === "Enter" && event.shiftKey === true) {
    } else if (event.key === "Enter") {
      event.preventDefault(); // prevent "Enter" from creating a new line if it is ONLY "Enter"
      const stickyText = event.target.value;
      if (stickyText) {
        this.#stickyList.addNote(stickyText);
        this.#inputNewNote.value = ""; // clear the input
        this.#renderStickyNotes();
      }
    }
  }

  // Event handler to delete note when trash can icon at top right of note is clicked on
  #handleClickDelete(event) {
    if (event.target.nodeName === "BUTTON") {
      const stickyNoteIndex = event.target.id[6]; // event.target.id = "button{id}"
      this.#stickyList.removeNote(stickyNoteIndex);
      this.#renderStickyNotes();
    }
  }

  // Helper function: save note edits when "Enter" or "Esc" are pressed during note editing
  #handleEnterOrEscNote(event) {
    if (event.key === "Enter" && event.shiftKey === true) {
    } else if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault(); // prevent "Enter" from creating a new line if it is ONLY "Enter"
      const stickyText = event.target.value;
      if (stickyText) {
        const id = event.target.id[8]; // event.target.id = "textarea{id}"
        this.#stickyList.editNote(id, stickyText);
        this.#inputNewNote.value = ""; // clear the input
        this.#renderStickyNotes();
      }
    }
  }

  // Helper function: save note edits when user clicks off the note being edited
  #handleClickOffNote(textarea, event) {
    if (
      event.target.nodeName !== "TEXTAREA" ||
      event.target.id !== textarea.id
    ) {
      const stickyText = textarea.value;
      if (stickyText) {
        const id = textarea.id[8]; // textarea.id = "textarea{id}"
        this.#stickyList.editNote(id, stickyText);
        this.#inputNewNote.value = ""; // clear the input
        this.#renderStickyNotes();
      }
    } else {
      document.addEventListener(
        "click",
        this.#handleClickOffNote.bind(this, textarea),
        { once: true },
      );
    }
  }

  // Event handler to edit note when a note is double-clicked on
  #handleDblClickNote(event) {
    let parentDiv = event.target; // represents parent div of each note
    if (event.target.classList.contains("note-text")) {
      // if double-clicked on note-text part of note, find parent div
      parentDiv = event.target.parentNode;
    }
    const textarea = parentDiv.querySelector("textarea");
    if (textarea) {
      // ensure selected element is not "null" or undefined
      textarea.classList.remove("hidden");
      textarea.focus(); // brings the textarea into focus
      textarea.selectionStart = textarea.value.length; // moves cursor to end of text input in the textarea
      textarea.addEventListener(
        "keydown",
        this.#handleEnterOrEscNote.bind(this),
      ); // handles "Enter" or "Esc"
      document.addEventListener(
        "click",
        this.#handleClickOffNote.bind(this, textarea),
        { once: true },
      ); // handles clicking off note
    }
  }
}

new StickyNotesApp();
