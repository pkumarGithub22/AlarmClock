// fetch all class and id which are given in HTML file
const currentTime = document.getElementById("current_time");
const setHours = document.getElementById("hours")
const setMinutes = document.getElementById("minutes")
const setSeconds = document.getElementById("seconds");
const setAmPm = document.getElementById("am-pm");
const setAlarmButton = document.getElementById("submitButton");
const alarmContainer = document.getElementById("alarms-container");


// fetch ringtone
let ringtone = new Audio("audio.mp3");
ringtone.loop = true;

// set the option and select list dynamicaly 

window.addEventListener("DOMContentLoaded", (event) => {
    dropDownMenu(1, 12, setHours);
    dropDownMenu(0, 59, setMinutes);
    dropDownMenu(0, 59, setSeconds);
    setInterval(getCurrentTime, 1000);
    fetchAlarm();
})


// set alarm by click set alarm button
setAlarmButton.addEventListener("click", getInput);



// create dropdown dynamicaly by the function
function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
        const dropDown = document.createElement("option");
        dropDown.value = i < 10 ? "0" + i : i;
        dropDown.innerHTML = i < 10 ? "0" + i : i;
        element.appendChild(dropDown);
    }
}

// find the current time by date() method
function getCurrentTime(){
    let time=new Date();
    time=time.toLocaleTimeString("en-US",{
        hour:"numeric",
        minute:"numeric",
        second:"numeric",
        hour12:true,
    });
    currentTime.innerHTML=time;

    return time;
}

// find all of input or select
function getInput(e){
    e.preventDefault();
    const hourValue=setHours.value;
    const minuteValue=setMinutes.value;
    const secondValue=setSeconds.value;
    const amPmValue=setAmPm.value;

    const alarmTime=convertToTime(hourValue,minuteValue,secondValue,amPmValue);
    setAlarm(alarmTime);

}


// convert string time into numeric
function convertToTime(hour,minute,second,amPm){
    return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


// set alarm by this fucntion
function setAlarm(time,fetching=false){
    const alarm=setInterval(()=>{
        if(time===getCurrentTime()){
            ringtone.play();
            ringtone.play();
            alert("Alarm Ringing")
        }

    },500);

    addAlarmToDom(time,alarm);

    if(!fetching){
      saveAlarm(time)  
    }
}

// create alarm list dynamicaly 
function addAlarmToDom(time,intervalId){
    const alarm=document.createElement("div");
    alarm.classList.add("alarm","mb","d-flex");
    alarm.innerHTML=`
    <div class='list-button'>
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete Alarm</button>
    </div>
    `;

    // delete the set alarm by delete button
    const deleteButton=alarm.querySelector(".delete-alarm");
    deleteButton.addEventListener("click",(e)=>deleteAlarm(e,time,intervalId));
    alarmContainer.prepend(alarm)
}


// save alarm in localstorage and check alarms which are set
function checkAlarms(){
    let alarms=[];
    const isPresent=localStorage.getItem("alarms");
    if(isPresent) alarms=JSON.parse(isPresent);
    return alarms;
}



// save the all alarms in local storage
function saveAlarm(time){
    const alarms=checkAlarms();
    alarms.push(time);
    localStorage.setItem("alarms",JSON.stringify(alarms));
}


// fetch all alarms for ringing when time are come
function fetchAlarm(){
    const alarms=checkAlarms();
    alarms.forEach((time)=>{
        setAlarm(time,true);
    })
}


// delete alarm by the target
function deleteAlarm(event,time,intervalId){
    const self=event.target;
    clearInterval(intervalId);
     const alarm=self.parentElement;

     deleteAlarmFromLocal(time);
     alarm.remove();
}


// delete alarms from local storage
function deleteAlarmFromLocal(time){
    const alarms=checkAlarms();

    const index=alarms.indexOf(time);
    alarms.splice(index,1);
    localStorage.setItem("alarms",JSON.stringify(alarms))
}


// stop alarm by the stopalarm button
const stopButton=document.getElementById('stopButton');
stopButton.addEventListener("click",function(){
    ringtone.pause();
})
