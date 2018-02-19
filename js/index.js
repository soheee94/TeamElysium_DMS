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

        //TODO : li -> status -> i = spinner
        let status = document.createElement("i");
        status.setAttribute("class", "fas fa-spinner fa-pulse");
        status.style["margin-top"] = "8px";

        $(".status").append(status);

        $.ajax({
            url: 'http://igrus.mireene.com/php/dms_php/savefile.php',
            type: 'POST',
            data: formData,
            success: function (data) {
                let dataStatus = data.split("\n");
                for(let i=0; i<dataStatus.length-1; i++){
                    if (dataStatus[i] === "존재하는 이름입니다.") {
                        $("#fileindex"+i).addClass("danger");
                        $("#fileindex"+i+" .status i").switchClass("fas fa-spinner fa-pulse", "fas fa-times", 1000, "easeInOutQuad");
                    }
                }

                //TODO : data에 따라 check / times i 추가

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
    li.setAttribute("class", "row");
    li.setAttribute("id", "fileindex"+index);

    let div1 = document.createElement("div");
    div1.setAttribute("class", "col-md-2");

    let circle = document.createElement("i");
    circle.setAttribute("class", "far fa-circle fa-2x");
    circle.style["margin-top"] = "8px";

    let circlenumber = document.createElement("span");
    circlenumber.setAttribute("class", "fa-layers-text fa-inverse");
    circlenumber.setAttribute("data-fa-transform", "left-2 down-1");
    circlenumber.style["font-weight"] = "900";
    circlenumber.style["color"] = "#555";
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

