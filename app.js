App({
  data:{
    bj: 0.002,//向左
    bj2: 0.002,//向上
    secret:"6a40c709e9eb56f2881db739ef98ff7a",
    aurl: 'https://bronnyjames.cn/pc'// bronnyjames.cn
  },
  globalData: {
    access_token:null,
    w_height: null,
    w_width:null,
    userInfo:null,
    cuLo: null,
    cuLa: null, //当前
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
  ,getuser:function(_success){
    var that = this;
    wx.request({
      url: that.data.aurl + '/login/queryuser',
      data: {
        userid: that.globalData.userInfo.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        _success(res2.data)
      }
    })
  },
  getLogin: function (success1) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: function (res1) {
              var userInfo = res1.userInfo;
              console.log(res.code)
              console.log(userInfo)
              wx.request({
                url: that.data.aurl+'/login/get3drSessionKey',
                data: {
                  code: res.code,
                  img: userInfo.avatarUrl,
                  name: userInfo.nickName,
                  secret: that.data.secret
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
      console.log( user)
      if(user != null && user != '' && typeof (user) != "undefined"){
      this.globalData.userInfo = user;
      return true;
    }
    return false;
    }
})
