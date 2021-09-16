import GLOBAL_TYPES from "./globalTypes";
import { postDataAPI, deleteDataAPI, getDataAPI } from "../../utils/fetchData";

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES'
}

export const createNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        const res = await postDataAPI("notify", msg, auth.token);
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

export const removeNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        const res = await deleteDataAPI(
            `notify/${msg.id}?url=${msg.url}`,
            auth.token
        );
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

export const getNotifies = (token) => async dispatch => {
    try {
        const res = await getDataAPI('notifies', token)

        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};
