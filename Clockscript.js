//var leftcanvas = document.getElementById('leftoptioncanvas'),
//leftcontext = leftcanvas.getContext('2d'),
canvas = document.getElementById('currentclockcanvas'),
context = canvas.getContext('2d'),
refreshClockCanavas = document.getElementById('refreshClock'),
refreshClockContext = refreshClockCanavas.getContext('2d'),
helpCanavas = document.getElementById('helpCan'),
helpContext = helpCanavas.getContext('2d'),
lowerbase4canvas = document.getElementById('lowerbase4canvas');
lowerbase4context = lowerbase4canvas.getContext('2d'),
lowerbase5canvas = document.getElementById('lowerbase5canvas');
lowerbase5context = lowerbase5canvas.getContext('2d');




var appfont = "Calibri";
var currentDate;
var settingmode = false;
var monthNum;
//leftcanvas1 = document.getElementById('leftoptioncanvas2'),
//leftcontext1 = leftcanvas1.getContext('2d');


var clocksArray = [{  
   CURRENT  : {"name":"name","time":"10 min", "next":"UP", "maxtime":"maxtime", "mintime":"mintime","steps":[]},
   FIRST  : {"name":"name","time":"10 min", "next":"UP", "maxtime":"maxtime", "mintime":"mintime","steps":[]},
   SECOND  : {"name":"name","time":"10 min", "next":"UP", "maxtime":"maxtime", "mintime":"mintime","steps":[]},
   THIRD  : {"name":"name","time":"10 min", "next":"UP", "maxtime":"maxtime", "mintime":"mintime","steps":[]},
   FOURTH  : {"name":"name","time":"10 min", "next":"UP", "maxtime":"maxtime", "mintime":"mintime","steps":[]},
}],

clockSequence = ["FIRST","SECOND", "THIRD", "FOURTH"],

font = 35,
padding = 55,
x = canvas.width / 25,
Hx = canvas.width / 10,
space = 20,
r = canvas.width / 2 - (padding+15),
smallRadius = 25;
Hr = r + space;
var sunrise;

//var times;
var prayerClockIns;

function createCircle(mycanvas, lineWidth, radius) {
    mycontext = mycanvas.getContext("2d");
    mycontext.beginPath();
    mycontext.arc(mycanvas.width / 2, mycanvas.height / 2, radius, 0, Math.PI * 2, true); 
    //mycontext.fillStyle = '#212124';
   // mycontext.fill();
    mycontext.lineWidth = lineWidth;
    mycontext.strokeStyle = 'white';
    mycontext.stroke();
}

function createCenter(mycanvas, mylineWidth,radius) {
    mycontext = mycanvas.getContext("2d");
    mycontext.beginPath();
    mycontext.fillStyle = 'white';
    mycontext.lineWidth = mylineWidth;
    mycontext.arc(mycanvas.width / 2, mycanvas.height / 2, radius, 0, Math.PI * 2, true);   
    mycontext.fill();
}

function createTimeLimitArc(givenTime, startTime, endTime, next, radius, lineWidth, context, darwArrow){
    context.beginPath();
    context.strokeStyle = 'white';
    var stAngle = convertTimeToRadianAngle(startTime),
    enAngle = convertTimeToRadianAngle(endTime);

    // size of the arrow
    sdate1 = new Date(givenTime.getTime() - 8*60*1000), 
    sdate3 = new Date(givenTime.getTime() + 8*60*1000),
    
    stAngle1 = convertTimeToRadianAngle(sdate1), //(Math.PI * 2) * (sLoc / 60) - Math.PI / 2;
    enAngle2 = convertTimeToRadianAngle(sdate3);//(Math.PI * 2) * (eLoc / 60) - Math.PI / 2;

    context.fillSyle = 'blue';
    context.lineWidth = 2;
    
    if(darwArrow){
        if(next == 'UP'){arrowType = 1;}
        else if(next == 'DOWN'){arrowType = 3;}
        else{arrowType = 0;}
        //console.log("darwArrow"+darwArrow+"next:"+next+"arrowType"+arrowType);
        drawArcedArrow(context,canvas.width / 2, canvas.height / 2, radius-15,stAngle1,enAngle2,false,2,arrowType);
    }
    context.stroke();
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = '#FF0066';
    
    /**
      *  Below four line to create a shadow effect. Save the previous setting 
      *  of context here to restore it after drawing arc. This will help us
      *  to limit shadow effect only for the arc.
      */
    context.save();
    context.shadowColor = 'white';
    context.shadowBlur = 40;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.arc(canvas.width / 2, canvas.height / 2, radius, stAngle,enAngle, true); 
    context.fillSyle = '#FF3300';
    context.stroke();
    context.restore();
}
 
