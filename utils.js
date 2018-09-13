
function getDay(){
	var date=new Date();
	var day=['每天'];
	day.push((date.getMonth()+1)+'月'+date.getDate()+'日 今天');
	for(var i=1;i<=3;i++){
		date.setDate(date.getDate()+1);
		day.push((date.getMonth()+1)+'月'+date.getDate()+'日 '+week_str(date.getDay()));
	}
	var hour=[]
	for(var i=0;i<24;i++){
		if(i<=9){
			hour.push("0"+i+"点");
		}else{
		hour.push(i+"点");
		}
		
	}
	var mm=[]
	for(var i=0;i<12;i++){
		if(i<2){
			mm.push("0"+(i*5)+"分");
		}else{
			mm.push((i*5)+"分");
		}
	}
	return [day,hour,mm];
}
function week_str(week){
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