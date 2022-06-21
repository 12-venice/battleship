const randomIntFromInterval = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const botNames = [
    { first_name: 'Captain', second_name: 'Jack' },
    { first_name: 'Генри', second_name: 'Морган' },
    { first_name: 'Фрэнсис', second_name: 'Дрейк' },
    { first_name: 'Черная', second_name: 'Борода' },
];

const botMessages = [
    'Парень! Локоть к локтю мы пройдем через пару боченков рома!',
    'Ahoy! На палубе!',
    'Якорь вам в глотку!',
    'Что ещё за пресноводных моллюсков притащило, разрази меня гром!',
    'Ща задницу порву на щупальца осьминога!',
    'Есть только один флаг и он такой же черный, как черны наши сердца',
    'Парень! Локоть к локтю мы пройдем через пару боченков рома!',
    'Старому Морскому волку нет забот до гальюнных прихвостней!',
    'Всю жизнь будешь палубу драить!',
    'Прощелыга подкильная, не видать тебе сокровища как этой мачты в моей заднице!',
];

export const getBot = () => {
    const rnd = randomIntFromInterval(0, botNames.length - 1);
    return {
        _id: 'bot',
        id: 1,
        avatar: '',
        first_name: botNames[rnd].first_name,
        second_name: botNames[rnd].second_name,
        display_name: `${botNames[rnd].first_name} ${botNames[rnd].second_name}`,
        email: '',
        login: '',
        phone: '',
        rooms: [],
    };
};

export const getBotMessage = () => {
    const rnd = randomIntFromInterval(0, botMessages.length - 1);
    return {
        _id: 'bot1',
        user: getBot(),
        date: Date.now(),
        text: botMessages[rnd],
        delivered: false,
        createdAt: Date.now() as unknown as Date,
    };
};
