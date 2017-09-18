/*
 *by zhangpeng 2017-4-20
 */
import React, { Component } from 'react';
import $ from "jquery"; 
import urls from '../url/urls';
import echarts from 'echarts';
import {connect} from 'react-redux';
import { setLoading } from "../actions/action.js";

var myOption;
// 保存前一个的气泡显示状态
var a = 5;
var b = 0;
var colorList = ['#2cbef7','#c471e3','#d55d81','#1ab29b','#3a9ff7'];
class AreaThreeLeft extends Component{
	constructor(props){
		super(props);	
	}
	
	componentWillReceiveProps(nextProps){
		var ele = echarts.init(document.getElementById("AreaThreeLeft"));
		const { dispatch, id ,timeObj} = nextProps;
		$.ajax({
			type:"POST",
			url:urls.LeftLine,
			dataType:"json",
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:{ l2regionid:id, ...timeObj }
		}).done(function(res){
			if(res.code == "200"){
				//$("#AreaThreeLeft > div").text("");
				$("#AreaThreeLeft > div").removeClass("nodata");
				var seriesData = [];
				var formatData = [];
				for(var i = 0;i<res.data.line.legend.length;i++)for(var i = 0;i<res.data.line.legend.length;i++){
					seriesData.push({
						name:res.data.line.legend[i], 
						type:'line', 
						data:res.data.line.series[res.data.line.legenden[i]],
						markPoint:{
			            	data : [{
							    coord:[,],
							    symbolSize:55
							}],
							itemStyle:{
								normal:{
									color:'#fd726f'
								}
							}

			            } 
			        });
				};

				seriesData[b].markPoint.data[0].coord = [a , res.data.line.series[res.data.line.legenden[b]][a]];
				seriesData[b].markPoint.itemStyle.normal.color = colorList[b];

				for(var j = 0;j<res.data.line.xAxis.length;j++){
					var date = "";
					var num = (new Date(+res.data.line.xAxis[j] * 1000)).getMonth() + 1;
					var str;
					var nums = (new Date(+res.data.line.xAxis[j] * 1000)).getDate();
					var strs;
					if(num < 10 && nums < 10){
						str = 0 + "" + num;
						strs = 0 + "" + nums;
						date = str + "-" + strs;
					}else if(num < 10 && nums >= 10){
						str = 0 + "" + num;
						date = str + "-" + nums;
					}else if(num >= 10 && nums < 10){
						strs = 0 + "" + nums;
						date = num + "-" + strs;
					}else{
						date = num + "-" + nums;
					}
					formatData.push(date);
				}
				
				var option ={
					color: colorList,
					tooltip : {
				        trigger: 'axis'
				    },
				    grid: {
				        left: '2%',
				        right: '3%',
				        bottom: '8%',
				        top: '30%',
				        containLabel: true
				    },
				    xAxis : [
			        	{
				            type : 'category',
				            data : formatData,
				            axisLine:{
				            	lineStyle:{
				            		color:"#e4e4e4"
				            	}
				            },
				            axisTick:{
				            	show:false
				            },
				            axisLabel:{
				            	interval:0,
				            	rotate:50,
				            	textStyle:{
				            		color:"#676767",
				            		fontSize:13
				            	}
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            name:res.data.line.unit,
				            max:100,
				            axisLine:{
				            	show:false,
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
				    series: seriesData,
				    title:{
				    	text:res.data.line.title,
				    	textStyle:{
				    		fontSize:16
				    	},
				    	left:'3%',
				    	top: '2%'
				    },
				    legend:{
				    	data:res.data.line.legend,
				    	left:"3%",
				    	right:'2%',
				    	top: '10%',
				    	align:'left',
				    	textStyle:{
				    		fontSize:12
				    	}
				    }
				}
				myOption = option;
				ele.setOption(option);
				dispatch(setLoading(false));
			}else{
				$("#AreaThreeLeft > div").text("No Data");
				$("#AreaThreeLeft > div").addClass("nodata");
				dispatch(setLoading(false));
			}
		}).fail(function(err){
			$("#AreaThreeLeft > div").text("No Data");
			$("#AreaThreeLeft > div").addClass("nodata");
			console.log(err);
			dispatch(setLoading(false));
		});
		
		ele.on("click",(e) => {
			if(e.componentSubType === "line"){
				for(var m=0;m<myOption.series.length;m++){
					if(e.seriesIndex === m){
						myOption.series[m].markPoint.data[0].coord = [e.dataIndex , e.value];
						myOption.series[m].markPoint.itemStyle.normal.color = e.color;
					}else{
						myOption.series[m].markPoint.data[0].coord = ["-","-"];
						myOption.series[m].markPoint.itemStyle.normal.color = "";
					}
				}
				a = e.dataIndex;
				b = e.seriesIndex;
		        ele.setOption(myOption)
			}
		})

		window.addEventListener("resize",function(){
			ele.resize();
		});			
	}
	
	render(){
		return (
			<div id="AreaThreeLeft"></div>
		)
	}
}

function mapStateToProps(state){
	return {
		id:state.linkRefresh,
		timeObj:state.linkTime
	}
}

export default connect(mapStateToProps)(AreaThreeLeft);