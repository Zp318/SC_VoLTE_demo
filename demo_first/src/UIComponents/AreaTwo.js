/*
 *by zhangpeng 2017-4-20
 */
import React, { Component } from 'react';
import $ from "jquery"; 
import urls from '../url/urls';
import echarts from 'echarts';
import {connect} from 'react-redux';
import { refreshShow , setLoading} from "../actions/action.js";

var myOption;
// 记住上一个点击状态
var a = 0;
var colorArr = [];
class AreaTwo extends Component{
	constructor(props){
		super(props);
	}

	componentWillReceiveProps(nextProps){
		var me = this;
		const { dispatch, timeObj } = nextProps;
		var ele = echarts.init(document.getElementById("AreaTwo"));
		var myData;
		$.ajax({
			type:"POST",
			url:urls.topBar,
			dataType:"json",
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:{ ...timeObj }
		}).done(function(res){
			if(res.code == "200"){
				// $("#AreaTwo > div").text("");
				$("#AreaTwo > div").removeClass("nodata");
				myData = res.data.data;
				var citys = [];
				var citysValue = [];
				// 切换地市ID
				if(a != 0){
					dispatch(refreshShow(myData[a].id));
				}else{
					dispatch(refreshShow(myData[0].id));
				}
	
				for(var i = 0;i < res.data.data.length;i++){
					citys.push(res.data.data[i].name);
					citysValue.push(res.data.data[i].value);
					if(i===0){
						colorArr.push("#fd726f");
					}else{
						colorArr.push("#46beef");
					}
				}

				var option ={
					color: ['#46beef','#fd726f'],
					tooltip : {
				        trigger: 'axis'
				    },
				    grid: {
				        left: '2%',
				        right: '2%',
				        bottom: '5%',
				        top: '25%',
				        containLabel: true,
				        show:true,
				        borderWidth:1
				    },
				    xAxis : [
			        	{
				            type : 'category',
				            data : citys,
				            axisLine:{
				            	lineStyle:{
				            		color:"#e4e4e4"
				            	}
				            },
				            axisTick:{
				            	show:false
				            },
				            axisLabel:{
				            	textStyle:{
				            		color:"#676767",
				            		fontSize:15
				            	},
				            	formatter:function(value){
				            		if(value.length === 3){
				            			return value[0] + "\n" + value[1] + "\n" + value[2];
				            		}else{
				            			return value[0] + "\n" + value[1]
				            		}
				            	}
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            name:res.data.unit,
				            max:100,
				            axisLine:{
				            	lineStyle:{
				            		color:"#e4e4e4"
				            	}
				            },
				            axisTick:{
				            	show:false
				            },
				            axisLabel:{
				            	textStyle:{
				            		color:"#676767"
				            	}
				            },
				            nameTextStyle:{
				            	color:"#676767"
				            }
				        }
				    ],
				    series :{
			            name:res.data.legend,
			            type:'bar',
			            data:citysValue,
			            itemStyle:{
			            	normal:{
			            		barBorderRadius: 20,
			            		color: function(params) {
			                        return colorArr[params.dataIndex]
			                    }
			            	}
			            },
			            markPoint:{
			            	data : [{
							    coord:[a,+res.data.data[a].value],
							    symbolSize:55
							}],
							itemStyle:{
								normal:{
									color:'#fd726f'
								}
							}
			            },
			            barMaxWidth:22
			        },
				    title:{
				    	text:res.data.title,
				    	textStyle:{
				    		fontSize:16
				    	},
				    	left:'1.5%',
				    	top: '3%'
				    },
				    legend:{
				    	data:[
				    		{
							    name: res.data.legend,
							    icon:'pin'
							}
				    	],
				    	right:'2%',
				    	top: '10%'
				    }
				}

				myOption = option;
				ele.setOption(option);
			}else{
				$("#AreaTwo > div").text("No Data");
				$("#AreaTwo > div").addClass("nodata");
				dispatch(setLoading(false));
			}
		}).fail(function(err){
			$("#AreaTwo > div").text("No Data");
			$("#AreaTwo > div").addClass("nodata");
			dispatch(setLoading(false));
			console.log(err)
		});
		
		ele.on("click",(e) => {
			const { dispatch } = me.props;
			if(e.componentSubType === "bar"){
				dispatch(refreshShow(myData[e.dataIndex].id));
				dispatch(setLoading(true));

				//当点击同个地市时，不会发送折线图请求，也就loading不会设为false，所以做以下处理 
				setTimeout(function(){
					if($("#loadMask").css("display") === "block"){
						dispatch(setLoading(false));
					}
				},10)
		
				a = e.dataIndex;
				// 点击柱状图切换颜色
				for(var k=0;k<colorArr.length;k++){
					if(k===e.dataIndex){
						colorArr[k] = '#fd726f';
					}else{
						colorArr[k] = '#46beef';
					}
				}
				myOption.series.markPoint.data[0].coord = [e.dataIndex,+e.value];
		        ele.setOption(myOption)
			}
		})
		
		window.addEventListener("resize",function(){
			ele.resize();
		});			
	}
	
	render(){
		return (
			<div id="AreaTwo"></div>
		)
	}
}

function mapStateToProps(state){
	return {
		timeObj:state.linkTime
	}
}

export default connect(mapStateToProps)(AreaTwo);