function createClockAnimation(canvasIndexPassed) {
    
    //console.log("Is it running..");
    var  canvasIndex = 7;  
    var radius = r; lineWidth = 2; isSmallClock = true;
    for(var index in clocksArray[0]){
        //console.log(clocksArray[0].CURRENT.name);
        var timeAnimation = false;
        animateSteps = clocksArray[0][index].steps;
        if(clocksArray[0].CURRENT.name == clocksArray[0][index].name){
            canvas = document.getElementById('currentclockcanvas');
            var ratio = canvas.width/canvas.height;
            if(ratio > 0.60){
                radius = canvas.height/2 - canvas.height/7;
            }else{
                radius = canvas.width/2 - canvas.width/12;
            }
            lineWidth = radius * 0.05;
            isSmallClock = false;
        }else{
            var canvasName = 'lowerbase'+canvasIndex+'canvas';
            canvas = document.getElementById(canvasName);
            radius = canvas.width/2 - canvas.width/12; lineWidth = 2; isSmallClock = true;
            canvasIndex++;
        }
        if (animateSteps.length > 0) {
            var timeDiff = animateSteps[0].getTime() - clocksArray[0][index].time.getTime();
            var sdate = new Date(clocksArray[0][index].maxtime.getTime() + timeDiff);
            var edate = new Date(clocksArray[0][index].mintime.getTime() + timeDiff);
            // edate = new Date(animateSteps[0].getTime() - 60* 60 * 1000);
            //console.log(formDateToString(clocksArray[0][index].maxtime));

            if(animateSteps.length == 1){
                timeAnimation = true;
            }
            createClock(canvas, animateSteps[0],sdate, edate, 
                clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock, timeAnimation);
            animateSteps = animateSteps.slice(1);
        }else{
            clearTimeout(animateloop);
        }
        clocksArray[0][index].steps = animateSteps;

    }
}

function refreshClock() {
   canvasIndexPassed = 7;
   console.log("Update Clock:"+date.getHours()+":"+date.getMinutes());
    var currentTimeChanged = updatePrayerClockTime();
    console.log("currentTimeChanged" + currentTimeChanged+"-->"+settingmode);
    if(settingmode == false){
    if(true){
        var  canvasIndex = canvasIndexPassed;  
        var radius = r; lineWidth = 2; isSmallClock = true;
        for(var index in clocksArray[0]){
            animateSteps = clocksArray[0][index].steps;
            if(clocksArray[0].CURRENT.name == clocksArray[0][index].name){
                canvas = document.getElementById('currentclockcanvas');
                var ratio = canvas.width/canvas.height;
                if(ratio > 0.60){
                    radius = canvas.height/2 - canvas.height/7;
                }else{
                    radius = canvas.width/2 - canvas.width/12;
                }
                lineWidth = radius * 0.05;
                isSmallClock = false;
                console.log(canvas.width+"radius" + radius+"-->"+isSmallClock);
	            createClock(canvas, clocksArray[0][index].time,clocksArray[0][index].maxtime, clocksArray[0][index].mintime, 
                clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);
            }else{
                var canvasName = 'lowerbase'+canvasIndex+'canvas';
                canvas = document.getElementById(canvasName);
                radius = canvas.width/2 - canvas.width/12; lineWidth = 2; isSmallClock = true;
                console.log(canvas.width+"radius" + radius+"-->"+isSmallClock);
            
            	createClock(canvas, clocksArray[0][index].time,clocksArray[0][index].maxtime, clocksArray[0][index].mintime, 
                clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);
                

		//canvasName = 'lowerbase'+(canvasIndex-4)+'canvas';
        // if(canvasName != 'lowerbase1canvas' || ){
		      // canvas = document.getElementById(canvasName);
        //     	createClock(canvas, clocksArray[0][index].time,clocksArray[0][index].maxtime, clocksArray[0][index].mintime, 
        //         clocksArray[0][index].name, clocksArray[0][index].next, lineWidth, radius, isSmallClock);
        // }
                canvasIndex++;
		
            }
        }
    }
    }
    createUtilityIcon();
    createFixedUtilityIcon();
}

