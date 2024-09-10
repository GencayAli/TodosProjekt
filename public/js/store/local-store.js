function _generateId() {
  const nextId = JSON.parse(localStorage.lastId || '0') + 1;
  localStorage.lastId = nextId;
  return nextId;
}

function _loadTodos() {
  return JSON.parse(localStorage.todos || '[]');
}

function _saveTodos(todos) {
  localStorage.todos = JSON.stringify(todos);
}

/**
 * LocalStore
 *
 * Store implementation using localstorage as backend.
 */
export class LocalStore {
  /**
   * Creates a new model item
   * @param {object} data The data to save
   */
  async create(data) {
    const todos = _loadTodos();
    const todo = { id: _generateId(), ...data };
    console.log(todo);
    _saveTodos([...todos, todo]);
    return todo;
  }

  async read() {
    return _loadTodos();
  }

  /**
   * Will update the given data
   *
   * @param {number} id ID of an item to update
   * @param {object} data The data (properties) to update
   */
  async update(id, data) {
    const todos = _loadTodos();
    const todo = { ...todos.find((t) => t.id === id), ...data };
    _saveTodos(todos.map((t) => (t.id === id ? todo : t)));
    return todo;
  }

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   */
  async delete(id) {
    const todos = _loadTodos();
    _saveTodos(todos.filter((t) => t.id !== id));
  }
}
