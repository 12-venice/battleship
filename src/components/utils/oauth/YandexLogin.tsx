export const YandexLogin = (props: string) => {
    const OAUTH_ID = '085740c0f5614f93a07ce6b4c4246a65';
    let requestUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${OAUTH_ID}`;
    requestUrl += `&redirect_uri=${window.location.origin}${props}`;
    requestUrl += '&force_confirm=yes';
    window.location.href = requestUrl;
};
