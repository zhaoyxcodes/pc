const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jg:null,
    rid:null,
    offer:null,
    remark:null,

    s_title:null,
    e_title:null
  },
  onLoad: function (options) {
    if (typeof (options.offer) != 'undefined' && typeof (options.s_title) != 'undefined' && typeof (options.e_title) != 'undefined'&&typeof (options.rid) != 'undefined') {
      this.setData({
        rid: options.rid,
        jg: options.offer,
        offer: options.offer,
        s_title: options.s_title,
        e_title: options.e_title
      })
    }
  },
  bindoffer(e) {
    this.setData({
      offer: e.detail.value
    })
  },
  reservation(e) {
    var that = this
    if (this.data.offer == null || this.data.offer.length <= 0) {
      utils.showModal('', '请输入路费', false)
      return false;
    } else if (this.data.rid == null || this.data.rid <= 0) {
      return false;
    } 
    var data = {
      price: this.data.offer,
      rid: this.data.rid,
      remark: this.data.remark,
      modeldata: JSON.stringify({
        touser: 'ovtTW5UfIDsfxg-bkLJ60_8AYPC8',
        template_id: '7HA4ZAU0szLGjtXiGGTwS1n-b89Bzy-t50W27d6r7Yg',
        form_id: e.detail.formId,
        page: "page/home/orderpreview/orderpreview",
        data: {
          "keyword1": { "value": this.data.jg +'元', "color": "#173177" },
          "keyword2": { "value": this.data.offer + '元', "color": "#173177" },
          "keyword3": { "value": "起点：" + this.data.s_title + " 终点：" + this.data.e_title+"乘客价格调整了", "color": "#173177" }
          
        }
      })
    }

    wx.request({
      url: app.data.aurl + '/order/updateOrderPrice',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res2) {
        if (res2.data == 0) {
          utils.showModal('', '预定失败', false)
          return false;
        } else {
          wx.navigateBack();
        }
      }
    })
  }

})