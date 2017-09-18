export const REFRESH_SHOW = "REFRESH_SHOW";
export const CHOOSE_TIME = "CHOOSE_TIME";
export const SET_LOADING = "SET_LOADING";

//更新请求参数
export function refreshShow(id){
	return {
		type:REFRESH_SHOW,
		id
	}
}

//选择时间
export function choosTime(obj){
	return {
		type:CHOOSE_TIME,
		timeObj:obj
	}
}

//设置loading值
export function setLoading(boolean){
	return {
		type:SET_LOADING,
		boolean
	}
}