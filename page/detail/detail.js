// page/detail/detail.js
const app = getApp()
var utils = require('../../utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:[],//时间
    lineid:null,
    detailjson:null,
    cuLo: null,
    cuLa: null, //当前
    scale: 16,
    dqmarkers:[],//当前
    markers: [],//详情
    ljdtitle:'',//下车点
    polyline: [],
    includePoints: [],

    offer: null, phone: null, remark: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.ljdtitle) != 'undefined' &&typeof (options.lineid) != 'undefined' && typeof (options.detailjson) != 'undefined' 
      && typeof (options.markers) != 'undefined' && typeof (options.date) != 'undefined') {
      this.setData({
        ljdtitle: options.ljdtitle,
        date: JSON.parse(options.date),
        dqmarkers: JSON.parse(options.markers),
        lineid: options.lineid,
        detailjson: JSON.parse(options.detailjson),
        cuLo: app.globalData.cuLo,
        cuLa: app.globalData.cuLa 
      })
      // this.setData({
      //   detailjson: JSON.parse(' { "endgeom": "POINT(108.869217 34.18243)", "img": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eriaibsyvz5EwfLroRrTJNT1lbKK3y1pSz2OdN92Z71n0UZ0037N8BxiahPqTibfdFhMazY5Zkr5apYWQ/132", "username": "zyx", "carid": "0c3edb4ea78a48c09ff18309d1a0b405", "minstart": 384.3559816843124, "minend": 549.2307782515703, "linename": "默认", "lineid": "3a3ee771815e4718997a0bfbc42b5830", "peplenum": 2, "start_title": "金地·西沣公元", "end_title": "神州数码西安科技园", "start_address": "null", "end_address": "null", "phone": "18717370370", "everyday": 1, "startdate": "2018-09-17 11:05", "distance": "5814", "duration": "17", "start_geom": "POINT(108.89623 34.17348)", "end_geom": "POINT(108.86741 34.19413)", "dayHName": "上午11:05", "GL_distance": "5.8公里", "XS_duration": "17分钟", "GL_minend": "549米", "GL_minstart": "384米", "END_LAT": "34.18243", "END_LOG": "108.869217" }'),
      //   lineid: '3a3ee771815e4718997a0bfbc42b5830',
      //   dqmarkers: JSON.parse( '[{ "id": "start", "longitude": 108.895903, "latitude": 34.170034, "title": "曹家堡公租房小区", "iconPath": "../../img/mapicon_navi_s.png", "width": 23, "height": 33 }, { "id": "end", "longitude": 108.86331, "latitude": 34.18171, "title": "付村花园", "iconPath": "../../img/mapicon_navi_e.png", "width": 23, "height": 33 }]'),
      //   cuLo: app.globalData.cuLo,
      //   cuLa: app.globalData.cuLa
      // })
      
      var startgeomli=utils.geompoint(this.data.detailjson.start_geom)
      var endgeomli =utils.geompoint(this.data.detailjson.end_geom)
      this.saveMark(startgeomli[0], startgeomli[1], endgeomli[0], endgeomli[1],'','')
      this.detail()
    }
  },
  bindoffer(e){
    this.setData({
      offer: e.detail.value
    })
  },
  bindphone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  bindTextAreaBlur(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  reservation(e){
    var that = this
    if (this.data.offer == null || this.data.offer.length<=0){
      utils.showModal('', '请输入路费', false)
      return false;
    } else if (this.data.phone == null || this.data.phone.length <= 0){
      utils.showModal('', '请输入联系方式', false)
      return false;
    }else if (this.data.lineid == null || this.data.dqmarkers==null||
      this.data.dqmarkers.length < 2 || this.data.detailjson==null ){
        return false;
      }
    var data = {
      date: this.data.detailjson.startdate,
      user: JSON.stringify(wx.getStorageSync("user")),
      dataval: JSON.stringify({
        downaddress: this.data.ljdtitle, downmi: this.data.detailjson.GL_minend, startmi: this.data.detailjson.GL_minstart,
        line_id: this.data.lineid,starttitle:this.data.dqmarkers[0].title,endtitle:this.data.dqmarkers[1].title,start: 'POINT(' + this.data.dqmarkers[0].longitude + ' ' + this.data.dqmarkers[0].latitude+')' ,
        end: 'POINT(' + this.data.dqmarkers[1].longitude + ' ' + this.data.dqmarkers[1].latitude + ')' ,
        gatherstart: this.data.detailjson.start_geom, downend: this.data.detailjson.endgeom,
        offer: this.data.offer, phone: this.data.phone, remark: this.data.remark, carid: this.data.detailjson.carid}),
      formid:'123' ,
      modeldata: JSON.stringify({
            touser: 'ovtTW5UfIDsfxg-bkLJ60_8AYPC8',
              template_id: 'YStdKnI25OuQwJiYXzHfJ4on2wuksynlhLMiXf_Zqic',
              form_id: e.detail.formId,
        page: "page/home/orderpreview/orderpreview?type=1&optype=0&rid=",
                    data: {
              "keyword1": { "value": "起点：" + that.data.dqmarkers[0].title + " 终点：" + that.data.dqmarkers[1].title, "color": "#173177" },
              "keyword2": { "value": app.globalData.userInfo.name, "color": "#173177" },
              "keyword3": { "value": that.data.phone, "color": "#173177" },
                      "keyword4": { "value": that.data.detailjson.startdate, "color": "#173177" },
              "keyword5": { "value": utils.getDQSJ(), "color": "#173177" },
            }
          })
      }
    
    wx.request({
      url: app.data.aurl +'/car/reservation',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        if (res2.data == 1 || res2.data == '1') {
          utils.showModal('', '预定失败，您已预定了此时间段(' + that.data.detailjson.startdate+'前后区间1小时)的订单，你重新选择时间段预定！', false)
          return false;
        }else if(res2.data==0){
          utils.showModal('', '预定失败', false)
          return false;
        }else{
          wx.redirectTo({
            url: 'sucess/sucess?rid=' + res2.data
          })
          
        }
      }
    })
  },
  detail(){
    var self=this
    wx.request({
      url: app.data.aurl +'/car/getPoint',
      data: { lineid: this.data.lineid},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        if (res2.data != null && res2.data.length>0){
          var points2=[]
          for (var i = 0; i < res2.data.length;i++){
            var geomli =utils.geompoint(res2.data[i].geom)
            points2.push({
              longitude: geomli[0],
              latitude: geomli[1]
            })
          }
          self.data.includePoints = points2
          self.data.polyline.push({
            name: '',
            points: points2,
            color: "#0091ff",
            width: 6,
            borderWidth: 1,
            dottedLine: true
          })

          self.setData({
            polyline:self.data.polyline,
            includePoints:self.data.includePoints
          })
        }
        
      }
    })
  },
  saveMark(currentLo2, currentLa2, newCurrentLo2, newCurrentLa2, starttitle2, endtitle2) {
    var imgurl = '../../img/mapicon_navi_s.png'
    this.data.markers.push({
      id: "start",
      longitude: currentLo2,
      latitude: currentLa2,
      title: starttitle2,
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    var imgurl = '../../img/mapicon_navi_e.png' //end
    this.data.markers.push({
      id: "end",
      longitude: newCurrentLo2,
      latitude: newCurrentLa2,
      title: endtitle2,
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    var imgurl = '../../img/lj.png'
    this.data.markers.push({
      id: "end2",
      longitude: this.data.detailjson.END_LOG,
      latitude: this.data.detailjson.END_LAT,
      title: '',
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    for (var i = 0; i < this.data.dqmarkers.length;i++){
      var imgurl = '../../img/marker_checked.png'
      if(i==0){
        imgurl = '../../img/marker.png'
      }
      this.data.markers.push({
        id: "end2_"+i,
        longitude: this.data.dqmarkers[i].longitude,
        latitude: this.data.dqmarkers[i].latitude,
        title: '',
        iconPath: imgurl,
        width: 23,
        height: 33
      });
    }
    this.setData({
      markers: this.data.markers
    });
  }
})