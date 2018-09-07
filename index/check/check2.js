const app = getApp()

Page({
  data: {
    attrSize: 5, heigthrpx: 20,
    listData: [
      { "code": "01", "text": "text1", "type": "type1" }
    ],
    addtitle: "",
    attrval: "",
    attrdatalist: [{ "id": "color", "attrname": "ys", "attrval": [], "height": "0", "fornum": 1 }, { "id": "size", "attrname": "size", "attrval": [], "height": "0", "fornum": 1 }],//后台获取属性
    attrSumSize: 0
  },
  onLoad: function () {

  },
  addattrtitle: function (e) {
    this.setData({
      addtitle: e.detail.value
    })
  },
  remove: function (e) {//删除属性值
    var attrindex = e.currentTarget.dataset.attid;
    var index = e.currentTarget.id
    this.data.attrdatalist[attrindex].attrval.splice(index, 1);
    this.js();
  },
  removeattr: function (e) {
    var index = e.currentTarget.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除此规格！',
      success: function (res) {
        if (res.confirm) {
          that.data.attrdatalist.splice(index, 1);
          that.js();
        } else if (res.cancel) {
        }
      }
    })
  },
  addattr: function (e) {
    if (this.data.addtitle.length <= 0) {
      wx.showModal({
        title: '',
        content: '请填写自定义属性名称！',
      })
    } else if (this.data.attrdatalist.length > this.data.attrSize) {
      wx.showModal({
        title: '',
        content: '规格数最大' + this.data.attrSize + "个",
      })
    } else {
      this.data.attrdatalist.push({ "id": "0", "attrname": this.data.addtitle, "attrval": [], "height": "0", "fornum": 1 })
      this.setData({
        attrdatalist: this.data.attrdatalist,
        addtitle: ""
      })
    }

  },
  addvalue: function (e) {
    var index = e.currentTarget.id
    if (this.data.attrval != null && this.data.attrval.length > 0) {
      for (var i = 0; i < this.data.attrdatalist.length; i++) {
        if (i == index) {
          var attrvals = this.data.attrdatalist[i].attrval;
          attrvals.push(this.data.attrval)
        }
      }
      this.js();

    } else {
      wx.showModal({
        title: '',
        content: '请输入规格值',
      })
    }
  },
  attrbind: function (e) {
    this.setData({
      attrval: e.detail.value
    })
  },
  js: function () {
    //计算总高度
    var heightsum = 1;
    for (var i = 0; i < this.data.attrdatalist.length; i++) {
      if (this.data.attrdatalist[i].attrval.length > 0) {
        heightsum = heightsum * parseInt(this.data.attrdatalist[i].attrval.length);
      }
    }
    console.log(heightsum)
    //计算每个格子高度
    for (var i = 0; i < this.data.attrdatalist.length; i++) {
      var hnnew = heightsum;
      var xnum = 1;
      for (var j = 0; j < this.data.attrdatalist.length; j++) {
        if (j <= i) {
          hnnew = hnnew / parseInt(this.data.attrdatalist[j].attrval.length)
          xnum = xnum * parseInt(this.data.attrdatalist[j].attrval.length)
        }
      }
      if (this.data.attrdatalist[i].attrval.length > 0 && hnnew > 0) {
        this.data.attrdatalist[i].height = hnnew * this.data.heigthrpx;
      }
      //计算循环次数
      if (this.data.attrdatalist[i].attrval.length > 0 && i != 0) {
        this.data.attrdatalist[i].fornum = xnum / this.data.attrdatalist[i].attrval.length;
      }

    }
    this.setData({
      attrdatalist: this.data.attrdatalist,
      attrval: "",
      attrSumSize: heightsum
    })
  }
})
