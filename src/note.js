class Note {
  #text;
  #id;

  constructor(text, id) {
    this.#id = id;
    this.#text = text;
  }

  get text() {
    return this.#text;
  }

  set text(text) {
    this.#text = text;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }
}

export default Note;
