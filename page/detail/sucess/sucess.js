// page/detail/sucess/sucess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.rid) != 'undefined') {
      this.setData({
        rid: options.rid
      })
    }
  },
  fh:function(){
    wx.navigateBack({
      delta: 111
    })
  },
  linklift:function(){
    wx.redirectTo({
      url: '../../home/lift/lift',
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (options ) {
    console.log(this.data.rid)
    // if (this.data.rid==null){
    //   return false;
    // }
    
    var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
      　　　　title: "小区拼车",        // 默认是小程序的名称(可以写slogan等)
        path: 'page/home/orderpreview/orderpreview?type=0&optype=2rid=' + this.data.rid,        // 默认是当前页面，必须是以‘/’开头的完整路径
      　　　　imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      　　　　success: function (res) {},
      　　　　fail: function () {},
        complete: function(){
        　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
          that.fh()
      　　　　}
  　　}
  　　// 来自页面内的按钮的转发
//   　　if(options.from=='button'){
//   　　　　var eData = options.target.dataset;
//   　　　　console.log(eData.name);     // shareBtn
//   　　　　// 此处可以修改 shareObj 中的内容
//   　　　　shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
// 　　  }
　　// 返回shareObj
　　return shareObj;
  }
})