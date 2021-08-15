let db = new Localbase('db')
let Audio = document.getElementsByClassName("audio");
let Btn = document.getElementsByClassName("bttn");
let slider = document.querySelectorAll(".volume-slider");
let muteBtn = document.getElementsByClassName("mute-btn");
let mainBtn = document.getElementsByClassName("main-btn")[0];
let mainSlider = document.querySelector(".main-slider");
let mainMuteBtn = document.getElementsByClassName("main-mute-btn")[0];
let resetBtn = document.getElementsByClassName("reset-btn")[0];
let loadPreset = document.getElementsByClassName("load-preset")[0];
let savePreset = document.getElementsByClassName("save-preset")[0];
let deletePreset = document.getElementsByClassName("delete-preset")[0];
let mainBtnState = 'pause';
let originalvol = [];
var mul = 1;

$(document).ready(function () {
    $('.js-example-basic-single').select2({
        placeholder: "Enter or Select a Preset",
        allowClear: true,
        tags: true
    });
});

let trial1 = document.getElementById("preset-box");

function initialPresets(){
    let allPresets=[];
    db.collection('presets').get().then(epreset => {
        for(let z in epreset){
            allPresets.push(epreset[z].nameOfPreset);
        }
        for(let z in allPresets){
            let x = document.createElement("OPTION");
            x.setAttribute("value", allPresets[z]);
            let t = document.createTextNode(allPresets[z]);
            x.appendChild(t);
            document.getElementById("preset-box").appendChild(x);
        }
    })
}

function addPresetInDOM(newPreset){
    let x = document.createElement("OPTION");
    x.setAttribute("value", newPreset);
    let t = document.createTextNode(newPreset);
    x.appendChild(t);
    document.getElementById("preset-box").appendChild(x);
}

function removePresetInDOM(temp,idx){
    
    trial1.remove(idx);
}

initialPresets();

for(i in Audio){
    originalvol.push(Audio[i].volume);
}
originalvol=originalvol.slice(0,7);

function consoleBlank(){
    document.getElementsByClassName("profile-set")[0].innerText = "\r";
}


// overall volume slider
mainSlider.addEventListener("input",function(e){
    mul = e.target.value / 100;
    for(i in Audio){
        // originalvol[i] = Audio[i].volume;
        Audio[i].volume = originalvol[i] * mul;
        if(mainBtnState==='playing')
            Audio[i].play();
    }
});


// overall mute button
mainMuteBtn.addEventListener("click", function () {
    mainSlider.value = 0;
    mul=0;
    for (i in originalvol) {
        Audio[i].volume = 0;
    }
});


// Reset button
resetBtn.addEventListener("click", function(){
    consoleBlank();
    //main slider
    mul = 1;
    mainSlider.value = mul*100;
    for(i in Audio){
        slider[i].value = 50;
        Audio[i].volume = 50/100;
        originalvol[i] = Audio[i].volume;
        Audio[i].volume = originalvol[i] * mul;
    }
});


//  Play / Pause button
mainBtn.addEventListener("click",function(){
    consoleBlank();
    if(mainBtnState === 'pause'){
        mainBtn.innerHTML = 'Pause';
        mainBtnState = 'playing';
        for (i in Audio) {
            originalvol[i] = slider[i].value / 100;
            Audio[i].volume=((slider[i].value)/100)*mul;
            if(mul!==0)
            Audio[i].play();
        }
    }else{
        mainBtn.innerHTML = "Play";
        mainBtnState = 'pause';
        for(i in Audio){
            Audio[i].pause();
        }
        mul=0;
    }
});


//randomizer button
let randomBtn = document.getElementsByClassName("randomizer-btn")[0];
randomBtn.addEventListener("click",function(){
    consoleBlank();
    for(i in Audio){
        Audio[i].volume = Math.random();
        slider[i].value = Audio[i].volume * 100;
        originalvol[i] = Audio[i].volume;
        console.log(Audio[i].length);
        Audio[i].volume = originalvol[i] * mul;
    }
});


