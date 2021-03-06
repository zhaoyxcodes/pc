var amapFile = require('../../amap-wx.js');
var utils = require('../../utils.js');
const app = getApp()
Page({
  data: {
    c_x: 0,
    c_y: 0,
    max_height: app.globalData.w_height,
    max_width: app.globalData.w_width,
    btn_height: 100,
    s_height: 260,
    key: '6f2ae22158f09ae7777a720c072deeb8',
    cuLo: null,
    cuLa: null, //当前
    currentLo: null, //起
    currentLa: null,
    newCurrentLo: null, //终
    newCurrentLa: null,
    starttitle: "",
    endtitle: "",

    currentLo2: null, //起
    currentLa2: null,
    newCurrentLo2: null, //终
    newCurrentLa2: null,
    starttitle2: "",
    endtitle2: "",

    distance: 0,
    duration: 0,
    markers: [],
    polyline: [],
    includePoints: [],
    scale: 14,
    checkindex: 0,

    p_phone: '',
    checkboxlist: [],
    peplenum: [1, 2, 3, 4, 5, 6], //乘坐人数
    pepleindex: 0,
    multiArray0: [],
    multiIndex0: [0, 0, 0],
    multiArray: [],
    multiIndex: [0, 0, 0],
    currentData: 0,

    carauth: 0,//车主认证1
    ismsg:0,//是否有提醒
    dnone:'none'
  },
  linkrz(){
    wx.navigateTo({
      url: '../home/certification/certification'
    })
  },
  onLoad() {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        _this.setData({
          currentLo: res.longitude,
          currentLa: res.latitude,
          cuLo: res.longitude,
          cuLa: res.latitude,
          includePoints: [{
            longitude: res.longitude,
            latitude: res.latitude
          }]
        });
        app.globalData.cuLo = res.longitude
        app.globalData.cuLa = res.latitude

      }
    })


    this.setData({
      multiArray0: utils.getDay(0),
      multiIndex0: [0, new Date().getHours(), 0],
      multiArray: utils.getDay(1),
      multiIndex: [0, new Date().getHours(), 0]
    })
    if (app.globalData.userInfo.carstatus != null && app.globalData.userInfo.carstatus.length>0){
      this.setData({
        carauth: app.globalData.userInfo.carstatus
      })
    }
    if (app.globalData.userInfo.carphone != null && app.globalData.userInfo.carphone.length > 0) {
      this.setData({
        p_phone: app.globalData.userInfo.carphone
      })
    }
  },
  handletouchtart(e) {
    let pageX = e.touches[0].pageX;
    let pageY = e.touches[0].pageY;
    console.log(pageX + "    |    " + pageY)
    this.setData({
      c_x: pageX,
      c_y: pageY
    })
  },
  handletouchmove(e) {
    let currentX = e.touches[0].pageX;
    let currentY = e.touches[0].pageY;
    let tx = currentX - this.data.c_x
    let ty = currentY - this.data.c_y
    let text = ""
    //左右方向滑动

    if (ty < 0) {
      text = "向上滑动"
      this.setData({
        btn_height: 200

      })

    } else if (ty > 0) {
      text = "向下滑动"
      this.setData({
        btn_height: 100
      })
    } else {
      this.setData({
        btn_height: 200

      })
    }
    console.log(text)
  },
  gotopage(pagenum) {
    this.setData({
      distance: 0,
      duration: 0,
      checkindex: 0,
      markers: [],
      polyline: [],
      includePoints: []
    });
    if (pagenum == 0 && this.data.currentLo != null && this.data.currentLa != null && this.data.newCurrentLo != null &&
      this.data.newCurrentLa != null && this.data.starttitle != null && this.data.endtitle != null) {
      this.saveMark(this.data.currentLo, this.data.currentLa, this.data.newCurrentLo, this.data.newCurrentLa, this.data.starttitle, this.data.endtitle);
    } else if (pagenum == 1 && this.data.currentLo2 != null && this.data.currentLa2 != null && this.data.newCurrentLo2 != null &&
      this.data.newCurrentLa2 != null && this.data.starttitle2 != null && this.data.endtitle2 != null) {
      this.saveMark(this.data.currentLo2, this.data.currentLa2, this.data.newCurrentLo2, this.data.newCurrentLa2, this.data.starttitle2, this.data.endtitle2);
      this.getPolyline();
    }
  },
  saveMark(currentLo2, currentLa2, newCurrentLo2, newCurrentLa2, starttitle2, endtitle2) {
    this.data.markers=[];
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
    this.data.includePoints.push({
      longitude: currentLo2,
      latitude: currentLa2
    });
    this.data.includePoints.push({
      longitude: (parseFloat(currentLo2) - app.data.bj),
      latitude: (parseFloat(currentLa2) + app.data.bj2)
    })
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

    this.data.includePoints.push({
      longitude: newCurrentLo2,
      latitude: newCurrentLa2
    });
    this.data.includePoints.push({
      longitude: (parseFloat(newCurrentLo2) - app.data.bj),
      latitude: (parseFloat(newCurrentLa2) + app.data.bj2)
    })
    this.setData({
      markers: this.data.markers,
      includePoints: this.data.includePoints
    });
  },
  getAddress(e) {
    var _this = this;
    wx.chooseLocation({
      success(res) {
        var markers = _this.data.markers;
        //clean
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].id == e.currentTarget.id) {
            markers.splice(i, 1)
          }
        }
        var imgurl = "";
        if (e.currentTarget.id == "start") {
          imgurl = '../../img/mapicon_navi_s.png'
          _this.setData({
            polyline: [],
            starttitle: res.name,
            currentLo: res.longitude,
            currentLa: res.latitude,
          });
        } else {
          imgurl = '../../img/mapicon_navi_e.png' //end
          _this.setData({
            polyline: [],
            endtitle: res.name,
            newCurrentLo: res.longitude,
            newCurrentLa: res.latitude,
          });
         
        }
        markers.push({
          id: e.currentTarget.id,
          longitude: res.longitude,
          latitude: res.latitude,
          title: res.name,
          iconPath: imgurl,
          width: 23,
          height: 33
        });


        _this.setData({
          markers: markers,
          checkindex: 0
        });
        if (_this.data.starttitle.length > 0 && _this.data.endtitle.length > 0) {
          _this.setData({
            includePoints: []
          });
          _this.saveMark(_this.data.currentLo, _this.data.currentLa, _this.data.newCurrentLo, _this.data.newCurrentLa, _this.data.starttitle, _this.data.endtitle);
        }

      }
    });
  },
  getAddress2(e) {
    var _this = this;
    wx.chooseLocation({
      success(res) {
        var markers = _this.data.markers;
        //clean
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].id == e.currentTarget.id) {
            markers.splice(i, 1)
          }
        }
        var imgurl = "";
        if (e.currentTarget.id == "start") {
          imgurl = '../../img/mapicon_navi_s.png'
          _this.setData({
            polyline: [],
            starttitle2: res.name,
            currentLo2: res.longitude,
            currentLa2: res.latitude,
          });
        } else {
          imgurl = '../../img/mapicon_navi_e.png' //end
          _this.setData({
            polyline: [],
            endtitle2: res.name,
            newCurrentLo2: res.longitude,
            newCurrentLa2: res.latitude,
          });
        }
        markers.push({
          id: e.currentTarget.id,
          longitude: res.longitude,
          latitude: res.latitude,
          title: res.name,
          iconPath: imgurl,
          width: 23,
          height: 33
        });

        _this.setData({
          markers: markers,
          checkindex: 0,
          checkboxlist: []
        });
        if (_this.data.starttitle2.length > 0 && _this.data.endtitle2.length > 0) {
          _this.setData({
            distance: 0,
            duration: 0,
            polyline: [],
            includePoints: []
          });
          _this.saveMark(_this.data.currentLo2, _this.data.currentLa2, _this.data.newCurrentLo2, _this.data.newCurrentLa2, _this.data.starttitle2, _this.data.endtitle2);
          _this.getPolyline();
        }
      }
    });
  },
  drawPolyline(self, color) {
    return {
      origin: this.data.currentLo2 + ',' + this.data.currentLa2,
      destination: this.data.newCurrentLo2 + ',' + this.data.newCurrentLa2,
      strategy: 10,
      success(data) {
        // console.log(data)
        var points2 = [];
        for (var x = 0; x < data.paths.length; x++) {
          var lineobj = data.paths[x];
          var points = [];
          if (lineobj && lineobj.steps) {
            var steps = lineobj.steps;
            for (var i = 0; i < steps.length; i++) {
              var poLen = steps[i].polyline.split(';');
              for (var j = 0; j < poLen.length; j++) {
                points.push({
                  longitude: parseFloat(poLen[j].split(',')[0]),
                  latitude: parseFloat(poLen[j].split(',')[1])
                })
                points2.push({
                  longitude: parseFloat(poLen[j].split(',')[0]),
                  latitude: parseFloat(poLen[j].split(',')[1])
                })
                self.data.includePoints.push({
                  longitude: parseFloat(poLen[j].split(',')[0]),
                  latitude: parseFloat(poLen[j].split(',')[1])
                })
              }
            }
          }
          var dottedLine = false;
          if (self.data.polyline.length > 0) {
            dottedLine = true;
          }
          var c_color=color;
          if (self.data.polyline.length==0){
            c_color="#1aad16"
          }
          self.data.polyline.push({
            name: '',
            distance: lineobj.distance,
            duration: parseInt(lineobj.duration / 60),
            points: points,
            color: c_color,
            width: 6,
            borderWidth: 1,
            dottedLine: dottedLine
          })
        }
        if (self.data.polyline.length > 1) {
          self.setData({
            s_height: 330 + 140
          });
        } else {
          self.setData({
            s_height: 330 //page2
          });
        }
      
        self.setData({
          checkboxlist: ["0"], //默认选择线路
          includePoints: self.data.includePoints,
          distance: self.data.polyline[0].distance,
          duration: self.data.polyline[0].duration,
          polyline: self.data.polyline
        });
      }
    }
  },
  showline(e) {
    var index = e.currentTarget.id;
    for (var i = 0; i < this.data.polyline.length; i++) {
      if (index == i) { //选中的
        this.data.polyline[i].dottedLine = false;
        this.data.polyline[i].color = "#1aad16"
      } else {
        this.data.polyline[i].dottedLine = true;
        this.data.polyline[i].color = "#0091ff"
      }
    }
    
    this.setData({
      distance: this.data.polyline[index].distance,
      duration: this.data.polyline[index].duration,
      polyline: this.data.polyline,
      checkindex: index
    });
  },
  getPolyline() {
    var amap = new amapFile.AMapWX({
      key: this.data.key
    });
    var self = this;
    amap.getDrivingRoute(this.drawPolyline(this, "#0091ff"));
  },
  goTo(e) {
    this.getPolyline();
  },
  //选择时间
  bindMultiPickerChange0: function(e) {
    var val = e.detail.value
    console.log('picker发送选择改变，携带值为', val)
    this.setData({
      multiIndex0: val
    })
  },
  bindMultiPickerColumnChange0: function(e) {
    var val = e.detail.value
    console.log('修改的列为', e.detail.column, '，值为', val);

    var data = {
      multiIndex0: this.data.multiIndex0
    };
    data.multiIndex0[e.detail.column] = val;
    console.log(this.data.multiIndex0)
    this.setData(data);
  },
  //选择时间
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.w_height(e.detail.current);
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.w_height(e.target.dataset.current);
      that.gotopage(e.target.dataset.current)
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  bindPickerChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      pepleindex: e.detail.value
    })
  },
  w_height(current) {
    console.log(current)
    var s_height = 330; //page2
    if (current == 0) {
      s_height = 260;
    }
    this.setData({
      s_height: s_height
    })

  },
  getphone: function(e) {
    this.setData({
      p_phone: e.detail.value
    })
  },
  checkboxChange: function(e) {
    this.setData({
      checkboxlist: e.detail.value
    })
  },
  linkhome:function(){
    wx.navigateTo({
      url: '../home/home',
    })
  },
  dc: function() {
    var bool = app.islogin()
    if (!bool) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    }
    if (this.data.markers.length < 2) {
      utils.showModal('', '请选择位置', false)
      return false;
    }
    var newmult=[];
    newmult.push((this.data.multiIndex0[0]+1))
    newmult.push(this.data.multiIndex0[1] )
    newmult.push(this.data.multiIndex0[2])
    wx.navigateTo({
      url: '../release/release?markers=' + JSON.stringify(this.data.markers) + "&date=" + JSON.stringify(newmult)
     })
  },
  fb: function() {
    var bool = app.islogin()
    if (!bool) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    }
    if (this.data.markers.length < 2) {
      utils.showModal('', '请选择位置', false)
      return false;
    }
    if (this.data.checkboxlist.length <= 0) {
      utils.showModal('', '请选择路线', false)
      return false;
    } else if (this.data.p_phone.length <= 0) {
      utils.showModal('', '请填写手机号码，方便乘客联系', false)
      return false;
    }
    var polyline_submit = [];
    for (var i = 0; i < this.data.checkboxlist.length; i++) {
      var checkboxnum = this.data.checkboxlist[i];
      if (checkboxnum == 0) {
        this.data.polyline[checkboxnum].name = "默认";
      } else {
        this.data.polyline[checkboxnum].name = "线路" + checkboxnum;
      }
      polyline_submit.push(this.data.polyline[checkboxnum])
    }
    if (polyline_submit.length < 1) {
      utils.showModal('', '线路不能为空', false)
      return false;
    }
    wx.request({
      url: app.data.aurl +'/car/insertCar',
      data: {
        markers: JSON.stringify(this.data.markers),
        polyline: JSON.stringify(polyline_submit),
        peplenum: this.data.peplenum[this.data.pepleindex],
        phone: this.data.p_phone,
        date: JSON.stringify(this.data.multiIndex),
        user: JSON.stringify(wx.getStorageSync("user"))
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res2) {
        console.log(res2.data)
        if (res2.data == 1) {
          wx.navigateTo({
            url: '../home/service/service',
          })
        } else if (res2.data == 11 || res2.data == '11') {
          utils.showModal('', '该时间前后1小时已存在发布信息，请重新选择时间。', false)
          return false;
        } else if (res2.data == 12 || res2.data == '12') {
          utils.showModal('', '发布时间必须大于当前时间，请重新选择时间。', false)
          return false;
        }  else {
          utils.showModal('', '预定失败', false)
          return false;
        }

      }
    })
  }
})