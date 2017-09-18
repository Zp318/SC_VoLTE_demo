import {combineReducers} from 'redux';
import { REFRESH_SHOW , CHOOSE_TIME , SET_LOADING} from '../actions/action';

//联动更新图表
function linkRefresh(state="",action){
	switch (action.type){
		case REFRESH_SHOW : 
			return action.id
		default: 
			return state
	}
}

//选择时间更新视图
function linkTime(state={startTime:"", endTime:""},action){
	switch (action.type){
		case CHOOSE_TIME : 
			return Object.assign({} , state , action.timeObj)
		default: 
			return state
	}
}

//设置loading图标
function linkLoading(state="",action){
	switch (action.type){
		case SET_LOADING : 
			return action.boolean
		default: 
			return state
	}
}

// 合并Reducers
const myReducers = combineReducers({
	linkRefresh,
	linkTime,
	linkLoading
});

export default myReducers;
