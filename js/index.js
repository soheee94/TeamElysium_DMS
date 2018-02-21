"use strict"

window.onload = () => {	
	getCategory1();
}

let getCategory1 = () => {
	let category1 = document.getElementById("category1");
    let selectC1 = document.getElementById("selectC1");

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory1.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
        		let list = document.createElement("li");
        		list.setAttribute("id", value.code);
        		list.setAttribute("onClick", "getCateogry2(this.id)");
        		list.textContent = value.name;

        		category1.appendChild(list);

                let option = document.createElement("option");
                option.textContent = value.name;
                option.setAttribute("value", value.code);

                selectC1.appendChild(option);
        	}
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}


let getCateogry2 = id => {
	let selectCategory1 = document.getElementById(id);
	selectCategory1.classList.add("selection");
	$("#"+id).siblings().removeClass("selection");

	let category2 = document.getElementById("category2");
	$("#category2").empty();
	$("#category3").empty();
	$("#documentList").empty();

	let data = {code : id};

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory2.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
        		let list = document.createElement("li");
        		list.setAttribute("id", value.code);
        		list.setAttribute("onClick", "getCateogry3(this.id)");
        		list.textContent = value.name;

        		category2.appendChild(list);
        	}
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let getCateogry3 = id => {
	let selectCategory2 = document.getElementById(id);
	selectCategory2.classList.add("selection");
	$("#"+id).siblings().removeClass("selection");

	let category3 = document.getElementById("category3");
	$("#category3").empty();
	$("#documentList").empty();
	
	let data = {code : id};

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory3.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
        		let list = document.createElement("li");
        		list.setAttribute("id", value.code);
        		list.setAttribute("onClick", "getDocumentList(this.id)");
        		list.textContent = value.name;

        		category3.appendChild(list);
        	}
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let getDocumentList = id => {
	let selectCategory3 = document.getElementById(id);
	selectCategory3.classList.add("selection");
	$("#"+id).siblings().removeClass("selection");

	let documentList = document.getElementById("documentList");
	$("#documentList").empty();
	
	let data = {code : id};

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getDocumentList.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
        		let list = document.createElement("li");
        		list.setAttribute("id", value.code);
                list.setAttribute("onClick", "selectDocument(this.id)");
                list.setAttribute("data-file", value.encodefilename);
                list.setAttribute("data-c3code", value.c3_code);
                list.setAttribute("class", "task");
        		list.textContent = value.name;

        		let downloadbtn = document.createElement("button");
        		downloadbtn.textContent = "다운로드";
        		downloadbtn.setAttribute("class", "btn btn-primary btn-sm");
        		downloadbtn.setAttribute("id", value.filename)
        		downloadbtn.setAttribute("onClick", "downloadDocument(this.id)");
        		downloadbtn.setAttribute("style", "float:right; height:20px; padding:0; font-size : 0.5em;")

        		list.appendChild(downloadbtn);
        		documentList.appendChild(list);
        	}

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let selectDocumentid;

let selectDocument = id => {
    selectDocumentid = document.getElementById(id);
    selectDocumentid.classList.add("selection");
    $("#"+id).siblings().removeClass("selection");
}