// sound effect icon buttons & respective volume sliders & mute buttons
for (let i = 0; i < Btn.length; i++) {
  Btn[i].addEventListener("click", function () {
        consoleBlank();
        if (slider[i].value >= 0 && slider[i].value < 33) {
            slider[i].value = 33;
            Audio[i].volume = 33 / 100;
            originalvol[i] = Audio[i].volume;
            if(mainBtnState==='playing'){
                Audio[i].volume = originalvol[i] * mul;
                Audio[i].play();
            }else Audio[i].pause();

        } else if (slider[i].value >= 33 && slider[i].value < 67) {
            slider[i].value = 67;
            Audio[i].volume = 67 / 100;
            originalvol[i] = Audio[i].volume;
            if (mainBtnState === "playing") {
                Audio[i].volume = originalvol[i] * mul;
                Audio[i].play();
            } else Audio[i].pause();

        } else if (slider[i].value >= 67 && slider[i].value < 100) {
            slider[i].value = 100;
            Audio[i].volume = 100 / 100;
            originalvol[i] = Audio[i].volume;
            if(mainBtnState==='playing'){
                Audio[i].volume = originalvol[i] * mul;
                Audio[i].play();
            }else Audio[i].pause();

        } else {
            slider[i].value = 0;
            Audio[i].volume = 0;
            originalvol[i] = Audio[i].volume;
        }
  });

  slider[i].addEventListener("input", function (e) {
        consoleBlank();
        Audio[i].volume = e.target.value / 100;
        originalvol[i] = Audio[i].volume;
        if(mainBtnState==='playing'){
            Audio[i].volume = originalvol[i] * mul;
            Audio[i].play();
        }else Audio[i].pause();
  });

  muteBtn[i].addEventListener("click",function(){
        consoleBlank();
        slider[i].value = 0;
        Audio[i].volume = 0;
        originalvol[i] = Audio[i].volume;
  });
  Audio[i].addEventListener('timeupdate', function () {
      var buffer = .91
      if (this.currentTime > this.duration - buffer) {
          this.currentTime = 0
          this.play()
      }
  });
}


//load preset button
loadPreset.addEventListener("click",function(){ 
    let presetName = document.querySelector(".preset-name").value;
    console.log(presetName);
    if (presetName.length == 0){
        document.getElementsByClassName("profile-set")[0].style.color = "#ff0000";
        document.getElementsByClassName("profile-set")[0].innerText = "Error: Preset Name was not entered.";
    }else{
        let test = db.collection('presets').get().then(epreset => {
            let flag = false;
            for (let z in epreset) {
                if (epreset[z].nameOfPreset == presetName) {
                    flag=true;
                    let profileArray = epreset[z].vals;
                    let lastValue = profileArray[profileArray.length - 1];
                    mul = lastValue;
                    mainSlider.value = mul * 100;
                    for (let i = 0; i < profileArray.length - 1; i++) {
                        slider[i].value = profileArray[i];
                        Audio[i].volume = profileArray[i] / 100;
                        originalvol[i] = Audio[i].volume;
                        Audio[i].volume = originalvol[i] * mul;
                    }
                    document.getElementsByClassName("profile-set")[0].style.color = "#00ff00";
                    document.getElementsByClassName("profile-set")[0].innerText = "Preset was loaded successfully."
                }
            }
            if(flag==false){
                document.getElementsByClassName("profile-set")[0].style.color = "#ff0000";
                document.getElementsByClassName("profile-set")[0].innerText = "Preset does not exist.";
            }
        });
    }
});


//save preset button
savePreset.addEventListener("click",function(){
    let presetName = document.querySelector(".preset-name").value;
    if (presetName.length==0){
        document.getElementsByClassName("profile-set")[0].style.color = "#ff0000";
        document.getElementsByClassName("profile-set")[0].innerText = "Error: Preset Name was not entered.";
    }else{
        let tempObj = {nameOfPreset:presetName,vals:[]};
        let valArr=[];
        for(let j=0;j<Audio.length;j++){
            valArr.push((Number)(slider[j].value));
        }
        valArr.push(mul);
        tempObj.vals=valArr;
        let test = db.collection('presets').get().then(epreset => {
            for(let z in epreset){
                if(epreset[z].nameOfPreset==presetName){
                    db.collection('presets').doc({ nameOfPreset: presetName }).delete();
                    removePresetInDOM(presetName, z);
                    break;
                }
            }
            db.collection('presets').add(tempObj);
            addPresetInDOM(presetName);
        });
        document.getElementsByClassName("profile-set")[0].style.color = "#00ff00";
        document.getElementsByClassName("profile-set")[0].innerText = "'"+presetName+"'"+' Preset was saved successfully.';
    }
});


//delete button
deletePreset.addEventListener("click",function(){
    let presetName = document.querySelector(".preset-name").value;
    if (presetName.length == 0) {
        document.getElementsByClassName("profile-set")[0].style.color = "#ff0000";
        document.getElementsByClassName("profile-set")[0].innerText = "Error: Preset Name was not entered.";
    }else{
        let test = db.collection('presets').get().then(epreset => {
            let flag = false;
            for (let z in epreset) {
                if (epreset[z].nameOfPreset == presetName) {
                    flag=true;
                    db.collection('presets').doc({ nameOfPreset: presetName }).delete();
                    removePresetInDOM(presetName,z);
                    document.getElementsByClassName("profile-set")[0].style.color = "#FFA500";
                    document.getElementsByClassName("profile-set")[0].innerText = "'" + presetName + "'"+" Preset deleted sucessfully.";
                }
            }
            if(flag==false){
                document.getElementsByClassName("profile-set")[0].style.color = "#ff0000";
                document.getElementsByClassName("profile-set")[0].innerText = "Error: Invalid Preset Name";
            }
        });
    }
});