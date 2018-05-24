var noticeBin = {};

function notice_type_update(element) {

  console.log('Yeah this is happening!');

  // Get current notice type
  var currType = document.getElementById('current_type').value;
  store_notice(currType, element.value);
  remove_activity_instance();
  switch_node_by_type(currType, element.value);

  if (noticeBin[element.value]) {
    notice_populate_form(noticeBin[element.value]);
    delete noticeBin[element.value];
  } else {
    effective_datePicker.setDate(new Date(), false);
  }
  document.getElementById('current_type').value = element.value;
}

function store_notice(oldType, newType) {
  if (oldType != newType && !noticeBin[oldType]) {
    // create a notice object
    noticeBin[oldType] = get_notice_object();  
  } 
}

function remove_activity_instance() {
  delete acitivityIns;
}

function switch_node_by_type(oldType, newType) {
  // Items in bullpen are activated, activated items are benched.
  var active = document.getElementById('form_body');
  var bench = document.getElementById(oldType);
  var bullpen = document.getElementById(newType);
    
  while(active.firstChild){
    bench.appendChild(active.firstChild);
  }
  while(bullpen.firstChild) {
    active.appendChild(bullpen.firstChild);
  }
}

function clear_form_fields() {
    var noticeForm = document.noticeForm;
    
    // Clear shared fields on the notice Form.
    if (noticeForm.message_open && noticeForm.message_close) {
      noticeForm.message_open.value = '';
      noticeForm.message_close.value = '';
    } else if (noticeForm.message_en && noticeForm.message_zh) {
      noticeForm.message_en.value = '';
      noticeForm.message_zh.value = '';
    } 
}

function delete_notice(noticeid){
    if (confirm('Are you sure you want to delete this notice?')){
        var href = "/notice/" + noticeid;

        makeAjaxRequest(href, 'DELETE');

    } else {
         //Do Nothing
    }
}


function insert_activity() {
    var content = document.noticeForm.content.value;
    var at = document.noticeForm.activity_title;
    var activityTitle = at.options[at.selectedIndex].value;

    if (typeof activityIns === 'undefined') {
        activityIns = new Activity();
    }

    var identifier = activityIns.addActivity(activityTitle, content);

    build_activity_card(activityTitle, content, identifier);

    document.noticeForm.content.value = "";
    document.noticeForm.activity_title.selectedIndex = 0; 
}

//This is for loading an already existing project's contacts
function load_activity(activityId, activityTitle, content, isEditable=false) {
    if (typeof activityIns  === 'undefined') {
        activityIns = new Activity();
    }
    var identifier = activityIns.addActivity(activityTitle, content, activityId);

    // If loading a predefined contact, use the id as the identifier
    build_activity_card(activityTitle, content, activityId, isEditable);
}

function load_activities_from_notice_bin(activities) {
    for (var identifier in activities) {
      var activity = activities[identifier]; 
      var content = activity.content;
      var activityTitle = activity.title;

      if (typeof activityIns === 'undefined') {
        activityIns = activities;
      }
    }
}

function remove_activity(event) {
    var identifier = event.target.parentElement.id;
    activityIns.removeActivity(identifier);
    remove_card(identifier);
}

function remove_card(identifier) {
     var targetElement = document.getElementById(identifier);
     targetElement.parentNode.removeChild(targetElement);
}

function build_activity_card(activityTitle, content, identifier, isEditable) {
     // Create the basic elements
     var cardDiv = document.createElement("div");
     cardDiv.setAttribute("class", "card panel");
     cardDiv.setAttribute("id", identifier);
     var containerDiv = document.createElement("div");
     containerDiv.setAttribute("class", "container");
     var boldTag = document.createElement("b");
     var headerElement = document.createElement("h4");
     var deleteButton = document.createElement ("button");
     deleteButton.onclick = remove_activity;

     var contentText = document.createElement("p");
     contentText.appendChild(document.createTextNode(content));
     boldTag.appendChild(document.createTextNode(activityTitle));

     containerDiv.appendChild(boldTag);
     containerDiv.appendChild(contentText);

     cardDiv.appendChild(containerDiv);
     cardDiv.appendChild(deleteButton);

     if (isEditable) {
         var ids = identifier.split("-");
         var link = "/notice/" + ids[0] + "/activity/" + ids[1] + "/edit";
         var linkElement = document.createElement("a");
         linkElement.appendChild(document.createTextNode("Edit"));
         linkElement.setAttribute("href", link);
         cardDiv.appendChild(linkElement);
     }

     document.getElementById('activity_cards').appendChild(cardDiv);
}

