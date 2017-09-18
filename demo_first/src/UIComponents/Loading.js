/*
 *by zhangpeng 2017-4-20
 */
import React, { Component } from 'react';
import $ from 'jquery';
import { Spin } from 'antd';
import {connect} from 'react-redux';

class Loading extends Component{
	constructor(props){
		super(props);
		this.state={
			loading:true
		}		
	}
	
	componentWillReceiveProps(nextProps){
		const { dispatch , boolean} = nextProps;
		var me = this;
		if(!boolean){
			setTimeout(function(){
				$("#loadMask").hide();
				me.setState({
					loading : boolean
				});
			},600)
		}else{
			$("#loadMask").show();
			me.setState({
				loading : boolean
			});
		}
	}
	
	render(){
		return (
			<div id="Loading">
			    <Spin tip="loading..." spinning={this.state.loading} size="large"></Spin>
			</div>
		)
	}
}

function mapStateToProps(state){
	return {
		boolean:state.linkLoading
	}
}

export default connect(mapStateToProps)(Loading);