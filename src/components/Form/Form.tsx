import { Input } from '../Input';
import { formProps, inputProps } from '../utils/ErrorBoundary/types';

export const Form = ({
    inputs,
    childrensUp,
    childrensDown,
}: formProps): JSX.Element => (
    <div className="form__main">
        {childrensUp}
        <form className="form__block">
            {inputs.map(
                (input: inputProps): JSX.Element => (
                    <Input className={input.className} title={input.title} />
                ),
            )}
        </form>
        {childrensDown}
    </div>
);
