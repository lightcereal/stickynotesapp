import Note from "./note.js";

class NotesWall {
  #stickies = []; // list of notes
  #nextId = 0; // index of next note added to array

  addNote(text) {
    let i = this.#nextId;
    this.#stickies.push(new Note(text, i));
    this.#nextId++;
  }

  get stickies() {
    return this.#stickies;
  }

  removeNote(index) {
    this.#stickies.splice(index, 1);
    for (
      this.#nextId = 0;
      this.#nextId < this.#stickies.length;
      this.#nextId++
    ) {
      // reassign ids to all notes
      this.#stickies[this.#nextId].id = this.#nextId;
    }
  }

  editNote(index, text) {
    this.#stickies[index].text = text;
  }
}

export default NotesWall;