function createHand(mycanvas, loc, isHour, width, radius) {
    var x = mycanvas.width / 15,
    Hx = mycanvas.width / 20,
    mycontext = mycanvas.getContext("2d"),
    angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2, handRadius = isHour ? radius - x - Hx : radius - x;
    mycontext.beginPath();
    mycontext.lineWidth = width;
    mycontext.strokeStyle = 'white';
    mycontext.moveTo(mycanvas.width / 2, mycanvas.height / 2);
    mycontext.lineTo(mycanvas.width / 2 + Math.cos(angle) * handRadius, mycanvas.height / 2 + Math.sin(angle) * handRadius);
    mycontext.stroke();
}

function createHands(mycanvas, date,radius,lineWidth) {
    
    hour = date.getHours();
    hour = hour > 12 ? hour - 12 : hour;
    var minLineWidth = (lineWidth > 3) ? lineWidth-2 : lineWidth;
    //console.log(minLineWidth+"--->lineWidth"+lineWidth);
    createHand(mycanvas, hour * 5 + (date.getMinutes() / 60) * 5, true,lineWidth ,radius);
    createHand(mycanvas, date.getMinutes(), false, minLineWidth,radius);
    //createSechand(date.getSeconds(), false, 0.2);
}

function createClock(canvas, animateDate, sdate, edate, name, next, lineWidth, radius, isSmallClock) {
    
    var minLineWidth = (lineWidth > 3) ? lineWidth-2 : lineWidth;
    var context = canvas.getContext("2d");
    //console.log(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    //radius = canvas.width - padding;
    //console.log(canvas.width+":"+canvas.height+","+radius);
    if(!isSmallClock){
        createCircle(canvas,minLineWidth-1,radius);
        createTimeLimitArc(animateDate, sdate, edate, next, radius+2, minLineWidth, context, true);        
        writeTimeInClock(animateDate, context, canvas, radius);
        context.font="lighter 20px Source Sans Pro";
        writeInfoInClock(context,"San Mateo, US", radius+15,'UP', 'BIG');
        writeInfoInClock(context,name, radius+15,'DOWN', 'BIG');
        createCenter(canvas,lineWidth,lineWidth);//2,3        
    }else{
        createCircle(canvas,lineWidth,radius);
        createTimeLimitArc(animateDate, sdate, edate, next, radius, minLineWidth, context, false);
        createCenter(canvas,lineWidth,lineWidth+1);//2,3
        context.font="lighter 12px Source Sans Pro";
        writeInfoInClock(context,formDateToStringHMM(animateDate), radius,'DOWN','SMALL');
        writeInfoInClock(context,name, radius,'UP','SMALL');
           
    }
    var hour = animateDate.getHours();
    var now = new Date();
    //console.log("Second"+now1.getSeconds()%2);
    var animateHand = false;
    if(now.getHours() == hour && now.getMinutes() == animateDate.getMinutes()){
        animateHand =true;
    }else{
        animateHand = false;
    }
    
    if(animateHand){
        if(now.getSeconds()%2 == 0){
        createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius);
        createHand(canvas, animateDate.getMinutes(), false, minLineWidth,radius);
        }
    }else{
        createHand(canvas, hour * 5 + (animateDate.getMinutes() / 60) * 5, true, lineWidth, radius);
        createHand(canvas, animateDate.getMinutes(), false, minLineWidth,radius);
    }
    
}

