import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';

export const RegisterPage = (): JSX.Element => {
    // eslint-disable-next-line no-unused-vars
    const [form, setForm] = useState({});

    const submit = <Button type="submit" title="sign up!" />;

    const fields = [
        {
            type: 'first_name',
            title: 'First name',
        },
        {
            type: 'second_name',
            title: 'Second name',
        },
        {
            type: 'login',
            title: 'Login',
        },
        {
            type: 'email',
            title: 'E-mail',
        },
        {
            type: 'phone',
            title: 'Phone',
        },
        {
            type: 'password',
            title: 'Password',
        },
    ];

    return (
        <Layout>
            <div className="register__main">
                <span className="register__link">BATTLESHIP</span>
                <span className="register__header">REGISTRATION</span>
                <Form fields={fields} setData={setForm} submit={submit} />
                <NavLink to="/auth">
                    <span className="register__link">sign in</span>
                </NavLink>
            </div>
        </Layout>
    );
};