function Activity() {
}

Activity.prototype.addActivity = function(activityTitle, content, identifier=false) {
    var data = {'title': activityTitle,
                'content': content,
                };

    if (!identifier) {
        var id = activityTitle.replace(/ /g,'') + "_" + Date.now();
    } else {
        var id = identifier;
    }
    this[id] = data;

    return id;
};

Activity.prototype.removeActivity = function(identifier) {
    delete this[identifier];
};

Activity.prototype.getActivity = function() {
    var information = this;
    return Object.keys(information).map(function(key){return information[key]});
};

function update_activity(identifiers) {
    //create the data object
        
    var at =  document.activityEditForm.activity_title;
    activityTitle = at.options[um.selectedIndex].value;

    var activityData = {
        "title": activityTitle,
        "content": document.activityEditForm.content.value
    };

    var ids = identifiers.split("-");
    var href = "/notice/" + ids[0] + "/activity/" + ids[1];

    makeAjaxRequest(href, 'PUT',  activityData);
}

function save_notice() {
    var href = "/notice/create";
    var notice = get_notice_JSON();

    if(notice) {
        // Post data to server.
        makeAjaxRequest(href, 'POST',  notice);
    }
}

function update_notice(noticeId) {
    var href = "/notice/" + noticeId;
    var notice = get_notice_JSON();

    if(notice) {
        // Post data to server.
        makeAjaxRequest(href, 'PUT',  notice);
    }
}

function get_notice_object() {
  var retval =  build_notice_object(false);
  remove_activity_instance();
  return retval;
}

function get_notice_JSON() {
  //var retval = JSON.stringify(build_notice_object(true)));
  var retval = build_notice_object(true);
  remove_activity_instance();
  return retval;
}

function build_notice_object(forOutput = false) {
    // Build the notice data object to post to server
    var notice = {};
    var noticeForm = document.noticeForm;
    
    // Retreive message information from notice Form.
    if (noticeForm.message_open && noticeForm.message_close) {
      notice.message_open = noticeForm.message_open.value;
      notice.message_close = noticeForm.message_close.value;
    } else if (noticeForm.message_en && noticeForm.message_zh) {
      notice.message_en = noticeForm.message_en.value;
      notice.message_zh = noticeForm.message_zh.value;
    }

    // Retreive teacher information from notice Form.
    var selIdx = noticeForm.teacher.selectedIndex;
    notice.teacher_name = noticeForm.teacher[selIdx].value;

    // Retreive effective date information from notice Form.
    notice.effective_date = formatDateToISO(noticeForm.effective_date.value);


    // Retreive closing information from notice Form.
    if (noticeForm.closing) {
      notice.closing = noticeForm.closing.value;
    }

    // Retrieve activties from object.
    if (typeof activityIns !== 'undefined') {
        var activities = activityIns.getActivity();
        
        if(activities.length > 0) {
            notice.activities = (forOutput) ? activityIns.getActivity() : activityIns;
        }
    } else if(forOutput) {
      notice.activities = [];
    }

    var currType = document.getElementById('current_type').value;
    notice.ntype = (currType == 'WEN') ? 'WeeklyEnglish' : (currType == 'WZH') ? 'WeeklyChinese' : 'General';
    return notice;
}

