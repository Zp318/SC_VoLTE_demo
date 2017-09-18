import React, { Component } from 'react';
import AreaOne from './UIComponents/AreaOne';
import AreaTwo from './UIComponents/AreaTwo';
import AreaThreeLeft from './UIComponents/AreaThreeLeft';
import AreaThreeRight from './UIComponents/AreaThreeRight';
import AreaFour from './UIComponents/AreaFour';
import Loading from './UIComponents/Loading';

// 组件划分：从上到下分为五部分：AreaOne(时间控件),AreaTwo(柱状图),AreaThreeLeft(折线图),AreaThreeRight(饼状图),AreaFour(表格).
class App extends Component {
  render() {
    return (
      <div id="container">
      
        <div id="loadMask">
          <Loading />
        </div>

        <div id="area_one">
          <AreaOne />
        </div>
        
        <div id="area_two">
          <AreaTwo />
        </div>
        
        <div id="area_three">
          <div id="area_three_left"><AreaThreeLeft /></div>
          <div id="area_three_right"><AreaThreeRight /></div>
        </div>
        
        <div id="area_four">
          <AreaFour/>
        </div>
  
        

      </div>
    );
  }
}

export default App;
