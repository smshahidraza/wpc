

FIRST_QUARTER = 1;
SECOND_QUARTER = 2;
THIRD_QUARTER = 3;
FOURTH_QUARTER = 4;

var IMASK = 0;
    FAJR = 1,
    SUNRISE = 2,
    DHUHR = 3,
    ASR = 4,
    SUNSET = 5;
    MAGHRIB = 6,
    ISHA = 7;
    MIDNIGHT = 8;


var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12',
}

var HijriNames = [
  "Muharram", "Safar", "Rabi Al-Awwal", "Rabi Al-Thani", 
  "Jmd Al-Awwal", "Jmd Al-Thani", "Rajab", "Sha'ban", 
  "Ramadan", "Shawwal", "Dhul Qa'idah", "Dhul Hijjah"
];

var HijriNamesArabic = [
    "محرم","صفر","ربيع الأول","ربيع الثاني",
    "جمادى الأول","جمادى الآخر","رجب ","شعبان",
    "رمضان", "شوال" ,"ذو القعدة" ,"ذو الحجة"
];

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

Date.prototype.dayNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
];

Date.prototype.getDayName = function() {
    return this.dayNames[this.getDay()];
};

Date.prototype.getShortDayName = function () {
    return this.getDayName().substring(0, 3);
};


var drawArcedArrow=function(ctx,x,y,r,startangle,endangle,anticlockwise,style,which,angle,d)
{
    'use strict';
    style=typeof(style)!='undefined'? style:3;
    which=typeof(which)!='undefined'? which:1; // end point gets arrow
    angle=typeof(angle)!='undefined'? angle:Math.PI/8;
    d    =typeof(d)    !='undefined'? d    :10;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,r,startangle,endangle,anticlockwise);
    ctx.stroke();
    var sx,sy,lineangle,destx,desty;
    ctx.strokeStyle='rgba(0,0,0,0)';	// don't show the shaft
    if(which&1){	    // draw the destination end
	sx=Math.cos(startangle)*r+x;
	sy=Math.sin(startangle)*r+y;
	lineangle=Math.atan2(x-sx,sy-y);
	if(anticlockwise){
	    destx=sx+10*Math.cos(lineangle);
	    desty=sy+10*Math.sin(lineangle);
	}else{
	    destx=sx-10*Math.cos(lineangle);
	    desty=sy-10*Math.sin(lineangle);
	}
	drawArrow(ctx,sx,sy,destx,desty,style,2,angle,d);
    }
    if(which&2){	    // draw the origination end
	sx=Math.cos(endangle)*r+x;
	sy=Math.sin(endangle)*r+y;
	lineangle=Math.atan2(x-sx,sy-y);
	if(anticlockwise){
	    destx=sx-10*Math.cos(lineangle);
	    desty=sy-10*Math.sin(lineangle);
	}else{
	    destx=sx+10*Math.cos(lineangle);
	    desty=sy+10*Math.sin(lineangle);
	}
	drawArrow(ctx,sx,sy,destx,desty,style,2,angle,d);
    }
    ctx.restore();
}

var drawArrow=function(ctx,x1,y1,x2,y2,style,which,angle,d)
{
  'use strict';
  // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
  // would happen instead of addition
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  style=typeof(style)!='undefined'? style:3;
  which=typeof(which)!='undefined'? which:1; // end point gets arrow
  angle=typeof(angle)!='undefined'? angle:Math.PI/8;
  d    =typeof(d)    !='undefined'? d    :10;
  // default to using drawHead to draw the head, but if the style
  // argument is a function, use it instead
  var toDrawHead=typeof(style)!='function'?drawHead:style;

  // For ends with arrow we actually want to stop before we get to the arrow
  // so that wide lines won't put a flat end on the arrow.
  //
  var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var ratio=(dist-d/3)/dist;
  var tox, toy,fromx,fromy;
  if(which&1){
    tox=Math.round(x1+(x2-x1)*ratio);
    toy=Math.round(y1+(y2-y1)*ratio);
  }else{
    tox=x2;
    toy=y2;
  }
  if(which&2){
    fromx=x1+(x2-x1)*(1-ratio);
    fromy=y1+(y2-y1)*(1-ratio);
  }else{
    fromx=x1;
    fromy=y1;
  }

  // Draw the shaft of the arrow
  ctx.beginPath();
  ctx.moveTo(fromx,fromy);
  ctx.lineTo(tox,toy);
  ctx.stroke();

  // calculate the angle of the line
  var lineangle=Math.atan2(y2-y1,x2-x1);
  // h is the line length of a side of the arrow head
  var h=Math.abs(d/Math.cos(angle));
  h = h -2;
  if(which&1){	// handle far end arrow head
    var angle1=lineangle+Math.PI+angle;
    var topx=x2+Math.cos(angle1)*h;
    var topy=y2+Math.sin(angle1)*h;
    var angle2=lineangle+Math.PI-angle;
    var botx=x2+Math.cos(angle2)*h;
    var boty=y2+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);
  }
  if(which&2){ // handle near end arrow head
    var angle1=lineangle+angle;
    var topx=x1+Math.cos(angle1)*h;
    var topy=y1+Math.sin(angle1)*h;
    var angle2=lineangle-angle;
    var botx=x1+Math.cos(angle2)*h;
    var boty=y1+Math.sin(angle2)*h;
    toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
  }
}

