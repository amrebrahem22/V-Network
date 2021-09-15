import GLOBAL_TYPES from "./globalTypes";
import { postDataAPI, deleteDataAPI } from "../../utils/fetchData";

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
