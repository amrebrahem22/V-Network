import { postDataAPI } from '../../utils/fetchData'
import { TYPES as NOTIFY_TYPES } from './notifyActions'

export const TYPES = {
    AUTH: 'AUTH',
}

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: NOTIFY_TYPES.NOTIFY, payload: {loading: true} })
        const res = await postDataAPI('login', data)
        dispatch({ 
            type: TYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: NOTIFY_TYPES.NOTIFY, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: NOTIFY_TYPES.NOTIFY, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}