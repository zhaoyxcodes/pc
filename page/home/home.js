const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg:'../../img/user/imguser.jpg',
    username:"未登录",
    max_height: app.globalData.w_height,
    isadm:'',

    carauth: app.globalData.carauth,//车主认证1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.carauth)
    this.setData({
      isadm:app.globalData.userInfo.isadm
    })
    wx.setNavigationBarTitle({
      title: "我"
    })
  },
  nt: function (event) {
    console.log(event)
    // 验证是否登录
    var bol = true //app.islogin()
    if (bol){
      if (event.currentTarget.id == "ye") {
        wx.navigateTo({
          url: 'money/money',
        })
      } else if (event.currentTarget.id == "cz") {
        wx.navigateTo({
          url: 'certification/certification',
        })
      }
    }else{
      wx.navigateTo({
        url: 'authuser/authuser',
      })
    }
    
  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var bol = app.islogin()
    if(bol){
      this.setData({
        userimg: app.globalData.userInfo.img,
        username: app.globalData.userInfo.name
      })
    }
  }

 
    
})