function writeTimeInClock(sdate, context, canvas, radius){
    
    context.beginPath();
    context.strokeStyle = 'white';
    //context.font="lighter 30px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
    context.font=Math.round(radius/4.5)+"px "+appfont;
    context.fillStyle = "white";
    //var x = canvas.width/2 - (r - 10),
    //height = canvas.height/2 - 20;
    hour = sdate.getHours(),
    am = "AM";

    if(hour > 12){
        hour = hour - 12;
        am="PM";
    }else if(hour == 0){
        hour = 12;
    }

    var dim = getDimToWriteInsideClock(canvas, sdate, radius);
    
    var crTime = formDateToStringHMM(sdate);
    //console.log("writeTimeInClock"+dim+"radius"+radius+"crTime"+crTime);
   // var timeWidth = context.measureText(crTime).width;
//    console.log(hour+":"+sdate.getMinutes());
    
    //if(radius > 150){
        //context.font="lighter "+Math.round(radius/3)+"px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans
    //}else{
    //    context.font="lighter 50px Source Sans Pro";//Sans Pro, Source Sans Pro, Open Sans        
    //}

    var width = context.measureText(crTime).width;
    var height = context.measureText(crTime).height;
    
    //context.beginPath();
    //context.fillText(hour,dim[0],dim[1]);
    //Sans Pro, Source Sans Pro
    context.fillText(crTime,dim[0] , dim[1]);
    context.stroke();
}

function writeInfoInClock(context, info,radius, where, size){
    context.beginPath();
    var x = canvas.width/2;
    var gap = 0;
    var ugap = 0;
    if(size == 'BIG'){
        ugap = radius*0.10;
        gap = radius*0.20;
        fontsize = Math.round(radius/4);
        if(where == 'UP'){
            fontsize = fontsize - 10;
        }
    }else{
        ugap = 10;
        gap = radius*0.50;
        fontsize = Math.round(radius/2);
    }
    context.font=fontsize+"px "+appfont;
    if(where == 'UP'){height = canvas.height/2 - (radius + ugap);}
    else if(where == 'DOWN'){height = canvas.height/2 + radius + gap;}            
    var infoWidth = context.measureText(info).width;
    context.fillText(info,x - (infoWidth/2),height);
    context.stroke();
}

function getAnimationSteps(sdate,steps){
    /**
      * This function stores 15 timestamp,
      * (15 minutes - given time) and store it in an array
      * to be used for the animation on load of clock.
      */
    edate = new Date(sdate.getTime() -  steps * 60 * 1000);
    var animateStepForClock = [];
    for (;edate.getTime() <= sdate.getTime(); ) {       
        animateStepForClock.push(new Date(edate.getTime()));
        edate.setMinutes(edate.getMinutes() + 1);
    }
    return animateStepForClock;
}



