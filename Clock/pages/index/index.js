//index.js
const app = getApp()
const util =require('../../utils/util.js')
Page({
  data: {
   clockShow:false,
   mTime:300000,
   time:'20',
   timer:null,
   timeStr:'20:00',
   rate:'',
   cateArr:[
     {
       icon:'gongzuo',
       text:'工作'
     },
     {
      icon:'xuexi',
      text:'学习'
    },
    {
      icon:'xiezuo',
      text:'写作'
    },
    {
      icon:'sikao',
      text:'思考'
    },
    {
      icon:'fangsong',
      text:'放松'
    },
    {
      icon:'yule',
      text:'娱乐'
    }
   ],
   cateActive:'0',
   okShow:false,
   pauseShow:true,
   continueCancleShow:false
  },
  onLoad: function () {
   var res=wx.getSystemInfoSync();
   var rate =750/res.windowWidth;
   this.setData({
     rate:rate
   })
  },
 getUserInfo:function(e){
   app.globalData.userInfo = e.detail.userInfo
this.setData({
  userInfo:e.detail.userInfo,
  hasUserInfo:true
})
},
sliderChange:function(e){
this.setData({
  time:e.detail.value,
})
},

clickCate:function(e){
this.setData({
  cateActive:e.currentTarget.dataset.index
})
},
start:function(){
  this.setData({
    clockShow:true,
    mTime:this.data.time*60*1000,
    timeStr:parseInt(this.data.time)>=10?this.data.time+':00':'0'+this.data.time+':00',
  })
  this.drawBg();
  this.drawActive();
},
drawBg:function(){
  var lineWidth=6 / this.data.rate;
  var ctx=wx.createCanvasContext('progress_bg')
  ctx.setLineWidth(lineWidth);
  ctx.setStrokeStyle('#E7624F');
  ctx.setLineCap('round');
  ctx.beginPath();
  ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*lineWidth,0,2*Math.PI,false);
  ctx.stroke();
  ctx.draw();
},
drawActive:function(){
  var _this=this;

  var timer=setInterval(function(){  
    var angle=1.5+2*(_this.data.time*60*1000-_this.data.mTime)/(_this.data.time*60*1000);
    var currentTime=_this.data.mTime-100;
    _this.setData({
      mTime:currentTime
    });
    if(angle<3.5){
      if(currentTime%1000==0){
        var timeStr1=currentTime/1000;
        var timeStr2=parseInt(timeStr1/60);
        var timeStr3=(timeStr1-timeStr2*60)>=10?(timeStr1-timeStr2*60):'0'+(timeStr1-timeStr2*60);
        var timeStr2=timeStr2>=10?timeStr2:'0'+timeStr2;
        _this.setData({
          timeStr:timeStr2+':'+timeStr3
        })
      }
      var lineWidth=6 / _this.data.rate;
      var ctx=wx.createCanvasContext('progress_active')
      ctx.setLineWidth(lineWidth);
      ctx.setStrokeStyle('#ffffff');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(400/_this.data.rate/2,400/_this.data.rate/2,400/_this.data.rate/2-2*lineWidth,1.5*Math.PI,angle*Math.PI,false);
      ctx.stroke();
      ctx.draw();
    }else{
      var logs=wx.getStorageSync('logs')||[];
      logs.unshift({
        date:util.formatTime(new Date),
        cate:_this.data.cateActive,
        time:_this.data.time
      });
      
      wx.setStorageSync('logs', logs);
      _this.setData({
        timeStr:'00:00',
        okShow:true,
        pauseShow:false,
        continueCancleShow:false,
        

      })
      clearInterval(timer);
    }
  },100);
  _this.setData({
    timer:timer,
  })
},
pause:function(){
clearInterval(this.data.timer);
this.setData({
  pauseShow:false,
  continueCancleShow:true,
  okShow:false
})
},
continue:function(){
  this.drawActive();
  this.setData({
    pauseShow:true,
    continueCancleShow:false,
    okShow:false
  })
},
cancle:function(){
  clearInterval(this.data.timer);
  this.setData({
    pauseShow:true,
    continueCancleShow:false,
    okShow:false,
    clockShow:false
  })
},
ok:function(){
  clearInterval(this.data.timer);
  this.setData({
    pauseShow:true,
    continueCancleShow:false,
    okShow:false,
    clockShow:false
  })
}
})
