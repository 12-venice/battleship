import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import { fields, headers, submit } from './config';

export const RegisterPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className="register__main">
                <span className="register__link">{headers.title}</span>
                <span className="register__header">{headers.page}</span>
                <Form fields={fields} setData={setData} submit={submit} />
                <NavLink to="/auth">
                    <span className="register__link">{headers.navigation}</span>
                </NavLink>
            </div>
        </Layout>
    );
};