function setupApp(){
    
    var date = new Date(); // today
    currentDate = date;
    mode = 'manual'; // manual
    dayLightSaving = 'auto',
    method = 'ISNA';
    if(mode == 'auto'){
        prayerClocks.initClock(date.getFullYear(), method, [37.7933, -122.4212], -8, dayLightSaving);
        prayerClockIns = prayerClocks.getPrayerClockForDay(date);
    }else{
        prayerClocks.initManualClock(date.getFullYear(), method, [37.7933, -122.4212], -8, dayLightSaving);
        prayerClockIns = prayerClocks.getPrayerClockForDay(date);
        //prayerClockIns = prayerClocks.getManualPrayerClockForDay(date);
    }
    
    //console.log(prayerClockIns);
    

    refreshClockCanavas.addEventListener('click', function(event) {
        reloadClockWithTodayDate();
    }, false);
    
    lowerbase4canvas.addEventListener('click', function(event) {
        reloadClockWithLeft();
    }, false);

    lowerbase5canvas.addEventListener('click', function(event) {
        reloadClockWithRight();
    }, false);

    lowerbase3canvas.addEventListener('click', function(event) {
        loadSetting(currentDate.getMonth());
    }, false);

    currentclockcanvas.addEventListener('click', function(event) {
        showMaxMinTime();
    }, false);

    helpCanavas.addEventListener('click', function(event) {
        showHelp();
    }, false);


    createUtilityIcon();
    createFixedUtilityIcon();
    updatePrayerClockTime();
}

function showMaxMinTime(){

    return false;

    var maxTime = clocksArray[0]['CURRENT'].maxtime;
    var mintime = clocksArray[0]['CURRENT'].mintime;
    var next = clocksArray[0]['CURRENT'].next;
    var locationNameCanavas = document.getElementById('maxmin');

    var popuphtml =  "<h2>"+clocksArray[0].CURRENT.name+" : &nbsp;" +formDateToString(clocksArray[0]['CURRENT'].time)+"</h2>";

    //popuphtml += "<p> Prayer Detail : "+ clocksArray[0].CURRENT.name;    

    //popuphtml += "<h4>Current Time : "+ formDateToString(clocksArray[0]['CURRENT'].time) + "</h4>" ;    
    popuphtml += "<p>Max Time : "+ formDateToString(maxTime) + ",  " +maxTime.getShortMonthName()+" "+maxTime.getDate() ;
    popuphtml += "</br>Min Time : "+ formDateToString(mintime) + ",  " +mintime.getShortMonthName()+" "+mintime.getDate(); 
    popuphtml += "</br>Next Day Time : "+ next+"</p>";
    popuphtml += "<a class='close' href='#close'></a>";

        

    locationNameCanavas.innerHTML =  popuphtml;
    window.location.hash = '#login_form';
    //alert("maxTime"+maxTime+"\n mintime"+mintime+"\nnext"+next);
}

function closesetting(){
        var c = $('#currentclockcanvas');
        var container = $(c).parent();

        document.getElementById("clockBody").style.display="block";
        document.getElementById("settingpanel").style.display="none";
        settingmode = false;
        var conWidth = $(container).width();
        //console.log("Window Width:"+window.innerWidth+"-->"+window.innerHeight+"Ratio: "+(appWidth/appHight)+"container width"+conWidth);
        var appWidth, appHeight;
        if(conWidth > window.innerHeight){
          appWidth = window.innerHeight;
          appHight = conWidth;
        }else{
          appWidth = conWidth;
          appHight = window.innerHeight;
        }
        c.attr('width', appWidth ); //max width
        c.attr('height', (appHight/10)*6 ); //max height
        refreshClock();


}