let deleteDocument = () => {
    if(confirm("'"+selectDocumentid.textContent.replace("다운로드","") + "' 을(를) 정말 삭제하시겠습니까?")){
        let id = selectDocumentid.id;
        let filename = selectDocumentid.getAttribute("data-file");
        let c3code = selectDocumentid.getAttribute("data-c3code");

        let data = {code : id, filename : filename};

        $.ajax({
            url: 'http://igrus.mireene.com/php/dms_php/deletefile.php',
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function(data) {
                alert("삭제가 완료되었습니다.");
                getDocumentList(c3code);
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }
}

let downloadDocument = filename => {
    window.location.href = "http://igrus.mireene.com/medical_document/" + filename;
}

let getselectC2 = () => {
    let selectC2 = document.getElementById("selectC2");
    let selectC1 = document.getElementById("selectC1");
    let id = selectC1.options[selectC1.selectedIndex].value;

    // $("#selectC2").empty();
    // $("#selectC3").empty();

    let data = {code : id};

    $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory2.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
            for(let value of data){
                let option = document.createElement("option");
                option.setAttribute("value", value.code);
                option.textContent = value.name;

                selectC2.appendChild(option);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let getselectC3 = () => {
    let selectC2 = document.getElementById("selectC2");
    let selectC3 = document.getElementById("selectC3");
    let id = selectC2.options[selectC2.selectedIndex].value;

    // $("#selectC3").empty();

    let data = {code : id};

    $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory3.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
            for(let value of data){
                let option = document.createElement("option");
                option.setAttribute("value", value.code);
                option.textContent = value.name;

                selectC3.appendChild(option);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });    
}

//file upload
$("#upload").submit(function(e) {
    e.preventDefault();    
    let formData = new FormData(this);

    let filecnt = document.getElementById('fileselect').files.length;
    let c3code = document.getElementById("selectC3").value;

    if(c3code !== "" && filecnt !== 0){
        formData.append('c3_code', c3code);

        let status = document.createElement("i");
        status.setAttribute("class", "fas fa-spinner fa-pulse statusicon");
        status.style["margin-top"] = "8px";

        $(".status").append(status);

        $.ajax({
            url: 'http://igrus.mireene.com/php/dms_php/savefile.php',
            type: 'POST',
            data: formData,
            success: function (data) {
                let dataStatus = data.split("\n");
                for(let i=0; i<dataStatus.length-1; i++){
                    let status = document.createElement("i");

                    if (dataStatus[i] === "존재하는 이름입니다.") {
                        $("#fileindex"+i).switchClass("primary", "danger"); 
                        status.setAttribute("class", "fas fa-times statusicon");

                        let div4 = document.createElement("div");
                        div4.setAttribute("class", "feedback");
                        div4.textContent = "이미 존재하는 문서이름입니다.";

                        document.getElementById("fileindex"+i).appendChild(div4);
                    }
                    else{
                        $("#fileindex"+i).switchClass("primary", "success");
                        status.setAttribute("class", "fas fa-check statusicon");
                    }
                    status.style["margin-top"] = "8px";  
                    $("#fileindex"+i+" .statusicon").remove();
                    $("#fileindex"+i+" .status").append(status);
                }

                return false;
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    else if(filecnt === 0){
        alert("파일을 첨부해주세요.");
    }
    else{
        alert("분류를 선택해주세요.");
    }

});

// drag drop upload files
// getElementById
function $id(id) {
    return document.getElementById(id);
}

// call initialization file
if (window.File && window.FileList && window.FileReader) {
    Init();
}

//
// initialize
function Init() {

    var fileselect = $id("fileselect");
    var filedrag = $id("filedrag");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {    
        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
    }

}


// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}


// file selection
function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++) {
        ParseFile(f, i);
    }
}


let ParseFile = (file, index) => {
    let filelist = $id("filelistul");

    let li = document.createElement("li");
    li.setAttribute("class", "row primary");
    li.setAttribute("id", "fileindex"+index);

    let div1 = document.createElement("div");
    div1.setAttribute("class", "col-md-2");

    let circle = document.createElement("i");
    circle.setAttribute("class", "far fa-circle fa-2x");
    circle.style["margin-top"] = "8px";

    let circlenumber = document.createElement("span");
    circlenumber.setAttribute("class", "fa-layers-text");
    circlenumber.setAttribute("data-fa-transform", "left-2 down-1");
    circlenumber.style["font-weight"] = "900";
    circlenumber.textContent = filelist.getElementsByTagName("li").length + 1;

    div1.appendChild(circle);
    div1.appendChild(circlenumber);
    li.appendChild(div1);

    let div2 = document.createElement("div");
    div2.setAttribute("class", "col-md-8");

    let filename = document.createElement("p");
    filename.setAttribute("class", "filename");
    filename.textContent = file.name;

    if(file.name.length > 22){
        filename.textContent = file.name.substr(0,19) + "…";
    }

    let filesize = document.createElement("p");
    filesize.setAttribute("class", "filesize");
    filesize.textContent = convertFileSize(file.size);

    div2.appendChild(filename);
    div2.appendChild(filesize);
    li.appendChild(div2);

    let div3 = document.createElement("div");
    div3.setAttribute("class", "col-md-2 status");

    li.appendChild(div3);
    filelist.appendChild(li);
}

let convertFileSize = x => {
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(x) / Math.log(1024));
  return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
};

let versionManagementOpen = id => {
    getDocumentVersionList(id);
    $("#versionManagementModal").modal();
}

let getDocumentVersionList = id => {
    let versionList = document.getElementById("versionListUl");
    $("#versionListUl").empty();
    let data = {code : id};
    
     $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getDocumentVersionList.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
            
            for(let value of data){
                let li = document.createElement("li");
                li.setAttribute("class", "row");

                let div1 = document.createElement("div");
                div1.setAttribute("class", "col-md-1 fawrapper");

                let fileicon = document.createElement("i");
                fileicon.setAttribute("class", "fas fa-file");
                fileicon.style["color"] = "#0069d9";
                fileicon.style["align-self"] = "center";

                div1.appendChild(fileicon);

                let div2 = document.createElement("div");
                div2.setAttribute("class", "col-md-10");

                let filewrapper = document.createElement("p");
                
                let versionName = document.createElement("span");
                let versionText = "";
                if(value.version === "0"){
                    versionText = "현재 버전";
                }
                else{
                    versionText = "버전 " + value.version;
                }
                versionName.textContent = versionText;
                versionName.style["margin-right"] = "8px";

                let versionFileName = document.createElement("span");
                versionFileName.setAttribute("class", "versionFileName");
                versionFileName.textContent = value.encodefilename;

                filewrapper.appendChild(versionName);
                filewrapper.appendChild(versionFileName);
                div2.appendChild(filewrapper);

                let versionRegistrant = document.createElement("p");
                versionRegistrant.setAttribute("class", "versionRegistrant");
                versionRegistrant.textContent = value.registrant;

                div2.appendChild(versionRegistrant);

                let div3 = document.createElement("div");
                div3.setAttribute("class", "col-md-1 fawrapper dropdown");
                div3.setAttribute("id", "dropdownMenuButton");
                div3.setAttribute("data-toggle", "dropdown");
                div3.setAttribute("aria-haspopup", "true");
                div3.setAttribute("aria-expanded", "false");

                let downloadbtn = document.createElement("i");
                downloadbtn.setAttribute("class", "fas fa-ellipsis-v");
                downloadbtn.style["align-self"] = "center";

                div3.appendChild(downloadbtn);

                let dropdown = document.createElement("div");
                dropdown.setAttribute("class", "dropdown-menu");
                dropdown.setAttribute("aria-labelledby", "dropdownMenuButton");

                let dropdownitem = document.createElement("a");
                dropdownitem.setAttribute("class", "dropdown-item");
                dropdownitem.setAttribute("href", "#");

                let fadownload = document.createElement("i");
                fadownload.setAttribute("class", "fas fa-download");

                let textdownload = document.createElement("span");
                textdownload.textContent = "다운로드";
                textdownload.style["margin-left"] = "10px";

                dropdownitem.appendChild(fadownload);
                dropdownitem.appendChild(textdownload);
                dropdown.appendChild(dropdownitem);

                li.appendChild(div1);
                li.appendChild(div2);
                li.appendChild(div3);
                li.appendChild(dropdown);

                versionList.appendChild(li);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });  
}


////////////////////////////////////
///context menu/////////////////////
////////////////////////////////////

function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }

  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }


  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "task";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  /**
   * Initialise our application's code.
   */
  function initcontextmenu() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

      if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
   * Positions the menu properly.
   * 
   * @param {Object} e The event
   */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   * 
   * @param {HTMLElement} link The link that was clicked
   */
  function menuItemListener( link ) {
    versionManagementOpen(taskItemInContext.getAttribute("id"));
    toggleMenuOff();
  }

  /**
   * Run the app.
   */
  initcontextmenu();