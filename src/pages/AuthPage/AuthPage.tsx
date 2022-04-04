import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';

export const AuthPage = (): JSX.Element => {
    const childrensUp = <span className="auth__header">AUTHORIZATION</span>;
    const childrensDown = (
        <NavLink to="/">
            <Button title="sign in!" />
        </NavLink>
    );
    const inputs = [{ title: 'Login' }, { title: 'Password' }];
    return (
        <Layout>
            <Form
                inputs={inputs}
                childrensUp={childrensUp}
                childrensDown={childrensDown}
            />
        </Layout>
    );
};
