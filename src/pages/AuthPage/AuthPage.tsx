import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';

export const AuthPage = (): JSX.Element => {
    // eslint-disable-next-line no-unused-vars
    const [form, setForm] = useState({});

    const submit = <Button type="submit" title="sign in!" />;

    const fields = [
        {
            type: 'login',
            title: 'Login',
        },
        {
            type: 'password',
            title: 'Password',
        },
    ];

    return (
        <Layout>
            <div className="auth__main">
                <span className="auth__link">BATTLESHIP</span>
                <span className="auth__header">AUTHORIZATION</span>
                <Form fields={fields} setData={setForm} submit={submit} />
                <NavLink to="/register">
                    <span className="auth__link">sign up</span>
                </NavLink>
            </div>
        </Layout>
    );
};