function notice_populate_form(notice) {
    // Populate the notice form from the notice data object
    var noticeForm = document.noticeForm;
    
    // Populate the notice form with message data from notice object.
    if (notice.message_open && notice.message_close) {
      noticeForm.message_open.value = notice.message_open;
      noticeForm.message_close.value = notice.message_close;
    } else if (notice.message_en && notice.message_zh) {
      noticeForm.message_en.value = notice.message_en;
      noticeForm.message_zh.value = notice.message_zh;
    } 

    // Populate the notice form with closing data from notice object.
    if (notice.closing) {
      noticeForm.closing.value = notice.closing;
    }

    // Populate the notice form with teacher data from notice object.
    var elem = noticeForm.teacher
    for (var i = 0; i < elem.options.length; i++) {
      if (elem.options[i] == notice.teacher_name) {
        elem.selectedIndex = i;
        break;
      }
    }

    // Populate the notice form with effective date data from notice object.
    if(effective_datePicker) {
      if (notice.effective_date) {
        effective_datePicker.setDate(new Date(notice.effective_date), false);
      } else {
        effective_datePicker.setDate(new Date(), false);
      }
    } else {
      noticeForm.effective_date.value = notice.effective_date;
    }

    // Retrieve activities from noticeBin object.
    load_activities_from_notice_bin(notice.activities); 
}

function convertCheckboxesToInteger(checkboxElements) {
    var numVal = 0;

    for (key in checkboxElements) {
        if(checkboxElements[key].checked){
            numVal += parseInt(checkboxElements[key].value);
        }
    }

    return numVal
}

function load_update_time(dayInt, timeInt, isVisible, domElement) {
    var resultArray = getUpdateDayBinary(dayInt);
    var daysOfWeek = resultArray[0];
    var weekBinary = resultArray[1];

    var cnt = 0;
    for (key in daysOfWeek){
        var day = daysOfWeek[key];
        var elementId = "send_update_day_" + day;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = elementId;
        checkbox.name = "send_update_day";
        checkbox.value = key;
        checkbox.setAttribute("class", "form-control");
        checkbox.style.marginRight = "2px";

        checkbox.onclick = function (domElement){
            var checkboxes = document.getElementsByName('send_update_day');

            var count = 0;
            var mondayIdx = 0;
            for (var idx=0; idx < checkboxes.length; idx++) {
                if (checkboxes[idx].checked) {
                   count++;
                }
                if(checkboxes[idx].value == "2"){
                    mondayIdx = idx;
                }
            }

            if(count == 0) {
                document.getElementById('send_updates').checked = false;
                document.getElementById('updateDateTime').style.visibility = "hidden";
                checkboxes[mondayIdx].checked = true;
            }
        };

        if (weekBinary[cnt] == '1') {
            checkbox.checked = true;
        }

        var label = document.createElement("label");
        label.appendChild(document.createTextNode(day.slice(0, 3) + ':'));
        label.style.marginLeft = "4px";
        label.style.marginRight = "2px";

        domElement.appendChild(label);
        domElement.appendChild(checkbox);

        cnt++;
    }

    var selector = document.createElement("select");
    selector.setAttribute("class", "form-control");
    selector.name = "send_update_time";

    var selectedIndex = 0;

    for (var idx = 0; idx < 24; idx++) {
        var option = document.createElement("option");
        option.setAttribute("value", idx);
        option.innerHTML = formatTime(idx);
        if(idx == timeInt) {
            selectedIndex = idx;
        }
        selector.appendChild(option);
    }

    selector.options.selectedIndex = selectedIndex;
    domElement.appendChild(selector);

    domElement.style.visibility = (isVisible) ? "visible" : "hidden";
}

function load_update_time_message(dayInt, timeInt, domElement) {
    
    var message = "";

        
    var resultArray = getUpdateDayBinary(dayInt);
    var daysOfWeek = resultArray[0];
    var weekBinary = resultArray[1];

    var cnt = 0;
    for (key in daysOfWeek){
        if (weekBinary[cnt] == '1') {
            message += daysOfWeek[key] + ', ';
        }
        cnt++;
    }
       
    if(message.length != 0) {
        message = message.substring(0, message.length - 2);
        var sliceIdx = message.lastIndexOf(',') + 1;
        if(sliceIdx > 0) {
            message = message.slice(0, sliceIdx) + " and" + message.slice(sliceIdx); 
        }
        message += " at ";

        message += formatTime(timeInt); 

        domElement.innerHTML = message;
    }
}

