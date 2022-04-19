import { createSelector } from 'reselect';
import { AllStateTypes } from 'src/store/reducers/index';

const userNameSelector = createSelector(
    (state: AllStateTypes) => state.user.item?.display_name,
    (userName) => userName,
);

export const mapStateToProps = (state: AllStateTypes) => ({
    display_name: userNameSelector(state),
});
