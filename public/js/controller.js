export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCallback('itemEditBegin', (item) =>
      this.beginEditItem(item.id),
    );
    this.view.bindCallback('itemEditCancel', (item) =>
      this.cancelEditItem(item.id),
    );
    this.view.bindCallback('itemEditDone', (item) =>
      this.commitEditItem(item.id, item.title),
    );
    this.view.bindCallback('itemToggle', (item) =>
      this.toggleCompletedState(item.id, item.completed),
    );
    this.view.bindCallback('itemRemove', (item) => this.removeItem(item.id));
    this.view.bindCallback('newTodo', (title) => this.addItem(title));
    this.view.bindCallback('removeCompleted', () =>
      this.removeCompletedItems(),
    );
    this.view.bindCallback('toggleAll', (completed) =>
      this.toggleAll(completed),
    );
  }

  /**
   * Load & Initialize the view
   * @param {string}  '' | '#/' | '#/active' | '#/completed'
   */
  setView(hash) {
    const route = hash.split('/')[1];
    let page = route || '';
    if (!['', 'active', 'completed'].includes(page)) {
      page = '';
      window.location.hash = '#/';
      return;
    }
    this._updateFilter(page);
  }

  /**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   */
  async addItem(title) {
    await this.model.create(title);
    this._updateView(true); // force updating
  }

  /*
   * Triggers the item editing mode.
   */
  async beginEditItem(id) {
    const todo = await this.model.read(id);
    this.view.render('editMode', { id, title: todo.title });
  }

  /*
   * Cancels the item editing mode.
   */
  cancelEditItem(id) {
    this.view.render('viewMode', { id });
  }

  /*
   * Finishes the item editing mode successfully.
   */
  async commitEditItem(id, title) {
    if (title.length !== 0) {
      await this.model.update(id, { title });
      this.view.render('viewMode', { id, title });
    } else {
      await this.removeItem(id);
    }
  }

  /**
   * Find the DOM element with given ID,
   * Then remove it from DOM & Storage
   */
  async removeItem(id) {
    await this.model.remove(id);
    this.view.render('removeItem', id);
    this._updateView();
  }

  /**
   * Will remove all completed items from the DOM and storage.
   */
  async removeCompletedItems() {
    await this.model.removeCompleted();
    this._updateView(true);
  }

  /**
   * Will toggle ALL checkboxes' on/off state and completeness of models.
   * Just pass in the event object.
   */
  async toggleAll(completed) {
    await this.model.toggleAll(completed);
    this._updateView(true);
  }

  /**
   * Give it an ID of a model and a checkbox and it will update the item
   * in storage based on the checkbox's state.
   *
   * @param {number} id The ID of the element to complete or uncomplete
   * @param {object} checkbox The checkbox to check the state of complete
   *                          or not
   * @param {boolean|undefined} silent Prevent re-filtering the todo items
   */
  async toggleCompletedState(id, completed) {
    await this.model.update(id, { completed });
    this.view.render('elementComplete', { id, completed });

    // Rerender view
    this._updateView();
  }

  /**
   * Updates the pieces of the page which change depending on the remaining
   * number of todos.
   */
  async _updateCount() {
    const todos = await this.model.getCounts();

    this.view.render('updateElementCount', todos.active);
    this.view.render('clearCompletedButton', todos.completed > 0);
    this.view.render('toggleAll', todos.completed === todos.total);
    this.view.render('contentBlocksVisibility', todos.total > 0);
  }

  /**
   * Updates the rendered list items
   */
  async _updateListEntries(route) {
    const todos = await this.model.readAll();
    const filteredTodos =
      route === 'all'
        ? todos
        : todos.filter((t) => t.completed === (route === 'completed'));
    this.view.render('showEntries', filteredTodos);
  }

  /**
   * Re-filters the todo items, based on the active route.
   * @param {boolean|undefined} force  forces a re-painting of todo items.
   */
  async _updateView(force) {
    // Update the elements on the page, which change with each completed todo
    await this._updateCount();

    if (
      force ||
      this._lastActiveRoute !== 'all' ||
      this._lastActiveRoute !== this._activeRoute
    ) {
      this._updateListEntries(this._activeRoute);
    }

    this._lastActiveRoute = this._activeRoute;
  }

  /**
   * Simply updates the filter nav's selected states
   */
  async _updateFilter(currentPage) {
    // Store a reference to the active route, allowing us to re-filter todo
    // items as they are marked complete or incomplete.
    this._activeRoute = currentPage;

    if (currentPage === '') this._activeRoute = 'all';

    // Filter the todo items
    await this._updateView();

    this.view.render('setFilter', currentPage);
  }
}