function loadSetting(monthNumSetting){
        //monthNum = 0;
        monthNum = monthNumSetting;
        var todayDate = new Date();
        var crdate = new Date();
        todayDate.setMonth(monthNum);
        var monthBegin = new Date(todayDate.getFullYear(),  monthNum, 1);
        var monthEnd = new Date(todayDate.getFullYear(), monthNum, getDaysInMonth((monthNum+1), todayDate.getFullYear()));

        console.log(monthNum+", " + getDaysInMonth((monthNum+1),todayDate.getFullYear()));
        var monthTime="<table id='settingbody' summary='Time Setting'><thead><tr>";
        monthTime +="<th  style='font-size:18px; text-align:left' colspan='2'>"+todayDate.getMonthName()+"</th><th  scope='col'></th><th  scope='col' style='font-size:22px'><a href='#' onclick='closesetting();return false;''>x</a></th></tr></thead><tbody>";
        monthTime +="<th  scope='col'></th><th  scope='col'>IMASK</th><th  scope='col'>Sunrise</th><th  scope='col'>Sunset</th></tr></thead><tbody>";

        //"IMASK &nbsp; FAJR &nbsp; Sunrise &nbsp; Dhuhr &nbsp; Asr &nbsp; Sunset &nbsp; Maghrib &nbsp; Isha &nbsp; Midnight </br>";
        
        while ( monthBegin <= monthEnd){
            timeObject = prayerClocks.getPrayerClockForDay(monthBegin);

            
            var daytime = "<tr>";
            var index = 0;
            if(getDDMMMFromDate(monthBegin)== getDDMMMFromDate(crdate)){
                daytime += "<td style='font-size:18px;font-weight:bold;color:#FF9933''> &#8594; "+getDDMMMFromDate(monthBegin).substring(0,2)+"</td>";
            }else{
                daytime += "<td style='font-size:18px;''>"+getDDMMMFromDate(monthBegin).substring(0,2)+"</td>";                
            }
            for (var i in timeObject){
            if(index == 0 || index == 2 || index == 5){
                //table += times[timeNames[i].toLowerCase()]+ '\t'; 
                var next='NA';

                var tempDate = convertToDateObject(timeObject[i].time, 'FLOAT', monthBegin);
                //daytime+="<td>"+timeObject[i].name+"::"+formDateToStringHMM(date)+"&nbsp;";
                daytime+="<td>"+formDateToStringHMM(tempDate)+"</td>";
            }
            index++;
                //console.log(daytime+"::"+timeObject[i].time);
            }
             +daytime;
            monthTime += daytime+"</tr>";

            //sunrise = convertToDateObject(prayerClockIns[SUNRISE].time,'FLOAT');

            monthBegin.setDate(monthBegin.getDate() + 1);
        }
        //console.log(monthTime);
        monthTime += "</tbody></table>";
        document.getElementById("clockBody").style.display="none";
        document.getElementById("settingpanel").style.display="block";
        
        document.getElementById("settingpanel").innerHTML=monthTime;
        settingmode = true;
}

function reloadClockWithTodayDate(){

    var date = new Date();
    currentDate.setTime(date.getTime());
    reloadClockWithDate(currentDate, 15);
}

function reloadClockWithLeft(){

    if(settingmode == false){    
        var nextMs = currentDate.getTime() - 1000*60*60*24*1;
        currentDate.setTime(nextMs);
        reloadClockWithDate(currentDate, 5);
    }else{
        if(monthNum == 0){
            monthNum = 12;
        }
        monthNum = monthNum - 1;
        loadSetting(monthNum);
    }

    //testFloatTime();
}

function testFloatTime(){
    //var floattime = fromHMMtoFloat("05:30");
    //console.log("floattime" + floattime);
    var date = new Date();
    var floattime = convertToDateObject("4:59", 'HH_MM_A',date);
    var floatT = fromTimeToFloat(floattime);
    var dateN = convertToDateObject(floatT, 'FLOAT', date);
    console.log("4:59"+" - Float:"+floatT+"-->"+dateN);

}

function reloadClockWithRight(){

    if(settingmode == false){
        var nextMs = currentDate.getTime() + 1000*60*60*24*1;
    currentDate.setTime(nextMs);
    reloadClockWithDate(currentDate, 5);

    }else{
        if(monthNum == 12){
            monthNum = 0;
        }
        monthNum = monthNum + 1;
        loadSetting(monthNum);
    }
}

