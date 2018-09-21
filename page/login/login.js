const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bool = app.islogin()
    if (!bool) {
      this.setData({
        islogin: true
      })
      console.log("未登录")
    } else {
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },
  bindGetUserInfo:function(e){
     var that = this
      app.getLogin(function (bs) {
        if (bs == 1) {
          wx.navigateTo({
            url: '../index/index',
          })
        } else {
          wx.showModal({
            title: "", showCancel: false,
            content: "认证失败",
            success: function (res) { }
          })
          return false;
        }

      })
  }
  
})