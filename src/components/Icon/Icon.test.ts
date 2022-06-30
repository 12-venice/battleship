import { Icon } from "./Icon";
import TestRenderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = TestRenderer.create(Icon({ type: 'call' })).toJSON();
    expect(tree).toMatchSnapshot();
});