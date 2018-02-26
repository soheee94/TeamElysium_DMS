"use strict"

window.onload = () => {	
	getCategory1();
}

jQuery(document).ready(function(){
    let accordionsMenu = $('.cd-accordion-menu');

    if( accordionsMenu.length > 0 ) {
        
        accordionsMenu.each(function(){
            let accordion = $(this);
            //detect change in the input[type="checkbox"] value
            accordion.on('change', 'input[type="checkbox"]', function(){
                let checkbox = $(this);
                ( checkbox.prop('checked') ) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
            });
        });
    } 
  
  // $( ".menu-button" ).click(function() {
  //   $('.sidebar').toggleClass('sidebar-close');
  //   $('.content').toggleClass('content_full-width');
  //   $('.menu-icon').toggleClass('click-rotate');
  // });
});

let getCategory1 = () => {
    let category = document.getElementById("category");


	let category1 = document.getElementById("category1");
    let selectC1 = document.getElementById("selectC1");

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory1.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
                let li = document.createElement("li");
                li.setAttribute("class", "has-children category1");
                li.setAttribute("id", value.code);

                let checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "group-"+value.code);
                checkbox.setAttribute("name", "group-"+value.code);

                let label = document.createElement("label");
                label.setAttribute("for", "group-"+value.code);
                label.textContent = value.name;

                let folder = document.createElement("i");
                folder.setAttribute("class", "fas fa-folder");

                label.prepend(folder);

                li.appendChild(checkbox);
                li.appendChild(label);

                category.appendChild(li);
        	}

            getCategory2();
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}


let getCategory2 = () => {

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory2.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
                let category1 = document.getElementById(value.c1_code);

                let ul = document.createElement("ul");
                ul.setAttribute("class","category2");

                let li = document.createElement("li");
                li.setAttribute("class","has-children");

                let checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "sub-group-"+value.code);
                checkbox.setAttribute("name", "sub-group-"+value.code);

                let label = document.createElement("label");
                label.setAttribute("for", "sub-group-"+value.code);
                label.textContent = value.name;

                let folder = document.createElement("i");
                folder.setAttribute("class", "fas fa-folder");

                let category3ul = document.createElement("ul");
                category3ul.setAttribute("id", value.code);   

                label.prepend(folder);

                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(category3ul);               

                ul.appendChild(li);

                category1.appendChild(ul);

        	}

            getCategory3();
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let getCategory3 = () => {
	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory3.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            let ul = document.createElement("ul");
        	for(let value of data){               
                let category2 = document.getElementById(value.c2_code);                

                let li = document.createElement("li");
                li.setAttribute("class","category3");

                let a = document.createElement("a");
                a.setAttribute("id",value.code);
                a.setAttribute("onClick", "getDocumentList(this.id)");
                a.textContent = value.name;

                li.appendChild(a);

                category2.appendChild(li);
        	}


        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

}

let getDocumentList = id => {

	let documentList = document.getElementById("tabledocumentList");
	$("#tabledocumentList").empty();
	
	let data = {code : id};

	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getDocumentList.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
                let tr = document.createElement("tr");
                tr.setAttribute("class", "task");
                tr.setAttribute("id", value.code);

                let name = document.createElement("td");
                name.textContent = value.name;

                let registrant = document.createElement("td");
                registrant.textContent = "한소희";

                let date = document.createElement("td");
                date.textContent = "2018.02.26";

                tr.appendChild(name);
                tr.appendChild(registrant);
                tr.appendChild(date);

                documentList.appendChild(tr);

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
        formData.append('registrant', '한소희');

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
    versionList.setAttribute("data-id", id);
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

                let infoWrapper = document.createElement("p");

                let versionDate = document.createElement("span");
                versionDate.setAttribute("class", "versionDate");
                versionDate.textContent = value.date;

                let versionRegistrant = document.createElement("span");
                versionRegistrant.setAttribute("class", "versionRegistrant");
                versionRegistrant.textContent = value.registrant;

                infoWrapper.appendChild(versionDate);
                infoWrapper.appendChild(versionRegistrant);
                div2.appendChild(infoWrapper);

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
                dropdownitem.setAttribute("id", value.file);
                dropdownitem.setAttribute("onClick", "downloadDocument(this.id)");

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

$( "#newVersionUpload" ).change(function() {
    let newVersionUploadForm = document.getElementById("newVersionUploadForm");
    let newVersionUploadData = new FormData(newVersionUploadForm);
    
    let document_code = document.getElementById("versionListUl").getAttribute("data-id");
    newVersionUploadData.append('document_code', document_code);
    newVersionUploadData.append('registrant', '한소희');

    let c3code = document.getElementById(document_code).getAttribute("data-c3code");

    $.ajax({
            url: 'http://igrus.mireene.com/php/dms_php/newVersionUpload.php',
            type: 'POST',
            data: newVersionUploadData,
            success: function (data) {
                getDocumentVersionList(document_code);
                getDocumentList(c3code);
            },
            cache: false,
            contentType: false,
            processData: false
        });  
});


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


  function menuItemListener( link ) {
    let type = link.getAttribute("data-action");
    if(type === "View"){
       versionManagementOpen(taskItemInContext.getAttribute("id"));
    }
    //TODO
    else if(type === "download"){
        alert("다운로드");
    }
    else if(type ==="delete"){

    }
    toggleMenuOff();
  }

  initcontextmenu();