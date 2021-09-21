import { MESS_TYPES } from '../actions/messageAction'
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false
}

const messageReducer = (state = initialState, action) => {
    switch (action.type){
        case MESS_TYPES.ADD_USER:
            return {
                ...state,
                users: [action.payload, ...state.users]
            };
        default:
            return state;
    }
}

export default messageReducer;