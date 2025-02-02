import { Collection, WeakCollection, type Group } from "./group.js";

export type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap;

type DefaultEventMap = [never];

type Args<K, T> = T extends DefaultEventMap
  ? [...args: any[]]
  : K extends keyof T
  ? T[K]
  : never;

type EventName<K, T> = T extends DefaultEventMap
  ? string | symbol | number
  : K | keyof T;

type Listener<K, T> = T extends DefaultEventMap
  ? (...args: any[]) => void
  : K extends keyof T
  ? T[K] extends unknown[]
    ? (...args: T[K]) => void
    : never
  : never;

export type ExtractEventMap<T> = T extends Emitter<infer U> ? U : never;

export default class Emitter<T extends EventMap<T>> {
  private listeners = new Collection<EventName<any, T>, Function>();
  private onces = new WeakCollection<Group<Function>, Function>();

  on<K>(eventName: EventName<K, T>, listener: Listener<K, T>): this {
    this.listeners.group(eventName).push(listener);
    return this;
  }

  once<K>(eventName: EventName<K, T>, listener: Listener<K, T>): this {
    const l = this.listeners.group(eventName);
    this.onces.group((l.push(listener), l)).push(listener);
    return this;
  }

  off<K>(eventName: EventName<K, T>, listener: Listener<K, T>): this {
    this.listeners.get(eventName)?.deleteOne(listener);
    this.listeners.trim();
    return this;
  }

  emit<K>(eventName: EventName<K, T>, ...args: Args<K, T>): boolean {
    const l = this.listeners.get(eventName);
    l?.forEach(async (i) => i(...args));
    if (l) this.onces.once(l)?.forEach((i) => l.deleteOne(i));
    this.listeners.trim();
    return true;
  }

  clear<K>(eventName: EventName<K, T>, ...args: Args<K, T>): this {
    this.listeners.delete(eventName);
    return this;
  }
}
