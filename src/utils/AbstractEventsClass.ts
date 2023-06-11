/**
 * Abstract event tools.
 */
export abstract class AbstractEventsClass {

  protected callbacks: any = {};
  protected defaultCallback: any = null;

  /**
   * Listen events. If no event id, all events will be triggered.
   *
   * @param {string} id
   * @param callback
   */
  on(id: string | null = null, callback: any) {
    if (id) {
      this.callbacks[id] = this.callbacks[id] || [];
      this.callbacks[id].push(callback);
    } else {
      this.defaultCallback = callback;
    }
  }

  /**
   * Trigger events.
   *
   * @param {string} id
   * @param {{}} data
   * @returns {Promise<void>}
   */
  async trigger(id: string, data: any = {}) {
    if (this.defaultCallback) {
      this.defaultCallback(id, data);
    }

    for (const cb of this.callbacks[id] || []) {
      await cb(data);
    }
  }
}
