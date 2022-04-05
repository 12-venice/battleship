import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';

export const AuthPage = (): JSX.Element => {
    const [form, setForm] = useState({
        Login: '',
        Password: '',
    });
    const childrensUp = <span className="auth__header">AUTHORIZATION</span>;
    const childrensDown = (
        <NavLink to="/">
            <Button title="sign in!" />
        </NavLink>
    );
    return (
        <Layout>
            <Form
                form={form}
                setForm={setForm}
                childrensUp={childrensUp}
                childrensDown={childrensDown}
            />
        </Layout>
    );
};
