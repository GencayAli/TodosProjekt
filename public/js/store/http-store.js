/**
 * HttpStore
 *
 * Store implementation using http backend.
 */
export class HttpStore {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Creates a new model item
   * @param {object} data The data to save
   */
  async create(data) {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async read() {
    const response = await fetch(this.baseUrl);
    return await response.json();
  }

  /**
   * Will update the given data
   *
   * @param {number} id ID of an item to update
   * @param {object} data The data (properties) to update
   */
  async update(id, data) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   */
  async delete(id) {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }
}
