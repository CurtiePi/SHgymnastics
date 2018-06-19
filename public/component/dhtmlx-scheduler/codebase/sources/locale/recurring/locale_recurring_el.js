/*
@license
dhtmlxScheduler v.5.0.0 Stardard

This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
scheduler.__recurring_template='<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />Ημερησίως</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>Εβδομαδιαίως</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />Μηνιαίως</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />Ετησίως</label> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>Κάθε</label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />ημέρα<br /> <label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>Κάθε εργάσιμη</label> </div> <div style="display:none;" id="dhx_repeat_week"> Επανάληψη κάθε<input class="dhx_repeat_text" type="text" name="week_count" value="1" />εβδομάδα τις επόμενες ημέρες:<br /> <table class="dhx_repeat_days"> <tr> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />Δευτέρα</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />Πέμπτη</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />Τρίτη</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />Παρασκευή</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />Τετάρτη</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />Σάββατο</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />Κυριακή</label><br /><br /> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <label><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>Επανάληψη</label><input class="dhx_repeat_text" type="text" name="month_day" value="1" />ημέρα κάθε<input class="dhx_repeat_text" type="text" name="month_count" value="1" />μήνα<br /> <label><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/>Την</label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><select name="month_day2"><option value="1" selected >Δευτέρα<option value="2">Τρίτη<option value="3">Τετάρτη<option value="4">Πέμπτη<option value="5">Παρασκευή<option value="6">Σάββατο<option value="0">Κυριακή</select>κάθε<input class="dhx_repeat_text" type="text" name="month_count2" value="1" />μήνα<br /> </div> <div style="display:none;" id="dhx_repeat_year"> <label><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/>Κάθε</label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />ημέρα<select name="year_month"><option value="0" selected >Ιανουάριος<option value="1">Φεβρουάριος<option value="2">Μάρτιος<option value="3">Απρίλιος<option value="4">Μάϊος<option value="5">Ιούνιος<option value="6">Ιούλιος<option value="7">Αύγουστος<option value="8">Σεπτέμβριος<option value="9">Οκτώβριος<option value="10">Νοέμβριος<option value="11">Δεκέμβριος</select>μήνα<br /> <label><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/>Την</label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >Δευτέρα<option value="2">Τρίτη<option value="3">Τετάρτη<option value="4">Πέμπτη<option value="5">Παρασκευή<option value="6">Σάββατο<option value="7">Κυριακή</select>του<select name="year_month2"><option value="0" selected >Ιανουάριος<option value="1">Φεβρουάριος<option value="2">Μάρτιος<option value="3">Απρίλιος<option value="4">Μάϊος<option value="5">Ιούνιος<option value="6">Ιούλιος<option value="7">Αύγουστος<option value="8">Σεπτέμβριος<option value="9">Οκτώβριος<option value="10">Νοέμβριος<option value="11">Δεκέμβριος</select><br /> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <label><input class="dhx_repeat_radio" type="radio" name="end" checked/>Χωρίς ημερομηνία λήξεως</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="end" />Μετά από</label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />επαναλήψεις<br /> <label><input class="dhx_repeat_radio" type="radio" name="end" />Λήγει την</label><input class="dhx_repeat_date" type="text" name="date_of_end" value="'+scheduler.config.repeat_date_of_end+'" /><br /> </div> </form> </div> <div style="clear:both"> </div>';