var drawHead=function(ctx,x0,y0,x1,y1,x2,y2,style)
{
  'use strict';
  if(typeof(x0)=='string') x0=parseInt(x0);
  if(typeof(y0)=='string') y0=parseInt(y0);
  if(typeof(x1)=='string') x1=parseInt(x1);
  if(typeof(y1)=='string') y1=parseInt(y1);
  if(typeof(x2)=='string') x2=parseInt(x2);
  if(typeof(y2)=='string') y2=parseInt(y2);
  var radius=3;
  var twoPI=2*Math.PI;

  // all cases do this.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0,y0);
  ctx.lineTo(x1,y1);
  ctx.lineTo(x2,y2);
  switch(style){
    case 0:
      // curved filled, add the bottom as an arcTo curve and fill
      var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
      ctx.arcTo(x1,y1,x0,y0,.55*backdist);
      ctx.fill();
      break;
    case 1:
      // straight filled, add the bottom as a line and fill.
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.lineTo(x0,y0);
      ctx.fill();
      break;
    case 2:
      // unfilled head, just stroke.
      ctx.stroke();
      break;
    case 3:
      //filled head, add the bottom as a quadraticCurveTo curve and fill
      var cpx=(x0+x1+x2)/3;
      var cpy=(y0+y1+y2)/3;
      ctx.quadraticCurveTo(cpx,cpy,x0,y0);
      ctx.fill();
      break;
    case 4:
      //filled head, add the bottom as a bezierCurveTo curve and fill
      var cp1x, cp1y, cp2x, cp2y,backdist;
      var shiftamt=5;
      if(x2==x0){
	// Avoid a divide by zero if x2==x0
	backdist=y2-y0;
	cp1x=(x1+x0)/2;
	cp2x=(x1+x0)/2;
	cp1y=y1+backdist/shiftamt;
	cp2y=y1-backdist/shiftamt;
      }else{
	backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
	var xback=(x0+x2)/2;
	var yback=(y0+y2)/2;
	var xmid=(xback+x1)/2;
	var ymid=(yback+y1)/2;

	var m=(y2-y0)/(x2-x0);
	var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
	var dy=m*dx;
	cp1x=xmid-dx;
	cp1y=ymid-dy;
	cp2x=xmid+dx;
	cp2y=ymid+dy;
      }

      ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
      ctx.fill();
      break;
  }
  ctx.restore();
};

function fromStringTimeToDateObject(namazTime, date){
  /**
    * Convert a string time into a javascript date object
    * example: 3:40 PM will be converted into today's date
    * object with the given time.
    */
  //console.log("fromStringTimeToDateObject-"+namazTime);
  var hourmin = namazTime.split(":"),
  temp_hour = parseInt( hourmin[0] ),
  namazMinute = Math.floor( hourmin[1]  );
  
  var tempDate =  new Date();
  tempDate.setTime(date.getTime());
  tempDate.setDate(date.getDate());
  tempDate.setHours(temp_hour,namazMinute);
  //console.log(tempDate);
  return tempDate;
}

