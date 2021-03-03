//regex for manual time entry: ^(([0-9]?[0-9]):)?([0-5]?[0-9]):([0-5]?[0-9])(.[0-9]?[0-9]?[0-9])?$
//regex for video link (turns out there's a data validation for links): ^.*[a-zA-Z0-9]\.[a-zA-Z].*$

//string.autoLink
//https://github.com/bryanwoods/autolink-js/blob/master/autolink.js
(function(){var k=[].slice;String.prototype.autoLink=function(){var d,b,g,a,e,f,h;e=1<=arguments.length?k.call(arguments,0):[];f=/(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;if(!(0<e.length))return this.replace(f,"$1<a href='$2'>$2</a>");a=e[0];d=a.callback;g=function(){var c;c=[];for(b in a)h=a[b],"callback"!==b&&c.push(" "+b+"='"+h+"'");return c}().join("");return this.replace(f,function(c,b,a){c=("function"===typeof d?d(a):
void 0)||"<a href='"+a+"'"+g+">"+a+"</a>";return""+b+c})}}).call(this);

var CATEGORIES = []; //gets the category list from sheet 2 of the spreadsheet
var SHOWGLOBAL = [];
var CATEGORYRULES = [];
var GLOBALRULES = "";
var FIELDSTODISPLAY = ["Place", "Username", "Time", "Date", "Proof"]; //keep this hardcoded
var categoryObjs = new Map();
var runs = [];

var EMBEDWIDTH = "75%";
var EMBEDHEIGHT = "500";

class CategoryObject {
  constructor(btn, div, table) {
    this.btn = btn;
    this.div = div;
    this.table = table;

    // used for keeping track of Place
    this.placeInt = 0;
    // for ties
    this.placeIncrement = 1;
    this.currTime = "";
    this.foundNames = new Set();
  }

  add(run) {
    //only one run displayed per username per category
    if (this.foundNames.has(run.Username.toLowerCase()))
      return;
    this.foundNames.add(run.Username.toLowerCase());

    // figure out this run's place, accounting for ties
    if (run.Time === this.currTime) {
      this.placeIncrement++;
    } else {
      this.placeInt += this.placeIncrement;
      this.placeIncrement = 1;
      this.currTime = run.Time;
    }

    formatRun(run, this.placeInt);

    let tr = this.table.insertRow();
    tr.className = "place" + this.placeInt;

    for (let field of FIELDSTODISPLAY) {
      let td = tr.insertCell();
      td.textContent = run[field];
    }

    // hover comment
    tr.title = run.Comments;

    //dropdown collapsible content. put it in its own tr/td
    let divtr = this.table.insertRow();
    divtr.className = "divtr";

    let divtd = divtr.insertCell();
    divtd.className = "divtr";
    divtd.colSpan = "999";

    let div = document.createElement('div');
    div.className = "content";
    divtd.appendChild(div);

    tr.onclick = function() {
      if (div.style.maxHeight){
        //slide back up
        div.style.maxHeight = null;
        //we don't want the embeds staying in existence
        div.ontransitionend = function() {
          div.textContent = "";
        }
      } else {
        //slide it out, fill the div with its text
        createDropdown(div,run);
        div.style.maxHeight = div.scrollHeight + "px";

        //we don't want the newly slid out thing to be off the bottom of the screen
        div.ontransitionend = function() {
        let bottompx = div.getBoundingClientRect().top + div.clientHeight;
        if (bottompx > window.innerHeight)
          window.scrollBy({
            top: bottompx-window.innerHeight+25,
            left: 0,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  setEnabled(bool) {
    if (bool) {
      this.btn.classList.add("button-selected");
      this.btn.classList.remove("button-unselected");
      this.div.classList.remove("no-display");
    } else {
      this.btn.classList.remove("button-selected");
      this.btn.classList.add("button-unselected");
      this.div.classList.add("no-display");
    }
  }
}

var srcomcats = { "q25oryvk": "Get Laid", "q25e7rv2": "Get Laid With Kyu", "wk6pm7qd": "Unlock Venus",
"9d80v62n": "All Panties", "zdn4mlxk": "100%" }

var srcomvars = { "jq68mvlm":"Easy","5lm7y8lv":"Normal","81w6gml4":"Hard","jq60v6nq":"Easy","5lmk20yq":"Hard",
"81wp7x9q":"Easy","zqopj6g1":"Hard","mlnwej6l":"Easy","810z6kjq":"Hard" }

var srcomusers = { "zxzlp08q": "TwinkieSWF","48gewpjp": "Zibang","v81zpljp": "Pumpkin","98rerdx1": "DJSALTYNUTZ","y8d3wmx6": "RebelWatt","qxkqw6x0": "Sly1020","zx7690j7": "YaBoyBTrue","0jmepex1": "Goglabesh","pj0rzwjw": "Zetrile","qj244n8k": "Gelarshi3150","v8l1yrjm": "Wolff","dx3m1k8l": "Blazephlozard","7j4rq5v8": "Sm_Izumi","y8dgmg86": "Avetixz","7j4k05x1": "Hostile","7j4rgql8": "GldnUnicorn","kjprd6y8": "LavenderCourage","68wk6dl8": "Nanashi","v81n3ljp": "Gamingnerd","qjn3wl2x": "jonnyfire","y8dwkg5j": "7ife","kj929pw8": "NikkoNikkoSushi","18qz49q8": "fillyy_","zx7mpvx7": "quo","w98rqqx1": "TOTOzigemm","48grz12x": "crashingacastle","zx7273r8": "pod7","48ged91j": "perpetucake","zxz72o9j": "SussLady","kj96deoj": "Garrett","qjnznl2j": "makeshiftreaper","qjn9zgqx": "Zaba","5j5vkmg8": "Ryah","0jmldon8": "modz24","0jmlo2y8": "ninja_muffin99","0jmlg4o8": "4seanah","qxk3ez98": "McMelchior","kj9pk9nx": "CommanderBo","kjp6yny8": "sfrankdaddy","qxko2m78": "DrRaspberry","5j5qo5zj": "TwentyExEx","98r2l9dx": "Alfygator","18v2eryj": "ShiroBlaze","kj9p0n7x": "EdmundCantSpeedRun","18v0k5vx": "tentacion","kjpyk75j": "Djkgund","pj0wkmm8": "7swagmuffin7","98rm03dj": "EVILxoRi","1xymv7vx": "Free","68wloe4j": "gravest0rm","y8de93oj": "Nexxyy","48goq32x": "Denialohyeah","18v791y8": "hatedbyxfinity","kj9yd4ox": "Major_Oddish","48gzn31j": "thisisHod","qj21r4o8": "Eruinah","e8eez928": "Aenderan","zx7ewk68": "hellorooftops","18vm71n8": "OhJoker","98r5563x": "logArythm557","v8l0pqv8": "WaverlyPants","1xy21gz8": "Unhappypanda","5j5emqqj": "pepperpaprica","68wl14vj": "Savin","kj9zg478": "CatTreeDreamCar","zx7e1l08": "DripDrip","y8dpgwo8": "DAN_Gogh","pj0op5rj": "Topaz","18qg73ox": "Personax11","dx3qleej": "ReinGM","48gnmqrj": "Ryusaki50814","y8dy7v98": "CaptainKzonie","o86m6z0j": "Ilmina","kjpgzpyj": "Tribe.NoForce","68wg12qx": "Dedew","qj2574oj": "Vanadium","e8eynrpx": "Lusther","qjovzz3x": "SavedMyEggs","0jmvrkzj": "Mendozerformula","98rvynwj": "Elprocrastino","zx75nkr8": "TyrantsEye","y8d5wlgj": "RenNya","kj9ovpnj": "PillowChrome","qj2zlm7j": "Eliezrt","pj0o203j": "Imperg","kj9m6mox": "TrainyTrain","qxk66p68": "KavMaster","5j5d73n8": "MaxyneCash","0jmoq7o8": "Cat_Overlord","zx7nl008": "NekoKiwi","dx33m6kx": "Mumu_Didi","qjomodex": "YaGurlJen","zxzrymn8": "mothwolf_jr","e8eqz0p8": "Nosavo","0jmgd3ej": "ModiJo","18vmo728": "Tei","xz9m5ye8": "Vixensteal","8gee1e1j": "JXNamor","98r2kd3x": "EduIV","8wkknwv8": "Chodie","5j5629wx": "Caleb39","jpr4mwk8": "AsunaEternity","98rr3238": "RayLmao","8dw4vkoj": "Klepto","0jm94gy8": "poopoopatrol","pj0w9w98": "Sauprix","xko3p7k8": "Scarlet_0","8wk3q9v8": "HaloDva","8l0rnq28": "KingCubone","814my2r8": "BlubberFace","8qzpy5d8": "KingCubbers","8geo1w1j": "HoodieXD","j5wg09wj": "Zaxor09","8e9k72pj": "Boombizzle","1xyw2pn8": "Bantalope","x355326j": "streetbackguy","jmo46wy8": "TheAce513","48glogrx": "VyralGalaxy","kjplyn08": "Ray-Zide","8qzdrro8": "DeltaTDS","dx32dr6j": "stanly191","86vzep3j": "HarriCoco","dx3wno2j": "MelonkeepR","8rpwgrgj": "dick_all_gone","xkoww228": "SibuTV","18vk4r2j": "FrenchPlaty","8l09oz48": "CatoFazbear","xz9e92e8": "Chaos_Sinfora","8v5vmwvj": "goop_granite","x7q5wor8": "CNPO_Fish","8qzlnkd8": "Hukitul","814ldkl8": "EmersonKing","8rpzzodj": "Renotsu","j2wvp4pj": "RowletForSenator","qjor727j": "jkmsr","1xye4nw8": "realgray","8en97p68": "Soks","jnzzdpwj": "LettuceLobster","8wl1ywvj": "Bri311","x35y7m2j": "Educational_Frosting","8qr3yvwj": "ZanDaGames","jp4op42j": "GoomyAP","xkoon378": "MetalVonSexy","zx7n2l08": "sasistion2","x3qwq6kj": "ZedOrigin","xyryqoyj": "BigBun","8d39yylx": "chamberlain","xyr9mqvj": "GriWard","8qr0wp0j": "Tangaroah","x72y6268": "Meladiic","8l4opzvj": "Colonel_Blam","8r7m2ggj": "McFlurry","j2w3donj": "Ember_Cat","8d3pmolx": "BigLemonZest","xyrqwrvj": "ayuyuyu","jp4zy32j": "AtousticPickle","j51pnoq8": "GofriBoi","86n7glwx": "Mommy_Milker","v81nnw3j": "LEGI0N","x7273yr8": "RShields","xk4zzmmj": "JacksonTheGod","j42p6o5x": "MMVman21","8vkyylnj": "gman1432","0jmp044j": "alpharad","48g43378": "DaZdRaPeRmA","j51eqdz8": "kinegra","8d37kwmx": "Zucc_My_Feet","xyr2zpyj": "Jassa","zx70eo0j": "lemondeity","8qzmm5w8": "Phineas_Tentacles","qj2gnko8": "DJTittyFat","8rp90qdj": "OpossumDefense","8r75d6gj": "fishboi87","j51ez168": "kyameranu","8160rmlx": "nighthawk98","8vk9pmvj": "PILLCOLLECTER","j42og6dx": "gengats","jmpy5v4j": "hacks4noobs","8enl9168": "miniyodadude","xk4q159j": "Danyoull" }

window.onload = function() {
	fetchCats(1);
}

function convertTime(seconds) {
	return (new Date(seconds * 1000).toISOString().substr(11, 8)) + (seconds % 1).toFixed(3).toString().replace(/^0+/, '');
}

function getSrcom(url) {
	fetch(url)
      .then(res => res.json())
      .then(function(data) {
		  console.log(data);
		  
		  for (let run of data.data) {
			  if (run.status.status == "verified") {
				  var newrun = {};
				  var categorystring = srcomcats[run.category];
				  for (const [key, value] of Object.entries(run.values)) {
					categorystring += " " + srcomvars[value];
				  }
				  runs.push(newrun);
				  newrun["Category"] = categorystring;
				  newrun["Comments"] = run.comment;
				  newrun["Date"] = run.date;
				  newrun["Username"] = srcomusers[run.players[0].id];
				  console.log(run.times.primary_t);
				  newrun["Time"] = convertTime(run.times.primary_t);
				  newrun["Timenum"] = (run.times.primary_t / (3600*24));
				  if (run.videos != null && run.videos.links != null) {
					  newrun["Proof"] = "Yes";
					  newrun["Proof link"] = run.videos.links[run.videos.links.length-1].uri;
				  }
				  else {
					  newrun["Proof"] = "No";
				  }
				  newrun["Verified"] = "No";
				  console.log(newrun);
				  
				
			  }
		  }
		  
		  if (data.pagination.links[data.pagination.links.length-1].rel == "next") {
			getSrcom(data.pagination.links[data.pagination.links.length-1].uri);
		  }
		  else {
			  runs = runs.sort(sortRuns);
			  populateTables(runs);
		  }
  });
}

function fetchCats(tries) {
  fetch('https://spreadsheets.google.com/feeds/cells/1kl9o-EDJ-9yUYhPAU8FjZ1SVGYb12CUqEHdngcg9Cw0/5/public/full?alt=json')
      .then(res => res.json())
      .then(function(data) {
    parseCategories(data);
    makeTables();
	switchTab(CATEGORIES[0]);
    if (document.location.hash !== "") {
		let hashCat = document.location.hash.split("#")[1].replace(/%20/g," ");
		if (CATEGORIES.indexOf(hashCat) != -1) {
			switchTab(hashCat);
		}
	}
	
	getSrcom('https://www.speedrun.com/api/v1/runs?game=k6qjy9dg&max=200');
  }).catch(function(error) {
    console.log("refetching cats");
    if (tries < 10)
      fetchCats(tries+1);
    else
      document.getElementById("header-div").textContent = "Unable to retrieve the Google Sheets file";
  });
}

function fetchRuns(tries) {
	fetchLink = "https://spreadsheets.google.com/feeds/cells/1kl9o-EDJ-9yUYhPAU8FjZ1SVGYb12CUqEHdngcg9Cw0/4/public/full?alt=json";
	if (document.location.hash === "#test")
		fetchLink = "https://spreadsheets.google.com/feeds/cells/1kl9o-EDJ-9yUYhPAU8FjZ1SVGYb12CUqEHdngcg9Cw0/3/public/full?alt=json";
  fetch(fetchLink)
      .then(res => res.json())
      .then(function(data) {
    runs = parseRuns(data);
    // sort all runs of all categories by Time, we worry about filtering by category later
	// no longer necessary, Sheet #4 is pre-sorted
    //runs = runs.sort(sortRuns);
    populateTables(runs);
  }).catch(function(error) {
    console.log("refetching runs");
    if (tries < 10)
      fetchRuns(tries+1);
    else
      document.getElementById("header-div").textContent = "Unable to retrieve the Google Sheets file";
  });
}

function createDropdown(div,run) {
  let link = run["Proof link"];
  let embedLink = embedCheck(link);

  if (embedLink !== "") {
    div.innerHTML = '<iframe width="' + EMBEDWIDTH + '" height="' + EMBEDHEIGHT + '" src="' + embedLink + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
	div.innerHTML += '<p class="underembed">(<a href="' + link + '">' + link + '</a>)</p>';
  } else if (URLisImage(link)) {
    div.innerHTML = '<img width="' + EMBEDWIDTH + '" height="' + EMBEDHEIGHT + '" onload="resizeImage(this)" src="' + link + '">';
	div.innerHTML += '<p class="underembed">(<a href="' + link + '">' + link + '</a>)</p>';
  } else {
    if (link !== "")
      div.innerHTML = '<br><a href="' + link + '">' + link + '</a>';
    else
      div.innerHTML = "<br>No proof";
  }

  // comment
  let p = document.createElement('p');
  p.className = "comment";
  if (run.Comments !== "") {
	p.textContent = "Comments: " + run.Comments;
	console.log(p.textContent);
	p.innerHTML = p.innerHTML.autoLink();
  }
  else {
	p.textContent = "No comment";
  }
  div.appendChild(p);
}

function resizeImage(img) {
	if (img.naturalHeight < EMBEDHEIGHT) img.height = img.naturalHeight;
}

function embedCheck(runLink) {
  //test for youtu.be and youtube.com
  let ytAttempt = runLink.split("youtu.be/");
  if (ytAttempt.length == 1) ytAttempt = runLink.split("watch?v=");
  if (ytAttempt.length > 1) {
    //extra variables after the ID seem to be fine, but we need to replace the & with a ?, and t=#s with start=#
	//so glad youtube isn't consistent at all with its timecodes
	IDandVars = ytAttempt[1].split(/[\?|&]/g);
	finalString = IDandVars[0] + "?";
	for (i = 1; i < IDandVars.length; i++) {
		finalString += IDandVars[i] + "&";
	}
	finalString = finalString.replace(/([\?|&])t=([0-9]+)s/g,"$1start=$2")
    return ("https://www.youtube.com/embed/" + finalString);
  }

  //test for google drive
  ytAttempt = runLink.split("/file/d/");
  if (ytAttempt.length == 1) ytAttempt = runLink.split("open?id=");
  if (ytAttempt.length > 1) {
    //drive link could be IDididiiddidd/etc, chop off the etc.
    ytAttempt = ytAttempt[1].split("/");
    return ("https://drive.google.com/file/d/" + ytAttempt[0] + "/preview");
  }

  return "";
}

function switchTab(category) {
  for (let categoryObj of categoryObjs) {
    categoryObj[1].setEnabled(categoryObj[0] == category);
  }
}

function makeTables() {
  let mainContainer = document.getElementById("main-container");
  let buttonDiv = document.getElementById("button-div");
  for (let category of CATEGORIES) {
    // button
    let btn = document.createElement('button');
    btn.textContent = category;
    btn.onclick = function() {
      switchTab(category);
	  window.location.href="#" + category;
    };
    buttonDiv.appendChild(btn);

    // containing div
    let div = document.createElement('div');
    div.className = 'category-div';

    //submit run button
    let submitButton = document.createElement('button');
    submitButton.className = 'submit';
    submitButton.textContent = "Submit Run";
    submitButton.onclick = function() {
      d = new Date();
      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }
      dateString = d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate());
      window.location.href="https://docs.google.com/forms/d/e/1FAIpQLSfU2xUfo-qPqPRDmk4L1iIjdq28d03KJmSj1h3bWPtqHGwMBw/viewform?usp=pp_url&entry.1212348438=" + prefillCategory(category) + "&entry.958412694=" + dateString;
    };
    div.appendChild(submitButton);

	// category rules button
	let divrules = document.createElement('div');
    divrules.className = "rulesdiv";
	if (SHOWGLOBAL[category] == "yes") {
		divrules.textContent = GLOBALRULES + "\n" + CATEGORYRULES[category];
	}
	else {
		divrules.textContent = CATEGORYRULES[category];
	}
	console.log(divrules.textContent);
	divrules.innerHTML = divrules.innerHTML.autoLink();
	
	let rulesButton = document.createElement('button');
    rulesButton.className = 'rules';
    rulesButton.textContent = "Category Rules";
    rulesButton.onclick = function() {
    if (divrules.style.maxHeight){
        //slide back up
        divrules.style.maxHeight = null;
      } else {
        //slide it out
        divrules.style.maxHeight = divrules.scrollHeight + "px";
      }
    };
    div.appendChild(rulesButton);

    // category name
    let catName = document.createElement('h2');
    catName.textContent = category;
    div.appendChild(catName);

    // table and header row
    let tbl = document.createElement('table');
    div.appendChild(tbl);

	//dropdown collapsible content. put it in its own tr/td
    let divtr = tbl.insertRow();
    divtr.className = "rulestr";
    let divtd = divtr.insertCell();
    divtd.className = "rulestr";
    divtd.colSpan = "999";
	divtd.appendChild(divrules);

    let tr = tbl.insertRow();
    for (let field of FIELDSTODISPLAY) {
      let th = document.createElement('th');
      th.textContent = field;
      tr.appendChild(th);
    }

    categoryObjs.set(category, new CategoryObject(btn, div, tbl));

    mainContainer.appendChild(div);
  }
}

function parseCategories(data) {
  let entries = data.feed.entry;
  for (let entry of entries) {
	if (entry.gs$cell.col == 1) {
		CATEGORIES.push(entry.gs$cell.inputValue);
	}
  }
}

function parseRuns(data) {
  let entries = data.feed.entry;
  let fields = [];
  let runs = [];

  let currentRow = 0;
  for (let entry of entries) {
    // fill out the fields array from row 1 of the sheet
    if (entry.gs$cell.row == 1) {
      fields[entry.gs$cell.col] = entry.gs$cell.inputValue;
      continue;
    }

    // short names
    row = entry.gs$cell.row;
    col = entry.gs$cell.col;
    input = entry.gs$cell.inputValue;
    num = entry.gs$cell.numericValue;

    // new row = new run
    if (row != currentRow) {
      currentRow = row;
      runs[row-2] = {};
      for (let field of fields) {
        // prefill all the fields, because some are optional but shouldn't be undefined
        if (field != undefined) runs[row-2][field] = "";
      }
    }

    runs[row-2][fields[col]] = input;
    // Times and dates have a raw decimal number form, which is extremely convenient for sorting
    if (num != undefined) {
      runs[row-2][(fields[col]+"num")] = num;
    }
  }
  return runs;
}

function formatRun(run, placeInt) {
  // give the run its Place
  run.Place = formatPlace(placeInt);

  // no Verified value = No
  if (run.Verified === "")
    run.Verified = "No";

  // no Proof link = No
  if (run["Proof link"] === "")
    run.Proof = "No";
  else {
    run.Proof = "Yes";
    //theURL = new URL(run["Proof link"]);
    //run["Proof"] = theURL.hostname;
  }

  // reformat the Time
  run.Time = reformatTime2(run.Time);
}

function populateTables(runs) {
  for (let run of runs) {
    categoryObjs.get(run.Category).add(run);
  }
}

function formatPlace(placeInt) {
  if (placeInt % 10 === 1 && placeInt % 100 !== 11)
    return placeInt + "st";
  else if (placeInt % 10 === 2 && placeInt % 100 !== 12)
    return placeInt + "nd";
  else if (placeInt % 10 === 3 && placeInt % 100 !== 13)
    return placeInt + "rd";
  else
    return placeInt + "th";
}

function reformatTime2(t) {
  return t.replace(/^0(0:0?)?/, '').replace(/\.000$/, '');
}

function sortRuns(a,b) {
  return a.Timenum - b.Timenum;
}

function prefillCategory(catName) {
  return catName.replace("%","%25").replace(" ","+");
}

function sanitize(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

function URLisImage(uri) {
  //make sure we remove any nasty GET params
  uri = uri.split('?')[0];
  //moving on, split the uri into parts that had dots before them
  var parts = uri.split('.');
  //get the last part (should be the extension)
  var extension = parts[parts.length-1];
  //define some image types to test against
  var imageTypes = ['jpg','jpeg','png','gif','webp'];
  //check if the extension matches anything in the list.
  return (imageTypes.indexOf(extension) !== -1)
}