function reloadClockWithDate(currentDate, nofiteration){


    /*
     * Logic to refresh the canvas.
     */

    // var  canvasIndex = 7;  
    // var context, canvas;
    // for(var index in clocksArray[0]){
    //     if(clocksArray[0].CURRENT.name == clocksArray[0][index].name){
    //         canvas = document.getElementById('currentclockcanvas');
    //         context = canvas.getContext("2d");

    //     }else{
    //         var canvasName = 'lowerbase'+canvasIndex+'canvas';
    //         canvas = document.getElementById(canvasName);
    //         context  = canvas.getContext("2d");
    //         canvasIndex++;
    //     }
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    // }


    console.log("currentDate" + currentDate);
    prayerClockIns = prayerClocks.getPrayerClockForDay(currentDate);
    // next logic can go up here

    //console.log(prayerClockIns);
    //sunrise = convertToDateObject(prayerClockIns[SUNRISE].time,'FLOAT', currentDate);
    //createSunIcon(sunrise,leftcontext);
    //createDummyMoonIcon(leftcontext1, leftcanvas1, GregToIsl(currentDate, currCountry));
    //createNavigationIcon(leftcontext2, leftcanvas2);
    //createSettingIcon(leftcontext3, leftcanvas3);
    reloadClockWithAnimation(currentDate, nofiteration);
}

function reloadClockWithAnimation(date, nofiteration){
        currentDate = date;
        //console.log(clocksArray[0].CURRENT.name+"-->"+getCurrentPrayerTime().name);
        fillUpClocksArray(clocksArray[0].CURRENT, getCurrentPrayerTime(), nofiteration);
        var clockCounter = 0;
        for(var pClkInsind in prayerClockIns) {
            prayerName = prayerClockIns[pClkInsind].name.toUpperCase();
            if(prayerName == 'FAJR' || prayerName == 'DHUHR' || prayerName == 'ASR' || prayerName == 'MAGHRIB' || prayerName == 'ISHA'){
                if(clocksArray[0]['CURRENT'].name != prayerClockIns[pClkInsind].name){
                    fillUpClocksArray(clocksArray[0][clockSequence[clockCounter]], prayerClockIns[pClkInsind], nofiteration);
                    //console.log(clockCounter+"ELSE:"+clocksArray[0][clockSequence[clockCounter]].name);
                    clockCounter = clockCounter+1;
                }
            }
        }
        refreshClock();
    
}

function createUtilityIcon(){

    sunrise = convertToDateObject(prayerClockIns[SUNRISE].time,'FLOAT', currentDate);
    //createSunIcon(sunrise);
    //createSettingIcon(leftcontext1, leftcanvas1);
    var moveLeftCanavas = document.getElementById('lowerbase1canvas');
    var moveLeftContext = moveLeftCanavas.getContext('2d');

    createSunIcon(sunrise,moveLeftContext, moveLeftCanavas);    

    var lowerbase2canvas = document.getElementById('lowerbase2canvas');
    var lowerbase2context = lowerbase2canvas.getContext('2d');

    createDummyMoonIcon(lowerbase2context, lowerbase2canvas, GregToIsl(currentDate, 'US'));


    //createNavigationIcon(lowerbase3context,lowerbase3canvas, '19.9 N US', 'US')



    //var radius1 = lowerbase4canvas.width/2 - lowerbase4canvas.width/3; var lineWidth = 2; var isSmallClock = true;

   // createClock(lowerbase4canvas, new Date(), new Date(), new Date(),  
   //             "Juma", 'DOWN', lineWidth, radius1, isSmallClock);


}

function createFixedUtilityIcon(){

    var lowerbase3canvas = document.getElementById('lowerbase3canvas');
    var lowerbase3context = lowerbase3canvas.getContext('2d');

    createSettingIcon(lowerbase3context, lowerbase3canvas);

    createLeftArrow(lowerbase4context, lowerbase4canvas, 'white');
    drawHomeIcon(refreshClockContext, refreshClockCanavas);
    createHelpIcon(helpContext, helpCanavas);


    createRightArrow(lowerbase5context, lowerbase5canvas, 'white');

}

