import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {DatePicker} from 'antd';
import {LocaleProvider} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

import $ from 'jquery';

import 'antd/dist/antd.min.css';
import '../style/datePicker.css';
import urls from '../url/urls';
import {connect} from 'react-redux';
import { choosTime , setLoading} from "../actions/action.js";


//解析地址
//获取地址栏参数//可以是中文参数
function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}

class AreaOne extends Component{
	constructor(props){
		super(props);
 
		let cur=moment(Date.now()).format("YYYY-MM-DD");  
		let installEndDate = moment(cur).valueOf();
		let installStartDate=moment(installEndDate - 1*24*60*60*1000).valueOf();

		this.state = {
			redNote:'none',
			initStart:installStartDate,    //初始化的从后台获取后不会自动改变的
			initEnd: installEndDate,
			startValue: installStartDate,   // null
			endValue: installEndDate    // null
		}
	};

	//更改开始时间
	onStartChange(date){

		let triggle = moment(date).valueOf();
		let timeformat = moment(triggle).format("YYYY-MM-DD");   //转换为00:00
		let clickDate = moment(timeformat).valueOf();

		if(clickDate != NaN){

			 this.setState({startValue:moment(clickDate).valueOf()})
	   		 this.setState({endValue:moment(clickDate + 1*24*60*60*1000).valueOf()})
		}
	};
	//更改结束时间
	onEndChange(date){

		let triggle = moment(date).valueOf();
		let timeformat = moment(triggle).format("YYYY-MM-DD");   //转换为00:00
		let clickDate = moment(timeformat).valueOf();

		if(clickDate != NaN){

			 this.setState({startValue:moment(clickDate - 1*24*60*60*1000).valueOf()});
	   		 this.setState({endValue:moment(clickDate).valueOf()});
		}
	};

	//不可选择的开始时间
	disableStartDate(_time){

		let time = moment(_time).valueOf();
		let maxTime = this.state.initStart;
		let minTime = this.state.initEnd - 30*24*60*60*1000;

		//不能被选择的情况
		return time < minTime || time > maxTime;

	};
	//不可选择的结束时间
	disableEndDate(_time){

		let time = moment(_time).valueOf();
		let maxTime = this.state.initEnd;
		let minTime = this.state.initEnd - 29*24*60*60*1000;

		//不能被选择的情况
		return time < minTime || time > maxTime;

	};
	//点击query 
	handleQuery(){
		var me =this;
		const { dispatch } = me.props;
		let startTime = this.state.startValue;
		let endTime = this.state.endValue;

		// 切换查询时间
		dispatch(choosTime({ startTime:parseInt(startTime/1000), endTime:parseInt(endTime/1000) }));
		dispatch(setLoading(true));
		if(startTime ===  null || startTime ===  undefined || 
			startTime === NaN || endTime ===  null || 
				endTime ===  undefined || endTime === NaN){

			this.setState({redNote:'inline-block'});

		}else{ 
			//start 和 end 都有值得情况   去掉红色标记
			this.setState({redNote:'none'});
			
		}

	};


	//  创建真实的 DOM
	componentDidMount(){
		var me = this;
		const { dispatch } = me.props;
		var start = getUrlParam("startTime");
		var end = getUrlParam("endTime");
		if(+start > 0){
				var endCurr = moment(end*1000).valueOf();
				var startCurr = moment(start*1000).valueOf();

				this.setState({initStart: startCurr});
				this.setState({initEnd: endCurr});
				this.setState({startValue: startCurr});
				this.setState({endValue: endCurr});

				// 初始化时间
				dispatch(choosTime({startTime:+start, endTime:+end}));
				this.setState({});
		}else{
			$.ajax({
				type: 'GET',
				url: urls.datePicker,
				dataType: 'json',
				headers:{
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
					"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
				}

			}).done((res) => {
				if(res.code == "200"){
					var curr = res.data['crrtime']*1000;
					var endCurr = moment(curr).valueOf();
					var startCurr = moment(curr - 1*24*60*60*1000).valueOf();

					this.setState({initStart: startCurr});
					this.setState({initEnd: endCurr});
					this.setState({startValue: startCurr});
					this.setState({endValue: endCurr});
				}
				// 初始化时间
				dispatch(choosTime({startTime:res.data.crrtime-3600*24, endTime:res.data.crrtime}));
				this.setState({});
			}).fail((err) => {
				console.log("error")
			})

		}
	};
	
	// 4. 渲染一个虚拟的 DOM
	render(){
		const StartObj={
			onChange:(value) => this.onStartChange(value),
			placeholder: "Start Time",
			value: moment(this.state.startValue),
			disabledDate: this.disableStartDate.bind(this),
			allowClear: false
		
		};

		const EndObj={
			onChange:value => this.onEndChange(value),
			placeholder: "End Time",
			value: moment(this.state.endValue),
			disabledDate: this.disableEndDate.bind(this),
			allowClear: false
		};

		const DateFormat = "YYYY-MM-DD";

		return (
			<div className="datePicker">

					<LocaleProvider locale={enUS}>
						<ul>
							<li><span>时间范围：</span></li>

							<li>
								<DatePicker {...StartObj} defaultValue={moment(moment(this.state.initStart),DateFormat)}/>
							</li>

							<li className="dash">
								<span></span>
							</li>

							<li>
								<DatePicker {...EndObj} defaultValue={moment(moment(this.state.initEnd),DateFormat)}/>
							</li>

							<li className="query" onClick={this.handleQuery.bind(this)}>
								<span>查询</span>
							</li>

							<li className="redNote" style={{"display": this.state.redNote}}>
								<span>开始时间和结束时间不能为空</span>
							</li>

						</ul>
					</LocaleProvider>
			</div>
		)
	};
}

export default connect()(AreaOne);

  
