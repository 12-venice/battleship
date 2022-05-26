/**
 * Создание стора на клиенте
 */

import configureStore from '../../store/store';
import reducers from '../../store/reducers';

// скопировать стейт полученный на сервере
const state = window.__INITIAL_STATE__;
// удалить из window, чтобы не дублировать
delete window.__INITIAL_STATE__;

// создать хранилище из данных с сервера
const { store: reduxStore } = configureStore(reducers, state, { isLogger: true });

export { reduxStore };
