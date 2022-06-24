import { activeFieldList } from './types';

export function reverseStatistics(statistics: any[]) {
    const cloneStatistics: any[] = statistics.slice();
    const result = cloneStatistics.map((element) => {
        const clone: any = {};
        Object.assign(clone, element);
        clone[activeFieldList.invited] = element[activeFieldList.created];
        clone[activeFieldList.created] = element[activeFieldList.invited];
        return clone;
    });
    return result;
}
