import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import $ from 'jquery';
import moment from 'moment';


import 'antd/dist/antd.min.css';
import '../style/table.css';
import urls from '../url/urls';    //路径


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

class Mytable extends Component{
	constructor(props){
		super(props);

		this.state = {
			target: null,
			startTime: null,
			endTime: null,
			regionid: null,
			regionname: null,
			rillType:null,
			theader:[],
			tbody: [],
			dataLength: null,
			width:150
		}
	};

	//导出
	exportExcelFun(){

		let start = this.state.startTime;
		let end = this.state.endTime;
		let regionid = this.state.regionid;
		let regionname = this.state.regionname;
		let rillType = this.state.rillType;

		$.ajax({
			type: 'POST',
			url: urls.cellTableExport,
			data: {startTime: start, endTime: end, l2regionid: regionid, l2regionname: regionname, rillType: rillType},
			dataType: 'json',
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			}
		}).done((res) => {

			if(res.code == "200"){

				let path = res.path;

				window.open(path);
			}


		}).fail((err) => {
			console.log("error");
		})
	};

	//组件渲染完成
	componentDidMount(){

		let me=this;

		this.setState({tbody: []});
		this.setState({theader: []});

		let start = getUrlParam("startTime");
		let end = getUrlParam("endTime");
		let regionid = getUrlParam("l2regionid");
		let regionname = getUrlParam("l2regionname");
		let rillType = getUrlParam("rillType");

		this.setState({startTime:start});
		this.setState({endTime:end});
		this.setState({regionid:regionid});
		this.setState({regionname:regionname});
		this.setState({rillType: rillType});

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: urls.cellTableRequest,
			data:{startTime: start, endTime: end, l2regionid: regionid, l2regionname: regionname, rillType: rillType},
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

				let numReg = /^\d+(\.\d+)?$/;

				let len = copyHeadDate.length;

				copyHeadDate.map((item,index) => {

					//item['width'] = this.state.width;   //定宽度，不受
					
					item['width'] = '30%';

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

				console.log(copyHeadDate)


				//将时间转换为正确的格式
				bodyData.filter((item,index) => {

					item.time = moment(item['time']*1000).format("YYYY-MM-DD")
					return item;
				});
				

				 this.setState({theader: copyHeadDate});
				 this.setState({tbody: copyBodyDate});
			}

		}).fail((err) => {
			console.log("error")
		})

	};

	
	render(){

		const showText = this.state.regionname + ' - 质差小区列表';

		const widthX = this.state.width * this.state.dataLength;

		const tabelObj = {
			columns: this.state.theader,
			size: 'small',
			dataSource: this.state.tbody,
			pagination: {
				defaultPageSize: 100
			},
			scroll: {
				y: 500
			}
		};

		return (
			<div id="Mytable">
				<div id="myTitle">
					<ul>
						<li>
							<span></span>
							<span>{showText}</span>
						</li>
					</ul>
				</div>

				<div id="myDatas">

					<p className = "exportExcel" onClick = {this.exportExcelFun.bind(this)}>
						<Icon type="export"/>
					</p>
					
					<Table {...tabelObj}  />

				</div>

			</div>
		)
	}
}

export default Mytable;
