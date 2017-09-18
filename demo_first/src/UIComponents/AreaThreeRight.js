/*
 *by zhangpeng 2017-4-20
 */
import React, { Component } from 'react';
import $ from "jquery"; 
import urls from '../url/urls';
import echarts from 'echarts';
import {connect} from 'react-redux';
import { setLoading } from "../actions/action.js";

class AreaThreeRight extends Component{
	constructor(props){
		super(props);
	}

	componentWillReceiveProps(nextProps){
		var ele = echarts.init(document.getElementById("AreaThreeRight"));
		const { dispatch, id , timeObj} = nextProps;
		$.ajax({
			type:"POST",
			url:urls.rightPie,
			dataType:"json",
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"X-CSRF-TOKEN":$("meta[name='_csrf']").attr("content")
			},
			data:{l2regionid:id , ...timeObj}
		}).done(function(res){
			if(res.code == "200"){
				// $("#AreaThreeRight > div").text("");
				$("#AreaThreeRight > div").removeClass("nodata");
				var option ={
					color: ['#2cbef7','#c471e3','#d55d81','#1ab29b','#3a9ff7'],
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				   },
				    series: {
				    	name:res.data.pie.title,
			            type:'pie',
			            radius: ['30%', '40%'],
			            minAngle:20,
			            label:{
			            	normal:{
			            		show:true,
			            		formatter:'{d}%',
			                    textStyle:{
			                    	color:"#676767",
			                    	fontSize:14
			                    }
			            	}
			            },
			            labelLine: {
			                normal: {
			                    show: true,
			                    length:20,
			                    length2:10
			                }
			            },
			            data:res.data.pie.series,
			            center:['25%','50%'],
			            itemStyle:{
			            	normal:{
			            		borderWidth:2,
			            		borderColor:"white"
			            	}
			            }
			        },
				    title:{
				    	text:res.data.pie.title,
				    	textStyle:{
				    		fontSize:16
				    	},
				    	left:'3%',
				    	top: '2%'
				    },
				    legend:{
				    	orient: 'vertical',
	        			x: 'left',
				    	data:res.data.pie.legend,
				    	textStyle:{
				    		fontSize:14
				    	},
				    	icon:'pin',
				    	left:'50%',
				    	top: '35%'
				    }
				}

				ele.setOption(option);
			}else{
				$("#AreaThreeRight > div").text("No Data");
				$("#AreaThreeRight > div").addClass("nodata");
				dispatch(setLoading(false));
			}
		}).fail(function(err){
			$("#AreaThreeRight > div").text("No Data");
			$("#AreaThreeRight > div").addClass("nodata");
			console.log(err);
			dispatch(setLoading(false));
		});
		
		window.addEventListener("resize",function(){
			ele.resize();
		});			
	}

	render(){
		return (
			<div id="AreaThreeRight"></div>
		)
	}
}

function mapStateToProps(state){
	return {
		id:state.linkRefresh,
		timeObj:state.linkTime
	}
}

export default connect(mapStateToProps)(AreaThreeRight);