function fromFloatTimeToDateObject(namazHour, date){
  /**
    * Convert a float time into a javascript date object
    * given time
    */
 // Get the hour integer part
 var temp_hour = Math.floor( namazHour );
 namazHour -= temp_hour;
 
  // Get minutes
  namazHour *= 60;
  var namazMinute = Math.round( namazHour );
  
  var tempDate =  new Date();
  tempDate.setTime(date.getTime());
  tempDate.setDate(date.getDate());
  tempDate.setHours(temp_hour,namazMinute);
  return tempDate;
}


function convertToDateObject1(namazHour,sourceType){
  /**
    * Delegate the date convertor based on the
    * type of date passed
    */
   if(sourceType == 'FLOAT'){
      return fromFloatTimeToDateObject(namazHour);
   }else if(sourceType == 'HH_MM_A'){
      return fromStringTimeToDateObject(namazHour);
   }
}

function convertToDateObject(namazHour,sourceType, date){
  /**
    * Delegate the date convertor based on the
    * type of date passed
    */
   if(sourceType == 'FLOAT'){
      return fromFloatTimeToDateObject(namazHour, date);
   }else if(sourceType == 'HH_MM_A'){
      return fromStringTimeToDateObject(namazHour, date);
   }
}

function fromTimeToFloat(time){
    // Number of decimal places to round to
    var decimal_places = 2,
    hours = parseInt(time.getHours()),
    minutes = parseFloat(time.getMinutes()/60);
    hourMin = hours+minutes;
    return parseFloat(hourMin).toFixed(decimal_places);

}

function formDateToString( time )
{
  // Get the hour integer part
  hour = time.getHours();
  minute = time.getMinutes();
 
  var ap = "am";
  if( hour   > 11 ) { ap = "pm";             }
  if( hour   > 12 ) { hour = hour - 12;      }
  if( hour   == 0 ) { hour = 12;             }
  if( hour   < 10 ) { hour   = "0" + hour;   }
  if( minute < 10 ) { minute = "0" + minute; }
 
  timeString = hour + ":" + minute + ap;
  return timeString;
}

function formDateToStringHMM( time )
{
  // Get the hour integer part
  hour = time.getHours();
  minute = time.getMinutes();
 
  if( hour   > 12 ) { hour = hour - 12;      }
  if( hour   == 0 ) { hour = 12;             }
  if( minute < 10 ) { minute = "0" + minute; }
 
  timeString = hour + ":" + minute;
  return timeString;
}


function dateToDDMMMyyString(date){
  return date.getShortDayName()+", "+date.getShortMonthName()+" "+date.getDate();
}

function getDateFromDDMMM(dateString, year){
  var day = parseInt( dateString.substring(0,2)),
  month = dateString.substring(2,5);
  var monthint = parseInt(months[camelCase(month)]) - 1;
  //console.log(month +" "+day+"--"+monthint); //parseInt(months[
  var tempDate =  new Date(year, monthint,day);
  //console.log(tempDate);
  return tempDate;
}

function camelCase(s) {
  return (s||'').toLowerCase().replace(/(\b|-)\w/g, function(m) {
    return m.toUpperCase().replace(/-/,'');
  });
}

function searchEmptyQuarterOfClock(date){

    var hoursHand = (date.getHours() < 12)? date.getHours(): date.getHours() - 12;
    hrdegree = hoursHand * 360/12 + (date.getMinutes()/60) * 360/12;
    mndeg = date.getMinutes() * 360/60;

    //console.log(date.getHours()+"hrdegree:"+ hrdegree+","+date.getMinutes()+"::mndeg"+mndeg);
    if(!(hrdegree > 45 && hrdegree < 135) && !(mndeg > 45 && mndeg < 135)){
        return FIRST_QUARTER;
    }else if(!(hrdegree > 135 && hrdegree < 225) && !(mndeg > 135 && mndeg < 225)){
        return SECOND_QUARTER;
    }else if(!(hrdegree > 225 && hrdegree < 315) || !(mndeg > 225 && mndeg < 315)){
        return THIRD_QUARTER;
    }else {
        return FOURTH_QUARTER;
    }
}

