/**
 * Abstract event tools.
 */
export declare abstract class AbstractEventsClass {
    protected callbacks: any;
    /**
     * Listen events.
     *
     * @param {string} id
     * @param callback
     */
    on(id: string, callback: any): void;
    /**
     * Trigger events.
     *
     * @param {string} id
     * @param {{}} data
     * @returns {Promise<void>}
     */
    trigger(id: string, data?: any): Promise<void>;
}
