export const validationPatterns: Record<
    string,
    { pattern: RegExp; error: string }
> = {
    name: {
        pattern: /^[А-ЯЁA-Z][А-ЯЁA-Zа-яёa-z-]+$/,
        error: 'This field is filled in incorrectly',
    },
    login: {
        pattern: /^(?=.*[a-zA-Z])([a-zA-Z0-9-_]){3,20}$/,
        error: 'The login is incorrect',
    },
    email: {
        pattern:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        error: 'The e-mail is incorrect',
    },
    password: {
        pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
        error: 'The password must be at least 8 characters and contain a capital letter and a number',
    },

    phone: {
        pattern: /^((\+7|7|8)+([0-9]){10})$/,
        error: 'The phone number is incorrect',
    },
};
