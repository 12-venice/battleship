// TODO: удалить компонент после окончания разборок с ssr
import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

const Home = () => <h2>Home Page</h2>;
const Contacts = () => <h2>Contacts Page</h2>;

export const EmptyApp: React.FC = () => (
    <div>
        <p>
            <Link to="/">Home</Link>
        </p>
        <p>
            <Link to="/contacts">Contacts</Link>
        </p>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contacts />} />
        </Routes>
    </div>
);

// eslint-disable-next-line import/no-default-export
export default hot(EmptyApp);
