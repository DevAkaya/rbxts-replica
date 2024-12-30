// Type definition for a Connection


export type Connection<T> = {

    Disconnect(): void;
}



export type SignalParams<T> = Parameters<
	T extends unknown[] ? (...args: T) => never : T extends unknown ? (arg: T) => never : () => never
>;
export type SignalCallback<T> = (...args: SignalParams<T>) => unknown;
export type SignalWait<T> = T extends unknown[] ? LuaTuple<T> : T;

// Type definition for a Signal
export class Signal<T extends unknown[] | unknown> {

    Connect(callback: SignalCallback<T>): Connection<T>
    GetListenerCount(): number;
    Fire(...args: unknown[]): void;
    FireUntil(continueCallback: () => boolean, ...args: unknown[]): void;
}
