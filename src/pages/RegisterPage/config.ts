export const headers = {
    title: 'BATTLESHIP',
    page: 'REGISTRATION',
    navigation: 'sign in',
};

export const inputs = [
    {
        validateType: 'name',
        title: 'First name',
        name: 'first_name',
        defaultValue: 'Andrey',
    },
    {
        validateType: 'name',
        title: 'Second name',
        name: 'second_name',
    },
    {
        validateType: 'login',
        title: 'Login',
        name: 'login',
    },
    {
        validateType: 'email',
        title: 'E-mail',
        name: 'email',
    },
    {
        validateType: 'phone',
        title: 'Phone',
        name: 'phone',
    },
    {
        validateType: 'password',
        title: 'Password',
        name: 'password',
        type: 'password',
    },
];

export const submitTitle = 'sign up!';