function getDimToWriteInsideClock(canvas, date, radius){
    var context = canvas.getContext('2d'),
    crTime = formDateToStringHMM(date),
    timeWidth = context.measureText(crTime).width,
    dim = [canvas.width/2, canvas.height/2],
    emptyQuarter = searchEmptyQuarterOfClock(date),
    x = canvas.width/2 - (radius - 10),
    height = canvas.height/2 - 20;

    //console.log("emptyQuarter"+emptyQuarter);

    switch(emptyQuarter){
        case FIRST_QUARTER:
            x = canvas.width/2 + (radius - timeWidth - 20);
            height = canvas.height/2 + 10;
            break;
        case SECOND_QUARTER:
            x = canvas.width/2 - timeWidth/2,
            height = canvas.height/2 + ( radius - radius*0.10);
            break;
        case THIRD_QUARTER:
            x = canvas.width/2- (radius - 20);
            height = canvas.height/2 + 10;
            break;
        default:
            x = canvas.width/2 - timeWidth/2,
            height = canvas.height/2 + (radius - 20);
    }        
    dim = [x, height];
    return dim;
}

function convertTimeToRadianAngle(time){
    var hour = time.getHours(),
    loc = hour * 5 + (time.getMinutes() / 60) * 5,
    angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2;
    return angle;
    // return Math.floor(((360/60) * currentTime.getMinutes()),0);
}

function createSunIcon(sunRisetime, leftcontext, leftcanvas){
    leftcontext.clearRect(0,0, leftcanvas.width, leftcanvas.height);
    leftcontext.beginPath();
    leftcontext.strokeStyle = 'white';
    leftcontext.beginPath();
    var radius = leftcanvas.width * 0.10;
    leftcontext.arc(leftcanvas.width/2, leftcanvas.height/2, radius, 0,Math.PI, true); 
    leftcontext.closePath();
    leftcontext.lineWidth = 2;
    var fontsize = Math.round(radius*1.7);

    leftcontext.font=fontsize+"px Calibri";
    //leftcontext.font="lighter 12px Source Sans Pro "; //Georgia
    leftcontext.fillStyle = "white";
    sunrise = formDateToString(sunRisetime);
    timeWidth = leftcontext.measureText(sunrise).width;
    leftcontext.fillText(sunrise,leftcanvas.width/2 - timeWidth/2, leftcanvas.height/2 + leftcanvas.height*0.20);
    //todayDate = sunRisetime.getTime();
    //console.log(dateToDDMMMyyString(sunRisetime));
    dateWidth = leftcontext.measureText(dateToDDMMMyyString(sunRisetime)).width;

    leftcontext.fillText(dateToDDMMMyyString(sunRisetime),leftcanvas.width/2 - dateWidth/2, leftcanvas.height/2 + leftcanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    var sunriseWidth = leftcontext.measureText("Sunrise").width;
    leftcontext.fillText("Sunrise",leftcanvas.width/2 - sunriseWidth/2, leftcanvas.height/2 - leftcanvas.height*0.30);

    leftcontext.stroke();
    createSunRay(leftcontext,leftcanvas, radius);

}

function createSunRay(mycontext, mycanvas, radius){

    for (i=7;i<=11;i++) {
        var ang=Math.PI/6*i; // (180/6 * 7 = 210) 
        sang=Math.sin(ang);
        cang=Math.cos(ang);
        //console.log("Cos angle:"+cang+"Sin Angle:"+sang);
        mycontext.beginPath();
        mycontext.lineTo(mycanvas.width/2+cang*radius,mycanvas.height/2+sang*radius);
        mycontext.lineTo(mycanvas.width/2+cang*radius*1.8,mycanvas.height/2+sang*radius*1.8);
        mycontext.stroke();
    }
}

function GregToIsl(date, currCountry) {


  d= date.getDate();
  m= date.getMonth();
  y= date.getFullYear();
  delta=1

          if ((y>1582)||((y==1582)&&(m>10))||((y==1582)&&(m==10)&&(d>14)))
            {
//added +delta=1 on jd to comply isna rulling 2007
            jd=intPart((1461*(y+4800+intPart((m-14)/12)))/4)+intPart((367*(m-2-12*(intPart((m-14)/12))))/12)-
  intPart( (3* (intPart(  (y+4900+    intPart( (m-14)/12)     )/100)    )   ) /4)+d-32075+delta
            }
            else
            {
//added +1 on jd to comply isna rulling
            jd = 367*y-intPart((7*(y+5001+intPart((m-9)/7)))/4)+intPart((275*m)/9)+d+1729777+delta
            }
          //arg.JD.value=jd
//added -1 on jd1 to comply isna rulling
          jd1=jd-delta
          //arg.wd.value=weekDay(jd1%7)
          l=jd-1948440+10632
          n=intPart((l-1)/10631)
          l=l-10631*n+354
          j=(intPart((10985-l)/5316))*(intPart((50*l)/17719))+(intPart(l/5670))*(intPart((43*l)/15238))
          l=l-(intPart((30-j)/15))*(intPart((17719*j)/50))-(intPart(j/16))*(intPart((15238*j)/43))+29
          m=intPart((24*l)/709)
          d=l-intPart((709*m)/24)
          y=30*n+j-30


        if(currCountry == 'SA'){
          hijriDate = d + "::"+HijriNamesArabic[m]+"::"+y;

        }else{
          hijriDate = d + "::"+HijriNames[m]+"::"+y;

        }

        //console.log(hijriDate+"-->"+currCountry+" " +d + "::"+m+"::"+y);
        return hijriDate;

  // arg.HDay.value=d
  // arg.HMonth.value=m
  // arg.HYear.value=y
}

function intPart(floatNum){
if (floatNum< -0.0000001){
   return Math.ceil(floatNum-0.0000001)
  }
return Math.floor(floatNum+0.0000001)
}

function createNavigationIcon(mycontext,mycanvas, qiblaDirection, currCountry){
    mycontext.beginPath();
    mycontext.lineWidth = 1;
    mycontext.strokeStyle = 'white';
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2-10, 3, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2-10, 10, 0,Math.PI * 2, true); 
    //mycontext.stroke();
    mycontext.closePath();

    mycontext.font="20px Calibri"; //Georgia
    mycontext.fillStyle = "white";
    
    if(currCountry == 'SA'){
      timeWidth = mycontext.measureText(qiblaNameInArabic).width;

      mycontext.fillText(qiblaNameInArabic,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 20);
    }else{
      timeWidth = mycontext.measureText("Qibla").width;
      mycontext.fillText("Qibla",mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 20);
    }
    timeWidth = mycontext.measureText(qiblaDirection).width; // 18.91 N CW
    mycontext.fillText(qiblaDirection,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 40);
    mycontext.stroke();
    mycontext.closePath();

    var x = 8;

    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2-4,17);
    // mycontext.stroke();
    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2+9,mycanvas.height/2 + 3);
    // mycontext.stroke();
    // mycontext.moveTo(mycanvas.width/2-10,15);
    // mycontext.lineTo(mycanvas.width/2-11,21);
    // mycontext.stroke();

    mycontext.stroke();

}

