App({
  data:{
   
  },
  globalData: {
    w_height: null,
    w_width:null
  },
  onLaunch: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.w_width = res.windowWidth
        that.globalData.w_height = res.windowHeight
      }
    })
  }
})
