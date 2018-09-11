var amapFile = require('../../amap-wx.js');
const app = getApp()
Page({
  data: {
    c_x: 0, c_y: 0,
    max_height: app.globalData.w_height,
    max_width: app.globalData.w_width,
    btn_height: 100,
    s_height: 260,
    key: '6f2ae22158f09ae7777a720c072deeb8',
    cuLo: null, cuLa: null,//当前
    currentLo: null,//起
    currentLa: null,
    newCurrentLo: null,//终
    newCurrentLa: null,
    starttitle: "", endtitle: "",

    currentLo2: null,//起
    currentLa2: null,
    newCurrentLo2: null,//终
    newCurrentLa2: null,
    starttitle2: "", endtitle2: "",

    distance: 0,
    duration: 0,
    markers: [], polyline: [], includePoints: [],
    scale: 16,
    checkindex: 0,


    multiArray: [],
    multiIndex: [0, 0, 0],
    currentData: 0,
  },
  onLoad() {
    var _this = this;
    wx.getLocation({
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
      }
    })

    this.data.multiArray = [['9月10日 今天', '9月11日 周二', '9月11日 周三', '9月11日 周四'], ['0点', '1点', '2点', '3点', '4点', '5点'], ['00分', '10分', '20分', '30分', '40分', '50分']]

    this.setData({
      multiArray: this.data.multiArray,
    })
  },
  handletouchtart(e) {
    let pageX = e.touches[0].pageX;
    let pageY = e.touches[0].pageY;
    console.log(pageX + "    |    " + pageY)
    this.setData({
      c_x: pageX, c_y: pageY
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

    }
    else if (ty > 0) {
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
      markers: [], polyline: [], includePoints: []
    });
    if (pagenum == 0 && this.data.currentLo != null && this.data.currentLa != null && this.data.newCurrentLo != null
      && this.data.newCurrentLa != null && this.data.starttitle != null && this.data.endtitle != null) {
      this.saveMark(this.data.currentLo, this.data.currentLa, this.data.newCurrentLo, this.data.newCurrentLa, this.data.starttitle, this.data.endtitle);
      this.saveincludeP()
    } else if (pagenum == 1 && this.data.currentLo2 != null && this.data.currentLa2 != null && this.data.newCurrentLo2 != null
      && this.data.newCurrentLa2 != null && this.data.starttitle2 != null && this.data.endtitle2 != null) {
      this.saveMark(this.data.currentLo2, this.data.currentLa2, this.data.newCurrentLo2, this.data.newCurrentLa2, this.data.starttitle2, this.data.endtitle2);
      this.getPolyline();
    }
  },
  //将乘车点加入到地图点中
  saveincludeP(){
    this.data.includePoints.push({
      longitude: this.data.currentLo,
      latitude: this.data.currentLa
    });
    this.data.includePoints.push({
      longitude: this.data.newCurrentLo,
      latitude: this.data.newCurrentLa
    });
    this.setData({
      includePoints: this.data.includePoints
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
    var imgurl = '../../img/mapicon_navi_e.png'//end
    this.data.markers.push({
      id: "end",
      longitude: newCurrentLo2,
      latitude: newCurrentLa2,
      title: endtitle2,
      iconPath: imgurl,
      width: 23,
      height: 33
    });
    this.setData({
      markers: this.data.markers
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
            starttitle: res.address,
            currentLo: res.longitude,
            currentLa: res.latitude,
          });
        } else {
          imgurl = '../../img/mapicon_navi_e.png'//end
          _this.setData({
            polyline: [],
            endtitle: res.address,
            newCurrentLo: res.longitude,
            newCurrentLa: res.latitude,
          });
        }
        markers.push({
          id: e.currentTarget.id,
          longitude: res.longitude,
          latitude: res.latitude,
          title: res.address,
          iconPath: imgurl,
          width: 23,
          height: 33
        });


        _this.setData({
          markers: markers,
          checkindex: 0
        });
        if (_this.data.starttitle.length > 0 && _this.data.endtitle.length > 0) {
          _this.saveincludeP()
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
            starttitle2: res.address,
            currentLo2: res.longitude,
            currentLa2: res.latitude,
          });
        } else {
          imgurl = '../../img/mapicon_navi_e.png'//end
          _this.setData({
            polyline: [],
            endtitle2: res.address,
            newCurrentLo2: res.longitude,
            newCurrentLa2: res.latitude,
          });
        }
        markers.push({
          id: e.currentTarget.id,
          longitude: res.longitude,
          latitude: res.latitude,
          title: res.address,
          iconPath: imgurl,
          width: 23,
          height: 33
        });


        _this.setData({
          markers: markers,
          checkindex: 0
        });
        if (_this.data.starttitle2.length > 0 && _this.data.endtitle2.length > 0) {
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
              }
            }
          }
          var dottedLine = false;
          if (self.data.polyline.length > 0) {
            dottedLine = true;
          }
          self.data.polyline.push({
            distance: lineobj.distance,
            duration: parseInt(lineobj.duration / 60),
            points: points,
            color: color,
            width: 6,
            borderWidth: 1,
            dottedLine: dottedLine
          })
        }

        for (var b = 0; b < self.data.markers.length; b++) {
          points2.push({
            longitude: self.data.markers[b].longitude,
            latitude: self.data.markers[b].latitude
          });
        }
        self.setData({
          includePoints: points2,
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
      if (index == i) {//选中的
        this.data.polyline[i].dottedLine = false;
      } else {
        this.data.polyline[i].dottedLine = true;
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
    var amap = new amapFile.AMapWX({ key: this.data.key });
    var self = this;
    amap.getDrivingRoute(this.drawPolyline(this, "#0091ff"));
  },
  goTo(e) {
    this.getPolyline();
  },
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
  bindchange: function (e) {
    const that = this;
    that.w_height(e.detail.current);
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
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
  w_height(current) {
    console.log(current)
    var s_height = 400;
    if (current == 0) {
      s_height = 260;
    }
    this.setData({
      s_height: s_height
    })

  }
})