import nitt from '.';

it('should default export be a function', () => {
  expect(nitt).toBeInstanceOf(Function);
});

describe('nitt#', () => {
  let events, inst;

  beforeEach(() => {
    events = Object.create(null);
    inst = nitt(events);
  });

  describe('on()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('on');
      expect(inst.on).toBeInstanceOf(Function);
    });

    it('should register handler for new type', () => {
      let foo = () => {};
      inst.on('foo', foo);

      expect(events).toHaveProperty('foo');
      expect(events.foo).toEqual([foo]);
    });

    it('should register handlers for any type strings', () => {
      let foo = () => {};
      inst.on('constructor', foo);

      expect(events).toHaveProperty('constructor');
      expect(events.constructor).toEqual([foo]);
    });

    it('should append handler for existing type', () => {
      let foo = () => {};
      let bar = () => {};
      inst.on('foo', foo);
      inst.on('foo', bar);

      expect(events).toHaveProperty('foo');
      expect(events.foo).toEqual([foo, bar]);
    });

    it('should NOT normalize case', () => {
      let foo = () => {};
      inst.on('FOO', foo);
      inst.on('Bar', foo);
      inst.on('baz:baT!', foo);

      expect(events).toHaveProperty('FOO');
      expect(events.FOO).toEqual([foo]);
      expect(events).not.toHaveProperty('foo');
      expect(events).toHaveProperty('Bar');
      expect(events.Bar).toEqual([foo]);
      expect(events).not.toHaveProperty('bar');
      expect(events).toHaveProperty('baz:baT!');
      expect(events['baz:baT!']).toEqual([foo]);
    });
  });

  describe('once()', () => {
    it('should execute handler just once', () => {
      let foo = jest.fn();
      inst.once('foo', foo);

      inst.emit('foo', 1);
      inst.emit('foo', 2);

      expect(foo).toBeCalledTimes(1);
      expect(foo).toBeCalledWith(1);
    });

    it('should remove the handler once is executed', () => {
      let foo = jest.fn();
      inst.once('foo', foo);

      expect(events.foo).toHaveLength(1);
      inst.emit('foo', 1);
      expect(events.foo).toHaveLength(0);
    });

    it('should not allow to remove a once handler', () => {
      let foo = jest.fn();
      inst.once('foo', foo);

      expect(events.foo).toHaveLength(1);
      inst.off('foo', foo);
      expect(events.foo).toHaveLength(1);
    });
  });

  describe('when()', () => {
    it('should return a promise', () => {
      let foo = jest.fn();
      const result = inst.when('foo');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve with the event', async () => {
      const promise = inst.when('foo');

      inst.emit('foo', 'event data');
      expect(await promise).toEqual('event data');
    });
  });

  describe('off()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('off');
      expect(inst.off).toBeInstanceOf(Function);
    });

    it('should remove handler for type', () => {
      let foo = () => {};
      inst.on('foo', foo);
      inst.off('foo', foo);

      expect(events).toHaveProperty('foo');
      expect(events.foo).toHaveLength(0);
    });

    it('should NOT normalize case', () => {
      let foo = () => {};
      inst.on('FOO', foo);
      inst.on('Bar', foo);
      inst.on('baz:bat!', foo);

      inst.off('FOO', foo);
      inst.off('Bar', foo);
      inst.off('baz:baT!', foo);

      expect(events).toHaveProperty('FOO');
      expect(events.FOO).toHaveLength(0);
      expect(events).not.toHaveProperty('foo');
      expect(events).toHaveProperty('Bar');
      expect(events.Bar).toHaveLength(0);
      expect(events).not.toHaveProperty('bar');
      expect(events).toHaveProperty('baz:bat!');
      expect(events['baz:bat!']).toHaveLength(1);
    });
  });

  describe('emit()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('emit');
      expect(inst.emit).toBeInstanceOf(Function);
    });

    it('should invoke handler for type', () => {
      let event = { a: 'b' };

      inst.on('foo', (one, two) => {
        expect(one).toEqual(event);
        expect(two).toBe(undefined);
      });

      inst.emit('foo', event);
    });

    it('should NOT ignore case', () => {
      let onFoo = jest.fn(),
        onFOO = jest.fn();
      events.Foo = [onFoo];
      events.FOO = [onFOO];

      inst.emit('Foo', 'Foo arg');
      inst.emit('FOO', 'FOO arg');

      expect(onFoo).toHaveBeenCalledTimes(1);
      expect(onFoo).toHaveBeenCalledWith('Foo arg');
      expect(onFOO).toHaveBeenCalledTimes(1);
      expect(onFOO).toHaveBeenCalledWith('FOO arg');
    });

    it('should invoke * handlers', () => {
      let star = jest.fn(),
        ea = { a: 'a' },
        eb = { b: 'b' };

      events['*'] = [star];

      inst.emit('foo', ea);
      expect(star).toHaveBeenCalledTimes(1);
      expect(star).toHaveBeenCalledWith('foo', ea);
      star.mockReset();

      inst.emit('bar', eb);
      expect(star).toHaveBeenCalledTimes(1);
      expect(star).toHaveBeenCalledWith('bar', eb);
    });
  });
});
