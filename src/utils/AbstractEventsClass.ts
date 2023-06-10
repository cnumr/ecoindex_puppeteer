/**
 * Abstract event tools.
 */
export abstract class AbstractEventsClass {

  protected callbacks: any = {};

  /**
   * Listen events.
   *
   * @param {string} id
   * @param callback
   */
  on(id: string, callback: any) {
    this.callbacks[id] = this.callbacks[id] || [];
    this.callbacks[id].push(callback);
  }

  /**
   * Trigger events.
   *
   * @param {string} id
   * @param {{}} data
   * @returns {Promise<void>}
   */
  async trigger(id: string, data: any = {}) {
    for (const cb of this.callbacks[id] || []) {
      await cb(data);
    }
  }
}
