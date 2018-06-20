var optionsLibrary = [];

function initColorPicker(in_color='#FABC02') {
  var options = {
    backgroundUrl: '/images/text-color.png',
  };
  var picker = document.getElementById("colorPicker");
  picker = tinycolorpicker(picker);
  picker.setColor(in_color);
}

function copyAccountNumber(acctEl) {
  if (acctEl.value != '') {
    document.getElementById('contact_phone_one').value = acctEl.value;
  }
}

function updateGymClasses() {
  console.log('Okay now what?');
}

function initialize_class_options() {
  var classSelect = document.getElementById('gclass');
  Array.prototype.push.apply(optionsLibrary, classSelect.options);
  update_class_options();
}

function update_class_options() {
  var gymElem = document.getElementById('locale');
  var gymIndex = gymElem.selectedIndex;
  var gymId = gymElem.options[gymIndex].value;

  var classSelect = document.getElementById('gclass');
  var optionsArray = [];

  removeOptions(classSelect);
  for (var idx = 0; idx < optionsLibrary.length; idx++) {
    var option = optionsLibrary[idx];
    if (option.getAttribute('gymId') == gymId) {
      optionsArray.push(option);
    }
  }

  loadOptions(classSelect, optionsArray);
}