function load() {

    var mydata = data['01JAN'];
    alert(mydata[0].name);
    alert(mydata[0].time);
}

 // function loadJSON(callback) {   

 //    var xobj = new XMLHttpRequest();
 //        xobj.overrideMimeType("application/json");
 //  xobj.open('GET', 'data3.json', true); // Replace 'my_data' with the path to your file
 //  xobj.onreadystatechange = function () {
 //          if (xobj.readyState == 4 && xobj.status == "200") {
 //            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
 //            callback(xobj.responseText);
 //          }
 //    };
 //    xobj.send(null);  
 // }

function createDummyMoonIcon(mycontext,mycanvas,lunarDate){
   
   mycontext.clearRect(0,0,mycanvas.width, mycanvas.height); 
    mycontext.fillStyle = '#00CC00';//'#837E7C';
    //mycontext.fillStyle = 'blue';
   var radius = mycanvas.width * 0.10;
    var fontsize = Math.round(radius*1.5);

    mycontext.save();
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2 - mycanvas.height*0.12, radius, 0,Math.PI* 2);
    mycontext.clip();
    mycontext.fillStyle = 'white';
    mycontext.fillRect(0, 0, mycanvas.width, mycanvas.height);
    mycontext.restore();

    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2-5, mycanvas.height/2-mycanvas.height*0.16 , radius, 0,Math.PI* 2);
   
    mycontext.fill();
    
     mycontext.closePath();
     
    mycontext.font=fontsize+"px Calibri"; //Georgia
    mycontext.fillStyle = "white";
    var lunarDateArr = lunarDate.split("::");
    var ddMM = lunarDateArr[0]+" "+lunarDateArr[1];
    timeWidth = mycontext.measureText(ddMM).width;
    mycontext.fillText(ddMM,mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + mycanvas.height*0.20);
    // //todayDate = sunRisetime.getTime();
    dateWidth = mycontext.measureText(lunarDateArr[2]+" A.H").width;
    mycontext.fillText(lunarDateArr[2]+" A.H",mycanvas.width/2 - dateWidth/2, mycanvas.height/2 + mycanvas.height*0.40);
    //console.log("timeWidth"+ timeWidth+ "dateWidth"+dateWidth);
    //mycontext.stroke();
    
}

