const app = getApp()

Page({
  data: {
    heigthrpx: 20, 
    attrSumSize: 0,//总数
    attrdatalist: [{ "id": "color", "attrname": "ys", "attrval": [{ "id": "1", "name": "黑色" }, { "id": "2", "name": "白色" }, { "id": "0", "name": "褐色" }] }, { "id": "size", "attrname": "size", "attrval": [{ "id": "3", "name": "15cm" }, { "id": "4", "name": "18cm" }] }, { "id": "pp", "attrname": "品牌", "attrval": [{ "id": "7", "name": "NIKE" }, { "id": "8", "name": "AD" }, { "id": "9", "name": "KW" }] },],//后台获取属性
    checklist: [],//选中的属性值
    submitSKU: [],
    skuli:[],//sku值的下标[0,0]
    priceli:[],
    count:[]
  },
  onLoad: function () {

  },
  attrbind: function (e) {
    var attrvalindexs = e.detail.value;
    var attrid = e.target.dataset.attid
    var attrname = e.target.dataset.attname
    var attrindex = e.target.dataset.attindex
    var checks = []

    for (var i = 0; i < attrvalindexs.length; i++) {
      checks.push(this.data.attrdatalist[attrindex].attrval[attrvalindexs[i]])
    }
    var bol = false;
    for (var i = 0; i < this.data.checklist.length; i++) {
      if (attrid == this.data.checklist[i].id) {
        if (checks.length <= 0) {
          this.data.checklist.splice(i, 1);
        } else {
          this.data.checklist[i].attrval = checks
        }
        bol = true
      }
    }
    if (!bol) {
      this.data.checklist.push({ "id": attrid, "attrname": attrname, "attrval": checks, "height": "0", "fornum": 1 })
    }
    this.js_style()
  },
  js_style: function () {
    //计算总高度
    var heightsum = 1;
    for (var i = 0; i < this.data.checklist.length; i++) {
      if (this.data.checklist[i].attrval.length > 0) {
        heightsum = heightsum * parseInt(this.data.checklist[i].attrval.length);
      }
    }
    // console.log(heightsum)
    //计算每个格子高度
    for (var i = 0; i < this.data.checklist.length; i++) {
      var hnnew = heightsum;
      var xnum = 1;
      for (var j = 0; j < this.data.checklist.length; j++) {
        if (j <= i) {
          hnnew = hnnew / parseInt(this.data.checklist[j].attrval.length)
          xnum = xnum * parseInt(this.data.checklist[j].attrval.length)
        }
      }
      if (this.data.checklist[i].attrval.length > 0 && hnnew > 0) {
        this.data.checklist[i].height = hnnew * this.data.heigthrpx;
      }
      //计算循环次数
      if (this.data.checklist[i].attrval.length > 0 && i != 0) {
        this.data.checklist[i].fornum = xnum / this.data.checklist[i].attrval.length;
      }

    }
    // console.log(this.data.checklist)
    this.data.priceli = [];
    this.data.count=[];
    for (var i = 0; i < heightsum;i++){
      this.data.priceli.push(0);
      this.data.count.push(0);
    }
    this.setData({
      checklist: this.data.checklist,
      attrSumSize: heightsum,
      priceli: this.data.priceli,
      count: this.data.count
    })
     this.js_sku()//计算sku
    
  },
  priceSKU:function(e){
    var val = e.detail.value
    var index = e.currentTarget.id
    this.data.priceli[index] = val;
    this.js_countorprice();
  },
  countSKU:function(e){
    var val=e.detail.value
    var index = e.currentTarget.id
    this.data.count[index]=val;
    this.js_countorprice();
  },
  js_countorprice:function(){
    for(var i=0;i<this.data.submitSKU.length;i++){
      this.data.submitSKU[i].prive = this.data.priceli[i];
      this.data.submitSKU[i].count = this.data.count[i];
    }
    this.setData({
      count: this.data.count,
      priceli: this.data.priceli,
      submitSKU:this.data.submitSKU
    })
    console.log(this.data.submitSKU)
  },
  js_sku: function () {
    this.data.submitSKU = [];
    this.data.skuli=[]
    var csize = this.data.checklist.length;
    if (csize > 0) {
      this.goto(0)
    }
  },
  //迭代计算sku属性名|值
  goto:function(num1) {
    if (this.data.skuli != null && this.data.skuli.length >( this.data.checklist.length-1)) {
      this.data.skuli = []
    }
    if (num1 < this.data.checklist.length) {
      for (var i = 0; i < this.data.checklist[num1].attrval.length; i++) {
        if (num1 == (this.data.checklist.length - 1)) {//最后一个值
          var str = [];
          
          for (var j = 0; j < this.data.skuli.length; j++) {
            var itemli = this.data.skuli[j].split("|");
            var inum1 = parseInt(itemli[0]);
            var inum2 = parseInt(itemli[1]);
            var itemattr = this.data.checklist[inum1]
            var itemval=this.data.checklist[inum1].attrval[inum2] 
            str.push({ "attrid": itemattr.id, "attrname": itemattr.attrname, "valid": itemval.id, "valname": itemval.name});
          }
          var itemattr2 = this.data.checklist[num1]
          var itemval2 = this.data.checklist[num1].attrval[i]
          str.push({ "attrid": itemattr2.id, "attrname": itemattr2.attrname, "valid": itemval2.id, "valname": itemval2.name });
          var priceval=this.data.priceli[this.data.submitSKU.length]
          var countval = this.data.count[this.data.submitSKU.length]
          this.data.submitSKU.push({ "attrlist": str, "count": countval, "prive": priceval});

        } else {
          this.data.skuli[num1] = num1 + "|" + i;
        }
        var num2 = num1 + 1
        this.goto(num2)
      }
    }
  }
})
