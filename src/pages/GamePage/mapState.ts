import { createSelector } from 'reselect';
import { AllStateTypes } from 'src/store/reducers/index';

const userNameSelector = createSelector(
    (state: AllStateTypes) => state.user.item?.display_name,
    (userName) => userName,
);

const userAvatarSelector = createSelector(
    (state: AllStateTypes) => state.user.item?.avatar,
    (userName) => userName,
);

const opponentNameSelector = createSelector(
    (state: AllStateTypes) => state.opponent.item?.display_name,
    (userName) => userName,
);

export const mapStateToProps = (state: AllStateTypes) => ({
    display_name: userNameSelector(state),
    avatar: userAvatarSelector(state),
    opponent_display_name: opponentNameSelector(state),
});
