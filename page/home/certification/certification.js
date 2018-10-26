// page/home/certification/certification.js
const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    pics2: [],
    isShow2: true,
    max_height: app.globalData.w_height,
    max_width: app.globalData.w_width,

    ishidden:1,//0编辑1查看

    userid: null,remark:'',
    name: null, peoplenum: null, phone: null, carnum: null
    , carlicense: null, driverlicense: null, id: null, status: null, carbrand: null, carcolor:null,
    colorlist: app.data.colorlist,colorindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata()
  },
  bindPickerChange: function (e) {
    this.setData({
      carcolor: e.detail.value
    })
  },
  getdata:function(){
    var _this=this;
    wx.request({
      url: app.data.aurl + '/home/querycertificationByUser',
      data: { userid: app.globalData.userInfo.id, isstatus:0},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data)
        if (res2.data != null && res2.data!='null'){
          _this.data.pics.push(app.data.aurl + '/home/getImage?filename=' + res2.data.carfile)
          _this.data.pics2.push(app.data.aurl + '/home/getImage?filename=' + res2.data.driverpath)
          _this.setData({
            isShow2: false,
            pics2: _this.data.pics2,
            isShow: false,
            pics:_this.data.pics,
            id: res2.data.id,
            userid: res2.data.user_id,
            status:res2.data.status,
            ishidden: 1, remark: res2.data.refuseremark,
            name: res2.data.name, peoplenum: res2.data.peoplenum, phone: res2.data.phone, carnum: res2.data.carnum
            , carlicense: res2.data.carlicense, driverlicense: res2.data.driverlicense, carbrand: res2.data.carbrand, carcolor: res2.data.carcolor
          })

        }else{
          _this.setData({ ishidden: 0})
        }
      }
    })

  },
  // 图片上传
  chooseImage: function () {
    var _this = this,
      pics = [];
    wx.chooseImage({
      count: 1 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        // if (pics.length >= 1) {
        //   _this.setData({
        //     isShow: (!_this.data.isShow)
        //   })
        // } else {
        //   _this.setData({
        //     isShow: (_this.data.isShow)
        //   })
        // }
        _this.setData({
          pics: pics
        })
        utils.uploadfile(pics[0], function (e) {
          if (e == "0") {
            utils.showModal('', '图片上传失败，请重新上传', false)
            _this.setData({
              pics: [], isShow: true
            })
          } else {
            _this.setData({
              driverlicense: e
            })
          }
        })
      }
    })
  },
  // 图片上传
  chooseImage2: function () {
    var _this = this,
      pics2 = [];
    wx.chooseImage({
      count: 1 - pics2.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        
        pics2 = pics2.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        // if (pics2.length >= 1) {
        //   _this.setData({
        //     isShow2: (!_this.data.isShow2)
        //   })
        // } else {
        //   _this.setData({
        //     isShow2: (_this.data.isShow2)
        //   })
        // }
        _this.setData({
          pics2: pics2
        })
        utils.uploadfile(pics2[0], function (e) {
          if (e == "0") {
            utils.showModal('', '图片上传失败，请重新上传', false)
            _this.setData({
              pics2: [], isShow2:true
            })
          } else {
            _this.setData({
              carlicense: e
            })
          }
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
  },
  bindname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindpeoplenum(e) {
    this.setData({
      peoplenum: e.detail.value
    })
  },
  bindphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindcarnum(e) {
    this.setData({
      carnum: e.detail.value
    })
  },
  bindcarbrand(e) {
    this.setData({
      carbrand: e.detail.value
    })
  },
  formSubmit:function(e){
    if ('bianji' == e.detail.target.id){
      this.setData({
        ishidden: 0,
        isShow: true,
        isShow2: true
      })
      return false;
    }
   
    var _this=this;
    if (this.data.name == null || this.data.name.length <= 0) {
      utils.showModal('', '请输入姓名', false)
      return false;
    } else if (this.data.peoplenum == null || this.data.peoplenum.length <= 0) {
      utils.showModal('', '请输入身份证号码', false)
      return false;
    } else if (this.data.phone == null || this.data.phone.length <= 0) {
      utils.showModal('', '请输入电话方式', false)
      return false;
    } else if (this.data.carbrand == null || this.data.carbrand.length <= 0) {
      utils.showModal('', '请输入车型并选择颜色', false)
      return false;
    } else if (this.data.carnum == null || this.data.carnum.length <= 0) {
      utils.showModal('', '请输入车牌号码', false)
      return false;
    } else if (this.data.pics.length < 1 || this.data.pics2.length < 1 
      || this.data.driverlicense.length < 1|| this.data.carlicense.length < 1) {
      utils.showModal('', '请上传证件', false)
      return false;
    } 
   var dataval= {
     id: _this.data.id, userid: app.globalData.userInfo.id, carbrand: _this.data.carbrand, carcolor: _this.data.colorindex,
        name: _this.data.name, peoplenum: _this.data.peoplenum, phone: _this.data.phone, carnum: _this.data.carnum
          , carlicense: _this.data.carlicense, driverlicense: _this.data.driverlicense
    }
    console.log(dataval)
    wx.showModal({
      title: "", showCancel: true,
      content: "确定提交审核",
      success: function (isok) {
       if(isok.confirm){
         wx.request({
           url: app.data.aurl + '/home/insertCertification',
           data: dataval,
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
                 content: "提交成功",
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