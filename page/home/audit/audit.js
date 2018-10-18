// page/home/service/service.js
const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    datalist: [],
    issh: false,
    iswc: false
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
  onShow: function () {
    this.getlist()
  },
  link_p(e) {
    var rid = e.currentTarget.id;
    if (rid == null ) {
      return false;
    }
    wx.navigateTo({
      url: 'auditdata?id=' + rid 
    })
  },
  getlist: function () {
    var _this = this;
    wx.request({
      url: app.data.aurl + '/home/querycertification',
      data: { },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data)
        for (var i = 0; i < res2.data.length; i++) {
          if (res2.data[i].status == 0) {
            _this.data.issh = true;
          } else  {
            _this.data.iswc = true;
          } 
        }
        _this.setData({
          issh: _this.data.issh,
          iswc: _this.data.iswc,
          datalist: res2.data
        })

      }
    })
  }
})