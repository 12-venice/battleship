import { Button } from 'src/components/Button';

export const headers = {
    title: 'BATTLESHIP',
    page: 'AUTHORIZATION',
    navigation: 'sign up',
};

export const fields = [
    {
        type: 'login',
        title: 'Login',
    },
    {
        type: 'password',
        title: 'Password',
    },
];
export const submit = Button({ type: 'submit', title: 'sign in!' });
