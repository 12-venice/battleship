import { fieldsProps } from 'src/components/Form/types';
import { validationPatterns } from './validationPatterns';

export const validation = (fields: fieldsProps[], values: {}) => {
    let valid = true;
    const newFields = fields.slice();
    for (let index = 0; index < newFields.length; index += 1) {
        const { name } = newFields[index];
        const value = values[name as keyof typeof values];
        if (name) {
            const { pattern, error } = validationPatterns[name];
            if (!pattern) {
                throw new SyntaxError('ERROR - no validation pattern found');
            }
            if (!pattern.test(value)) {
                valid = false;
                newFields[index] = {
                    ...newFields[index],
                    ...{
                        defaultValue: value,
                        className: 'validate invalid',
                        validateMsgFalse: error,
                    },
                };
            } else {
                newFields[index] = {
                    ...newFields[index],
                    ...{
                        defaultValue: value,
                        className: 'validate valid',
                    },
                };
            }
        }
    }
    return { valid, newFields };
};
