import { IShipData, ShipType } from 'src/gameCore/types';

export const SHIP_DATA: IShipData = {
    [ShipType.fourDeck]: { shipCount: 1, deckCount: 4 },
    [ShipType.tripleDeck]: { shipCount: 2, deckCount: 3 },
    [ShipType.doubleDeck]: { shipCount: 3, deckCount: 2 },
    [ShipType.singleDeck]: { shipCount: 4, deckCount: 1 },
};
