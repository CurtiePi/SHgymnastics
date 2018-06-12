function makeAjaxRequest(url, method, data) {


    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      console.log('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    console.log(url);
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open(method, url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    if (data !== "undefined"){
        httpRequest.send(JSON.stringify(data));
    } else {
        httpRequest.send();
    }

    function alertContents() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          location.href = httpRequest.responseText;
        } else {
          console.log('There was a problem with the request.');
          console.log('Status: ' + httpRequest.status)
        }
      }
    }
}

function formatDateToISO(dateString) {
    var dateObj = new Date(dateString);
    return dateObj.toISOString();
}

function formatDateToString(dateString) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

    var dateObj = new Date(dateString);
    
    var dateString = days[dateObj.getDay()];
    dateString += " " + months[dateObj.getMonth()];
    dateString += " " + ordinal_suffix_of(dateObj.getDate());
    dateString += ",  " + dateObj.getFullYear();

    return dateString;    
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

function initialize_dob(date_of_birth=null) {
  var birthday;
  var year;
  var days;
  var date;
  var month;

  if (date_of_birth) {
    birthday = new Date(date_of_birth);
    year = birthday.getFullYear();
    month = birthday.getMonth();
    date = birthday.getDate() - 1;    
    days = getDays(month, year);
  }

  populate_month(month);
  populate_day(date, days);
  populate_year(year);
}

function populate_month(selIdx=0) {
  var monthEl = document.getElementById('b_month');
  var m_d = ['JAN', 'FEB', 'MAR', 'APR',
             'MAY', 'JUN', 'JUL', 'AUG',
             'SEP', 'OCT', 'NOV', 'DEC'];

  for (var i = 0; i < m_d.length; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = m_d[i];
    if (i == selIdx) {
      opt.selected = true;
    }
    monthEl.appendChild(opt);
  }
}

function populate_day(selIdx=0, numDays=31) {
  var dayEl = document.getElementById('b_day');

  for (var i = 0; i < numDays; i++){
    var opt = document.createElement('option');
    opt.value = i + 1;
    opt.innerHTML = i + 1;
    if (i == selIdx) {
      opt.selected = true;
    }
    dayEl.appendChild(opt);
  }
}

function populate_year(selYear=0, numYears=45) {
  var selIdx = 0;
  var yearEl = document.getElementById('b_year');
  var baseYear = new Date();
  baseYear = baseYear.getFullYear();
  if (selYear) {
    selIdx = selYear - (baseYear - numYears);
    selIdx = (selIdx < 0) ? 0 : selIdx
  }

  for (var i = numYears; i >= 0; i--){
    var opt = document.createElement('option');
    opt.value = baseYear - i;
    opt.innerHTML = baseYear - i;
    yearEl.appendChild(opt);
  }
  yearEl.selectedIndex = selIdx;
}

function update_month(elemObj) {
  var dayEl = document.getElementById('b_day');
  var selectedIndex = dayEl.selectedIndex;
  var currNumDays = dayEl.options.length;
  var thirty = [3, 5, 8, 10];
  var month = elemObj.value;
  var year = document.getElementById('b_year').value;
  var numDays = getDays(month, year);

  if (currNumDays != numDays) {
    removeOptions(dayEl);
    populate_day(selectedIndex, numDays);
  }
}

function getDays(month, year) {
  var thirty = [3, 5, 8, 10];
  var numDays = 31;

  if (thirty.indexOf(month) > -1) {
    numDays = 30;
  } else if (month == 1) {
    if (isLeapYear(year)) {
      numDays = 29;
    } else {
      numDays = 28;
    }
  }
  return numDays
}

function update_year(elemObj) {
  var dayEl = document.getElementById('b_day');
  var selectedIndex = dayEl.selectedIndex;
  var month = document.getElementById('b_month').value;
  var currNumDays = dayEl.options.length;
  var numDays;

  if (month == 1) {
    if (isLeapYear(elemObj.value)) {
      numDays = 29;
    } else {
      numDays = 28;
    }
  }
  
  if (currNumDays != numDays) {  
    removeOptions(dayEl);
    populate_day(selectedIndex, numDays);
  }
}

function loadOptionsData(selectbox, data) {
  for (var i = 0; i <data.size; i++){
    var opt = document.createElement('option');
    opt.value = i + 1;
    opt.innerHTML = i + 1;
    if (i == selIdx) {
      opt.selected = true;
    }
    selectbox.appendChild(opt);
  }

}

function loadOptions(selectBox, optionsArray) {
  for(var idx = 0; idx <  optionsArray.length; idx++)
  {
    selectBox.appendChild(optionsArray[idx]);
  }
}

function removeOptions(selectbox)
{
  var i;
  for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
  {
    selectbox.remove(i);
  }
}

function isLeapYear(year) {
  return ((year % 4 == 0)  && (year % 100 != 0)) || (year % 400 == 0);
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
/*
function goto_unauthorized() {
  location.href="/unauthorized"
}

function protect() {
  var jqxhr = $.ajax( {
    dataType:"json",
    url:"https://rdbiz.herokuapp.com/api/auth",
    xhrFields: {
      withCredentials: true
   }
  })
  .done(function(data) {
    if (data.auth) {
      $("#rdbiz_name").text(data.name);
      if (!data.can_edit_projects) {
        $(".protect_btn").hide()
      }
    } else {
      goto_unauthorized()
    }
   })
  .fail(function() {
    goto_unauthorized()
  });
}
*/
