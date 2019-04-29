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
export default function nitt(defs: EventHandlerMap) {
  const all = new Map(
    Object.entries(defs).map(([type, handlers]) => [
      type,
      new Map(handlers.map(x => [x, x])),
    ])
  );

  const handlersFor = (
    type: string
  ): Map<any, EventHandler | WildCardEventHandler> =>
    all[type] || (all[type] = new Map());
  const remove = (type: string, key: EventHandler | Promise<any>) => {
    handlersFor(type).delete(key);
  };

  const add = (
    type: string,
    handler: EventHandler | WildCardEventHandler,
    key?: any
  ) => {
    handlersFor(type).set(key || handler, handler);
  };

  const addOnce = (
    type: string,
    handler: EventHandler | WildCardEventHandler,
    key?: any
  ) => {
    key = key || handler;
    add(
      type,
      (a, b) => {
        handler(a, b);
        remove(type, key);
      },
      key
    );
  };

  return {
    /**
     * Register an event handler for the given type.
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for all events
     * @param  {Function} handler Function to call in response to given event
     */
    on(type: string, handler: EventHandler) {
      add(type, handler);
    },

    /**
     * Register an event handler that is executed just once.
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for any event
     * @param  {Function} handler Function to call in response to given event
     */
    once(type: string, handler: EventHandler) {
      addOnce(type, handler);
    },

    /**
     * Returns a promise for a single event
     *
     * @param  {String} type	Type of event to listen for, or `"*"` for any event
     * @returns {Promise<any>}
     */
    when(type: string): Promise<any> {
      let resolver;
      const promise = new Promise(resolve => {
        resolver =
          type === '*'
            ? (a: any, b: any) => {
                resolve([a, b]);
              }
            : resolve;
      });
      addOnce(type, resolver, promise);
      return promise;
    },

    /**
     * Remove an event handler for the given type.
     *
     * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
     * @param  {Function} handler Handler function to remove
     */
    off(type: string, handler: EventHandler | Promise<any>) {
      remove(type, handler);
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * @param {String} type  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     */
    emit(type: string, evt: any) {
      handlersFor(type).forEach(handler => {
        handler(evt);
      });
      handlersFor('*').forEach(handler => {
        handler(type, evt);
      });
    },
  };
}
