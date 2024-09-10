// Stable queries
const queries = {
  $clearCompleted: document.querySelector('.clear-completed'),
  $footer: document.querySelector('.footer'),
  $main: document.querySelector('.main'),
  $newTodo: document.querySelector('.new-todo'),
  $todoItemCounter: document.querySelector('.todo-count'),
  $todoList: document.querySelector('.todo-list'),
  $toggleAllInput: document.querySelector('.toggle-all'),
};

// addEventListener wrapper:
const $on = (target, type, callback, useCapture) => {
  target.addEventListener(type, callback, !!useCapture);
};

// Attach a handler to event for all elements that match the selector,
// now or in the future, based on a root element
const $delegate = (target, selector, type, handler) => {
  // https://developer.mozilla.org/en-US/docs/Web/Events/blur
  const useCapture = type === 'blur' || type === 'focus';
  $on(target, type, dispatchEvent, useCapture);

  function dispatchEvent(event) {
    if (event.target.matches(selector)) handler.call(event.target, event);
  }
};

const _itemId = (element) => {
  const li = element.closest('li');
  return Number(li.dataset.id) || li.dataset.id;
};

const _setFilter = (currentPage) => {
  document.querySelector('.filters .selected').className = '';
  document.querySelector(`.filters [href="#/${currentPage}"]`).className =
    'selected';
};

const _elementComplete = (id, completed) => {
  const listItem = document.querySelector(`[data-id="${id}"]`);

  if (!listItem) return;

  listItem.classList.toggle('completed', completed);
};

const _removeItem = (id) => {
  const listItem = document.querySelector(`[data-id="${id}"]`);

  queries.$todoList.removeChild(listItem);
};

const _editItem = (id, title) => {
  const listItem = document.querySelector(`[data-id="${id}"]`);

  listItem.classList.add('editing');

  const input = document.createElement('input');
  input.className = 'edit';

  listItem.appendChild(input);
  input.focus();
  input.value = title;
};

const _viewItem = (id, title) => {
  const listItem = document.querySelector(`[data-id="${id}"]`);

  const input = listItem.querySelector('input.edit');
  listItem.removeChild(input);

  listItem.className = listItem.classList.remove('editing');
  if (title) listItem.querySelector('label').textContent = title;
};

export class View {
  constructor(templates) {
    this.templates = templates;
  }

  render(viewCmd, parameter) {
    switch (viewCmd) {
      case 'clearCompletedButton':
        queries.$clearCompleted.classList.toggle('hidden', !parameter);
        break;
      case 'contentBlocksVisibility':
        queries.$main.classList.toggle('hidden', !parameter);
        queries.$footer.classList.toggle('hidden', !parameter);
        break;
      case 'editMode':
        _editItem(parameter.id, parameter.title);
        break;
      case 'elementComplete':
        _elementComplete(parameter.id, parameter.completed);
        break;
      case 'removeItem':
        _removeItem(parameter);
        break;
      case 'setFilter':
        _setFilter(parameter);
        break;
      case 'showEntries':
        queries.$todoList.innerHTML = this.templates.show(parameter);
        break;
      case 'toggleAll':
        queries.$toggleAllInput.checked = parameter;
        break;
      case 'updateElementCount':
        queries.$todoItemCounter.innerHTML =
          this.templates.itemCounter(parameter);
        break;
      case 'viewMode':
        _viewItem(parameter.id, parameter.title);
        break;
      default:
        throw new Error(`Not implemented: ${viewCmd}`);
    }
  }

  // Bind view events to controller handlers
  bindCallback(event, handler) {
    switch (event) {
      case 'itemRemove':
        $delegate(queries.$todoList, '.destroy', 'click', (e) =>
          handler({ id: _itemId(e.target) }),
        );
        break;
      case 'itemEditBegin':
        $delegate(queries.$todoList, 'li label', 'dblclick', (e) =>
          handler({ id: _itemId(e.target) }),
        );
        break;
      case 'itemEditCancel':
        $delegate(queries.$todoList, 'li .edit', 'keyup', (e) => {
          if (e.key === 'Escape') {
            e.target.dataset.isCanceled = true;
            e.target.blur();
            handler({ id: _itemId(e.target) });
          }
        });
        break;
      case 'itemEditDone':
        $delegate(queries.$todoList, 'li .edit', 'blur', function (e) {
          if (!e.target.dataset.isCanceled) {
            handler({
              id: _itemId(e.target),
              title: e.target.value.trim(),
            });
          }
        });
        $delegate(queries.$todoList, 'li .edit', 'keyup', function (e) {
          if (e.key === 'Enter') e.target.blur();
        });
        break;
      case 'itemToggle':
        $delegate(queries.$todoList, '.toggle', 'change', (e) =>
          handler({ id: _itemId(e.target), completed: e.target.checked }),
        );
        break;
      case 'newTodo':
        $on(queries.$newTodo, 'keyup', (ev) => {
          if (ev.key === 'Enter') {
            const title = queries.$newTodo.value.trim();
            if (title) handler(title);
            queries.$newTodo.value = '';
          }
        });
        break;
      case 'removeCompleted':
        $on(queries.$clearCompleted, 'click', handler);
        break;
      case 'toggleAll':
        $on(queries.$toggleAllInput, 'change', () => {
          handler(queries.$toggleAllInput.checked);
        });
        break;
    }
  }
}
