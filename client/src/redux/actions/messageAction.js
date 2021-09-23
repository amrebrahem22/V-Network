export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
}



export const addUser = ({message, user}) => async (dispatch) =>{
    
    if (message.users.every(item => item._id !== user._id)) {
        dispatch({type: MESS_TYPES.ADD_USER, payload: user})
    }
}

export const addMessage = ({msg, auth, socket}) => async (dispatch) =>{
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
    
}