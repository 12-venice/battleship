/**
 * Расширим глобальный тип Window, чтобы мы могли обращаться к новому глобальному свойству:
 */

export {};

declare global {
    interface Window {
        // В d.ts нам неважно что это за тип,
        // так как он сразу попадает в redux store на клиенте
        __PRELOADED_STATE__?: object;
        // для redux devtools
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
