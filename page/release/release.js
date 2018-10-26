var amapFile = require('../../amap-wx.js');
var utils = require('../../utils.js');
const app = getApp()
Page({
  data: {
    page: 1,
    pageSize: 10,
    list: [],
    endjltitle:[],

    hidden: true,
    scrollTop: 0,
    scrollHeight: 0,

    markers: [],
    date: [],

    amap:null,
    key: '6f2ae22158f09ae7777a720c072deeb8',

    nolist:false,
    startendlist:['起点','终点'],startendindex:0,
    startendvalue:['请选择', '周边100米', '周边200米', '周边300米', '周边400米', '周边500米', '周边1000米', '周边1500米', '周边2000米'],valueindex:0,
    starttimelist: ['请选择', '出发时间前后5分钟', '出发时间前后10分钟'],starttimeindex:0
  },
  bindPickerStartEndvalue: function (e) {
    this.setData({
      valueindex: e.detail.value
    })
    this.loadMore();
  },
  bindPickerStartEnd: function(e) {
    this.setData({
      startendindex: e.detail.value,
      valueindex:0
    })
  },
  bindPickertime: function (e) {
    this.setData({
      starttimeindex: e.detail.value
    })
    this.loadMore();
  },
  onLoad: function(options) {
    // options.markers ='[{"id":"start","longitude":108.895903,"latitude":34.170034,"title":"曹家堡公租房小区","iconPath":"../../img/mapicon_navi_s.png","width":23,"height":33},{"id":"end","longitude":108.86743,"latitude":34.18056,"title":"付村花园东区","iconPath":"../../img/mapicon_navi_e.png","width":23,"height":33}]'
    // options.date ='[0,11,1]'
    if (typeof(options.markers) != 'undefined' && typeof(options.date) != 'undefined'){
      this.setData({
        markers: JSON.parse(options.markers),
        date: JSON.parse(options.date),
        scrollHeight: app.globalData.w_height
      })
    }
    this.data.amap = new amapFile.AMapWX({
      key: this.data.key
    });
    this.loadMore();
  },
  onShow: function() {
    var that = this;
    // this.loadMore();
  },//页面滑动到底部
  bindDownLoad: function () {
    this.loadMore();
    console.log("lower");
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
    console.log("滚动时触发scrollTop==" + event.detail.scrollTop);
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    this.data.page = 0;
    this.setData({
      list: [],
      scrollTop: 0
    });
    this.loadMore();
    console.log("重新加载");
  }
  ,
  loadMore: function() {
    this.setData({
      hidden: false
    });
    if (this.data.markers.length < 2) {
      utils.showModal('', '未能获取到您的位置，请重新选择', false)
      return false;
    }
    if (this.data.date.length <= 0) {
      utils.showModal('', '未能获取到您的出发时间，请重新选择', false)
      return false;
    }
    var start_d=''
    var end_d=''
    if (this.data.startendindex==0){
      start_d=this.jlutil()
    }else{
      end_d = this.jlutil()
    }
    var starttw=''
    if (this.data.starttimeindex==1){
      starttw=5;
    } else if (this.data.starttimeindex == 2) {
      starttw = 10;
    }
    var dataval = {
      pageSize: this.data.pageSize,
      pageNo: this.data.pageNo,
      start_d: start_d, end_d: end_d, starttw: starttw,
      markers: JSON.stringify(this.data.markers),
        date: JSON.stringify(this.data.date),
      peplenum:"",
      user: JSON.stringify(wx.getStorageSync("user"))
    }
    
    var that = this;
    wx.request({
      url: app.data.aurl +'/car/seachCar',
      data: dataval,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data )
        if (res2.data != null && res2.data.length>0) {
          var l = that.data.list
          for (var i = 0; i < res2.data.length; i++) {
            res2.data[i].dayHName = utils.getDayName(res2.data[i].startdate);
            res2.data[i].GL_distance = utils.GL_DIS(res2.data[i].distance);
            res2.data[i].XS_duration = utils.timeStamp(res2.data[i].duration);
            res2.data[i].GL_minend = utils.GL_DIS(res2.data[i].minend);
            res2.data[i].GL_minstart = utils.GL_DIS(res2.data[i].minstart);
            
            var endgeomstr=res2.data[i].endgeom;
            var edngeomp=endgeomstr.substring(6, endgeomstr.length-1);
            var endgeom = edngeomp.split(" ");
            res2.data[i].END_LAT = endgeom[1]
            res2.data[i].END_LOG = endgeom[0]
            l.push(res2.data[i])
            that.data.amap.getRegeo({
              success: function (data1) {
                that.data.endjltitle.push(data1[0].desc)
                that.setData({
                  endjltitle: that.data.endjltitle
                });
              },
              location: res2.data[i].END_LOG + ',' + res2.data[i].END_LAT
            })
          }
           
          that.setData({
            page: that.data.page + 1,
            list: l,
            nolist: false,
            hidden: true
          });


        } else {
          that.setData({
            list: [],
            nolist: true,
            hidden: true
          });
        }

      }
    })

  },
  jlutil:function(){
    var s='';
    if (this.data.valueindex > 0) {
      if (this.data.valueindex < 6) {
        s = this.data.valueindex * 100;
      } else {
        if (this.data.valueindex == 6) {
          s = 1000;
        } else if (this.data.valueindex == 7) {
          s = 1500;
        } else if (this.data.valueindex == 8) {
          s = 2000;
        }
      }
    }
    return s;
  },
  linkDetail:function(e){
    var lineid=e.currentTarget.id;
    var detailjson=null;var ljdtitle="";
    for (var i = 0; i < this.data.list.length;i++){
      if(this.data.list[i].lineid==lineid){
        ljdtitle=this.data.endjltitle[i];
        detailjson = this.data.list[i]
      }
    }
    if (detailjson==null){
      return false;
    }
    wx.navigateTo({
      url: '../detail/detail?date=' + JSON.stringify(this.data.date)+'&markers=' + JSON.stringify(this.data.markers) + '&detailjson=' + JSON.stringify(detailjson) + '&ljdtitle=' + ljdtitle+'&lineid=' + lineid
    })
  }
})