import { NavLink } from 'react-router-dom';
import { Form } from 'src/components/Form';
import { Layout } from '../../components/Layout';
import { fields, headers, submit } from './config';

export const AuthPage = (): JSX.Element => {
    const setData = (data: {}) => data;

    return (
        <Layout>
            <div className="auth__main">
                <span className="auth__link">{headers.title}</span>
                <span className="auth__header">{headers.page}</span>
                <Form fields={fields} setData={setData} submit={submit} />
                <NavLink to="/register">
                    <span className="auth__link">{headers.navigation}</span>
                </NavLink>
            </div>
        </Layout>
    );
};
