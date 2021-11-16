window.onhashchange = function() {
  var x = location.hash;
  var i = x.indexOf("#");
  var typ = "";
  var val = "";
  var filter = "";
  if (i == 0) {
    var j = x.indexOf("/");
    if (j > 0) {
      typ = x.substr(1, j - 1);
      val = x.substr(j + 1);
    } else {
      typ = x.substr(1);
    }

    j = typ.indexOf("?");
    if (j > 0) {
      typ = typ.substr(0, j);
      if (typ == "memorydomains")
        filter = typ.substr(j);
    }

    i = 0;

    if (val == "")
      page = typ;
    else {
      page = val;
      i = val.indexOf("/");
      if (i > 0)
        val = val.substr(0, i);
    }

    if (typ == "ofmf")
      $("#listPage").hide();

    $("#objectType").html(typ);
    $("#objectValue").html(val);
    $("#filter").html(filter);

    if (i > 0)
      showLogPage();
    else
      loadDoc(page);
  } else {
    window.location.reload();
  }
};

function onBack() {
  $(".ui-tooltip").remove();
  window.history.back();
}

function make_basic_auth(user, password) {
  var tok = user + ':' + password;
  var hash = Base64.encode(tok);
  return "Basic " + hash;
}

function clearLogin() {
  $("#user").val("");
  $("#pswd").val("");
}

function showSettings() {
  var str = "";

  str += '<h1>Settings</h1>';
  str += '<div class="subdetails">';
  str += '<p>To change the user id and/or password, Please enter the current';
  str += 'values as well as the new ones.</p>';
  str += '<p>Once the user id and password are updated, you will need to';
  str += 're-enter them to log back onto the OFMF.</p>';
  str += '<form id="updateForm" action="javascript:updateForm();">';
  str += '<p class="updateform">';
  str += 'Current User ID:';
  str += '<input type="text" id="olduser" value=""';
  str += 'autocomplete="off section-red new"><br>';
  str += 'Current Password:';
  str += '<input type="password" id="oldpswd" value=""';
  str += 'autocomplete="off section-red new-password"><br>';
  str += 'New User ID:';
  str += '<input type="text" id="newuser" value=""';
  str += 'autocomplete="off section-red new"><br>';
  str += 'New Password:';
  str += '<input type="password" id="newpswd1" value=""';
  str += 'autocomplete="off section-red new"><br>';
  str += 'Re-enter New Password:';
  str += '<input type="password" id="newpswd2" value=""';
  str += 'autocomplete="off section-red new"><br>';
  str += '</p>';
  str += '<input type="submit" value="Submit">';
  str += '</form>';
  str += '<p id="updateError" class="error"></p>';
  str += '</div>';

  clearLogin();
  $("#contactPage").hide();
  $("#contentPage").hide();
  $("#listPage").hide();
  $("#detailPage").hide();
  $("#objectType").html("");
  $("#objectValue").html("");
  $("#settingsPage").html(str);
  $("#settingsPage").show();
  $("#olduser").focus();
  $("#iflist").html("");
  $("#nslist").html("");
}
function showContents(page) {
  clearLogin();
  $("#listPage").html("");
  $("#detailPage").html("");
  $("#contentPage").html("");
  $("#settingsPage").html("");
  $("#contactPage").hide();
  $("#settingsPage").hide();
  $("#listPage").hide();
  $("#detailPage").hide();
  $("#objectType").html(page);
  $("#objectValue").html("");
  $("#iflist").html("");
  $("#nslist").html("");
  loadDoc(page);
}
function showList(page) {
  clearLogin(); 
  if (page == undefined && $("#renamed").html() != "") {
    page = $("#objectType").html()
    $("#renamed").html("");
  }
  if (page != undefined)
    $("#listPage").html("");
  $("#detailPage").html("");
  $("#settingsPage").html("");
  $("#listPage").show();
  $("#contactPage").hide();
  $("#settingsPage").hide();
  $("#contentPage").hide();
  $("#detailPage").hide();
  $("#objectValue").html("");
  $("#args").html("");
  $("#parentargs").html("");
  $("#iflist").html("");
  $("#nslist").html("");
  if (page != undefined) {
    $("#objectType").html(page);
    loadDoc(page);
  }
}

function showLogPage() {
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var str = "";

  str += "<h1>";
  if (typ == "memorydomains")
    str += "Fabric";
  else
    str += "Host";
  str += ": " + obj + " &nbsp;";
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += '</h1><h3>Log Pages'
  if (typ == "memorydomains") {
    str += ' &nbsp;<img src="refresh.png" alt="refresh" title="refresh"';
    str += ' class="icon" onclick="sendRefresh()">';
  }
  str += '</h3>';

  $("#detailPage").html(str);
  $("#detailPage").show();
  $("#contentPage").hide();

  loadDoc(obj + "/logpage");
}

function showDetails(page) {
  $("#detailPage").html("");
  $("#detailPage").show();
  $("#listPage").hide();
  if (page != undefined) {
    $("#objectValue").html(page);
    loadDoc(page);
  }
}

function clearSession() {
  sessionStorage.removeItem("ofmf_addr");
  sessionStorage.removeItem("ofmf_port");
  sessionStorage.removeItem("ofmf_auth");
  $("#settingsPage").html("");
  $("#listPage").html("");
  $("#detailPage").html("");
  $("#addrForm").show();
  $("#contactPage").hide();
  $("#settingsPage").hide();
  $("#contentPage").hide();
  $("#listPage").hide();
  $("#detailPage").hide();
  $("#menu").hide();
  $("#user").focus();
}

function Capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadDel(sub, item, val) {
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var str = "delete " + Capitalize(typ);
  var uri = typ;

  if (obj == "") {
    uri += "/" + sub;
    str += " '" + sub + "'";
  } else {
    uri += "/" + obj;
    str += " '" + obj + "'";

    if (item != undefined && typeof(item) == typeof(str)) {
      if (typ == "memorydomains") {
        uri += "/subsystem";
        str += " Subsystem '" + sub + "'";
      } else if (typ == "group") {
        str += " " + Capitalize(sub) + " '" + item + "'";
      } else {
         str += "  '" + sub + "'";
      }
    } else {
      if (sub == "/portid")
        str += " Port ID " + item;
      else if (sub == "/transport")
        str += " Transport " + item;
      else if (sub == "/interface")
        str += " Interface " + item;
      else if (typ == "memorydomains") {
        uri += "/subsystem";
        str += " Subsystem '" + sub + "'";
      }
    }

    if (sub != "" && sub.charAt(0) != "/")
      uri += "/";

    uri += sub;

    if (val != undefined && typ == "memorydomains") {
      if (item == "/host") {
        uri += item + "/" + val;
        str += " Host '" + val + "' from the Allowed Hosts list";
      } else if (item == "/nsid") {
        uri += item + "/" + val;
        str += " NS ID " + val;
      }
    } else if (item != undefined)
      uri += "/" + item;
  }

  openDialog("Are you sure you want to " + str, "DELETE", uri);
}

