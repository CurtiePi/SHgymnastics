function calInit(pClasses, pSchedule) {
  if (scheduler) {
    console.log('WE HAVE A SCHEDULER OBEJECT!!!');
    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.first_hour = 8;
    scheduler.config.details_on_create = true;

    scheduler.templates.event_class=function(start, end, event){
      var css = "";
      // if event has class property then assign special class
      if (event.sgClass) {
        css += "class_" + getLabel(sgClass, event.sgClass).toLowerCase();
      }
      return css;   // default return
    };

    var sgClass = createClassOptions(pClasses);

    scheduler.config.event_duration = parseInt(sgClass[0].duration);
    scheduler.config.auto_end_date = true;

    scheduler.locale.labels.section_sgClass = "Select a class:";

    var updateText = function(event) {
      var id = Object.keys(scheduler._events).pop();
      var elem = event.srcElement;
      var option = elem.options[elem.selectedIndex];
      scheduler.getEvent(id).text = option.innerHTML;
      var currDur = parseInt(scheduler.config.event_duration);
      var newDur = parseInt(sgClass[elem.selectedIndex].duration);
      scheduler.config.event_duration = newDur;

      if (newDur != currDur) {
        var end = new Date(scheduler.getEvent(id).end_date);
        var newEnd = new Date(end.getTime() + (newDur - currDur)*60000);
        scheduler.getEvent(id).end_date = newEnd;
        scheduler.updateEvent(id);

        // updating lightbox section
        var ev = scheduler.getEvent(id);
        var sections = scheduler.config.lightbox.sections;
        // if time is the last section
        var time_section = sections[sections.length - 1];
        var node = document.getElementById(time_section.id).nextSibling;                    var block = scheduler.form_blocks[time_section.type];
        // note that event - is event object variable
        block.set_value.call(this, node, ev[time_section.map_to], ev, time_section);
      }

    };

    scheduler.config.lightbox.sections = [
      { name: "sgClass",
        options: sgClass,
        map_to: "class_id",
        type: "select",
        onchange: updateText,
        image_path: "../common/dhtmlxCombo/imgs/",
        height:30,
        filtering: true },
      { name:"Notes",
        height:120,
        map_to:"notes",
        type:"textarea",
        focus:true},
      { name: "time", 
        height: 72,
        type: "time",
        map_to: "auto"
      }];

    scheduler.init('scheduler_here', new Date(),"month");

    //scheduler.parse(JSON.stringify(pSchedule), "json");
    scheduler.parse(pSchedule, "json");

    scheduler.attachEvent('onEventAdded', addEvent);
    scheduler.attachEvent('onEventChanged', changeEvent);
    scheduler.attachEvent('onEventDeleted', deleteEvent);
    scheduler.attachEvent('onLightbox', function(event_id) {
      if (scheduler.getEvent(event_id).text == "New event") {
        scheduler.getEvent(event_id).text = sgClass[0].label;
      }
    });


  } else {
    console.log('WE DO NOT HAVE A SCHEDULER OBEJECT!!!');
  }
}

function addNewEv() {
  scheduler.addEventNow();
}

function addEvent(id, event) {
  console.log("In the add Event function");

  makeAjaxRequest('/class/schedule', 'POST', event, updateEventId);
}

function updateEventId(dataString){
  var idArray = dataString.split(':');
  scheduler.changeEventId(idArray[0], idArray[1]);
}

function changeEvent(id, event) {
  console.log("In the change Event function");
  makeAjaxRequest('/class/schedule', 'PUT', event);
}

function deleteEvent(id) {
  console.log("In the delete Event function");
  var data = { id: id};
  makeAjaxRequest('/class/schedule', 'DELETE', data);
}

function createClassOptions(data) {
  var result = [];
  for (var key in data) {
    var classObj = data[key];
    
    result.push({
                key: classObj.id,
                label: classObj.title  + ' - ' + classObj.gymnasium.branch_name,
                duration: classObj.class_duration
                });
  }
  return result;
}

function getClassDurations(data) {
  var result = {};
  for (var key in data) {
    var classObj = data[key];
    
    result[classObj.id] = classObj.class_duration;
  }
  return result;
}
