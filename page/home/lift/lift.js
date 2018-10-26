// page/home/service/service.js
const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData:0,
    datalist: [],
    isydz: false,//预订中0
    isyd: false,//已预订1
    iswc: false,//已完成2
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist()
  },
  link_p(e) {
    var optype = e.currentTarget.dataset.optype
    var rid = e.currentTarget.id;
    if (rid == null || optype==null) {
      return false;
    }
    wx.navigateTo({
      url: '../orderpreview/orderpreview?type=0&rid=' + rid + "&optype=" + optype
    })
  },
  getlist: function () {
    var _this = this;
    wx.request({
      url: app.data.aurl+'/order/queryOrder',
      data: {
        user: JSON.stringify(wx.getStorageSync("user")),
        num: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data)
        for (var i = 0; i < res2.data.length; i++) {
          res2.data[i].dayHName = utils.getDayName(res2.data[i].sdate)
          if (res2.data[i].status == 0) {
            _this.data.isydz = true;
          } else if (res2.data[i].status == 1) {
            _this.data.isyd = true;
          } else if (res2.data[i].status == 2 || res2.data[i].status == 3 || res2.data[i].status == 4 || res2.data[i].status == 5 || res2.data[i].status == 6) {
            _this.data.iswc = true;
          }
        }
        _this.setData({
          isydz: _this.data.isydz,
          isyd: _this.data.isyd,
          iswc: _this.data.iswc,
          datalist: res2.data
        })

      }
    })
  }
})