//外部可用
const app = getApp()
module.exports = {
  getDay: getDay,
  showModal: showModal,
  getDayName: getDayName,
  GL_DIS: GL_DIS,
  timeStamp:timeStamp,
  geompoint: geompoint,
  getDQSJ: getDQSJ
}

function getDQSJ() {
  var time = new Date();   
  var m = time.getMonth() + 1;
  var t = time.getFullYear() + "-" + m + "-"
    + time.getDate() + " " + time.getHours() + ":"
    + time.getMinutes() + ":" + time.getSeconds();
  return t;
};
function geompoint(geom){
  if (geom.length > 0 && geom.indexOf("POINT")!=-1){
    var edngeomp = geom.substring(6, geom.length - 1);
    var endgeom = edngeomp.split(" ");
    return endgeom
  }
  return [];
}
// 将分钟数量转换为小时和分钟字符串
function timeStamp(StatusMinute) {
  var day = parseInt(StatusMinute / 60 / 24);
  var hour = parseInt(StatusMinute / 60 % 24);
  var min = parseInt(StatusMinute % 60);
  StatusMinute = "";
  if (day > 0) {
    StatusMinute = day + "天";
  }
  if (hour > 0) {
    StatusMinute += hour + "小时";
  }
  if (min > 0) {
    StatusMinute += parseFloat(min) + "分钟";
  }
  return StatusMinute;
}
function GL_DIS(distance){
  if (distance < 1000)
    return Math.floor(distance) + "米";
  else if (distance >= 1000)
    return (Math.round(distance / 100) / 10).toFixed(1) + "公里"
}
function getDayName(hh){
  console.log(hh)
  if (hh.length <= 0 && hh.indexOf(":")!=-1){
    return "";
  }
  var hlist=hh.split(":");
  var h=hlist[0].substring(hlist[0].length-2);
  var dname ="晚上";
  var hhval = parseInt(h);
  if (hhval < 6 && hhval>=4){
    dname ="凌晨"; 
  } else if (hhval >= 6 && hhval <8) {
    dname = "早上";
  } else if (hhval >= 8 && hhval <12) {
    dname = "上午";
  } else if (hhval < 15 && hhval >= 12) {
    dname = "中午";
  } else if (hhval < 18 && hhval >= 15) {
    dname = "下午";
  } else if (hhval < 20 && hhval >= 18) {
    dname = "傍晚";
  }
  return dname + h +":"+ hlist[1];
}
function showModal(title, content, showCancel) {
  wx.showModal({
    title: title, showCancel: showCancel,
    content: content,
    success: function (res) { }
  })
}
function mmm(title){
  wx.showToast({
    title: title,
    image: '../Image/error.png',
    duration: 2000
  })
}
function getDay() {
  var date = new Date();
  var day = ['每天'];
  day.push((date.getMonth() + 1) + '月' + date.getDate() + '日 今天');
  for (var i = 1; i <= 3; i++) {
    date.setDate(date.getDate() + 1);
    day.push((date.getMonth() + 1) + '月' + date.getDate() + '日 ' + week_str(date.getDay()));
  }
  var hour = []
  for (var i = 0; i < 24; i++) {
    if (i <= 9) {
      hour.push("0" + i + "点");
    } else {
      hour.push(i + "点");
    }

  }
  var mm = []
  for (var i = 0; i < 12; i++) {
    if (i < 2) {
      mm.push("0" + (i * 5) + "分");
    } else {
      mm.push((i * 5) + "分");
    }
  }
  return [day, hour, mm];
}
function week_str(week) {
  var str="";
  if (week == 0) {
    str = "星期日";
  } else if (week == 1) {
    str = "星期一";
  } else if (week == 2) {
    str = "星期二";
  } else if (week == 3) {
    str = "星期三";
  } else if (week == 4) {
    str = "星期四";
  } else if (week == 5) {
    str = "星期五";
  } else if (week == 6) {
    str = "星期六";
  }
  return str;
}