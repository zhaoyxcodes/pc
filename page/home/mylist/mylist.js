const app = getApp()
var utils = require('../../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bj: 0.002,//向左
    bj2: 0.002,//向上
    cuLo: null,
    cuLa: null,
    markers: [],
    polyline: [],
    includePoints: [],
    scale: 14,
    max_height: app.globalData.w_height,
    lineid: null,
    data: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "预览"
    })
    // options.rid ="3a3ee771815e4718997a0bfbc42b5830";
 
    if (typeof (options.rid) != 'undefined') {
      this.setData({
        lineid: options.rid
      })
      var _this = this
      wx.request({
        url: app.data.aurl + '/car/getLineById',
        data: { lineid: options.rid },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res2) {
          var data = res2.data;
          if (data != null && data.length>0){
            data[0].dayHName = utils.getDayName(data[0].sdate)
            var geomli = utils.geompoint(data[0].start_geom);
            _this.setData({
              data: data[0],
              cuLo: geomli[0],
              cuLa: geomli[1]
            })
            _this.detail();
            _this.saveMark(geomli, utils.geompoint(data[0].end_geom))
          }
          



        }
      })


    }

  },
  detail: function () {
    var self = this
    wx.request({
      url: app.data.aurl + '/car/getPoint',
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
  saveMark(cargeom_s, cargeom_e) {
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
    this.setData({
      markers: this.data.markers,
      includePoints: this.data.includePoints
    });
  }
})