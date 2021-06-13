import GLOBAL_TYPES from './globalTypes'
import { getDataAPI } from '../../utils/fetchData'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
}


export const getProfileUsers = ({users, id, auth}) => async (dispatch) => {
    if (users.every(user => user._id !== id)) {

        try {
            dispatch({type: PROFILE_TYPES.LOADING, payload: true})
            const res = getDataAPI(`/user/${id}`, auth.token)
            
            const users = await res;
    
            dispatch({
                type: PROFILE_TYPES.GET_USER,
                payload: users.data
            })
    
            dispatch({type: PROFILE_TYPES.LOADING, payload: false})
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, 
                payload: {error: err.response.data.msg}
            })
        }
    }
    
}