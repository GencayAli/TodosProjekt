export class Model {
  constructor(store) {
    this.todos = undefined;
    this.store = store;
  }

  /**
   * Creates a new todo model
   *
   * @param {string} [title] The title of the task
   */
  async create(title) {
    const todo = {
      title,
      completed: false,
    };

    const createdTodo = await this.store.create(todo);
    this.todos = [...this.todos, createdTodo];
  }

  /**
   * Finds and returns all models in storage.
   *
   */
  async readAll() {
    if (typeof this.todos === 'undefined') {
      this.todos = await this.store.read();
    }

    return this.todos;
  }

  /**
   * Finds and returns model by id
   */
  async read(id) {
    return this.todos.find((t) => t.id === id);
  }

  /**
   * Updates a model by giving it an ID, data to update
   *
   * @param {number} id The id of the model to update
   * @param {object} data The properties to update and their new value
   */
  async update(id, data) {
    const updatedTodo = await this.store.update(id, data);
    this.todos = this.todos.map((t) => (t.id === id ? updatedTodo : t));
  }

  /**
   * Removes a model from store
   *
   * @param {number} id The ID of the model to remove
   */
  async remove(id) {
    await this.store.delete(id);
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  /**
   * Removes all completed models from store
   */
  async removeCompleted() {
    for (const t of this.todos) {
      if (t.completed) await this.store.delete(t.id);
    }
    this.todos = this.todos.filter((t) => !t.completed);
  }

  /**
   * Syncs all completed state of models
   *
   * @param {boolean} completed New state
   */
  async toggleAll(completed) {
    for (const t of this.todos) {
      if (t.completed !== completed)
        await this.store.update(t.id, { completed });
    }
    this.todos = this.todos.map((t) => ({ ...t, completed }));
  }

  /**
   * Returns a count of all todos
   */
  async getCounts() {
    const stats = {
      active: 0,
      completed: 0,
      total: 0,
    };

    await this.readAll(); // Ensure loaded todos

    stats.total = this.todos.length;
    stats.completed = this.todos.reduce(
      (count, t) => (t.completed ? count + 1 : count),
      0,
    );
    stats.active = stats.total - stats.completed;
    return stats;
  }
}
