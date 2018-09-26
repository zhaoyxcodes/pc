// page/home/certification/certification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    pics2: [],
    isShow2: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 图片上传
  chooseImage: function () {
    var _this = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 1 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 1) {
          _this.setData({
            isShow: (!_this.data.isShow)
          })
        } else {
          _this.setData({
            isShow: (_this.data.isShow)
          })
        }
        _this.setData({
          pics: pics
        })

      }
    })
  },
  // 图片上传
  chooseImage2: function () {
    var _this = this,
      pics2 = this.data.pics2;
    wx.chooseImage({
      count: 1 - pics2.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics2 = pics2.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics2.length >= 1) {
          _this.setData({
            isShow2: (!_this.data.isShow2)
          })
        } else {
          _this.setData({
            isShow2: (_this.data.isShow2)
          })
        }
        _this.setData({
          pics2: pics2
        })

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
  }
})