import { Controller } from './controller.js';
import { Model } from './model.js';
import { ArrayStore } from './store/array-store.js';
import { HttpStore } from './store/http-store.js';
import { LocalStore } from './store/local-store.js';
import { Templates } from './templates/index.js';
import { View } from './view.js';

const stores = {
  array: new ArrayStore(),
  local: new LocalStore(),
  cloud: new HttpStore('https://cloud.lean-stack.de/api/public/todos'),
  express: new HttpStore('/api/todos'),
};

class TodoApp {
  constructor() {
    this.store = stores.express;  // this.store = stores.local wird geändert 09.09.24
    this.model = new Model(this.store);
    this.view = new View(new Templates());
    this.controller = new Controller(this.model, this.view);
  }
}

const app = new TodoApp();

function initializeView() {
  app.controller.setView(document.location.hash);
}

// Initialize view and listen to hash changes
initializeView();
window.addEventListener('hashchange', initializeView);
