type User = {};
type Room = {};

type Ship = {
    hits: number;
    kx: number;
    ky: number;
    type: number;
    x: number;
    y: number;
    arrDecks: Array<Array<number>>;
};

type Field = {
    matrix: Array<Array<number>>;
    squadron: Record<string, Ship>;
};

type Game = {
    room: Room;
    first_player: User;
    second_player: User;
    first_field: undefined | Field;
    second_field: undefined | Field;
};

// type DataShip = {
//     hits: number;
//     kx: number;
//     ky: number;
//     type: number;
//     x: number;
//     y: number;
//     arrDecks: Array<Array<number>>;
// };

// type RenderShip = {
//     decCount: number;
//     id: string;
//     isHorizontal: boolean;
//     isRip: boolean;
//     x: number;
//     y: number;
// };

// type DataField = {
//     matrix: Array<Array<number>>;
//     squadron: Record<string, DataShip>;
// };

// type RenderField = {
//     matrix: Array<Array<number>>;
//     ships: Array<RenderShip>;
// };

// type Game = {
//     room: Room;
//     first_player: User;
//     second_player: User;
//     first_data_field: undefined | DataField;
//     second_data_field: undefined | DataField;
//     first_render_field: undefined | RenderField;
//     second_render_field: undefined | RenderField;
// };

const game: Game = {};
const field = {
    matrix: ['s', ['s'], 2],
    squadron: {},
}