function showConfig() {
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var str = "reconfigure " + Capitalize(typ);
  var uri = typ + "/"  + obj + "/reconfig";

  str += " " + obj;

  openDialog("Are you sure you want to " + str, "POST", uri);
}

function sendRefresh() {
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var str = "refresh log pages for " + Capitalize(typ);
  var uri = typ + "/"  + obj + "/refresh";

  str += " " + obj;

  openDialog("Are you sure you want to " + str, "POST", uri);
}

function loadAltDel(alias, nqn, host) {
  var str;
  var uri = "memorydomains/" + alias + "/subsystem/" + nqn + "/host/" + host;

  str = "Are you sure you want to delete Host '" + host + "'" +
        " from Allowed list on Subsytem '" + nqn + "'" +
        " on Target '" + alias + "'?";

  openDialog(str, "DELETE", uri);
}

function toggleMode() {
  $("#res_refresh").hide();
  $("#log_refresh").hide();
  $("#oob_data").hide();
  $("#oob_note").hide();
  $("#inb_data").hide();
  $("#inb_note").hide();
  $("#event_note").hide();
  $("#local_note").hide();
  if ($("#mode").val() == "local") {
    $("#local_note").show();
    $("#log_refresh").show();
  } else if ($("#mode").val() == "oob") {
    $("#oob_data").show();
    $("#oob_note").show();
    $("#res_refresh").show();
  } else if ($("#mode").val() == "inb") {
    $("#inb_data").show();
    $("#inb_note").show();
    $("#res_refresh").show();
  }
}

function formFabricAlias(obj) {
  var str = "<p class='header'>";
  var hidden = " style='display:none'";
  var selected = " selected";
  var args = $("#parentargs").html().trim().split(",");
  var mode = "LocalMgmt";
  var typ = "";
  var fam = "";
  var adr = "";
  var port = "";
  var refresh = "";

  if (obj == undefined) obj = "";
  if (obj == "")
    str += "Add a Fabric</p>";
  else {
    str += "Update Fabric '" + $("#objectValue").html() + "'</p>";
    if (args[0] != undefined) refresh = args[0];
    if (args[1] != undefined) mode = args[1];
    if (args[2] != undefined) typ = args[2];
    if (args[3] != undefined) fam = args[3];
    if (args[4] != undefined) adr = args[4];
    if (args[5] != undefined) port = args[5];
  }
  str += "<p>Alias: <input id='alias' type='text' value='" + obj +
             "'></input></p>";

  str += "<p>Management Mode<select id='mode' onchange='toggleMode()'>";
  str += "<option value='local'";
  if (mode == "LocalMgmt") str += selected;
  str += ">Local</option>"
  str += "<option value='oob'";
  if (mode == "OutOfBandMgmt") str += selected;
  str += ">Out of Band</option>"
  str += "<option value='inb'";
  if (mode == "InBandMgmt") str += selected;
  str += ">In Band</option>"

  str += "</select><span class='units'>";

  visible = (mode == "InBandMgmt") ? "" : hidden;
  str += "<div id='inb_note'" + visible +
         "><p><b>Endpoint Manager configuration</b>" +
         "<font style='font-size:smaller'> using OFMF primatives to " +
	 "configure fabrics</font></p></div>";
  visible = (mode == "OutOfBandMgmt") ? "" : hidden;
  str += "<div id='oob_note'" + visible +
         "><p><b>Endpoint Manager configuration</b>" +
         "<font style='font-size:smaller'> using RESTful interface to " +
         "configure fabrics</font></p></div>";
  visible = (mode == "LocalMgmt") ? "" : hidden;
  str += "<div id='local_note'" + visible +
         "><p><b>Locally Managed</b>" +
	 "<font style='font-size:smaller'>, Targets need to " +
         "poll logpages periodically for resource changes</font></p></div>" +
         "</span></p>";

  visible = (mode == "InBandMgmt") ? "" : hidden;
  str += "<p><div id='inb_data'" + visible + ">";
  str += formType(typ, "TRTYPE", "inb_typ");
  str += formFamily(fam, "ADRFAM", "inb_fam");
  str += formAddress(adr, "TRADDR", "inb_adr");
  str += formPort(port, "TRSVCID", "inb_svc");
  str += "</div></p>";

  visible = (mode == "OutOfBandMgmt") ? "" : hidden;
  str += "<p><div id='oob_data'" + visible + ">";
  str += formFamily(fam, "Family", "oob_fam");
  str += formAddress(adr, "Address", "oob_adr");
  str += formPort(port, "RESTful Port", "oob_port");
  str += "</div></p>";

  str += "<p><b>Periodic Resource Updates</b></p>";
  str += "<p>Refresh: " +
         "<input id='refresh' type='number' value='" + refresh + "' min='0'>" +
         "</input><span class='units'>minutes - 0 disables timer ";
  visible = (mode.indexOf("Band") == -1) ? "" : hidden;
  str += "<span id='log_refresh'" + visible + ">Log Page</span>"
  visible = (mode.indexOf("Band") > 0) ? "" : hidden;
  str += "<span id='res_refresh'" + visible + ">Resource info</span>"
  str += " refreshing</span></p>";
  return str;
}


function formMemdomain(obj) {
  var str = "<p class='header'>";
  var hidden = " style='display:none'";
  var selected = " selected";
  var args = $("#parentargs").html().trim().split(",");
  
  var memdomainmember = "";

  if (obj == undefined) obj = "";
  if (obj == "")
    str += "Add a Memory Domain</p>";
  else {
    str += "Update Memory Domain '" + $("#objectValue").html() + "'</p>";
    if (args[0] != undefined) memdomainmember = args[0];
  }
  str += "<p>MemoryDomain: <input id='memdomainid' type='text' value='" + memdomainmember +
             "'></input></p>";

  return str;
}


