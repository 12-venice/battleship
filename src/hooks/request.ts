import { useHttp } from "./http.hook";

export const req = async () => {
    const { request } = useHttp()
    const data = await request('/api/game/invite', 'POST', {}, {
        Authorization: `Bearer 1`,
    });
    return data
};