//const devicesid ='651686662'//你的设备id 
//const datastreams = 'anybodyHere'//你的数据流ID 可以多个
//const apikey = 'Y9TcBWiQACL1Dnn=F0WGEdsDsKc= '//你的apikey
  
const date = new Date()
const hours = []
const mins = []
const secs = []
var begin_hour;
var begin_min;
var begin_sec;
var temp_sumtime=0;
var interval;
var that;
for (let i = 0; i <= 23; i++) {
  hours.push(i)
}

for (let i = 0; i <= 59; i++) {
  mins.push(i)
}

for (let i = 0; i <= 59; i++) {
  secs.push(i)
}
Page({
  startlearning: function(){var that = this
    wx.request({
      url: "https://api.heclouds.com/devices/651686662/datapoints",   
      header: {
        "api-key": "Y9TcBWiQACL1Dnn=F0WGEdsDsKc="                    
      },
      data: {
        limit: 1
      },
      method: "GET",
      success: function (e) {
        console.log(e.data.data)
        //此处打印GET回来的json数据
        that.setData({
          learning: e.data.data.datastreams[0].datapoints[0].value
        })
      }
    });
  },

  data: {
      learning:'',
      hours: hours,
      mins: mins,
      secs: secs,
      test_hour:"",
      test_min:"",
      test_sec:"",
      value: [0, 0, 0],
      iscontinue:true,
  test_sumtime:0,
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      test_hour: this.data.hours[val[0]],
      test_min: this.data.mins[val[1]],
      test_sec: this.data.secs[val[2]]
    })
  },
  comfire:function()
  {
    wx.showToast({
      title: '开始计时'
    })
    begin_hour = 0;
    begin_min = 0;
    begin_sec = 0;
var begin_time=new Date();
begin_hour=begin_time.getHours();
begin_min=begin_time.getMinutes();
begin_sec=begin_time.getSeconds();
console.log("开始的时间是begin_time: "+begin_hour+" :"+begin_min+" :"+begin_sec);
this.setData({
  test_sumtime: this.data.test_hour * 60 * 60 + this.data.test_min * 60 + this.data.test_sec,
  iscontinue:true
})
console.log("要执行的时间长是test_sumtime: "+this.data.test_sumtime);
    this.start_cal_time();
  //  this.cal_time();
  },
  cal_time:function()
  {
    console.log("do_____________________________________");
    if(this.data.iscontinue)
    {
   var temp_time=new Date();
   console.log("现在时间是:"+temp_time.getHours()+" :"+temp_time.getMinutes()+" :"+temp_time.getSeconds());
      temp_sumtime = (temp_time.getHours()-begin_hour)*60*60+(temp_time.getMinutes()-begin_min)*60+(temp_time.getSeconds()-begin_sec);
      this.setData({
        value: [this.data.test_hour-(temp_time.getHours() - begin_hour), this.data.test_min-(temp_time.getMinutes() - begin_min), this.data.test_sec-(temp_time.getSeconds() - begin_sec)],
      })
      console.log("现在过了多少时间: "+temp_sumtime);
      //表示开始
      if(temp_sumtime==0)
      {
        //预计计时为0S时:
        if(temp_sumtime==this.data.test_sumtime)
        {
          console.log("clearinterval");
          this.setData({
            iscontinue: false
          })
          wx.showToast({
            title: '结束计时',
          }) 
       let j=0;
           setInterval(function () {
              if (j < 3) {
                wx.vibrateLong({

                })
                j = j + 1
                }
             }, 800);
          
        }
        //预计计时不是0s,但是再开始时
                else
        {
          interval = setInterval(function () { that.start_cal_time();}, 1000)
        }
       }
      //在任何不表示开始的时候
      else{
   //console.log("temp_sumtime_this.data.temp_sumtime :" + temp_sumtime != this.data.temp_sumtime);
        console.log("temp_sumtime= " + temp_sumtime + "  this.data.test_sumtime: " + this.data.test_sumtime);
        if(temp_sumtime!=this.data.test_sumtime)
        {
          interval = setInterval(function () { that.start_cal_time()},1000)
          }
  else
  {
    console.log("clearinterval");
clearInterval(interval);
    wx.showToast({
      title: '计时结束',
    })
          let j = 0;
        setInterval(function () {
            ;
            if (j < 3) {
              wx.vibrateLong({

              })
              j=j+1;
            }
          
         
          }, 800);
    this.setData({
      iscontinue:false
    })
  }
      }
    }
  },
  onLoad:function()
  {
    that = this; 
    this.setData({
      iscontinue:true
    })
   begin_hour=0;
   begin_min=0;
   begin_sec=0;
  },
  rerepare:function()
  {
   
    this.setData({
      iscontinue:false,
      value: [0, 0, 0],
    })
    clearInterval(interval);
  },
  onUnload: function () {
   this.setData({
     iscontinue:false
   })
  },
  start_cal_time:function()
{

  if(this.data.iscontinue)
  {
    this.cal_time();
  }
  else{}
}
})