function createRightArrow(mycontext, mycanvas, colorName){

  mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);

  mycontext.lineWidth = mycanvas.width*0.08;
  mycontext.strokeStyle = colorName;
  mycontext.moveTo(mycanvas.width*0.25,(mycanvas.height/2 - mycanvas.height*0.20));
  mycontext.lineTo(mycanvas.width-mycanvas.height*0.25,mycanvas.height/2);
  mycontext.stroke();
  mycontext.moveTo(mycanvas.width-mycanvas.height*0.25,mycanvas.height/2-2);
  mycontext.lineTo(mycanvas.width*0.25,(mycanvas.height/2 + mycanvas.height*0.20));
  mycontext.stroke();

}


function createLeftArrow(mycontext, mycanvas, colorName){
  mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);
  
  mycontext.lineWidth = mycanvas.width*0.08;
  mycontext.strokeStyle = colorName;
  mycontext.moveTo(mycanvas.width-mycanvas.height*0.25,(mycanvas.height/2 - mycanvas.height*0.20));
  mycontext.lineTo(mycanvas.width*0.25,mycanvas.height/2);
  mycontext.stroke();
  mycontext.moveTo(mycanvas.width*0.25,mycanvas.height/2-2);
  mycontext.lineTo(mycanvas.width-mycanvas.height*0.25,(mycanvas.height/2 + mycanvas.height*0.20));
  mycontext.stroke();

}


function createRefreshIcon(context, canvas){
 
    var startTime = new Date();
    startTime.setHours(9);
    var endTime = new Date();
    endTime.setHours(12);

    context.beginPath();
    context.strokeStyle = 'white';
    //context.fill = 'white';
    var stAngle = convertTimeToRadianAngle(startTime),
    enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    // sdate1 = new Date(startTime.getTime() - 35*60*1000), 
    // sdate3 = new Date(startTime.getTime() + 35*60*1000),
    
    // stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    // enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;



    sdate1 = new Date(startTime.getTime()), 
    sdate3 = new Date(endTime.getTime()),
    
    stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    // stAngle1 = Math.PI* 11/6, //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    // enAngle2 = Math.PI /2;//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    arrowType = 2;
    drawArcedArrow(context,canvas.width/2, canvas.height / 2   , canvas.width/2 - 5,stAngle1,enAngle2,true,2,arrowType);
    
    context.moveTo(canvas.width/2 +  2, (canvas.height/2 - 20));
  // context.lineTo(4,canvas.height/2);
  // context.stroke();
  // context.moveTo(4,canvas.height/2-2);
  // context.lineTo(canvas.width,(canvas.height/2 + 20));

     context.stroke();


}

function createHelpIcon(mycontext, mycanvas){
      mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)

    mycontext.beginPath();
    mycontext.lineWidth = 1;
    mycontext.strokeStyle = 'white';
    mycontext.arc(mycanvas.width/2, mycanvas.height/2 - 4, 8, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.font="lighter 12px Source Sans Pro"; //Georgia
    mycontext.fillStyle = "white";
    timeWidth = mycontext.measureText("?").width;
    mycontext.fillText("?",mycanvas.width/2 - timeWidth/2, mycanvas.height/2);
    mycontext.stroke();

}


function drawHomeIcon(mycontext, mycanvas){
  mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)
  
  var x = 8;
  mycontext.lineWidth = 1;
  mycontext.strokeStyle = 'white';
  mycontext.moveTo(mycanvas.width/2,5);
  mycontext.lineTo(x-2,10+2);
  mycontext.stroke();
  mycontext.moveTo(x,10);
  mycontext.lineTo(x,(mycanvas.height - 10));
  mycontext.stroke();
  mycontext.moveTo(x,(mycanvas.height - 10));
  mycontext.lineTo(22, (mycanvas.height - 10));
  mycontext.stroke();
  mycontext.moveTo(22, (mycanvas.height - 10));
  mycontext.lineTo(22, 10);
  mycontext.stroke();
  mycontext.moveTo(22+2, 10+2);
  mycontext.lineTo(mycanvas.width/2,5);
  mycontext.stroke();
  
  mycontext.lineWidth = 2;
  mycontext.rect(13,(mycanvas.height - 16),4,6);
  mycontext.stroke();
  mycontext.fillStyle = '#9933FF';
  //mycontext.rect(13,(mycanvas.height - 16),4,7);
  
  mycontext.fill();
  
}