function formHostAlias(obj) {
  var nqn = $("#args").html().trim();
  var str = "<p class='header'>";
  if (obj == undefined) obj = "";

  if (obj == "")
    str += "Add a Host";
  else
    str += "Update Host '" + $("#objectValue").html() + "'";

  str += "</p><p>Alias: <input id='alias' type='text' value='" + obj +
             "'></input></p>";
  str += "<p>Host NQN: <input id='hostnqn' type='text' value='" + nqn +
             "'></input></p>";
  return str;
}
function formGroupHost() {
  var str = "";
  var xhttp = new XMLHttpRequest();
  var auth = sessionStorage.ofmf_auth;
  var url = "http://";

//raj  url += sessionStorage.ofmf_addr + ":" + sessionStorage.ofmf_port + "/host";
  url += sessionStorage.ofmf_addr + "/host";

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader('Authorization', auth);
  xhttp.send();

  var obj = jQuery.parseJSON(xhttp.responseText);
  var list = obj["Hosts"].sort();
  var i;

  str += "<p>Add a Host Alias to Group '" + $("#objectValue").html() + "'";
  str += "</p><br>";
  str += "<p>Alias: <select id='alias'>";

  for (i = 0; i < list.length; i++)
    str += "<option>" + list[i] + "</option>";

  str += "</select></p>";
  return str;
}
function formGroupFabric() {
  var str = "";
  var xhttp = new XMLHttpRequest();
  var auth = sessionStorage.ofmf_auth;
  var url = "http://";

//raj  url += sessionStorage.ofmf_addr + ":" + sessionStorage.ofmf_port + "/fabrics";
  url += sessionStorage.ofmf_addr + "/fabrics";

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader('Authorization', auth);
  xhttp.send();

  var obj = jQuery.parseJSON(xhttp.responseText);
  var list = obj["Memdomains"].sort();
  var i;

  str += "Add a Target Alias to Group '" + $("#objectValue").html() + "'";
  str += "</p>";
  str += "<p>Alias: <select id='alias'>";

  for (i = 0; i < list.length; i++)
    str += "<option>" + list[i] + "</option>";

  str += "</select></p>";
  return str;
}

function buildFilterMenu() {
  var str = "";
  var checked = ' checked="checked"';
  var filter = 0;
  var cur = $("#filter").html();
  if (cur.indexOf("=rdma") != -1) filter = 1;
  else if (cur.indexOf("=tcp") != -1) filter = 2;
  else if (cur.indexOf("=fc") != -1) filter = 3;
  else if (cur.indexOf("=Out") != -1) filter = 4;
  else if (cur.indexOf("=In") != -1) filter = 5;
  else if (cur.indexOf("=Loc") != -1) filter = 6;

  str += "<span style='float:right'>";
  str += '<img src="filtered.png" alt="filter" title="apply filter" class="dropbtn"';
  if (filter == 0) str += ' style="display:none"';
  str += ' id="filteredmenu" onclick="showDropdown(' + "'Filter'" + ');">';
  str += '<img src="unfiltered.png" alt="filter" title="apply filter" class="dropbtn"';
  if (filter != 0) str += ' style="display:none"';
  str += ' id="unfilteredmenu" onclick="showDropdown(' + "'Filter'" + ');">';
  str += '<div id="Filter" class="dropdown-content">';
  str += '<label class="filter">No Filter' +
         '<input type="radio" name="radio" onchange="filter(0)"';
  if (filter == 0) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only RDMA Fabric' +
         '<input type="radio" name="radio" onchange="filter(1)"';
  if (filter == 1) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only TCP Fabric' +
         '<input type="radio" name="radio" onchange="filter(2)"';
  if (filter == 2) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only FC Fabric' +
         '<input type="radio" name="radio" onchange="filter(3)"';
  if (filter == 3) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only Out-of-Band Managed' +
         '<input type="radio" name="radio" onchange="filter(4)"';
  if (filter == 4) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only In-Band Managed' +
         '<input type="radio" name="radio" onchange="filter(5)"';
  if (filter == 5) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += '<label class="filter">Only Locally Managed' +
         '<input type="radio" name="radio" onchange="filter(6)"';
  if (filter == 6) str += checked;
  str += '><span class="checkmark"></span></label>';
  str += "</div></span>";

  return str;
}

function filter(id) {
  var old = $("#filter").html();
  switch (id) {
    case 1: $("#filter").html("?fabric=rdma"); break;
    case 2: $("#filter").html("?fabric=tcp"); break;
    case 3: $("#filter").html("?fabric=fc"); break;
    case 4: $("#filter").html("?mode=OutOfBandMgmt"); break;
    case 5: $("#filter").html("?mode=InBandMgmt"); break;
    case 6: $("#filter").html("?mode=LocalMgmt"); break;
    default: $("#filter").html(""); break;
  }
  if (id == 0) {
    $("#unfilteredmenu").show();
    $("#filteredmenu").hide();
  } else {
    $("#filteredmenu").show();
    $("#unfilteredmenu").hide();
  }
  if (old != $("#filter").html())
    loadDoc($("#objectType").html());
}

function loadEdit(obj, sub, val) {
  var typ = $("#objectType").html();
  var item = $("#objectValue").html();
  var str = "";
  var uri = typ;

  if (obj == undefined) obj = "";

  if (item != "")
    uri += "/" + item;

  if (obj != "" && obj.charAt(0) != "/") {
    if (typ == "memorydomains") {
      uri += "/subsystem/";
      if (val == undefined)
        str += formSubsystem(obj);
    } else
       uri += "/";
  }

  uri += obj;

  if (obj == "") {
    if (typ == "memorydomains")
      str += formMemdomain(item);
    else if (typ == "host")
      str += formHostAlias(item);
    else
      str += formGroup(item, sub);
  } else {
    if (sub != undefined && typeof(sub) == typeof(str)) {
      if (sub.charAt(0) != "/")
         str += "  '" + sub + "'";
    } else {
      if (typ == "memorydomains") {
        if (typeof(sub) == typeof(0) && val == undefined)
          str += formPortID(sub);
      } else {
        if (typeof(sub) == typeof(0) && val == undefined)
          str += formTransport(sub);
      }
    }

    if (sub != undefined) {
      if (typeof(sub) == typeof(str)) {
        if (sub.charAt(0) != "/")
          uri += "/" + sub;
        else if (typ == "memorydomains") {
          uri += sub;
          if (val == undefined) {
            if (sub == "/ndis")
              str += formNSID(obj);
            else if (sub == "/host")
              str += formAllowedHost(obj);
          }
        }
      } else
        uri += "/" + sub;
    }

    if (val != undefined) {
      if (typeof(val) == typeof(str))
           str += "  '" + val + "'";
      else {
        if (typ == "memorydomains") {
          str += formNSID(obj,val);
        } else {
          str += " - " + val;
        }
      }
      uri += "/" + val;
    }
  }

  openDialog(str, "PUT", uri);
}

