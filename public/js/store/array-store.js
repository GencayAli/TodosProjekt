let todos = [];
let lastId = 0;

/**
 * ArrayStore
 *
 * Just an in-memory array implementation to help developing. Aka a mock store.
 */
export class ArrayStore {
  /**
   * Creates a new model item
   * @param {object} data The data to save
   */
  async create(data) {
    const todo = { id: ++lastId, ...data };
    todos = [...todos, todo];
    return todo;
  }

  async read() {
    return todos;
  }

  /**
   * Will update the given data
   *
   * @param {number} id ID of an item to update
   * @param {object} data The data (properties) to update
   */
  async update(id, data) {
    const todo = { ...todos.find((t) => t.id === id), ...data };
    todos = todos.map((t) => (t.id === id ? todo : t));
    return todo;
  }

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   */
  async delete(id) {
    todos = todos.filter((t) => t.id !== id);
  }
}
