function initColorPicker() {
  var options = {
    backgroundUrl: '/images/text-color.png',
  };
  var picker = document.getElementById("colorPicker");
  picker = tinycolorpicker(picker);
  picker.setColor('#FABC02');
}
