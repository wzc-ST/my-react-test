/*
 * @Description: Redux-配置
 */
import {
  compose,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
/* 中间件 */
import reduxPromise from "redux-promise";
/* redux-persist 状态持久化 */
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

/* reducer对象状态 */
import basicContentState from "./reducers/basicContentState";
/* 组合数据 */
const reducer = combineReducers({
  basicContentState,
});

/* redux-persist配置 */
const persistConfig = {
  key: "root",
  // 可以选择存在：storage，cookie，session等
  storage: storage,
  whitelist: [], // 需要缓存的数据（reducers的key）
  blacklist: [], // 不需要缓存的数据（reducers的key）
};
const persistedReducer = persistReducer(persistConfig, reducer);

/* 配置连接浏览器 Redux DevTools 扩展 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* 创建redux */
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(reduxPromise))
);

export const persistor = persistStore(store);
export default store;
