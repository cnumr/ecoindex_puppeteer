/**
 * Abstract event tools.
 */
export declare abstract class AbstractEventsClass {
    protected callbacks: any;
    protected defaultCallback: any;
    /**
     * Listen events. If no event id, all events will be triggered.
     *
     * @param {string} id
     * @param callback
     */
    on(id: string | null | undefined, callback: any): void;
    /**
     * Trigger events.
     *
     * @param {string} id
     * @param {{}} data
     * @returns {Promise<void>}
     */
    trigger(id: string, data?: any): Promise<void>;
}
