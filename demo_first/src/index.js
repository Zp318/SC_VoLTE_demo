import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style/index.css';
import {Provider} from "react-redux";
import {createStore,applyMiddleware,combineReducers,compose} from 'redux';
import myReducers from './reducers/reducer';
import thunkMiddleware from 'redux-thunk'; //action可以是一个函数用来发起异步请求
import {createLogger} from 'redux-logger';//action是一个标准的普通对象（plain object），用来记录nextState和action


if(!window.basePath){
	window.basePath = "http://localhost:3000/";
}

const logger = createLogger();
const initialState = {
    //monitorChartsConfig: monitorChartsConfig,
    //satisfactionChartsConfig: satisfactionChartsConfig
};

function configureStore() {
    let store;
    //开发环境
    if (module.hot) {
        /**
         * createStore(reducer,[initialState])
         * 创建一个Reduce store来存放应用中的state ，应用中只有一个state
         */
        /**
         * compose(...functions)
         * 从右向左组合多个函数
         */
        store = createStore(myReducers, initialState, compose(
            applyMiddleware(thunkMiddleware, logger), window.devToolsExtension ? window.devToolsExtension() : f => f
        ));
    } else {
        //生产环境
        store = createStore(myReducers, initialState, compose(
            applyMiddleware(thunkMiddleware), f => f
        ));
    }
    return store;
}

let store = configureStore();
ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);