function loadAdd(sub, val) {
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var str = "";
  var uri = typ;

  $("#args").html("");

  if (sub == undefined) {
    if (typ == "memorydomains")
      str += formMemdomain();
    else if (typ == "host")
      str += formHostAlias();
    else
      str += formGroup();
  } else if (typ == "memorydomains") {
    uri += "/" + obj;
    if (sub == "/subsystem") {
      uri += sub;
      str += formSubsystem();
    } else if (sub == "/portid") {
      uri += sub;
      if (val == undefined)
        str += formPortID();
    } else if (sub == "/interface") {
      uri += sub;
      if (val == undefined)
        str += formTransport();
    } else if (sub == "/transport") {
      uri += sub;
      if (val == undefined)
        str += formTransport();
    }
  } else if (typ == "group") {
    uri += "/" + obj + "/" + sub;
    if (val == undefined) {
      if (sub == "host")
        str += formGroupHost();
      else
        str += formGroupFabric();
    }
  } else if (typ == "host") {
    uri += "/" + obj;
    if (sub == "/transport") {
      uri += sub;
      if (val == undefined)
        str += formTransport();
    } else if (sub == "/interface") {
      uri += sub;
      if (val == undefined)
        str += formTransport();
    }
  }

  if (val != undefined) {
    if (val == "/host") {
      uri += "/subsystem/" + sub;
      str += formAllowedHost(sub);
    } else if (val == "/nsid") {
      uri += "/subsystem/" + sub;
      str += formNSID(sub);
    } else
      uri += "/";
    uri += val;
  }
  $("#args").html("");

  openDialog(str, "PUT", uri);
}

function parseMgmtMode(obj, itemA) {
  var str = "";
  var args = "";
  var mode = obj[itemA];

  str += '<p class="data">Management Mode: ';
  if (mode == "OutOfBandMgmt") {
    str += "Out-of-Band";
    str += ' &nbsp; <img src="config.png" alt="cfg" title="reconfigure"';
    str += ' class="icon" onclick="showConfig()">';
  }
  else if (mode == "InBandMgmt") {
    str += "In-Band";
    str += ' &nbsp; <img src="config.png" alt="cfg" title="reconfigure"';
    str += ' class="icon" onclick="showConfig()">';
  } else if (mode == "LocalMgmt")
    str += "Local";
  else
    str += mode;

  str += "</p>";

  $("#parentargs").html("," + mode);

  return str;
}

function parseObject(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();

  if (itemA == "Interfaces" && typ == "ofmf") {
    str += "<h1>About</h1>";
    str += '<div class="comments">';
    str += "<p>Use the menus to the right to view and manage ofmf defined ";
    str += "objects by <b>Open Fabrics Management Tool</b>.</p>";
    str += "<p>Currently active fabric interfaces ";
    str += "to query are listed below.</p></div>";
  }

  str += "<h1>";
  if (itemA == "NSDevs")
    str += "NS Devices";
  else if (itemA == "PortIDs")
    str += " Port IDs";
  else
    str += itemA;

  tmp = itemA.substr(0,itemA.length-1).toLowerCase();

  if ((itemA == "Interfaces") || (itemA == "NSDevices") ||
      (itemA == "Shared") || (itemA == "Restricted"))
    str += "</h1>";
  else {
    closeDiv = true;
    str += " &nbsp;";
    str += '<img src="plus.png" alt="add" title="add" class="icon" onclick="loadAdd(';
    if (itemA == "Memdomains" || itemA == "Hosts" || itemA == "Groups" ) {
      if (typ == "group" && tmp != "group")
        str += "'" + tmp + "'";
      str += ')">';
      if (itemA == "Memorydomains" && typ == "memorydomains")
        str += buildFilterMenu();
      str += '</h1>';
      if (listB.length > 22)
        str += '<div class="three-columns">';
      else if (listB.length > 11)
        str += '<div class="two-columns">';
      else
        str += '<div class="one-column">';
    } else {
      str += "'/" + tmp + "'" + ')"></h1>';
      if (itemA == "PortIDs")
        str += '<div class="details">';
    }
  }

  listB.sort(basicSort(obj[itemA]));

  listB.forEach(function(itemB) {
    var listC = Object.keys(obj[itemA][itemB]);
    var name = "";
    if (typeof(obj[itemA][itemB]) == typeof("") && listC != undefined) {
      name = obj[itemA][itemB];
      str += '<h3>';
      if (typ != "group" || tmp == "group") {
        str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
        str += "showDetails('" + name + "'" + ')">&nbsp; ';
        str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
        str += "'" + name + "'" + ')">&nbsp; ';
      } else {
        str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
        str += "'" + tmp + "','" + name + "'" + ')">&nbsp; ';
      }
      if (name.length > 50)
        str += '<b style="font-size:.6em">' + name + "</b></h3>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b></h3>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b></h3>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b></h3>";
      else
        str += name + "</h3>";
    } else if (itemA == "Interfaces" && typ == "host") {
       str += parseTransports(obj, itemA, itemB)
    } else if (itemA == "Transports") {
       str += parseTransports(obj, itemA, itemB)
    } else if (itemA == "Interfaces") {
       str += parseInterfaces(obj, itemA, itemB)
    } else if (itemA == "Subsystems") {
       str += parseSubsystems(obj, itemA, itemB)
    } else if (itemA == "PortIDs") {
       str += parsePortIDs(obj, itemA, itemB)
    } else if (itemA == "NSDevices") {
       str += parseNSDevs(obj, itemA, itemB)
    } else if (itemA == "Shared" || itemA == "Restricted") {
       str += parseACL(obj, itemA, itemB)
    } else {
      listC.forEach(function(itemC) {
        var listD = obj[itemA][itemB][itemC];
/*raj        str += '<p class="data">' + "--++--" + itemC + "=" + listD + "</p>";*/
        str += '<p class="data">' + itemC + " : " + listD + "</p>";
      });
    }
  });

  if (closeDiv)
    str += "</div>";

  return str;
}


