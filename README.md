# Nitt

> Small (< 400B) functional event emitter / pubsub.

- **Small:** less than 400 bytes gzipped
- **Familiar:** similar names (on, off, once, emit) & ideas as [Node's EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- **Functional:** methods don't rely on `this`
- **Modern:** Uses ES2015/ES6 features `Promise`, `Map`.
- **No dependency:** Nitt has no external dependencies

## Table of Contents

- [Nitt](#nitt)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
  - [API](#api)
    - [nitt](#nitt)
    - [on](#on)
    - [once](#once)
    - [when](#when)
    - [off](#off)
    - [emit](#emit)
  - [Contribute](#contribute)
  - [Acknowledments](#acknowledments)
  - [License](#license)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save nitt
```

## Usage

```js
import nitt from 'nitt';

const emitter = nitt();

// listen to an event
emitter.on('foo', e => console.log('foo', e));

// listen to all events
emitter.on('*', (type, e) => console.log(type, e));

// listen for a one-time event
emitter.once('foo', e => console.log('foo', e));

// wait for a one-time event using a promise
emitter.when('foo').then(e => console.log('foo', e));

// wait for any event using a promise
// note: In this special case, the promise resolves to array value
emitter.when('*').then(([type, e]) => console.log(type, e));

// fire an event
emitter.emit('foo', { a: 'b' });

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo); // listen
emitter.off('foo', onFoo); // unlisten

// one-time listeners
emitter.once('foo', onFoo); // listen
emitter.off('foo', onFoo); // unlisten

// promises
const promise = emitter.when('bar'); // listen
emitter.off('bar', promise); // unlisten
```

## API

### nitt

Nitt: functional event emitter / pubsub.

**Parameters**

- `all` **EventHandlerMap**

Returns **Nitt**

### on

Register an event handler for the given type.

**Parameters**

- `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to listen for, or `"*"` for all events
- `handler` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Function to call in response to given event

### once

Register an event handler that is executed just once.

**Parameters**

- `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to listen for, or `"*"` for all events
- `handler` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Function to call in response to given event

### when

Returns a promise for a single event

**Parameters**

- `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to listen for, or `"*"` for all events

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)**

### off

Remove an event handler for the given type.

**Parameters**

- `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to unregister `handler` from, or `"*"`
- `handler` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Handler function to remove

### emit

Invoke all handlers for the given type.
If present, `"*"` handlers are invoked after type-matched handlers.

**Parameters**

- `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The event type to invoke
- `evt` **Any?** Any value (object is recommended and powerful), passed to each handler

## Contribute

If you want to contribute, I would be happy to look in to your PRs.

## Acknowledments

I would like to thank [Jason Miller](https://jasonformat.com/) (@developit) for developing `mitt`. `nitt` is no more than just `mitt` with a few extras.

## License

[MIT License](https://opensource.org/licenses/MIT)
