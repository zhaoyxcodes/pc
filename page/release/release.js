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
    key: '6f2ae22158f09ae7777a720c072deeb8'
  },
  onLoad: function(options) {
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
    var dataval = {
      pageSize: this.data.pageSize,
      pageNo: this.data.pageNo,
      markers: JSON.stringify(this.data.markers),
        date: JSON.stringify(this.data.date),
      peplenum:"",
      user: JSON.stringify(wx.getStorageSync("user"))
    }
    
    var that = this;
    wx.request({
      url: 'https://zhao/pc/car/seachCar',
      data: dataval,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res2) {
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
            hidden: true
          });


        } else {
          that.setData({
            list: [],
            hidden: true
          });
        }

      }
    })

  },
  linkDetail:function(e){
    var lineid=e.currentTarget.id;
    var detailjson=null;
    for (var i = 0; i < this.data.list.length;i++){
      if(this.data.list[i].lineid==lineid){
        detailjson = this.data.list[i]
      }
    }
    if (detailjson==null){
      return false;
    }
    wx.navigateTo({
      url: '../detail/detail?date=' + JSON.stringify(this.data.date) +'&markers=' + JSON.stringify(this.data.markers)+'&detailjson=' + JSON.stringify(detailjson)+'&lineid=' + lineid
    })
  }
})