function parseMemoryDomain(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj[itemA]));

  listB.forEach(function(itemB) {
    var name1 = obj[itemA][itemB];
    var subname = name1.split('/');
    var name = subname[6] + '/' + subname[7];
	  
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;
}

function parseMemoryChunks(obj, itemA) {
  var listB = Object.keys(obj["Links"]["Endpoints"]);
  var linkObj;
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + "Name" + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
  str += "'" + name + "'" + ')">';
  str += ' <img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()"><br>';
  
  str += "MemoryChunkSizeMiB" + ": " + obj["MemoryChunkSizeMiB"] + " &nbsp;";
  str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
  str += "'" + name + "'" + ')">';
  str += ' <img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()"><br>';
  
  str += "AddressRangeOffsetMiB" + ": " + obj["AddressRangeOffsetMiB"] + " &nbsp;";
  str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
  str += "'" + name + "'" + ')">';
  str += ' <img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()"><br>';
  
  str += "<br><br>Endpoints" + ": ";
  str += "</h1>";

  listB.sort(basicSort(obj["Links"]["Endpoints"]));

  listB.forEach(function(itemB) {
    var name = "";
    var listC = Object.keys(obj["Links"]["Endpoints"][itemB]);
    var name1 = obj["Links"]["Endpoints"][itemB][listC];
    var subname = name1.split('/');
    var name = subname[4] + '/' + subname[5] + '/' + subname[6];
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;

}

function parseMemoryChunksCollection(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj[itemA]));

  listB.forEach(function(itemB) {
    var name = "";
    var listC = Object.keys(obj[itemA][itemB]);
    var name1 = obj[itemA][itemB][listC];
    var subname = name1.split('/');
    var name = subname[6] + '/' + subname[7] + '/' + subname[8];
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;

}

function parseConnection(obj, itemA) {
  var listB = Object.keys(obj["MemoryChunkInfo"]);
  var listC = Object.keys(obj["Links"]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj["MemoryChunkInfo"]));

  listB.forEach(function(itemB) {
    var name = "";
    var mc_key = Object.keys(obj["MemoryChunkInfo"][itemB]);

    mc_key.sort(basicSort(obj["MemoryChunkInfo"][itemB]);
    mc_key.forEach(function(item_mc_key) {
        var mc_key1 = Object.keys(obj["MemoryChunkInfo"][itemB][item_mc_key]);
        var name = obj["MemoryChunkInfo"][itemB][mc_key][item_mc_key];
/*    var subname = name1.split('/'); 
    var name = subname[6]; */
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + subname[3] + '/' + subname[4] + '/' + subname[5];
    str += '/' + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
    })	    
  });
  return str;

}

function parseConnectionCollection(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj[itemA]));

  listB.forEach(function(itemB) {
    var name = "";
    var listC = Object.keys(obj[itemA][itemB]);
    var name1 = obj[itemA][itemB][listC];
    var subname = name1.split('/');
    var name = subname[6];
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + subname[3] + '/' + subname[4] + '/' + subname[5];
    str += '/' + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;

}

function parseSystemCollection(obj, itemA) {
  var listB = Object.keys(obj[itemA]["Members"]);
  var linkObj;
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj[itemA]["Members"]));

  listB.forEach(function(itemB) {
    var name = "";
    var listC = Object.keys(obj[itemA]["Members"][itemB]);
    var name1 = obj[itemA]["Members"][itemB][listC];
    var subname = name1.split('/');
    var name = subname[4];
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;

}

function parseMemdomainCollection(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();
  var ref = "";

  str += "<h1>" + itemA + ": " + obj["Name"] + " &nbsp;";
  str += '<img src="plus.png" alt="add" title="add" class="icon"';
  str += ' onclick="loadAdd()">';
  str += ' &nbsp; ';
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";

  listB.sort(basicSort(obj[itemA]));

  listB.forEach(function(itemB) {
    var name = "";
    var listC = Object.keys(obj[itemA][itemB]);
    var name1 = obj[itemA][itemB][listC];
    var subname = name1.split('/');
    var name = subname[6];
	  
    str += '<h3>';
    if (name.length > 50) 
        str += '<b style="font-size:.6em">' + name + "</b>";
      else if (name.length > 40)
        str += '<b style="font-size:.7em">' + name + "</b>";
      else if (name.length > 30)
        str += '<b style="font-size:.8em">' + name + "</b>";
      else if (name.length > 20)
        str += '<b style="font-size:.9em">' + name + "</b>";
      else
        str += name;
    str += " &nbsp;";
    str += '<img src="view.png" alt="get" title="view" class="icon" onclick="';
    str += "showDetails('" + name + "'" + ')">&nbsp; ';
    str += '<img src="trash.png" alt="del" title="delete" class="icon" onclick="loadDel(';
    str += "'" + name + "'" + ')">&nbsp; </h3>';
  });
  return str;

}

function parseMembers(obj, itemA) {
  var listB = Object.keys(obj[itemA]);
  var str = "";
  var closeDiv = false;
  var typ = $("#objectType").html();

  str += "<h1>" + itemA + ": " + obj[itemA] + " &nbsp;";
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  if (itemA == "Alias") {
    str += ' &nbsp; ';
    str += '<img src="page.png" alt="log" title="view log pages"';
    str += ' class="icon" onclick="showLogPage()">';
  }
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";
  return str;
}

function parseName(obj, itemA) {
  var str = "";
  var typ = $("#objectType").html();
  str += "<h1>" + itemA + ": " + obj[itemA] + " &nbsp;";
  str += '<img src="pencil.png" alt="edit" title="edit" class="icon"';
  str += ' onclick="loadEdit()">';
  if (itemA == "Alias") {
    str += ' &nbsp; ';
    str += '<img src="page.png" alt="log" title="view log pages"';
    str += ' class="icon" onclick="showLogPage()">';
  }
  str += ' &nbsp; ';
  str += '<img src="back.png" alt="back" title="back" class="icon"';
  str += ' onclick="onBack()">';
  str += "</h1>";
  return str;
}

function parseString(obj, itemA) {
  var str = "";
  var args = "";

  str += '<p class="data">' + itemA + ": " + obj[itemA] + "</p>";

  args = obj[itemA];
  $("#args").html(args);

  return str;
}

function parseNumber(obj, itemA) {
  var str = "";
  var args = "";
  var val = obj[itemA];

  if (val == undefined) val = 0;

  str += '<p class="data">' + itemA + ": ";
  if (val)
    str += val + " minute" + ((val == 1) ? "" : "s");
  else
    str += "disabled";

  str += "</p>";

  args += val;
  $("#parentargs").html(args);

  return str;
}

function modifySort(a) {
  if (a == "Alias" || a == "Name" || a == "Refresh")
    a = "A" + a;
  else if (a == "MgmtMode")
    a = "B" + a;
  else if (a == "Interface")
    a = "C" + a;
  else
    a = "D" + a;
  return a;
}
function customSort(a,b) {
  a = modifySort(a);
  b = modifySort(b);
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
function basicSort(list) {
  return function(a,b) {
    if (list[a] > list[b]) return 1;
    if (list[a] < list[b]) return -1;
    return 0;
  }
}

function parseJSON(json, object) {
  var str = "";
  var obj = jQuery.parseJSON(json);
  var listA = Object.keys(obj).sort(customSort);

  $("#iflist").html("");
  $("#nslist").html("");

  listA.forEach(function(itemA) {
    if (itemA == "@odata.type" &&  obj[itemA] == "#MemoryDomainCollection.MemoryDomainCollection")
      str += parseMemdomainCollection(obj, "Members");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#ComputerSystemCollection.ComputerSystemCollection")
      str += parseSystemCollection(obj, "Links");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#ConnectionCollection.ConnectionCollection")
      str += parseConnectionCollection(obj, "Members");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#MemoryDomain.v1_3_0.MemoryDomain")
      str += parseMemoryDomain(obj, "MemoryChunks");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#MemoryChunksCollection.MemoryChunksCollection")
      str += parseMemoryChunksCollection(obj, "Members");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#MemoryChunks.v1_4_1.MemoryChunks")
      str += parseMemoryChunks(obj, "Name");
    else if (itemA == "@odata.type" &&  
	    obj[itemA] == "#Connection.v1_1_0.Connection")
      str += parseConnection(obj, "Name");
    else
      str += "";
  });
  object.innerHTML = str;
}

function showError(message, str) {
  message.innerHTML =
    '<p class="error">OFMF - Failed to connect.</p>' +
    "<p>" + str + "</p>" +
    "<p><b>Please try again.</b></p>";
  clearSession();
}

function loadDoc(page) {
  var xhttp = new XMLHttpRequest();
  var auth = sessionStorage.ofmf_auth;
  var url = "http://";
  var typ = $("#objectType").html();
  var obj = $("#objectValue").html();
  var filter = $("#filter").html();
  var cur_page;

  xhttp.onreadystatechange = function() {
    var cur_page;

    if (this.readyState != 4)
      return;

    message = document.getElementById("loginMessage");

    if (typ == "ofmf")
      cur_page = document.getElementById("contentPage");
    else if (obj == "")
      cur_page = document.getElementById("listPage");
    else
      cur_page = document.getElementById("detailPage");

    if (this.status == 200) {
      if ($("#addrForm").is(":visible")) {
        $("#addrForm").hide();
        $("#contentPage").show();
        $("#menu").show();
      } else if (cur_page == document.getElementById("contentPage")) {
        $("#contentPage").show();
        $("#menu").show();
      } else {
        $("#contentPage").hide();
        $("#listPage").hide();
        $("#detailPage").hide();
        $("#menu").show();
        if (typ == "ofmf")
          $("#contentPage").show();
        else if (obj == "")
          $("#listPage").show();
        else
          $("#detailPage").show();
      }

      if (this.responseText[0] == '{')
        parseJSON(this.responseText, cur_page);
      else if (page.substring(page.length - 7) == "logpage")
        cur_page.innerHTML += "<div class='logpages'>"
                           + this.responseText + "</div>";
      else
        cur_page.innerHTML = this.responseText;

      $("#form input[name=pswd]").val("");
      message.innerHTML = "<p><b>Please Login.</b></p>";
    } else if (this.status == 0)
      showError(message,
                "OFMF - Managment server is not responding.");
    else if (this.status == 403)
      showError(message, "Invalid user id and/or password.");
    else
      cur_page.innerHTML =
        "Error " + this.status + " : " + this.responseText;
  };
  xhttp.onerror = function () {
    console.log(xhttp.responseText);
  };

  if (sessionStorage.ofmf_addr == "" || sessionStorage.ofmf_port == "") {
    showError(message, "Invalid user id and/or password.");
    return;
  }

/*raj  url += sessionStorage.ofmf_addr + ":" + sessionStorage.ofmf_port + "/";*/
  url += sessionStorage.ofmf_addr + "/" + "redish/v1/";

  $("#parentUri").html(page);
  $("#renamedUri").html("");

  if (typ != "ofmf") {
    if (obj == "")
      page = typ + filter;
    else if (typ == "connections")
      page = page;	  
    else	    
      page = typ + "/" + page;
  }

  if(page == "Connections" || page == "connections")
	page = "Fabrics/GenZ/Connections";

  xhttp.open("GET", url + page, true);
  xhttp.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader('Authorization', auth);
  xhttp.send();

  if (location.hash != "#" + page) {
    document.title = "OFMF - " + page;
    // cache the html in the state
    var state = {
      'title': document.title,
      'html': page,
    };
    window.history.pushState(state, typ, "#" + page);
  }
}

function checkAddress() {
    if (typeof(Storage) != "undefined") {
        if (sessionStorage.ofmf_addr == null ||
            sessionStorage.ofmf_addr == "undefined") {
            $("#addrForm").show();
            $("#user").focus();
        } else {
            $("#loginMessage").html("<p>Connecting</p>");
            showContents("ofmf");
        }
    } else
        $("#notSupported").show();
}

function openDialog(str, verb, uri) {
  $("#editVerb").html(verb);
  $("#editUri").html(uri);

  str += "<p id='err'></p>";

  document.getElementById("editPage").style.width = "100%";
  $("#editForm").keyup(function (e) {
    if (e.key === "Enter")
      closeDialog(true);
    if (e.key === "Escape")
      closeDialog(false);
  });
  window.setTimeout(function() {
    $("#editForm").html(str);
    if ($("#alias").length)
      $("#alias").focus().select();
    else if ($("#nsid").length)
      $("#nsid").focus().select();
    else if ($("#portid").length)
      $("#portid").focus().select();
    else if ($("#subnqn").length)
      $("#subnqn").focus().select();
    else if ($("#group").length)
      $("#group").focus().select();
    }, 400);
}

function validateForm() {
  var field;
  var badfield;
  var fam;
  var name;
  var str = "";

  if ($("#alias").is(":visible")) {
    field = $("#alias");
    name = field.val();
    if (!validateAlias(name)) {
      str += "<p>Invalid Alias: must be 1 - 64 characters, ";
      str += " valid characters are alphanumerics";
      str += " plus the following special characters # < > _ : . -";
      if (badfield == undefined) badfield = field;
    }
    fam = $("#objectType").html() + "/" + $("#objectValue").html();
    if (name != $("#parentUri").html() && fam == $("#editUri").html())
      $("#renamedUri").html(name);
    fam = undefined;
  }
  if ($("#group").is(":visible")) {
    field = $("#group");
    name = field.val();
    if (!validateAlias(name)) {
      str += "<p>Invalid Group name: must be 1 - 64 characters, ";
      str += " valid characters are alphanumerics";
      str += " plus the following special characters # < > _ : . -";
      if (badfield == undefined) badfield = field;
    }
    if (name != $("#parentUri").html())
      $("#renamedUri").html(name);
  }
  if ($("#oob_data").is(":visible")) {
    field = $("#oob_adr");
    fam = $("#oob_fam").val();
    if (fam == "ipv4") {
      if (!validateIPv4(field.val())) {
        str += "<p>Invalid IPv4 address: must be format is x.x.x.x ";
        str += " where values are decimal numbers from 0 to 255";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "ipv6") {
      if (!validateIPv6(field.val())) {
        str += "<p>Invalid IPv6 address: must be format is x:x:x:x:x:x ";
        str += " where values may be omitted or hex numbers from 0 to FFFF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "fc") {
      if (!validateFC(field.val())) {
        str += "<p>Invalid FC address:";
        str += " must be format is xx:xx:xx:xx:xx:xx:xx:xx ";
        str += " where values may be omitted or hex numbers from 00 to FF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else {
      field = $("#oob_fam");
      str += "<p>Invalid Address Family. Please select from ipv4, ipv6, or fc";
      if (badfield == undefined) badfield = field;
    }
    if ($("#oob_port").is(":visible") && $("#oob_port").val() == "") {
      field = $("#oob_port");
      str += "<p>Invalid RESTful Port number."
      str += " Please specify the RESTful port number to use.";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#inb_data").is(":visible")) {
    field = $("#inb_adr");
    fam = $("#inb_fam").val();
    if (fam == "ipv4") {
      if (!validateIPv4(field.val())) {
        str += "<p>Invalid IPv4 address: must be format is x.x.x.x ";
        str += " where values are decimal numbers from 0 to 255";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "ipv6") {
      if (!validateIPv6(field.val())) {
        str += "<p>Invalid IPv6 address: must be format is x:x:x:x:x:x ";
        str += " where values may be omitted or hex numbers from 0 to FFFF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "fc") {
      if (!validateFC(field.val())) {
        str += "<p>Invalid FC address:";
        str += " must be format is xx:xx:xx:xx:xx:xx:xx:xx ";
        str += " where values may be omitted or hex numbers from 00 to FF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else {
      field = $("#inb_fam");
      str += "<p>Invalid Address Family. Please select from ipv4, ipv6, or fc";
      if (badfield == undefined) badfield = field;
    }
    if ($("#inb_typ").val() == "") {
      field = $("#inb_typ");
      str += "<p>Invalid Fabric Type. Please select from rdma, tcp, or fc";
      if (badfield == undefined) badfield = field;
    }
    if ($("#inb_typ").val() == "fc" && fam != "fc") {
      field = $("#inb_fam");
      str += "<p>Invalid Address Family. Please select 'fc' for Family";
      str += " when Fabric is Fiber Channel.";
      if (badfield == undefined) badfield = field;
    }
    if ($("#inb_typ").val() != "fc" && fam == "fc") {
      field = $("#inb_fam");
      str += "<p>Invalid Address Family. Please select 'ipv4 or ipv6 for";
      str += " Family when Fabric is not Fiber Channel.";
      if (badfield == undefined) badfield = field;
    }
    if ($("#inb_svc").is(":visible") && $("#inb_svc").val() == "") {
      field = $("#inb_svc");
      str += "<p>Invalid Transport Service ID."
      str += " Please specify the transport service ID to use.";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#typ").is(":visible")) {
    field = $("#adr");
    fam = $("#fam").val();
    if (fam == "ipv4") {
      if (!validateIPv4(field.val())) {
        str += "<p>Invalid IPv4 address: must be format is x.x.x.x ";
        str += " where values are decimal numbers from 0 to 255";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "ipv6") {
      if (!validateIPv6(field.val())) {
        str += "<p>Invalid IPv6 address: must be format is x:x:x:x:x:x ";
        str += " where values may be omitted or hex numbers from 0 to FFFF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else if (fam == "fc") {
      if (!validateFC(field.val())) {
        str += "<p>Invalid FC address:";
        str += " must be format is xx:xx:xx:xx:xx:xx:xx:xx ";
        str += " where values may be omitted or hex numbers from 00 to FF";
        str += " (either upper of lower case hex is valid)";
        if (badfield == undefined) badfield = field;
      }
    } else {
      field = $("#fam");
      str += "<p>Invalid Address Family. Please select from ipv4, ipv6, or fc";
      if (badfield == undefined) badfield = field;
    }
    if ($("#typ").val() == "") {
      field = $("#typ");
      str += "<p>Invalid Fabric Type. Please select from rdma, tcp, or fc";
      if (badfield == undefined) badfield = field;
    }
    if ($("#typ").val() == "fc" && fam != "fc") {
      field = $("#fam");
      str += "<p>Invalid Address Family. Please select 'fc' for Family";
      str += " when Fabric is Fiber Channel.";
      if (badfield == undefined) badfield = field;
    }
    if ($("#typ").val() != "fc" && fam == "fc") {
      field = $("#fam");
      str += "<p>Invalid Address Family. Please select 'ipv4 or ipv6 for";
      str += " Family when Fabric is not Fiber Channel.";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#svc").is(":visible") && $("#svc").val() == "") {
    field = $("#svc");
    str += "<p>Invalid Transport Service ID."
    str += " Please specify the transport service ID to use.";
    if (badfield == undefined) badfield = field;
  }
  if ($("#subnqn").is(":visible")) {
    field = $("#subnqn");
    if (!validateNQN(field.val())) {
      str += "<p>Invalid Subsystem NQN: must be 6 - 128 characters,";
      str += " valid characters are alphanumerics";
      str += " plus the following special characters @ + _ : . -";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#hostnqn").is(":visible")) {
    field = $("#hostnqn");
    if (!validateNQN(field.val())) {
      str += "<p>Invalid Host NQN: must be 6 - 128 characters, ";
      str += " valid characters are alphanumerics";
      str += " plus the following special characters @ + _ : . -";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#portid").is(":visible")) {
    field = $("#portid");
    if (field.val() == "") {
      str += "<p>Port ID must be provided";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#nsid").is(":visible")) {
    field = $("#nsid");
    if (field.val() == "") {
      str += "<p>Namespace ID must be provided";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#devid").is(":visible")) {
    field = $("#devid");
    if (field.val() == "" || field.val() < -1) {
      str += "<p>Invalid Device ID, >= 0 for actual nvme device,";
      str += " -1 for nullb0";
      if (badfield == undefined) badfield = field;
    }
  }
  if ($("#devnsid").is(":visible")) {
    field = $("#devnsid");
    if ((field.val() == "" && $("#devid").val() != -1) ||
      (field.val() < 0)) {
      str += "<p>Invalid Device Namespace ID, must be provided";
      str += " if Device ID is >= 0";
      if (badfield == undefined) badfield = field;
    }
  }

  if (badfield != undefined) {
    $("#err").html(str);
    badfield.focus();
    badfield.select();
    return false;
  }

  return true;
}

function closeDialog(execute) {
  var page = $("#editUri").html();

  $("#err").html("");

  if (execute) {
    if (!validateForm())
      return;

    if (!sendRequest())
      return;

    if (page.substring(page.length-8) == "/refresh")
      $(".logpages").remove();

    $("#parentargs").html("");
  }

  document.getElementById("editPage").style.width = "0%";
  $("#editVerb").html("");
  $("#editUri").html("");
  window.setTimeout(function() { $("#editForm").html(""); }, 80);
}

function buildOfmfJSON(url) {
  var str = "";
  if(url == "memorydomains") {
     str += buildMemdomains(url);
  }
  return str;
}

function buildMemdomains(url) {
  var str = '{';
  str += '"Members": [ { "@odata.id": /redfish/v1/Chassis/1/MemoryDomains/';
  str += $("#memdomainid").val() + '" }';
  return str;
}

function buildJSON(url) {
  var str = '{';

  if ($("#hostnqn").length)
    str += '"Alias":"' + $("#alias").val() + '",' +
           '"HOSTNQN":"' + $("#hostnqn").val() + '"';
  else if ($("#group").length)
    str += '"Name":"' + $("#group").val() + '"';
  else if ($("#refresh").length) {
    str += '"Alias":"' + $("#alias").val() + '"';
    if ($("#refresh").val() != "")
      str += ',"Refresh":' + $("#refresh").val();
    if ($("#mode").val() == "oob") {
      str += ',"MgmtMode":"OutOfBandMgmt"';
      str += ',"Interface":{';
      if ($("#oob_fam").val() != "")
        str += '"FAMILY":"' + $("#oob_fam").val() + '",' +
               '"ADDRESS":"' + $("#oob_adr").val() + '",' +
               '"PORT":' + $("#oob_port").val();
      str += '}';
    } else if ($("#mode").val() == "inb") {
      str += ',"MgmtMode":"InBandMgmt"';
      str += ',"Interface":{';
      if ($("#inb_typ").val() != "")
        str += '"TRTYPE":"' + $("#inb_typ").val() + '",' +
	       '"ADRFAM":"' + $("#inb_fam").val() + '",' +
               '"TRADDR":"' + $("#inb_adr").val() + '",' +
               '"TRSVCID":' + $("#inb_svc").val();
      str += '}';
    } else
      str += ',"MgmtMode":"LocalMgmt"';
  } else if ($("#allowany").length) {
    str += '"SUBNQN":"' + $("#subnqn").val() + '","AllowAnyHost":';
    if ($("#allowany").is(':checked'))
      str += "1";
    else
      str += "0";
  } else if ($("#devid").length)
    str += '"NSID":' + $("#nsid").val() + ',' +
           '"DeviceID":' + $("#devid").val() + ',' +
           '"DeviceNSID":' + $("#devnsid").val();
  else if ($("#nslst").length) {
    var value = $("#nslst").val();
    var fields = value.split(" ");
    str += '"NSID":' + $("#nsid").val() + ',' + '"DeviceID":' + fields[1];
    if (fields[1] != -1) str += ',' + '"DeviceNSID":' + fields[2];
  } else if ($("#iflst").length) {
    var value = $("#iflst").val();
    var fields = value.split(" ");
    str += '"PORTID":' + $("#portid").val() + ',' +
           '"TRTYPE":"' + fields[1] + '",' +
           '"ADRFAM":"' + fields[2] + '",' +
           '"TRADDR":"' + fields[3] + '",' +
           '"TRSVCID":' + $("#svc").val();
  } else if ($("#portid").length)
    str += '"PORTID":' + $("#portid").val() + ',' +
           '"TRTYPE":"' + $("#typ").val() + '",' +
           '"ADRFAM":"' + $("#fam").val() + '",' +
           '"TRADDR":"' + $("#adr").val() + '",' +
           '"TRSVCID":' + $("#svc").val();
  else if ($("#typ").length)
    str += '"TRTYPE":"' + $("#typ").val() + '",' +
           '"ADRFAM":"' + $("#fam").val() + '",' +
           '"TRADDR":"' + $("#adr").val() + '",' +
           '"TRSVCID":' + $("#svc").val();
  else if ($("#alias").length)
    str += '"Alias":"' + $("#alias").val() + '"';
  else if ($("#oldpswd").val().length) {
    str += '"OLD":"' + sessionStorage.getItem("dem_auth").substring(6) + '",';
    str += '"NEW":"' + $("#objectValue").html() + '"';
  }

  str += "}";

  return str;
}

function sendRequest() {
  var xhttp = new XMLHttpRequest();
  var auth = sessionStorage.dem_auth;
  var url = "http://";
  var verb = $("#editVerb").html();
  var page = $("#editUri").html();

  $("#post_err").html("");

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status != 200)
      if (this.responseText.substring(0, 5) == "ALERT")
         window.alert(this.responseText);
      else
         $("#post_err").html("Error " + this.status + " : " +
                             this.responseText);
  };
  xhttp.onerror = function () {
    console.log(xhttp.responseText);
  };

//raj  url += sessionStorage.ofmf_addr + ":" + sessionStorage.ofmf_port + "/";
  url += sessionStorage.ofmf_addr + "/";

  xhttp.open(verb, url + page, false);
  xhttp.setRequestHeader("Content-type", "text/plain; charset=UTF-8");
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.setRequestHeader('Authorization', auth);
  if ((verb == "DELETE") || ((verb == "POST") &&
       ((page.substring(page.length-9) == "/reconfig") ||
        (page.substring(page.length-8) == "/refresh"))))
    xhttp.send();
  else
/*raj    xhttp.send(buildJSON(page)); */
    xhttp.send(buildOfmfJSON(page));

  if ($("#post_err").html().substring(0,5) != "Error") {
    if ($("#objectValue").html() == "" || $("#renamedUri").html() == "")
      page = $("#parentUri").html();
    else {
      page = $("#renamedUri").html();
      $("#renamed").html("1");
      $("#objectValue").html(page);
    }

    if (page == "reset")
      clearSession();
    else
      loadDoc(page);

    return true;
  }

  if ($("err") != undefined)
    $("#err").html($("#post_err").html());
  else
    alert($("#post_err").html());

  return false;
}

function saveVal(str) {
    $("#args").html(str);
}

function validateIPv4(addr) {
  var pattern = /^(([0-9]{1,2}|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5])[.]){3}([0-9]{1,2}|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return pattern.test(addr);
}

function validateIPv6(addr) {
  var pattern = /^([0-9a-fA-F]{0,4}[:]){5}[0-9a-fA-F]{0,4}$/;
  return pattern.test(addr);
}

function validateFC(addr) {
  var pattern = /^([0-9a-fA-F]{2}[:]){7}[0-9a-fA-F]{2}$/;
  return pattern.test(addr);
}

function validateAlias(str) {
  var pattern = /^[0-9a-zA-Z#<>_:.-]{1,64}$/;
  return pattern.test(str);
}

function validateNQN(str) {
  var pattern = /^[0-9a-zA-Z@+_:.-]{6,128}$/;
  return pattern.test(str);
}
