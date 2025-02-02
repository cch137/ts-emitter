export default class Group<T> extends Array<T> {
  static readonly Group = Group;

  constructor(...items: T[]) {
    super(...items);
  }

  add(...items: T[]): this {
    items.forEach((item) => {
      if (!this.has(item)) this.push(item);
    });
    return this;
  }

  delete(item: T): boolean {
    let found = false;
    for (let i = this.length - 1; i > -1; i--) {
      if (this[i] === item) {
        this.splice(i, 1);
        if (!found) found = true;
      }
    }
    return found;
  }

  deleteLast(item: T): boolean {
    for (let i = this.length - 1; i > -1; i--) {
      if (this[i] === item) {
        this.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  deleteOne(item: T): boolean {
    const length = this.length;
    for (let i = 0; i < length; i++) {
      if (this[i] === item) {
        this.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  has(item: T): boolean {
    return this.includes(item);
  }

  clear(): void {
    this.splice(0);
  }
}

export { Group };

export class Collection<K = any, V = any> extends Map<K, Group<V>> {
  group(key: K): Group<V> {
    if (super.has(key)) return super.get(key)!;
    const g = new Group<V>();
    return super.set(key, g), g;
  }

  once(key: K): Group<V> | undefined {
    const g = super.get(key);
    return super.delete(key), g;
  }

  trim() {
    [...this].forEach(([k, g]) => {
      if (g.length === 0) this.delete(k);
    });
  }
}

export class WeakCollection<
  K extends WeakKey = object,
  V = any
> extends WeakMap<K, Group<V>> {
  group(key: K): Group<V> {
    if (super.has(key)) return super.get(key)!;
    const g = new Group<V>();
    return super.set(key, g), g;
  }

  once(key: K): Group<V> | undefined {
    const g = super.get(key);
    return super.delete(key), g;
  }
}
