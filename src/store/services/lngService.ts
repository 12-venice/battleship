import { selectEn, selectRu, changeLng } from '../reducers/lng';
import { store } from '../../client';

export const lngService = {
    selectEn: () => store.dispatch(selectEn()),
    selectRu: () => store.dispatch(selectRu()),
    changeLng: () => store.dispatch(changeLng()),
};
