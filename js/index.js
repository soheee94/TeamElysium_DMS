"use strict"

window.onload = () => {	
	getCategory1();

    //category navigation slide effect
    let accordionsMenu = $('.cd-accordion-menu');
    if( accordionsMenu.length > 0 ) {        
        accordionsMenu.each(function(){
            let accordion = $(this);
            accordion.on('change', 'input[type="checkbox"]', function(){
                let checkbox = $(this);
                ( checkbox.prop('checked') ) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
            });
        });
    }

    //문서 등록 => 파일 선택
    let fileselect = document.getElementById("fileselect");
    fileselect.addEventListener("change", FileSelectHandler, false);   
}

let upperCategoryName = '';
let upperCategoryCode = '';
let CategoryStep = 1;

$("#documentEnrollmentModal").on('show.bs.modal', function () {
    $("#filelistul").empty();
});

$("#categorySettingModal").on('show.bs.modal', function () {
    document.getElementById("categoryName").value = "";
    document.getElementById('categoryLocation').innerHTML = document.getElementById('folderprocess').innerHTML;
});

//분류 추가
let addCategory = () => {    
    let categoryName = document.getElementById("categoryName").value;
    let code = createHash();
    let data = {upperCategoryCode : upperCategoryCode, CategoryStep : CategoryStep, categoryName:categoryName, code : code}

    $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/addCategory.php',
        type: 'POST',
        data: data,
        dataType: 'html',
        success: function(data) {
            alert("분류가 추가되었습니다.");
            getCategory1();
            $("#categorySettingModal").modal("hide");

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

$("#categoryModifyModal").on('show.bs.modal', function () {
    document.getElementById("categoryModifyName").value = upperCategoryName;
});

//분류 이름 수정
let modifyCategory = () => {
    let modifyCategoryName = document.getElementById("categoryModifyName").value;
    let data = {CategoryStep : CategoryStep-1 , modifyCategoryName : modifyCategoryName , code : upperCategoryCode};

    $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/modifyCategory.php',
        type: 'POST',
        data: data,
        dataType: 'html',
        success: function(data) {
            alert("이름이 변경되었습니다.");
            getCategory1();
            document.getElementById("process_c1").textContent = "";
            document.getElementById("process_c2").textContent = "";
            document.getElementById("process_c3").textContent = "";
            $("#tabledocumentList").empty();
            $("#categoryModifyModal").modal("hide");

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
    
}

//TODO : 분류 삭제
let deleteCategory = () => {
    if(confirm("** 주의 **\n분류 '"+ upperCategoryName + "' 을(를) 정말 삭제하시겠습니까? \n(이하의 소분류와 문서들도 함께 삭제되며 복구할 수 없습니다.)")){
        let data = {CategoryStep : CategoryStep-1 , code : upperCategoryCode}

        alert("안돼!");
        // $.ajax({
        //     url: 'http://igrus.mireene.com/php/dms_php/deleteCategory.php',
        //     type: 'POST',
        //     data: data,
        //     dataType: 'html',
        //     success: function(data) {


        //     },
        //     error: function(request, status, error) {
        //         console.log(request, status, error);
        //     },
        // });
    }
}

function createHash() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 10;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

let getCategory1 = () => {
    let category = document.getElementById("category");
    $("#category").empty();
	$.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/getCategory1.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
        	for(let value of data){
                let li = document.createElement("li");
                li.setAttribute("class", "has-children");
                li.setAttribute("id", value.code);

                let checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "group-"+value.code);
                checkbox.setAttribute("name", "group-"+value.code);

                let label = document.createElement("label");
                label.setAttribute("for", "group-"+value.code);
                label.setAttribute("class", "category1");
                label.textContent = value.name;

                let folder = document.createElement("i");
                folder.setAttribute("class", "fas fa-folder");

                label.prepend(folder);

                li.appendChild(checkbox);
                li.appendChild(label);

                category.appendChild(li);
        	}

            $( ".category1" ).click(function() {
                $("#process_c2").empty();
                $("#process_c3").empty();
                $("#tabledocumentList").empty();

                let fileUploadBtn = document.getElementById("fileUploadBtn");
                fileUploadBtn.classList.add("disabled");
                fileUploadBtn.style.color = "#dbdbdb";
                fileUploadBtn.setAttribute("data-toggle", "");

                let categoryAddBtn = document.getElementById("categoryAddBtn");
                categoryAddBtn.classList.remove("disabled");
                categoryAddBtn.style.color = "#555";
                categoryAddBtn.setAttribute("data-toggle", "modal");

                let categoryChangeNameBtn = document.getElementById("categoryChangeNameBtn");
                categoryChangeNameBtn.classList.remove("disabled");
                categoryChangeNameBtn.style.color = "#555";
                categoryChangeNameBtn.setAttribute("data-toggle", "modal");

                let categoryDeleteBtn = document.getElementById("categoryDeleteBtn");
                categoryDeleteBtn.classList.remove("disabled");
                categoryDeleteBtn.style.color = "#555";
                categoryDeleteBtn.setAttribute("onClick", "deleteCategory()");

                document.getElementById('process_c1').textContent = $(this).text();
                upperCategoryName = $(this).text();

                upperCategoryCode = $(this).attr("for");
                upperCategoryCode = upperCategoryCode.replace("group-", "");

                CategoryStep = 2;
            });

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

                let li = document.createElement("li");
                li.setAttribute("class","has-children");

                let checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "sub-group-"+value.code);
                checkbox.setAttribute("name", "sub-group-"+value.code);

                let label = document.createElement("label");
                label.setAttribute("for", "sub-group-"+value.code);
                label.setAttribute("class", "category2");
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

            $( ".category2" ).click(function() {
                $("#process_c3").empty();
                $("#tabledocumentList").empty();

                let fileUploadBtn = document.getElementById("fileUploadBtn");
                fileUploadBtn.classList.add("disabled");
                fileUploadBtn.style.color = "#dbdbdb";
                fileUploadBtn.setAttribute("data-toggle", "");

                let categoryAddBtn = document.getElementById("categoryAddBtn");
                categoryAddBtn.classList.remove("disabled");
                categoryAddBtn.style.color = "#555";
                categoryAddBtn.setAttribute("data-toggle", "modal");

                let i = document.createElement("i");
                i.setAttribute("class", "fas fa-angle-right fa-lg");
                i.setAttribute("style", "color: #bdbdbd; margin : 0 10px;");

                document.getElementById('process_c2').textContent = $(this).text();
                upperCategoryName = $(this).text();
                document.getElementById('process_c2').prepend(i);
                
                upperCategoryCode = $(this).attr("for");
                upperCategoryCode = upperCategoryCode.replace("sub-group-", "");
                CategoryStep = 3;
            });

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

            $( ".category3" ).click(function() {
                let i = document.createElement("i");
                i.setAttribute("class", "fas fa-angle-right fa-lg");
                i.setAttribute("style", "color: #bdbdbd; margin : 0 10px;");

                //disabled color : #dbdbdb
                let categoryAddBtn = document.getElementById("categoryAddBtn");
                categoryAddBtn.classList.add("disabled");
                categoryAddBtn.style.color = "#dbdbdb";
                categoryAddBtn.setAttribute("data-toggle", "");

                let fileUploadBtn = document.getElementById("fileUploadBtn");
                fileUploadBtn.classList.remove("disabled");
                fileUploadBtn.style.color = "#555";
                fileUploadBtn.setAttribute("data-toggle", "modal");

                if(document.getElementById('process_c2').textContent === ''){
                    let i2 = document.createElement("i");
                    i2.setAttribute("class", "fas fa-angle-right fa-lg");
                    i2.setAttribute("style", "color: #bdbdbd; margin : 0 10px;");

                    let subid = $(this).parent().attr("id");
                    document.getElementById('process_c2').textContent = $('label[for="sub-group-' + subid + '"]').text();
                    document.getElementById('process_c2').prepend(i2);
                }

                document.getElementById('process_c3').textContent = $(this).text();
                upperCategoryName = $(this).text();
                document.getElementById('process_c3').prepend(i);

                upperCategoryCode = $(this).children("a").attr("id");
                CategoryStep = 4;
            });

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
                tr.setAttribute("data-file", value.filename);
                tr.setAttribute("data-ftpfile", value.encodefilename);
                tr.setAttribute("data-c3code", value.c3_code);

                let name = document.createElement("td");
                name.textContent = value.name;

                let registrant = document.createElement("td");
                registrant.textContent = "한소희";

                let date = document.createElement("td");
                date.textContent = value.date.split(" ")[0];

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

let deleteDocument = id => {
    let target = document.getElementById(id);
    if(confirm("'"+target.childNodes[0].textContent + "' 을(를) 정말 삭제하시겠습니까? \n(버전 관리의 모든 파일도 함께 삭제됩니다.)")){

        let filename = target.getAttribute("data-ftpfile");
        let c3code = target.getAttribute("data-c3code");

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

//file upload
$("#upload").submit(function(e) {
    e.preventDefault();    
    let formData = new FormData(this);

    let filecnt = document.getElementById('fileselect').files.length;
    let c3code = upperCategoryCode;

    if(filecnt !== 0){
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

                    if (dataStatus[i] === "It's a real name.") {
                        $("#fileindex"+i).switchClass("primary", "danger"); 
                        status.setAttribute("class", "fas fa-times statusicon");

                        let div4 = document.createElement("div");
                        div4.setAttribute("class", "feedback");
                        div4.textContent = "이미 존재하는 문서이름입니다.";

                        document.getElementById("fileindex"+i).appendChild(div4);
                    }
                    else if(dataStatus[i] === "successfully uploaded"){
                        $("#fileindex"+i).switchClass("primary", "success");
                        status.setAttribute("class", "fas fa-check statusicon");

                        
                    }
                    else{
                       $("#fileindex"+i).switchClass("primary", "danger"); 
                        status.setAttribute("class", "fas fa-times statusicon"); 
                    }
                    status.style["margin-top"] = "8px";  
                    $("#fileindex"+i+" .statusicon").remove();
                    $("#fileindex"+i+" .status").append(status);
                }
                getDocumentList(c3code);

                return false;
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    else{
        alert("파일을 첨부해주세요.");
    }
});

//파일 선택
function FileSelectHandler(e) {
    var files = e.target.files || e.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
        ParseFile(f, i);
    }
}

//선택된 파일 리스트 추가
let ParseFile = (file, index) => {
    let filelist = document.getElementById("filelistul");

    let li = document.createElement("li");
    li.setAttribute("id", "fileindex"+index);
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

    let versionFileName = document.createElement("span");
    versionFileName.textContent = file.name;

    filewrapper.appendChild(versionFileName);
    div2.appendChild(filewrapper);

    let infoWrapper = document.createElement("p");

    let versionDate = document.createElement("span");
    versionDate.setAttribute("class", "filesize");
    versionDate.textContent = convertFileSize(file.size);

    infoWrapper.appendChild(versionDate);
    div2.appendChild(infoWrapper);

    let div3 = document.createElement("div");
    div3.setAttribute("class", "col-md-1 fawrapper status");

    li.appendChild(div1);
    li.appendChild(div2);
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



//** context menu function list **//

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
        downloadDocument(taskItemInContext.getAttribute("data-file"));
    }
    else if(type ==="delete"){
        deleteDocument(taskItemInContext.getAttribute("id"));
    }
    toggleMenuOff();
  }

  initcontextmenu();