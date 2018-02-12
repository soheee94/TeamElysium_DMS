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

let data = new FormData();

let fileUpload = () => {
    $.ajax({
        url: 'http://igrus.mireene.com/php/dms_php/savefile.php',
        type: 'POST',
        contentType: 'multipart/form-data',
        data: data,
        processData: false,
        success: function(data) {

            console.log(data);
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

    return false;
}

// drag drop upload files
// getElementById
function $id(id) {
    return document.getElementById(id);
}

//
// output information
function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
}


// call initialization file
if (window.File && window.FileList && window.FileReader) {
    Init();
}

//
// initialize
function Init() {

    var fileselect = $id("fileselect"),
        filedrag = $id("filedrag");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
    
        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";

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
        ParseFile(f);
        data.append("file", f);
    }

}


function ParseFile(file) {
    Output(
        "<p>File info: <strong>" + file.name +
        "</strong> type: <strong>" + file.type +
        "</strong> size: <strong>" + file.size +
        "</strong> bytes</p>"
    );
    
}