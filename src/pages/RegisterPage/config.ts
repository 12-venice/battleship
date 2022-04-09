import { Button } from 'src/components/Button';

export const headers = {
    title: 'BATTLESHIP',
    page: 'REGISTRATION',
    navigation: 'sign in',
};

export const fields = [
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

export const submit = Button({ type: 'submit', title: 'sign up!' });
