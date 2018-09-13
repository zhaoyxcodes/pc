App({
  data:{
   
  },
  globalData: {
    w_height: null,
    w_width:null,
    userInfo:null
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

  ,
  getLogin: function (success1) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: function (res1) {
              var userInfo = res1.userInfo;
              wx.request({
                url: 'https://zhao/pc/login/get3drSessionKey',
                data: {
                  code: res.code,
                  img: userInfo.avatarUrl,
                  name: userInfo.nickName
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res2) {
                  console.log(res2.data.sessionkey)
                  if (typeof (res2) != 'undefined' && res2.data.sessionkey.length > 0) {
                    wx.setStorage({ key: "user", data: res2.data })
                    success1(1);
                  }
                }
              })
            }, fail:function(e){
              success1(0);
            }
          })
        }
      }
    })

  }
  ,
   islogin(){
    var user = wx.getStorageSync("user")
      console.log("islogin:" + user)
      if(user != null && user != '' && typeof (user) != "undefined"){
      app.globalData.userInfo = user;
      return true;
    }
    return false;
    }
})