function createSettingIcon(mycontext,mycanvas){
    mycontext.clearRect(0,0,mycanvas.width, mycanvas.height)
    mycontext.beginPath();
    mycontext.lineWidth = mycanvas.width*0.06;
    //mycontext.lineWidth = 2;
    mycontext.strokeStyle = 'white';
    mycontext.beginPath();
    var radius1 = mycanvas.width * 0.10;
    var radius2 = mycanvas.width * 0.20;
    
    mycontext.arc(mycanvas.width/2, mycanvas.height/2, radius1, 0,Math.PI * 2, true); 
    mycontext.closePath();
    mycontext.stroke();
    mycontext.beginPath();
    mycontext.arc(mycanvas.width/2, mycanvas.height/2, radius2, 0,Math.PI * 2, true); 
    mycontext.stroke();
    mycontext.closePath();
    //mycontext.font="20px Calibri"; //Georgia

    //mycontext.font="lighter 12px Georgia"; //Georgia
    mycontext.fillStyle = "white";
    //timeWidth = mycontext.measureText("Setting").width;
    //mycontext.fillText("Setting",mycanvas.width/2 - timeWidth/2, mycanvas.height/2 + 35);
    mycontext.stroke();
    
    for (i=1;i<=8;i++) {
        var ang=Math.PI/4*i; // (180/6 * 7 = 210) 
        sang=Math.sin(ang);
        cang=Math.cos(ang);
        //console.log("Cos angle:"+cang+"Sin Angle:"+sang);
        mycontext.beginPath();
        mycontext.lineWidth = 3;
        mycontext.lineTo(mycanvas.width/2+cang*radius2,mycanvas.height/2+sang*radius2);
        mycontext.lineTo(mycanvas.width/2+cang*(radius2+radius1),mycanvas.height/2+sang*(radius2+radius1));
        mycontext.stroke();
    }
}


function createnos() {
    var nos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
angle = 0,
nowidth = 0;
    nos.forEach(function (numeral) {
        angle = Math.PI / 6 * (numeral - 3);
        nowidth = context.measureText(numeral).width;
        context.fillText(numeral,canvas.width / 2 + Math.cos(angle) * (Hr) -nowidth / 2,canvas.height / 2 + Math.sin(angle) * (Hr) + font / 3);
    });
}

//---------------------- Misc Functions -----------------------

// convert given string into a number
function eval(str){
    return 1* (str+ '').split(/[^0-9.+-]/)[0]; 
}

// detect if input contains 'min'
function isMin(arg){
    return (arg+ '').indexOf('min') != -1;
}

// compute the difference between two times 
function timeDiff(time1, time2) {
    return DMath.fixHour(time2- time1);
}

// add a leading 0 if necessary
function twoDigitsFormat(num) {
    return (num <10) ? '0'+ num : num;
}

function getDDMMMFromDate(date){
      var day = date.getDate();
      day = (day <10) ? '0'+ day : day;
      DMMM = day+date.getShortMonthName().toUpperCase(); 
      return DMMM;
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function subMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}

function fromHMMtoFloat(hhMM){
  

  var hourmin = hhMM.split(":"),
  temp_hour = parseInt( hourmin[0] ),
  namazMinute = Math.floor( hourmin[1]  );
  var floatMin = namazMinute/60;
  var flaotTime = temp_hour+"."+floatMin;
  floatTime = parseFloat(flaotTime);
  return floatTime;
}

function getDaysInMonth(m, y)
{
    // months in JavaScript start at 0 so decrement by 1 e.g. 11 = Dec
    --m;

    // if month is Sept, Apr, Jun, Nov return 30 days
    if( /8|3|5|10/.test( m ) ) return 30;

    // if month is not Feb return 31 days
    if( m != 1 ) return 31;

    // To get this far month must be Feb ( 1 )
    // if the year is a leap year then Feb has 29 days
    if( ( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ) return 29;

    // Not a leap year. Feb has 28 days.
    return 28;
}