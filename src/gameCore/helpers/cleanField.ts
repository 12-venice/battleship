import { getEmptyMatrix } from 'src/gameCore/helpers/getEmptyMatrix';

export const cleanField = () => ({ matrix: getEmptyMatrix(), squadron: {} });
