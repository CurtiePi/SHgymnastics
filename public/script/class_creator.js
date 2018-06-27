function calInit(pSchedule, pGymnasium, pInstructor, pClasses ) {
  console.log(pGymnasium);
  console.log(pInstructor);

  if (scheduler) {
    console.log('WE HAVE A SCHEDULER OBEJECT!!!');
    scheduler.config.repeat_date = "%Y-%m-%d %H:%i";
    scheduler.config.include_end_by = true;
    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.first_hour = 8;
    scheduler.config.details_on_create = true;

    var sgCoaches = createSelectOptions(pInstructor, "name");
    var sgGyms = createSelectOptions(pGymnasium, "branch_name");

    scheduler.config.event_duration = 30;
    scheduler.config.auto_end_date = true;

    scheduler.form_blocks["my_editor"]={
      render:function(sns){
        return "<div class='dhx_cal_ltext' style='height:60px;'>Sessions&nbsp;<input type='text' maxlength='3' size='3' style='margin-right: 10px;' oninput='update_occurances(this.value)'>Limit&nbsp;<input type='text' maxlength='3' size='3' style='margin-right: 10px;'>Cost&nbsp;<input type='text' maxlength='6' size='6' style='margin-right: 10px;'>Duration&nbsp;<select onchange='update_duration(this)' style='margin-right: 5px'><option value=30>30</option><option value=45>45</option><option value=60>60</option><option value=90>90</option><option value=120>120</option></select></div>";
      },
    
      set_value:function(node,value,ev){
        node.childNodes[1].value = ev.class_sessions || "";
        node.childNodes[3].value = ev.class_limit || "";
        node.childNodes[5].value = ev.class_cost || "";
        var options = node.childNodes[7].options;
        for (var idx = 0; idx < options.length; idx++){
          if (options[idx].value == ev.class_duration) {
            node.childNodes[7].selectedIndex = idx;
            break;
          }
        }
      },

      get_value:function(node,ev){
        ev.class_sessions = node.childNodes[1].value;
        ev.class_limit = node.childNodes[3].value;
        ev.class_cost = node.childNodes[5].value;
        var option = node.childNodes[7].options[node.childNodes[7].selectedIndex];
        ev.class_duration = option.value;
      },

      focus:function(node){
        var a=node.childNodes[7]; a.select(); a.focus(); 
      }
    }

    scheduler.config.lightbox.sections = [
      { name:"Class Title",
        height:15,
        map_to:"text",
        type:"textarea",
        focus:true },
      { name: "Gymnasium",
        options: sgGyms,
        map_to: "class_gym",
        type: "select",
        image_path: "../common/dhtmlxCombo/imgs/",
        height:36,
        filtering: true },
      { name: "Instructor",
        options: sgCoaches,
        map_to: "class_instructor",
        type: "select",
        image_path: "../common/dhtmlxCombo/imgs/",
        height:36,
        filtering: true },
      { name:"Description",
        height:20,
        map_to:"class_description",
        type:"textarea"},
      { name: "Class Info",
        height:15,
        map_to:"auto",
        type:"my_editor"},
      { name:"Pending",
        map_to:"is_pending",
        type:"checkbox", 
        height:5 },
      { name:"recurring",
        height:115, 
        type:"recurring",
        map_to:"rec_type", 
        button:"recurring",
        form: "sh_recurring"},
      { name: "time", 
        height: 70,
        type: "time",
        map_to: "auto"
      }];

    scheduler.init('scheduler_here', new Date(),"month");

    var classSchedule = insertClassData(pSchedule, pClasses);

    scheduler.parse(pSchedule, "json");

    scheduler.attachEvent('onEventAdded', addEvent);
    scheduler.attachEvent('onEventChanged', changeEvent);
    scheduler.attachEvent('onEventDeleted', deleteEvent);
  } else {
    console.log('WE DO NOT HAVE A SCHEDULER OBEJECT!!!');
  }
}

function addNewEv() {
  scheduler.addEventNow();
}

function addEvent(id, event) {

  makeAjaxRequest('/class/createtest', 'POST', event, updateEventId);
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

function createSelectOptions(obj, field) {
  var result = [];
  for (var key in obj) {
    var datum = obj[key];
    var value = datum[field];
    result.push({
      key:  datum.id,
      label: value
    });
  }
  return result;
}

function insertClassData(_schedule, _classes) {
  var classobj_fields = {'class_gym': 'gymnasium',
                        'class_instructor': 'instructor',
                        'class_description': 'description',
                        'class_sessions': 'session_count',
                        'class_limit': 'class_limit',
                        'class_duration': 'class_duration',
                        'is_pending': 'isPending',
                        'class_cost': 'cost'};

  /**
   * Since this will be used when creating a class
   * add class info to the event so it is displayed when the user
   * clicks on an event.
   **/
  for (var key in _schedule) {
    var schedObj = _schedule[key];
    for (var idx in _classes) {
      var classObj = _classes[idx];

      if (classObj.id == schedObj.class_id) {
        for (var keyname in classobj_fields) {
          var class_key = classobj_fields[keyname];

          if (keyname == 'class_gym') {
            schedObj[keyname] = classObj.gymnasium.id;
          } else {
            schedObj[keyname] = classObj[class_key];
          }
        }
       _schedule[key] = schedObj;
      }
    }
  }
  return _schedule;
}

function createOtions(data, field) {
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

function update_occurances(value) {
  console.log("UPDATING THE OCCURANCES!");
  document.getElementsByClassName('dhx_repeat_text')[1].value = value;
}

function  update_duration(srcElement) {
  var id = Object.keys(scheduler._events).pop();

  var option = srcElement.options[srcElement.selectedIndex];
  scheduler.getEvent(id).text = option.innerHTML;
  var currDur = parseInt(scheduler.config.event_duration);
  var newDur = parseInt(option.value);
  scheduler.config.event_duration = newDur;

  if (newDur != currDur) {
    var end = new Date(scheduler.getEvent(id).end_date);
    var newEnd = new Date(end.getTime() + (newDur - currDur)*60000);
    scheduler.getEvent(id).end_date = newEnd;
    scheduler.updateEvent(id);
 
    // updating lightbox section
    var ev = scheduler.getEvent(id);
    var sections = scheduler.config.lightbox.sections;
    // if time is the 
    var time_section = sections[sections.length - 1];
    var node = document.getElementById(time_section.id).nextSibling;
    var block = scheduler.form_blocks[time_section.type];
    // note that event - is event object variable
    block.set_value.call(this, node, ev[time_section.map_to], ev, time_section);
  }
};
