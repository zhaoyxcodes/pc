
function getDay(){
	var date=new Date();
	var day=['ÿ��'];
	day.push((date.getMonth()+1)+'��'+date.getDate()+'�� ����');
	for(var i=1;i<=3;i++){
		date.setDate(date.getDate()+1);
		day.push((date.getMonth()+1)+'��'+date.getDate()+'�� '+week_str(date.getDay()));
	}
	var hour=[]
	for(var i=0;i<24;i++){
		if(i<=9){
			hour.push("0"+i+"��");
		}else{
		hour.push(i+"��");
		}
		
	}
	var mm=[]
	for(var i=0;i<12;i++){
		if(i<2){
			mm.push("0"+(i*5)+"��");
		}else{
			mm.push((i*5)+"��");
		}
	}
	return [day,hour,mm];
}
function week_str(week){
	if (week == 0) {  
			str = "������";  
	} else if (week == 1) {  
			str = "����һ";  
	} else if (week == 2) {  
			str = "���ڶ�";  
	} else if (week == 3) {  
			str = "������";  
	} else if (week == 4) {  
			str = "������";  
	} else if (week == 5) {  
			str = "������";  
	} else if (week == 6) {  
			str = "������";  
	} 
	return str;
}