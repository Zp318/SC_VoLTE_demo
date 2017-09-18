import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import $ from 'jquery';
import moment from 'moment';



import 'antd/dist/antd.min.css';
import '../style/table.css';
import urls from '../url/urls';    //路径
import {connect} from 'react-redux';
import { refreshShow } from "../actions/action.js";

class AreaFour extends Component{
	constructor(props){
		super(props);

		this.state={
			target:null,
			theader:[],
			tbody:[],
			dataLength:null,
			width:190,
			currpage:1
		}
	};

	//跳转
	cellPopHtml(item,text,record){

		let timeObj = this.props.timeObj;
		let start = timeObj.startTime;
		let end = timeObj.endTime;

		let columnId = item['dataIndex'];
		let cityName = record['L2_NAME'];
		let cityCode = record['L2_ID'];

		let encodeName = encodeURI(cityName);

		let l2regionid = cityCode;
		let l2regionname = encodeName;
		let rillType = columnId;

		let params="?startTime=" + start + "&endTime=" + end + "&l2regionid=" + l2regionid + "&l2regionname=" + l2regionname + "&rillType=" + rillType;
		if(window.top.showTabPanel && $.type( window.top.showTabPanel ) === "function"){
			window.top.showTabPanel("质差小区列表",params.replace(/[^\w]/gi,""),urls.popHtml+params);
		}else{
			window.open(urls.popHtml + params);
		}

	};

	pageChange(page){
		let clickPage = page;
		this.setState({currpage: clickPage})
	};

	componentWillReceiveProps(nextProps){

		this.setState({tbody: []});
		this.setState({theader: []});
		this.setState({currpage: 1});

		const { dispatch, timeObj } = nextProps;

		let me=this;

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: urls.cityTable,
			data:{...timeObj},
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			}
		}).done((res) => {
			
			let code = res.code;
			if(code == "200"){
				//headData

				let headData = res.header;
				let bodyData = res.data;

				//按照列数摆放
				let copyHeadDate = headData.concat([]);
				let copyBodyDate = bodyData.concat([]);

				this.setState({dataLength: copyHeadDate.length})

				copyHeadDate.sort((x,y) => {
					return x['order'] - y['order']
				})

				let numReg = /^\d+(\.\d+)?$/;   //数字或有小数点的数字排序
				
				let len = copyHeadDate.length;

				copyHeadDate.map((item,index) => {
					item['width'] = this.state.width;   //定宽度，不受

					item['sorter'] = (a,b) => {

						let singleDate = a[item['dataIndex']];
						let returnType;

						if(singleDate !== undefined){
							if(numReg.test(singleDate)){  //纯数字
								return a[item['dataIndex']] - b[item['dataIndex']];
							}else{      //字符串排序
								return a[item['dataIndex']].length - b[item['dataIndex']].length;
							}
						}
					}

					return item;
				});

				//判断哪一个可以下钻
				copyHeadDate.filter((item, index) => {

					if(item.rillDown == "true"){

						item['render'] = (text,record,index) => {

							return <span className="clickType" onClick={me.cellPopHtml.bind(this,item,text,record)}>{text}</span>;

						}
					}
				});
				
				 this.setState({theader: copyHeadDate});
				 this.setState({tbody: copyBodyDate});
			}

		}).fail((err) => {
			console.log("error")
		})

	};

	//导出
	exportExcelFun(){
		const { dispatch, timeObj } = this.props;

		$.ajax({
			type: 'POST',
			url: urls.cityTableExport,
			data: {...timeObj},
			dataType: 'json',
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			}
		}).done((res) => {

			if(res.code == "200"){

				let path = res.path;

				window.open(path)
			}

		}).fail((err) => {
			console.log("error");
		})
	};

	render(){

		const widthX = this.state.width * this.state.dataLength;

		const title = 'VoLTE 通话时长报表';

		const tabelObj = {
			columns: this.state.theader,
			size: 'small',
			dataSource: this.state.tbody,
			pagination: {
				defaultPageSize: 10,
				current: this.state.currpage,
				onChange: this.pageChange.bind(this)
			},
			scroll: {
				x: widthX
			}
		};

		return (

			<div id="AreaFour">

				<div className="title">
					<ul>
						<li>
							<span>{title}</span>
	
						</li>
						<li className = "exportExcel" onClick = {this.exportExcelFun.bind(this)}>
							<Icon type="export"/>
						</li>
					</ul>
				</div>

				<div className="tableShow">
					<Table {...tabelObj}  />
				</div>

			</div>
		)



	}
}

function mapStateToProps(state){
	return {
		timeObj:state.linkTime
	}
}

export default connect(mapStateToProps)(AreaFour);
