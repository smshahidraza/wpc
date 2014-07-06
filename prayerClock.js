
function PrayerClock(method) {


	//------------------------ Constants --------------------------
	var
	
	// Time Names
	timeNames = {
		imsak    : 'Imsak',
		fajr     : 'Fajr',
		sunrise  : 'Sunrise',
		dhuhr    : 'Dhuhr',
		asr      : 'Asr',
		sunset   : 'Sunset',
		maghrib  : 'Maghrib',
		isha     : 'Isha',
		midnight : 'Midnight'
	},

	// json = [{
	//  	"01JAN" : [ {"name":"fajr", "time":"04:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"},
	//   				{"name": "dhuhr", "time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"}, 
	// 				{"name":"asr", "time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"},
	//  	 	  		{"name":"maghrib","time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"DOWN"},
	//  	 	  		{"name":"isha","time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"}
	//   			]
	// },{
	//  	"31JAN" : [ {"name":"fajr", "time":"04:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"},
	//   				{"name": "dhuhr", "time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"}, 
	// 				{"name":"asr", "time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"},
	//  	 	  		{"name":"maghrib","time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"DOWN"},
	//  	 	  		{"name":"isha","time":"12:32", "maxTime":"03:45AM", "minTime":"5:30AM", "next":"UP"}
	//   			]
	// }],
	
prayerTimeVariation = [{
	 	"IMASK" : 
	 				{"maxDate":"02JAN", "maxTime":"5.23" , "minDate":"15MAR", "minTime":"5:30"},
	 	"FAJR" 	: 
	 				{"maxDate":"02JAN", "maxTime":"3.76", "minDate":"15MAR", "minTime":"4.80"},
	 	"SUNRISE" : 
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"DHUHR" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"ASR" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"SUNSET" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"MAGHRIB" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"ISHA" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"},
	 	"MIDNIGHT" :
					{"maxDate":"02JAN", "maxTime":"03:45AM", "minDate":"15MAR", "minTime":"5:30AM"}
	  	}],

	prayerTimeJSONObject = {
	 	"01JAN" : [ 
					{"name":"fajr", "time":"04:32", "next":"UP"},
	  				{"name": "sunrise", "time":"5:02", "next":"UP"}, 
	  				{"name": "dhuhr", "time":"12:32", "next":"UP"}, 
					{"name":"asr", "time":"12:32", "next":"UP"},
	 	 	  		{"name":"maghrib","time":"12:32", "next":"DOWN"},
	 	 	  		{"name":"isha","time":"12:32", "next":"UP"}
	 	 	  	],
	 	"29DEC" :
	 			[   
					{"name":"fajr", "time":"04:33", "next":"UP"},
	  				{"name": "sunrise", "time":"5:02", "next":"UP"}, 
	  				{"name": "dhuhr", "time":"12:32", "next":"UP"}, 
					{"name":"asr", "time":"12:32", "next":"UP"},
	 	 	  		{"name":"maghrib","time":"12:32", "next":"DOWN"},
	 	 	  		{"name":"isha","time":"12:32", "next":"UP"}
	  			]
	  	};


	//----------------------- Public Functions ------------------------
	return {

	initClock: function(year,  method, coords, timezone, dayLightSaving){
		//var todayDate = new Date(),	
		date = new Date(year, 0, 1),
		endDate = new Date(year, 11, 31),
		prayTimes.setMethod(method);
		timeStampStart = new Date();
		tomorrowDate = new Date(timeStampStart.getFullYear(), timeStampStart.getMonth(), timeStampStart.getDate()+1);
		previousDate = new Date(year,11,31);
		//console.log("Start Time:"+timeStampStart.getTime());
		//prayTimes.modifyFormats('12h');
		txt = ' {';
		//prayTimes.setTimeFormat(prayTimes.Float); Not Supported

		var defaultTime = prayTimes.getTimes(previousDate, coords, timezone);

		// for (var i in timeNames){
		// 	console.log(prayerTimeVariation[0].IMASK.maxTime);
		// 	prayerTimeVariation[0][timeNames[i].toUpperCase()].maxTime=defaultTime[timeNames[i].toLowerCase()];
		// 	prayerTimeVariation[0][i.toUpperCase()].minTime=defaultTime[timeNames[i].toLowerCase()];
		// }

		 prayerTimeVariation[0].FAJR.maxTime = prayerTimeVariation[0].FAJR.minTime = defaultTime[timeNames['fajr'].toLowerCase()],
		 prayerTimeVariation[0].SUNRISE.maxTime = prayerTimeVariation[0].SUNRISE.minTime = defaultTime[timeNames['sunrise'].toLowerCase()],
		 prayerTimeVariation[0].DHUHR.maxTime = prayerTimeVariation[0].DHUHR.minTime = defaultTime[timeNames['dhuhr'].toLowerCase()],
		 prayerTimeVariation[0].ASR.maxTime = prayerTimeVariation[0].ASR.minTime = defaultTime[timeNames['asr'].toLowerCase()],
		 prayerTimeVariation[0].MAGHRIB.maxTime = prayerTimeVariation[0].MAGHRIB.minTime = defaultTime[timeNames['maghrib'].toLowerCase()],
		 prayerTimeVariation[0].ISHA.maxTime = prayerTimeVariation[0].ISHA.minTime = defaultTime[timeNames['isha'].toLowerCase()];
		
		while (date < endDate) {
			var times = prayTimes.getTimes(date, coords, timezone);
			//times = prayTimes.modifyFormats(times);
			var ddMMM = getDDMMMFromDate(date);
			txt += ' "'+ddMMM+'" : [ '; 
			//table += date.getShortMonthName() + ' '+ day+ '\t';
			//console.log(txt);
			for (var i in timeNames){
				//table += times[timeNames[i].toLowerCase()]+ '\t';	
				var next='NA';

				var date1 = convertToDateObject(times[timeNames[i].toLowerCase()], 'FLOAT', date);
				var date2 = convertToDateObject(defaultTime[timeNames[i].toLowerCase()], 'FLOAT', date);
				var next='UP';
				
					if( date1 < date2){
						next = 'UP';
					}else if(date1 > date2){
						next = 'DOWN';
					}else{
						next = 'SAME';
					}

				txt += '{ "name":"'+timeNames[i]+'",\t';
				txt += '"time":"'+defaultTime[timeNames[i].toLowerCase()]+'",\t';
				txt += '"next":"'+next+'"},\n';
				createPrayerTimeSetting(defaultTime,timeNames[i].toUpperCase(),ddMMM);
				//onsole.log(times[timeNames[i].toLowerCase()]);

			}	



			txt = txt.substring(0,(txt.length - 2));				
			txt += "],\n"
			//table += '\n';
			defaultTime = times;


			date.setDate(date.getDate()+ 1);  // next day
		}
			txt = txt.substring(0,(txt.length - 2)); // To remove last comma from the string				
			txt += "}\n"
			//console.log(txt);

			//console.log(logTxt);
			
			prayerTimeJSONObject = JSON.parse(txt);
			//console.log(prayerTimeJSONObject);
			timeStampEnd = new Date();
			console.log("Total Time (ms):"+ (timeStampEnd.getTime() - timeStampStart.getTime()));
			
			// var json = JSON.stringify(prayerTimeJSONObject);
			// var path = "c:\\shahid";
			// var fout = new File();
			// if (fout.isopen) {
			// 	fout.writeline(json);
			// 	fout.close();
			// 	post("\nJSON Write",path);
			// } else {
			// 	post("\ncould not create json file: " + path);
			// }

			// var url = 'data:text/json;charset=utf8,' + encodeURIComponent(txt);
			// window.open(url, '_blank');
			// window.focus();
			//console.log(prayerTimeJSONObject);

			//load();
			// loadJSON(function(response) {
			//   // Parse JSON string into object

			// 	// var actual_JSON = JSON.parse(response);
			// 	// alert(actual_JSON);
			// 	    var mydata = data['01JAN'];
			// 	    alert(mydata[0].name);
			// 	    alert(mydata[0].time);
			//  });

			// console.log(formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].FAJR.maxTime,date))+"-->"+formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].FAJR.minTime, date)));
			// console.log(formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].DHUHR.maxTime,date))+"-->"+formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].DHUHR.minTime, date)));
			// console.log(formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].ASR.maxTime, date))+"-->"+formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].ASR.minTime, date)));
			// console.log(formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].MAGHRIB.maxTime, date))+"-->"+formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].MAGHRIB.minTime, date)));
			// console.log(formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].ISHA.maxTime, date))+"-->"+formDateToString(fromFloatTimeToDateObject(prayerTimeVariation[0].ISHA.minTime, date)));
	},

	initManualClock: function(year,  method, coords, timezone, dayLightSaving){
		//var todayDate = new Date(),	
		date = new Date(year, 0, 1),
		endDate = new Date(year, 11, 31),
		prayTimes.setMethod(method);
		timeStampStart = new Date();
		tomorrowDate = new Date(timeStampStart.getFullYear(), timeStampStart.getMonth(), timeStampStart.getDate()+1);
		previousDate = new Date(year,11,31);
		txt = ' {';
		//prayTimes.setTimeFormat(prayTimes.Float); Not Supported

		var prDDMMM = getDDMMMFromDate(previousDate);
		var defaultTime = prayerTimeUserJSONObject[prDDMMM];
		// for (var i in timeNames){
		// 	console.log(prayerTimeVariation[0].IMASK.maxTime);
		// 	prayerTimeVariation[0][timeNames[i].toUpperCase()].maxTime=defaultTime[timeNames[i].toLowerCase()];
		// 	prayerTimeVariation[0][i.toUpperCase()].minTime=defaultTime[timeNames[i].toLowerCase()];
		// }
		var ddMMMKey = prDDMMM;
		 var imsakTime = convertToDateObject(defaultTime[0].time,'HH_MM_A', previousDate);

		 prayerTimeVariation[0].FAJR.maxTime = prayerTimeVariation[0].FAJR.minTime = fromTimeToFloat(addMinutes(imsakTime,30)),
		 prayerTimeVariation[0].SUNRISE.maxTime = prayerTimeVariation[0].SUNRISE.minTime = fromTimeToFloat(convertToDateObject(defaultTime[1].time,'HH_MM_A', previousDate)),
		 prayerTimeVariation[0].DHUHR.maxTime = prayerTimeVariation[0].DHUHR.minTime = fromTimeToFloat(convertToDateObject("13:00",'HH_MM_A', previousDate)),
		 prayerTimeVariation[0].ASR.maxTime = prayerTimeVariation[0].ASR.minTime = fromTimeToFloat(subMinutes(convertToDateObject(defaultTime[2].time,'HH_MM_A', previousDate),90)),
		 prayerTimeVariation[0].MAGHRIB.maxTime = prayerTimeVariation[0].MAGHRIB.minTime = fromTimeToFloat(convertToDateObject(defaultTime[2].time,'HH_MM_A', previousDate)),
		 prayerTimeVariation[0].ISHA.maxTime = prayerTimeVariation[0].ISHA.minTime = fromTimeToFloat(addMinutes(convertToDateObject(defaultTime[2].time,'HH_MM_A', previousDate),90));
		
		while (date < endDate) {
			//times = prayTimes.modifyFormats(times);
			var ddMMM = getDDMMMFromDate(date);
			var times = prayerTimeUserJSONObject[ddMMM];
			//console.log(ddMMM+"::"+times[0].time);
			txt += ' "'+ddMMMKey+'" : [ '; 
			//table += date.getShortMonthName() + ' '+ day+ '\t';
			//console.log(txt);
			
			// if(ddMMM == getDDMMMFromDate(timeStampStart)){
			// 	console.log(ddMMM+":::"+times[0].time + "-->"+convertToDateObject(fromTimeToFloat(convertToDateObject(times[0].time,'HH_MM_A', date)), 'FLOAT', date));
			// }
			
			for (var i in timeNames){
				//table += times[timeNames[i].toLowerCase()]+ '\t';	
				var next='NA';
				var date1, date2;
				if(timeNames[i] == "Fajr"){
				 	imsakTime = convertToDateObject(times[0].time,'HH_MM_A', date);
					date1 = addMinutes(imsakTime,30);
					imsakTime = convertToDateObject(defaultTime[0].time, 'HH_MM_A', date);
					date2 = addMinutes(imsakTime,30);	
					if(ddMMM == getDDMMMFromDate(timeStampStart)){
						//console.log("FAJR:"+convertToDateObject(prayTimes.sunAngleTime(this.eval(17), date, 'ccw'), 'FLOAT', date));
						console.log(ddMMM+":::"+date1);
					}				
				}else if(timeNames[i] == "Dhuhr"){
				 	date1 = convertToDateObject("13:00",'HH_MM_A', date);
					
					date2 = convertToDateObject("13:00", 'HH_MM_A', date);
														
				}else if(timeNames[i] == "Asr"){
				 	var sunset = convertToDateObject(times[2].time,'HH_MM_A', date);
					date1 = subMinutes(sunset,90);
					sunset = convertToDateObject(defaultTime[2].time,'HH_MM_A', date);
					date2 = subMinutes(sunset,20);										
				}else if(timeNames[i] == "Maghrib"){
				 	var sunset = convertToDateObject(times[2].time,'HH_MM_A', date);
					date1 = sunset;
					sunset = convertToDateObject(defaultTime[2].time,'HH_MM_A', date);
					date2 = sunset;										
				}else if(timeNames[i] == "Isha"){
				 	var sunset = convertToDateObject(times[2].time,'HH_MM_A', date);
					date1 = addMinutes(sunset,90);
					sunset = convertToDateObject(defaultTime[2].time,'HH_MM_A', date);
					date2 = addMinutes(sunset,90);									
				}else if(timeNames[i] == "Midnight"){
				 	date1 = convertToDateObject("12:00",'HH_MM_A', date);
					
					date2 = convertToDateObject("12:00", 'HH_MM_A', date);								
				}else{
					var index = 0;
					if(timeNames[i] == 'Imsak'){

					}else if(timeNames[i] == 'Sunrise'){
						index = 1;
					}else{
						index = 2;
					}
					date1 = convertToDateObject(times[index].time, 'HH_MM_A', date);
					date2 = convertToDateObject(defaultTime[index].time, 'HH_MM_A', date);
				}


				var floatDate = fromTimeToFloat(date2);
				var next='UP';
				
					if( date1 < date2){
						next = 'UP';
					}else if(date1 > date2){
						next = 'DOWN';
					}else{
						next = 'SAME';
					}

				txt += '{ "name":"'+timeNames[i]+'",\t';
				txt += '"time":"'+floatDate+'",\t';
				txt += '"next":"'+next+'"},\n';
				createManualPrayerTimeSetting(floatDate,timeNames[i].toUpperCase(),ddMMM);

				//onsole.log(times[timeNames[i].toLowerCase()]);

			}	



			txt = txt.substring(0,(txt.length - 2));				
			txt += "],\n"
			//table += '\n';
			defaultTime = times;
			ddMMMKey = ddMMM;


			date.setDate(date.getDate()+ 1);  // next day
		}
			txt = txt.substring(0,(txt.length - 2)); // To remove last comma from the string				
			txt += "}\n"
			//console.log(txt);

			//console.log(logTxt);
			
			prayerTimeJSONObject = JSON.parse(txt);
			//console.log(prayerTimeJSONObject);

			//var url = 'data:text/json;charset=utf8,' + encodeURIComponent(txt);
			//window.open(url, '_blank');
			//window.focus();

			//console.log(prayerTimeJSONObject);

			timeStampEnd = new Date();
			console.log("Total Time (ms):"+ (timeStampEnd.getTime() - timeStampStart.getTime()));
			
	},
	
	getPrayerClockForDay: function(date){
		var ddMMM = getDDMMMFromDate(date);
		//console.log(ddMMM);
		timeObject = prayerTimeJSONObject[ddMMM];		
		//console.log("timeObject"+timeObject);
		return timeObject;
	},

	getManualPrayerClockForDay: function(date){
		var ddMMM = getDDMMMFromDate(date);
		//console.log(ddMMM);
		timeObject = prayerTimeManualJSONObject[ddMMM];		
		return timeObject;
	},

	getPrayerTimeVariation: function(prayerName){
		//console.log(prayerName + "-->" + prayerTimeVariation[0][prayerName]);
		return prayerTimeVariation[0][prayerName];
	}
			
}

		function createManualPrayerTimeSetting(times, myindex, date){
		/* Below if else block is used to calculate
		 * max, min of each prayer time.
		 */

		// obj = prayerTimeSetting;
		// for(var i = 0; i < obj.length; ++i){
		//    //do something with obj[i]
		//    for(var ind in obj[i]) {
		//         console.log(ind);
		//         for(var vals in obj[i][ind]){
		//             console.log(vals, obj[i][ind][vals]);
		//         }
		//    }
		// }
		// var date = new Date();
		// date.setTime(tempDate.setTime());

		if(myindex == 'FAJR'){
			//var currentFajrTime = times[timeNames['fajr'].toLowerCase()];
			if(prayerTimeVariation[0].FAJR.maxTime < times){
				prayerTimeVariation[0].FAJR.maxTime = times;
				prayerTimeVariation[0].FAJR.maxDate = date;
			}else if(prayerTimeVariation[0].FAJR.minTime > times){
				prayerTimeVariation[0].FAJR.minTime = times;
				prayerTimeVariation[0].FAJR.minDate = date;
			}

		}else if(myindex == 'SUNRISE'){
			//var currentSunriseTime = times[timeNames['sunrise'].toLowerCase()];
			if(prayerTimeVariation[0].SUNRISE.maxTime < times){
				prayerTimeVariation[0].SUNRISE.maxTime = times;
			}else if(prayerTimeVariation[0].SUNRISE.minTime > times){
				prayerTimeVariation[0].SUNRISE.minTime = times;
			}

		} else if(myindex == 'DHUHR'){
			//var currentDhuhrTime = times[timeNames['dhuhr'].toLowerCase()];
			if(prayerTimeVariation[0].DHUHR.maxTime < times){
				prayerTimeVariation[0].DHUHR.maxTime = times;
				prayerTimeVariation[0].DHUHR.maxDate = date;
				//console.log("Max Day:"+date);
			}else if(prayerTimeVariation[0].DHUHR.minTime > times){
				prayerTimeVariation[0].DHUHR.minTime = times;
				prayerTimeVariation[0].DHUHR.minDate = date;
				//console.log("Min Day:"+date);
			}

		}else if(myindex == 'ASR'){
			//var currentAsrTime = times[timeNames['asr'].toLowerCase()];
			if(prayerTimeVariation[0].ASR.maxTime < times){
				prayerTimeVariation[0].ASR.maxTime = times;
				prayerTimeVariation[0].ASR.maxDate = date;
			}else if(prayerTimeVariation[0].ASR.minTime > times){
				prayerTimeVariation[0].ASR.minTime = times;
				prayerTimeVariation[0].ASR.minDate = date;
			}

		}else if(myindex == 'MAGHRIB'){
			//var currentMaghribTime = times[timeNames['maghrib'].toLowerCase()];
			if(prayerTimeVariation[0].MAGHRIB.maxTime < times){
				prayerTimeVariation[0].MAGHRIB.maxTime = times;
				prayerTimeVariation[0].MAGHRIB.maxDate = date;
			}else if(prayerTimeVariation[0].MAGHRIB.minTime > times){
				prayerTimeVariation[0].MAGHRIB.minTime = times;
				prayerTimeVariation[0].MAGHRIB.minDate = date;
			}
		}else if(myindex == 'ISHA'){
			//var currentIshaTime = times[timeNames['isha'].toLowerCase()];
			if(prayerTimeVariation[0].ISHA.maxTime < times){
				prayerTimeVariation[0].ISHA.maxTime = times;
				prayerTimeVariation[0].ISHA.maxDate = date;
			}else if(prayerTimeVariation[0].ISHA.minTime > times){
				prayerTimeVariation[0].ISHA.minTime = times;
				prayerTimeVariation[0].ISHA.minDate = date;
			}

		}
	}



	function createPrayerTimeSetting(times, myindex, date){
		/* Below if else block is used to calculate
		 * max, min of each prayer time.
		 */

		// obj = prayerTimeSetting;
		// for(var i = 0; i < obj.length; ++i){
		//    //do something with obj[i]
		//    for(var ind in obj[i]) {
		//         console.log(ind);
		//         for(var vals in obj[i][ind]){
		//             console.log(vals, obj[i][ind][vals]);
		//         }
		//    }
		// }
		// var date = new Date();
		// date.setTime(tempDate.setTime());

		if(myindex == 'FAJR'){
			var currentFajrTime = times[timeNames['fajr'].toLowerCase()];
			if(prayerTimeVariation[0].FAJR.maxTime < currentFajrTime){
				prayerTimeVariation[0].FAJR.maxTime = currentFajrTime;
				prayerTimeVariation[0].FAJR.maxDate = date;
			}else if(prayerTimeVariation[0].FAJR.minTime > currentFajrTime){
				prayerTimeVariation[0].FAJR.minTime = currentFajrTime;
				prayerTimeVariation[0].FAJR.minDate = date;
			}

		}else if(myindex == 'SUNRISE'){
			var currentSunriseTime = times[timeNames['sunrise'].toLowerCase()];
			if(prayerTimeVariation[0].SUNRISE.maxTime < currentSunriseTime){
				prayerTimeVariation[0].SUNRISE.maxTime = currentSunriseTime;
			}else if(prayerTimeVariation[0].SUNRISE.minTime > currentSunriseTime){
				prayerTimeVariation[0].SUNRISE.minTime = currentSunriseTime;
			}

		} else if(myindex == 'DHUHR'){
			var currentDhuhrTime = times[timeNames['dhuhr'].toLowerCase()];
			if(prayerTimeVariation[0].DHUHR.maxTime < currentDhuhrTime){
				prayerTimeVariation[0].DHUHR.maxTime = currentDhuhrTime;
				prayerTimeVariation[0].DHUHR.maxDate = date;
				//console.log("Max Day:"+date);
			}else if(prayerTimeVariation[0].DHUHR.minTime > currentDhuhrTime){
				prayerTimeVariation[0].DHUHR.minTime = currentDhuhrTime;
				prayerTimeVariation[0].DHUHR.minDate = date;
				//console.log("Min Day:"+date);
			}

		}else if(myindex == 'ASR'){
			var currentAsrTime = times[timeNames['asr'].toLowerCase()];
			if(prayerTimeVariation[0].ASR.maxTime < currentAsrTime){
				prayerTimeVariation[0].ASR.maxTime = currentAsrTime;
				prayerTimeVariation[0].ASR.maxDate = date;
			}else if(prayerTimeVariation[0].ASR.minTime > currentAsrTime){
				prayerTimeVariation[0].ASR.minTime = currentAsrTime;
				prayerTimeVariation[0].ASR.minDate = date;
			}

		}else if(myindex == 'MAGHRIB'){
			var currentMaghribTime = times[timeNames['maghrib'].toLowerCase()];
			if(prayerTimeVariation[0].MAGHRIB.maxTime < currentMaghribTime){
				prayerTimeVariation[0].MAGHRIB.maxTime = currentMaghribTime;
				prayerTimeVariation[0].MAGHRIB.maxDate = date;
			}else if(prayerTimeVariation[0].MAGHRIB.minTime > currentMaghribTime){
				prayerTimeVariation[0].MAGHRIB.minTime = currentMaghribTime;
				prayerTimeVariation[0].MAGHRIB.minDate = date;
			}
		}else if(myindex == 'ISHA'){
			var currentIshaTime = times[timeNames['isha'].toLowerCase()];
			if(prayerTimeVariation[0].ISHA.maxTime < currentIshaTime){
				prayerTimeVariation[0].ISHA.maxTime = currentIshaTime;
				prayerTimeVariation[0].ISHA.maxDate = date;
			}else if(prayerTimeVariation[0].ISHA.minTime > currentIshaTime){
				prayerTimeVariation[0].ISHA.minTime = currentIshaTime;
				prayerTimeVariation[0].ISHA.minDate = date;
			}

		}
	}

}



//---------------------- Init Object -----------------------


var prayerClocks = new PrayerClock();


