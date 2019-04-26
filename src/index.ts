// An event handler can take an optional event argument
// and should not return a value
type EventHandler = (event?: any) => void;
type WildCardEventHandler = (type: string, event?: any) => void;

// An array of all currently registered event handlers for a type
type EventHandlerList = Array<EventHandler>;
type WildCardEventHandlerList = Array<WildCardEventHandler>;
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  '*'?: WildCardEventHandlerList;
  [type: string]: EventHandlerList;
};

/** Nitt: functional event emitter / pubsub.
 *  @name nitt
 *  @returns {Nitt}
 */
export default function nitt(all: EventHandlerMap) {
  all = all || Object.create(null);

  return {
    /**
     * Register an event handler for the given type.
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for all events
     * @param  {Function} handler Function to call in response to given event
     */
    on(type: string, handler: EventHandler) {
      (all[type] || (all[type] = [])).push(handler);
    },

    /**
     * Register an event handler that is executed just once.
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for any event
     * @param  {Function} handler Function to call in response to given event
     */
    once(type: string, handler: EventHandler) {
      const onceHandler = evt => {
        handler(evt);
        this.off(type, onceHandler);
      };
      this.on(type, onceHandler);
    },

    /**
     * Returns a promise for a single event
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for any event
     * @returns {Promise<any>}
     */
    when(type: string): Promise<any> {
      return new Promise<any>(resolve => this.once(type, resolve));
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
     * @param  {Function} handler Handler function to remove
     */
    off(type: string, handler: EventHandler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * @param {String} type  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     */
    emit(type: string, evt: any) {
      (all[type] || []).forEach(handler => {
        handler(evt);
      });
      (all['*'] || []).forEach(handler => {
        handler(type, evt);
      });
    },
  };
}
