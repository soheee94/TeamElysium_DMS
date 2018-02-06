"use strict"

window.onload = () => {
	
	getCategory1();

}

let getCategory1 = () => {
	let category1 = document.getElementById("category1");

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