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
            case MESS_TYPES.ADD_MESSAGE:
                return {
                    ...state,
                    data: [...state.data, action.payload],
                    users: state.users.map(user => 
                        user._id === action.payload.recipient || user._id === action.payload.sender
                        ? {
                            ...user, 
                            text: action.payload.text, 
                            media: action.payload.media,
                        }
                        : user
                    )
                };
        default:
            return state;
    }
}

export default messageReducer;