function getUpdateDayBinary(dayInt) {
    resultBinary = '';

    var daysOfWeek = {'1':'Sunday', '2': 'Monday', '4': 'Tuesday', '8': 'Wednesday', '16': 'Thursday', '32': 'Friday', '64': 'Saturday'};

    var nbr = (dayInt >>> 0).toString(2);
    var dayBinary = nbr;
    var cnt = 0;
    while (cnt < (7 - nbr.length)){
        dayBinary = '0' + dayBinary;
        cnt += 1;
    }

    for(var idx = 0; idx < dayBinary.length; idx++){
        resultBinary = dayBinary[idx] + resultBinary;
    }

    return [daysOfWeek, resultBinary]; 
}

function formatTime(timeInt) {
   if (timeInt < 10) {
      return '0' + timeInt + ':00';
   } else {
      return timeInt + ':00';
   }
}

function create_preview() {
  var notice = build_notice_object();
  var currType = notice.ntype;
  var html = '';

  switch (currType) {
    case 'General':
        html = create_general_preview(notice);
        break;
    case 'WeeklyEnglish':
        html = create_english_preview(notice);
        break;
    case 'WeeklyChinese':
        html = create_chinese_preview(notice);
        break;
  }

  if (html) {
    console.log(html.length);
    open_modal(html);
  }
}

function create_chinese_preview(notice) {
    var content = '';
    content += notice.effective_date + '<br/>';
    content += '<p>';
    content += create_activities_content(notice.activities.getActivity());

    content += '<p>你好<br/>';
    content += notice.message_zh;
    content += '<p>';
    content += notice.message_en;
    content += '<p>';
    content += notice.closing;
    content += '<p>';
    content += get_teacher_name(notice.teacher_name);

    return content;
}

function create_english_preview(notice) {
    var content = '';
    content += notice.effective_date + '<br/>';
    content += '<p>Dear Parents/Caregivers';
    content += '<p>';
    content += notice.message_open;
    content += '<p>';
    content += create_activities_content(notice.activities.getActivity());
    content += '<p>';
    content += notice.message_close;
    content += '<p>';
    content += notice.closing;
    content += '<p>';
    content += get_teacher_name(notice.teacher_name);

    return content;

}

function create_general_peview(notice) {
    var content = '';
    content += '<p>Dear Parents/Caregivers';
    content += '<p>';
    content += notice.message_en;
    content += '<p>';
    content += notice.message_zh;
    content += '<p>';
    content += get_teacher_name(notice.teacher_name);

}

function create_activities_content(activities) {
  
  var content = '';

  for(var idx = 0; idx < activities.length; idx++) {
    var activity = activities[idx];
    content += '<li><strong>' + activity.title + '</strong> - ';
    content += activity.content + '</li>';
  }
  
  if (content.length > 0 ) {
    content = '<ul style="list-style-type: none">' + content;
    content += '</ul>';
  }

  return content;
}

function get_teacher_name(name) {
    var resultName = '';

    if (name == 'Management') {
        resultName = 'The Activity Box<br/>The Management';    
    } else {
        var firstName = name.split(" ");
        resultName = firstName[0];
    }

   return resultName; 
}

// Get the modal
//var modal = document.getElementById('myModal');

// Get the modal
//var modal = document.getElementById('myModal');

// When the user clicks on the button, open the modal 
function open_modal(content) {
    var modal = document.getElementById('myModal');
    modal.firstChild.innerHTML += content;
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function close_modal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    clear_modal_content();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById('myModal');
    if (event.target == modal) {
        //modal.style.display = "none";
        close_modal();
    }
}

function clear_modal_content() {
    var modal = document.getElementById('myModal');
    var content_node = modal.firstChild;
    var content = content_node.firstChild;
    while (content.nextSibling) {
      content_node.removeChild(content.nextSibling);
    }
}
