import { TYPES } from '../actions/notifyActions';

const initialState = {};

const notifyReducer = (state=initialState, action) => {
    switch(action.type) {
        case TYPES.NOTIFY:
            return action.payload
        default:
            return state
    }
}

export default notifyReducer