// All templates are HTML which were remove from the static starter template
// to be rendered dynamically.

const htmlEscapes = {
  '&': '&amp',
  '<': '&lt',
  '>': '&gt',
  '"': '&quot',
  "'": '&#x27',
  '`': '&#x60',
};

const reUnescapedHtml = /[&<>"'`]/g;
const reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

const escape = (str) =>
  str && reHasUnescapedHtml.test(str)
    ? str.replace(reUnescapedHtml, escapeHtmlChar)
    : str;
const escapeHtmlChar = (chr) => htmlEscapes[chr];

const createTodoItem = ({ id, title, completed, checked }) => `
<li data-id="${id}" class="${completed}">
    <div class="view">
        <input class="toggle" type="checkbox" ${checked}>
        <label>${title}</label>
        <button class="destroy"></button>
    </div>
</li>
`;

export class Templates {
  /**
   * Displays a counter of how many to dos are left to complete
   *
   * @param {number} activeTodos The number of active todos.
   * @returns {string} String containing the count
   */
  itemCounter(activeTodos) {
    const plural = activeTodos === 1 ? '' : 's';
    return `<strong>${activeTodos}</strong> item${plural} left`;
  }

  /**
   * Creates an <li> HTML string and returns it for placement in your app.
   *
   * NOTE: In real life you should be using a templating engine such as Mustache
   * or Handlebars, however, this is a vanilla JS example.
   *
   * @param {object} data The object containing keys you want to find in the
   *                      template to replace.
   * @returns {string} HTML String of an <li> element
   *
   * @example
   * view.show({
   *  id: 1,
   *  title: "Hello World",
   *  completed: 0,
   * })
   */
  show(data) {
    let view = '';

    data.forEach((item, index) => {
      view += createTodoItem({
        id: item.id,
        title: escape(item.title),
        completed: item.completed ? 'completed' : '',
        checked: item.completed ? 'checked' : '',
        index: index,
      });
    });

    return view;
  }
}
