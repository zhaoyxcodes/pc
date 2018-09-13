const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  bindGetUserInfo:function(e){
     var that = this
    var bool = app.islogin()
    if (!bool) {
      console.log("未登录")

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
  }
  
})