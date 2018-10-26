// page/home/certification/certification.js
const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    pics2: [],
    max_height: app.globalData.w_height,
    max_width: app.globalData.w_width,
    colorlist: app.data.colorlist,

    userid: null,
    name: null, peoplenum: null, phone: null, carnum: null
    , carlicense: null, driverlicense: null, id: null, status: null, remark: '', carbrand: null, carcolor:null
  },
  bindTextAreaBlur(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.id) != 'undefined' ) {
      this.setData({
        id: options.id
      })
    }
    this.getdata()
  },
  getdata: function () {
    var _this = this;
    wx.request({
      url: app.data.aurl + '/home/querycertificationById',
      data: { id: _this.data.id },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data)
        if (res2.data != null && res2.data != 'null') {
          _this.data.pics.push(app.data.aurl + '/home/getImage?filename=' + res2.data.carfile)
          _this.data.pics2.push(app.data.aurl + '/home/getImage?filename=' + res2.data.driverpath)
          _this.setData({
            pics2: _this.data.pics2,
            pics: _this.data.pics,
            id: res2.data.id,
            userid: res2.data.user_id,
            status: res2.data.status,
            name: res2.data.name, peoplenum: res2.data.peoplenum, phone: res2.data.phone, carnum: res2.data.carnum
            , carlicense: res2.data.carlicense, driverlicense: res2.data.driverlicense, carbrand: res2.data.carbrand, 
            carcolor: res2.data.carcolor
          })

        }
      }
    })

  },
  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  // 图片预览
  previewImage2: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics2
    })
  },
  formSubmit: function (e) {
    var status=0;
    if ('tg' == e.detail.target.id) {
      status=1;
    }else{
      status=2;
    }
  var _this=this
    wx.showModal({
      title: "", showCancel: true,
      content: "确定提交",
      success: function (isok) {
        if (isok.confirm) {
          wx.request({
            url: app.data.aurl + '/home/updateCertificationstatus',
            data: { status: status, id: _this.data.id, remark: _this.data.remark },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res2) {
              var data = res2.data;
              if (data == "0") {
                utils.showModal('', '提交失败', false)
              } else if (data == "1") {
                wx.showModal({
                  title: "", showCancel: false,
                  content: "审核成功",
                  success: function (isok) {
                    wx.navigateBack();
                  }
                })
              }
            }
          })
        }
       
      }
    })

  }
})