# Toast And Loading

-   in `client/src/redux/actions/globalActions.js`

```js
const GLOBAL_TYPES = {
	AUTH: "AUTH",
	ALERT: "ALERT",
};
export default GLOBAL_TYPES;
```

-   and in `client/src/redux/actions/authActions.js`

```js
import { postDataAPI } from "../../utils/fetchData";
import GLOBAL_TYPES from "./globalTypes";

// data => { email: '', password: '' }
export const login = (data) => async (dispatch) => {
	try {
		// 1.Start Loading
		dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
		const res = await postDataAPI("login", data);
		// 2.set the loaded data
		dispatch({
			type: GLOBAL_TYPES.AUTH,
			payload: {
				token: res.data.access_token,
				user: res.data.user,
			},
		});

		localStorage.setItem("firstLogin", true);
		// 3. set success message and remove the loading
		dispatch({
			type: GLOBAL_TYPES.ALERT,
			payload: {
				success: res.data.msg,
			},
		});
	} catch (err) {
		dispatch({
			type: GLOBAL_TYPES.ALERT,
			payload: {
				error: err.response.data.msg,
			},
		});
	}
};

export const refreshToken = () => async (dispatch) => {
	// 1. if already logged in
	const firstLogin = localStorage.getItem("firstLogin");

	if (firstLogin) {
		try {
			dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
			const res = await postDataAPI("refresh_token");
			dispatch({
				type: GLOBAL_TYPES.AUTH,
				payload: {
					token: res.data.access_token,
					user: res.data.user,
				},
			});

			dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
		} catch (err) {
			dispatch({
				type: GLOBAL_TYPES.ALERT,
				payload: {
					error: err.response.data.msg,
				},
			});
		}
	}
};
```

-   in `redux/reducers/authReducer.js`

```js
import GLOBAL_TYPES from "../actions/globalTypes";

const initialState = {};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case GLOBAL_TYPES.AUTH:
			return action.payload;
		default:
			return state;
	}
};

export default authReducer;
```

-   in `redux/reducers/alertReducer.js`

```js
import GLOBAL_TYPES from "../actions/globalTypes";

const initialState = {};

const alertReducer = (state = initialState, action) => {
	switch (action.type) {
		case GLOBAL_TYPES.ALERT:
			return action.payload;
		default:
			return state;
	}
};

export default alertReducer;
```

-   in `redux/reducers/index.js`

```js
import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";

export default combineReducers({
	auth,
	alert,
});
```

-   in `redux/store.js`

```js
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers/index";

import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

const DataProvider = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
```

-   in `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataProvider from "./redux/store";

ReactDOM.render(
	<React.StrictMode>
		<DataProvider>
			<App />
		</DataProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals();
```

-   in `src/customRouer/PageRender.js` i created custom routes

```js
import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";

const generatePage = (pageName) => {
	// 3.get the page with this name in the url
	const component = () => require(`../pages/${pageName}`).default;

	try {
		// 4. if exist create element, else render not found page
		return React.createElement(component());
	} catch (err) {
		return <NotFound />;
	}
};

const PageRender = () => {
	// 1. get the page from the params
	const { page, id } = useParams();

	let pageName = "";

	if (id) {
		pageName = `${page}/[id]`;
	} else {
		pageName = `${page}`;
	}

	// 2. generate a new component based on the page name
	return generatePage(pageName);
};

export default PageRender;
```

-   and in `app.js` we us `PageRender` to render our page, and added the `Alert` Component

```js
import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageRender from "./customRouter/PageRender";
import Alert from "./components/alert/Alert";
import "./App.css";
import Login from "./pages/login";
import Home from "./pages/home";
import { refreshToken } from "./redux/actions/authActions";

function App() {
	const { auth } = useSelector((state) => state);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refreshToken());
	}, [dispatch]);

	return (
		<Router>
			<Alert />
			<input type="checkbox" id="theme" />
			<div className="App">
				<div className="main">
					<Route
						exact
						path="/"
						component={auth.token ? Home : Login}
					/>
					<Route exact path="/:page" component={PageRender} />
					<Route exact path="/:page/:id" component={PageRender} />
				</div>
			</div>
		</Router>
	);
}

export default App;
```

-   and in `components/alert/Alert.js` will handle it based on the action

```js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import GLOBAL_TYPES from "../../redux/actions/globalTypes";
import Loading from "./Loading";
import Toast from "./Toast";

function Alert() {
	const { alert } = useSelector((state) => state);
	const dispatch = useDispatch();

	// if loading will render loading
	// and handleShow => will dispatch an action with empty object in the payload to reset the state to {}
	return (
		<div>
			{alert.loading && <Loading />}
			{alert.error && (
				<Toast
					msg={{ title: "Error", body: alert.error }}
					handleShow={() =>
						dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} })
					}
					bgColor="bg-danger"
				/>
			)}
			{alert.success && (
				<Toast
					msg={{ title: "Success", body: alert.success }}
					handleShow={() =>
						dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} })
					}
					bgColor="bg-success"
				/>
			)}
		</div>
	);
}

export default Alert;
```

-   and in `components/alert/Loading.js`

```js
import React from "react";

const Loading = () => {
	return (
		<div
			className="position-fixed w-100 h-100 text-center loading"
			style={{
				background: "#0008",
				color: "white",
				top: 0,
				left: 0,
				zIndex: 50,
			}}
		>
			<svg width="205" height="250" viewBox="0 0 40 50">
				<polygon
					stroke="#fff"
					strokeWidth="1"
					fill="none"
					points="20,1 40,40 1,40"
				/>
				<text fill="#fff" x="5" y="47">
					Loading
				</text>
			</svg>
		</div>
	);
};

export default Loading;
```

-   and in `components/alert/Toast.js`

```js
import React from "react";

const Toast = ({ msg, handleShow, bgColor }) => {
	return (
		<div
			className={`toast show position-fixed text-light ${bgColor}`}
			style={{ top: "5px", right: "5px", minWidth: "200px", zIndex: 50 }}
		>
			<div className={`toast-header text-light ${bgColor}`}>
				<strong className="mr-auto text-light">{msg.title}</strong>
				<button
					className="ml-2 mb-1 close text-light"
					onClick={handleShow}
					data-dismiss="toast"
					style={{
						outline: "none",
						background: "none",
						border: "none",
						marginLeft: "auto",
					}}
				>
					&times;
				</button>
			</div>
			<div className="toast-body">{msg.body}</div>
		</div>
	);
};

export default Toast;
```

-   and in `src/styles/loading.css`

```css
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
}
.loading svg {
	font-size: 5px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1.2px;
	animation: text 1s ease-in-out infinite;
}
@keyframes text {
	50% {
		opacity: 0.1;
	}
}
.loading polygon {
	stroke-dasharray: 22;
	stroke-dashoffset: 1;
	animation: dash 4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate-reverse;
}
@keyframes dash {
	to {
		stroke-dashoffset: 234;
	}
}
```

-   in `App.css`

```css
/* LOADING STYLES */
@import url("./styles/loading.css");
```
