const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bj: app.data.bj,//向左
    bj2:app.data.bj2,//向上
    cuLo:null,
    cuLa:null,
    markers: [],
    polyline: [],
    includePoints: [],
    scale: 14,
    max_height: app.globalData.w_height,
    lineid:null,
    data:null,

    carnum:null,
    rid:null,
    type:null,//0乘客1车主
    optype: null//预订中0 已预订1 已完成2 3乘客取消预约4车主取消预约5乘客删除
  },
  onShow:function(){
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "预览"
    })
    // options.rid ="2ffa19fb539641e9b55431207f00519b";
    if (typeof (options.optype) != 'undefined' && typeof (options.type) != 'undefined') {
      this.setData({
        optype: options.optype,
        type: options.type
      })
    }
    if (typeof (options.rid) != 'undefined' ) {
      this.setData({
        rid: options.rid
      })
      this.loaddata()
    }
    
  },
  loaddata:function(){
    var _this = this
    wx.request({
      url: app.data.aurl + '/home/querycertificationByUser',
      data: { userid: app.globalData.userInfo.id, isstatus: 1 },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        console.log(res2.data)
        _this.setData({
          carnum: res2.data.carnum
        })
      }
    })
    wx.request({
      url: app.data.aurl + '/order/queryOrderById',
      data: { id: _this.data.rid },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        var data = res2.data[0];
        var geomli = utils.geompoint(data.fstart);
        _this.setData({
          data: data,
          cuLo: geomli[0],
          cuLa: geomli[1],
          lineid: data.line_id
        })
        _this.detail();
        _this.saveMark(utils.geompoint(data.fgatherstart), utils.geompoint(data.fcarend), utils.geompoint(data.fstart),
          utils.geompoint(data.fend), utils.geompoint(data.fdownend))



      }
    })
  },
  detail:function(){
    var self = this
    wx.request({
      url: app.data.aurl +'/car/getPoint',
      data: { lineid: this.data.lineid },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        if (res2.data != null && res2.data.length > 0) {
          var points2 = []
          for (var i = 0; i < res2.data.length; i++) {
            var geomli = utils.geompoint(res2.data[i].geom)
            points2.push({
              longitude: geomli[0],
              latitude: geomli[1]
            })
            self.data.includePoints.push({
              longitude: geomli[0],
              latitude: geomli[1]
            })
          }
          self.data.polyline.push({
            name: '',
            points: points2,
            color: "#0091ff",
            width: 6,
            borderWidth: 1,
            dottedLine: true
          })

          self.setData({
            polyline: self.data.polyline,
            includePoints: self.data.includePoints
          })
        }

      }
    })
  },
  saveMark(cargeom_s, cargeom_e, ordergeom_s, ordergeom_e, downgeom) {
    var imgurl = '../../../img/mapicon_navi_s.png'
    this.data.markers.push({
      id: "start",
      longitude: cargeom_s[0],
      latitude: cargeom_s[1],
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.data.includePoints.push({
      longitude: cargeom_s[0],
      latitude: cargeom_s[1]
    })
    this.data.includePoints.push({
      longitude: (parseFloat(cargeom_s[0]) - this.data.bj),
      latitude: (parseFloat(cargeom_s[1]) + this.data.bj2)
    })
    var imgurl = '../../../img/mapicon_navi_e.png' //end
    this.data.markers.push({
      id: "end",
      longitude: cargeom_e[0],
      latitude: cargeom_e[1],
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.data.includePoints.push({
      longitude: cargeom_e[0],
      latitude: cargeom_e[1]
    })
    this.data.includePoints.push({
      longitude: parseFloat(cargeom_e[0]) - this.data.bj,
      latitude: parseFloat(cargeom_e[1]) + this.data.bj2
    })
    var imgurl = '../../../img/lj.png'
    this.data.markers.push({
      id: "end2",
      longitude: downgeom[0],
      latitude: downgeom[1],
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.data.includePoints.push({
      longitude: downgeom[0],
      latitude: downgeom[1]
    })
    this.data.includePoints.push({
      longitude: parseFloat(downgeom[0]) - this.data.bj,
      latitude: parseFloat(downgeom[1]) + this.data.bj2
    })
    var imgurl = '../../../img/marker.png'
    this.data.markers.push({
      id: "end2_1" ,
      longitude: ordergeom_s[0],
      latitude: ordergeom_s[1],
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.data.includePoints.push({
      longitude: ordergeom_s[0],
      latitude: ordergeom_s[1]
    })
    this.data.includePoints.push({
      longitude: parseFloat(ordergeom_s[0]) - this.data.bj,
      latitude: parseFloat(ordergeom_s[1]) + this.data.bj2
    })
    var imgurl = '../../../img/marker_checked.png'
    this.data.markers.push({
      id: "end2_2",
      longitude: ordergeom_e[0],
      latitude: ordergeom_e[1],
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.data.includePoints.push({
      longitude: ordergeom_e[0],
      latitude: ordergeom_e[1]
    })
    this.data.includePoints.push({
      longitude: parseFloat(ordergeom_e[0]) - this.data.bj,
      latitude: parseFloat(ordergeom_e[1]) + this.data.bj2
    })
    this.setData({
      markers: this.data.markers,
      includePoints: this.data.includePoints
    });
  },
  ustatus(e) {
    var btntx="";
    var btnid = e.detail.target.id;
    if (btnid == "jg_cg") {
      wx.navigateTo({
        url: '../price/price?s_title=' + this.data.data.start_title + '&e_title=' + this.data.data.downaddress+'&offer=' + this.data.data.offer + '&btnid=' + btnid + "&rid=" + this.data.rid
      })
      return false;
    }
    var data = {
      modeldata:'',
      rid: this.data.rid ,
      status:''
    }
    if (btnid == 1 || btnid == 2 || btnid == 3 || btnid == "jg_cz"
      || (btnid == 5 && this.data.optype == 1)) {
      var that=this;
      var modeldata = {
          touser: 'ovtTW5UfIDsfxg-bkLJ60_8AYPC8',
          template_id: '',
          form_id: e.detail.formId,
          page: "",
          data: {}
        }
      if (btnid==1){
        btntx = "确定乘客预定此订单";
        data.status ="1";
        modeldata.template_id ="YVmRoel0G_f3iAF6dEYD5tPZouern1mkkUR8PObp94w";
        modeldata.page = "page/home/orderpreview/orderpreview?type=0&optype=1&rid=" + this.data.rid
        modeldata.data={
          "keyword1": { "value": "起点：" + that.data.data.starttitle + " 终点：" + that.data.data.endtitle, "color": "#173177" },
          "keyword2": { "value": that.data.data.username, "color": "#173177" },
          "keyword3": { "value": that.data.data.sdate, "color": "#173177" },
          "keyword4": { "value": that.data.data.phone, "color": "#173177" },
          "keyword5": { "value": that.data.carnum, "color": "#173177" },
          "keyword6": { "value": that.data.data.offer+'元', "color": "#173177" },
          "keyword7": { "value": '请在' + that.data.data.start_title + "上车在" + that.data.data.downaddress + '下车', "color": "#173177" },
        } 
      } else if (btnid == 2 || btnid == 3){
        btntx = "乘客已预定此订单，取消可能对您的信用有所影响，确定取消吗？";
        data.status = "4";
        modeldata.template_id = "9rtF1pl4N5GrEKkmwlahSu5XCVAYh147seTwsrvm8yY";
        modeldata.page = "page/home/orderpreview/orderpreview?type=0&optype=2&rid=" + this.data.rid
        modeldata.data = {
          "keyword1": { "value": app.globalData.userInfo.name, "color": "#173177" },
          "keyword2": { "value": '车主拒绝了您的预定，您的起点是' + that.data.data.starttitle + " 终点是" + that.data.data.endtitle , "color": "#173177" }
        }
      } else if (btnid == 5 && this.data.optype == 1){
        //乘客已预订要删除
        btntx = "您已预定了此订单，取消可能对您的信用有所影响，确定取消吗？";
        modeldata.template_id = "EmuNfsedqcmZyHFF2kyJe6ACvqVd4U9rgkRy60pMPmc";
        modeldata.page = "page/home/orderpreview/orderpreview?type=0&optype=2&rid=" + this.data.rid
        modeldata.data = {
          "keyword1": { "value": app.globalData.userInfo.name, "color": "#173177" },
          "keyword2": { "value": '用户取消了起点：' + that.data.data.start_title + " 终点：" + that.data.data.end_title + '的订单', "color": "#173177" },
          "keyword3": { "value": utils.getDQSJ(), "color": "#173177" }
        }  
      } else if (btnid == "jg_cz"){//车主价格低
        btntx = "通知乘客价格有点低？";
        modeldata.template_id = "YStdKnI25OuQwJiYXzHfJxaos6Lcewq4zBgsRKxZRzQ";
        modeldata.page = "page/home/orderpreview/orderpreview?type=0&optype=0&rid=" + this.data.rid
        modeldata.data = {
          "keyword1": { "value": '起点：' + that.data.data.start_title + " 终点：" + that.data.data.end_title + '', "color": "#173177" },
          "keyword2": { "value": that.data.data.sdate, "color": "#173177" },
          "keyword3": { "value": "价格有点低哦，点击修改价格", "color": "#173177" }
        } 
      }
      data.modeldata= JSON.stringify(modeldata)
    }
    if (btnid == "jg_cz"){
      wx.showModal({
        title: "提醒", showCancel: true,
        content: btntx,
        success: function (isok) {
          wx.request({
            url: app.data.aurl + '/order/priceMin',
            data: { modeldata: data.modeldata},
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res2) {
              if (res2.data==1){
                wx.showToast({
                  title: '成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
              }else{
                wx.showModal({
                  title: "提醒", showCancel: false,
                  content: "发送失败"})
              }
              console.log("成功")
              return false;
            }
          })
        }
      })
        return false;
    }
    if (btnid == 4) {
      btntx = "确定取消此订单？";
      data.status = "3";
    } else if (btnid == 5){
      data.status = "5";
    }
    console.log(this.data.data)
    console.log(data)
    if(data.rid.length>0&&data.status.length>0){
      wx.showModal({
        title: "提醒", showCancel: true,
        content: btntx,
        success: function (isok) { 
          console.log()
          if (isok.confirm){
            wx.request({
              url: app.data.aurl + '/order/updateOrderStatus',
              data: data,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res2) {
                if (res2.data == 1) {
                  console.log("成功");
                  wx.navigateBack();
                }
              }
            })
          }
        }
      })
     
    }

  }
})