function updatePrayerClockTime(){
    if(clocksArray[0].CURRENT.name  != getCurrentPrayerTime().name){
        console.log(clocksArray[0].CURRENT.name+"-->"+getCurrentPrayerTime().name);
        fillUpClocksArray(clocksArray[0].CURRENT, getCurrentPrayerTime(),15);
        var clockCounter = 0;
        for(var pClkInsind in prayerClockIns) {
            prayerName = prayerClockIns[pClkInsind].name.toUpperCase();
            if(prayerName == 'FAJR' || prayerName == 'DHUHR' || prayerName == 'ASR' || prayerName == 'MAGHRIB' || prayerName == 'ISHA'){
                if(clocksArray[0]['CURRENT'].name != prayerClockIns[pClkInsind].name){
                    fillUpClocksArray(clocksArray[0][clockSequence[clockCounter]], prayerClockIns[pClkInsind], 15);
                    //console.log(clockCounter+"ELSE:"+clocksArray[0][clockSequence[clockCounter]].name);
                    clockCounter = clockCounter+1;
                }
            }
        }
        return true;
    }else{
        return false;
    }
}

// function loadSetting(monthName){
//     manSetting.loadSetting(monthName);
// }

function getCurrentPrayerTime(){
    var date = fromTimeToFloat(new Date());
    
    var fajr = parseFloat(prayerClockIns[FAJR].time);
    zuhar = parseFloat(prayerClockIns[DHUHR].time);
    asr = parseFloat(prayerClockIns[ASR].time);
    maghrib = parseFloat(prayerClockIns[MAGHRIB].time);
    isha = parseFloat(prayerClockIns[ISHA].time);

    //console.log("passedPrayerName"+passedPrayerName+"-->prayerName"+prayerName);
    if(date < fajr ){
        return prayerClockIns[FAJR];
    }else if (date > fajr && date < zuhar){
        return prayerClockIns[DHUHR];
    }else if (date > zuhar && date < asr){
        return prayerClockIns[ASR];        
    }else if (date > asr && date < maghrib){
        return prayerClockIns[MAGHRIB];
    }else if (date > maghrib && date < isha){
        return prayerClockIns[ISHA];
    }else{
        return prayerClockIns[FAJR];

    }    

}

function fillUpClocksArray(clocksArray, prayerClockIns, nofiteration){
    var timeVariationForClock = prayerClocks.getPrayerTimeVariation(prayerClockIns.name.toUpperCase());
    // console.log(prayerClockIns.name.toUpperCase()+":"+formDateToString(fromFloatTimeToDateObject(timeVariationForClock.maxTime))+"-->"+formDateToString(
    //  fromFloatTimeToDateObject(timeVariationForClock.minTime))+"-->next"+ prayerClockIns.next);
    var date = new Date();
    date.setDate(currentDate.getDate());
    clocksArray.name = prayerClockIns.name;
    clocksArray.time = fromFloatTimeToDateObject(prayerClockIns.time, date);
    clocksArray.steps = getAnimationSteps(clocksArray.time,nofiteration);
    var maxDay = timeVariationForClock.maxDate;
    var minDay = timeVariationForClock.minDate;
    clocksArray.maxtime = fromFloatTimeToDateObject(timeVariationForClock.maxTime, getDateFromDDMMM(maxDay, date.getFullYear()));
    clocksArray.mintime = fromFloatTimeToDateObject(timeVariationForClock.minTime, getDateFromDDMMM(minDay, date.getFullYear()));
    clocksArray.next = prayerClockIns.next;

    //console.log("Name:"+clocksArray.name+"clocksArray.next"+clocksArray.next);
       
}

//context.font = font + 'px Source Sans Pro';
function initApp(){
	setupApp();
	//animateloop = setInterval(createClockAnimation(5), 15);
	//refreshClock(7);
	//loop = setInterval(refreshClock, 1000);
    //loop = setInterval(refreshClock(7), 1000);
    //createClockAnimation();
    animateloop = setInterval(createClockAnimation, 15);

}
loop = setInterval(refreshClock, 1000);
//animateloop = setInterval(createClockAnimation, 15);
