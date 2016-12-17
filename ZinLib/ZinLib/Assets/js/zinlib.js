// #region global vars

var $linkRoot = window.location.protocol + "//" + location.host;
var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
var DynamicSelect2 = 0;
var CustomSearch = false;
var TreeAndSelectData = [];
//var idbAdapter = new LokiIndexedAdapter("loki");
var db = new loki("TEMP", {
    autosave: true,
    autoload: true,
    //adapter: idbAdapter,
    autoloadCallback: function () {

    }
});

// #endregion

// #region document ready

$(function () {
    $(".modal").appendTo($("#dvModalContainer"));
    $("#dvModalContainer .modal").each(function () {
        $("[id='" + this.id + "']:gt(0)").remove();
    });
    //cấu hình select2
    if ($().select2) {
        $(".select2").select2({ dropdownCssClass: "dynamic-select2", allowClear: false, width: "100%" }).change(function () {
            var value = this.value;
            var displayValue = $(this).find('option[value="' + value + '"]').text();
            $(this).attr('display-value', displayValue);
        });
    }
    //cấu hình datatable
    if ($(".dataTables_filter").length) {
        $(".CreateButton").insertBefore(".dataTables_filter");
    }
    else if ($(".btn-top-table").length) {
        $(".dataTables_length").css({ "text-align": "left" });
        $(".btn-top-table").appendTo($(".dataTables_length").parent().siblings(".col-md-6"));
    }
});

// #endregion

// #region anonymous functions

// #region Thư viện CRUD offline

//Lấy dữ liệu
function GetData(objname, modalId) {
    var treename;
    if (objname.startsWith("List")) {
        treename = objname.substring(4);
    } else {
        treename = objname;
    }
    var collection = db.getCollection(objname);
    if (collection === null) {
        var treeData =
                {
                    id: "root",
                    text: "Chưa có dữ liệu",
                    type: "root"
                };
        $("#tree" + treename).jstree("create_node", null, treeData, "first");
    }
    else {
        $("#tree" + treename).jstree("delete_node", $("#tree" + treename).jstree().get_json());
        $.each(collection.find(), function (index, value) {
            var textdata = TextGenerator(modalId, value);
            var treeData =
                {
                    id: value.Id,
                    text: textdata,
                    type: "root"
                };
            $("#tree" + treename).jstree("create_node", null, treeData, "last");
        });
    }
}

//Lưu chọn dữ liệu
function SaveChooseItem(objname, data) {
    var collection = db.getCollection(objname);
    if (collection === null) {
        collection = db.addCollection(objname);
    }
    var relationship = db.getCollection("Relationship");
    if (relationship === null) {
        relationship = db.addCollection("Relationship");
    }
    if (!relationship.findOne({ 'name': objname })) {
        relationship.insert({ name: objname, parent: 0 });
    }
    if (!collection.findOne({ 'Id': data.Id })) {
        $.each(data, function (index, value) {
            RecursiveData(index, data[index], data.Id, objname);
        });
        $.each(data, function (index, value) {
            if (index.startsWith("List")) {
                delete data[index];
            }
        });
        $("#tree" + objname).jstree("delete_node", "root");
        try {
            var inserted = collection.insert(data);
            var textdata = TextGenerator("mdlChiTiet" + objname, inserted);
            var treeData =
                {
                    id: inserted.Id,
                    text: textdata,
                    type: "root"
                };
            $("#tree" + objname).jstree("create_node", null, treeData, "last");
        } catch (err) {
            alertify.warning("tl", err);
        }
    }
}

//Quét đệ quy khi lưu data
function RecursiveData(name, data, parentId, parentName) {
    if (name.startsWith("List")) {
        var collection = db.getCollection(name);
        var shortname = name.substring(4);
        if (collection === null) {
            collection = db.addCollection(name);
        }
        var relationship = db.getCollection("Relationship");
        if (!relationship.findOne({ 'name': name })) {
            relationship.insert({ name: name, parent: parentName });
        }
        //$("#tree" + shortname).jstree("delete_node", $("#tree" + shortname).jstree().get_json());
        $("#tree" + shortname).jstree("delete_node", "root");
        $.each(data, function (indexInArray, valueOfElement) {
            try {
                valueOfElement.VirtualParent = parentId;
                var inserted = collection.insert(valueOfElement);
                var textdata = TextGenerator("mdlChiTiet" + shortname, inserted);
                var treeData =
                    {
                        id: inserted.Id,
                        data: { VirtualParent: inserted.VirtualParent },
                        text: textdata,
                        type: "root"
                    };
                $("#tree" + shortname).jstree("create_node", null, treeData, "last");
            } catch (err) {
                alertify.warning("tl", err);
            }
            $.each(valueOfElement, function (index, value) {
                RecursiveData(index, valueOfElement[index], valueOfElement.Id, name);
            });
        });
    }
}

////Lưu thêm mới
//function SaveAddItem(objname, modalId) {
//    var collection = db.getCollection(objname);
//    if (collection === null) {
//        collection = db.addCollection(objname);
//    }
//    var result = $("#" + modalId + " *").formToJson();
//    try {
//        var inserted = collection.insert(result);
//        var textdata = TextGenerator(modalId, inserted);
//        var treeData =
//            {
//                id: inserted.$loki,
//                text: textdata,
//                type: "root"
//            };
//        $("#tree" + objname).jstree("delete_node", "root");
//        $("#tree" + objname).jstree("create_node", null, treeData, "last");
//        alertify.success("tl", "Thêm mới thành công");
//    } catch (err) {
//        alertify.warning("tl", err);
//    }
//}

//Sửa
//function EditItem(objname, modalId, id) {
//    var collection = db.getCollection(objname);
//    var select = collection.findOne({ '$loki': parseInt(id) });
//    $("#" + modalId + " *").jsonToForm(select);
//}

//Lưu sửa
//function SaveEditItem(objname, modalId, id) {
//    var collection = db.getCollection(objname);
//    var select = collection.findOne({ '$loki': parseInt(id) });
//    var newData = $("#" + modalId + " *").formToJson();
//    $.each(select, function (index, value) {
//        if (index !== "meta" && index !== "$loki") {
//            select[index] = newData[index];
//        }
//    });
//    try {
//        collection.update(select);
//        var textdata = TextGenerator(modalId, select);
//        $("#tree" + objname).jstree("rename_node", select.$loki, textdata);
//        alertify.success("tl", "Chỉnh sửa thành công");
//    } catch (err) {
//        alertify.warning("tl", err);
//    }
//}

//Lưu xóa
function SaveRemoveItem(objname, modalId, id) {
    var collection = db.getCollection(objname);
    var select = collection.findOne({ '$loki': parseInt(id) });
    try {
        collection.remove(select);
        $("#tree" + objname).jstree("delete_node", id);
        alertify.success("tl", "Xóa thành công");
    } catch (err) {
        alertify.warning("tl", err);
    }
}

//Tạo chuỗi tương ứng với modal
function TextGenerator(modalId, listValue) {
    var data = $("#" + modalId + " *").formToJson();
    var listLabel = [];
    $.each(data, function (index, value) {
        var id = $("#" + modalId).find("[name='" + index + "']").prop("id");
        var labeltext = $("#" + modalId).find("label[for='" + id + "']").text();
        listLabel.push({ id: id, name: index, label: labeltext });
    });
    var text = "";
    $.each(listLabel, function (index, value) {
        var textLabel = listLabel[index].label;
        var textValue = listValue[listLabel[index].name];
        if (textValue && textValue.toString().includes("/Date(")) {
            textValue = moment(textValue).format("DD/MM/YYYY");
        }
        if (index === listLabel.length - 1) {
            text += "<b>" + textLabel + "</b>: " + "<b style='color:blue'>" + textValue + "</b>";
        }
        else {
            text += "<b>" + textLabel + "</b>: " + "<b style='color:blue'>" + textValue + "</b>, ";
        }
    });
    return text;
}

// #endregion

// #region Thư viện tương tác treeview và select

//OnLoadTreeAndSelect("tree_phongban", "ddlPhongBan", rowData.TenPhong, rowData.NguoiDungPhongId, rowData.KhoaChaId);
function OnLoadTreeAndSelect(idTree, idSelect, textSelect, currentNodeId, parentNodeId) {
    $("#" + idTree).jstree().deselect_all();
    $("#" + idTree).jstree("select_node", "#" + parentNodeId + "");
    //disable node tree
    $("#" + idTree).jstree("disable_node", "#" + currentNodeId);
    TreeAndSelectData.push({ id: currentNodeId, text: $("#" + idTree).jstree("get_text", "#" + currentNodeId) });
    var childNodes = $("#" + idTree).jstree("get_node", "#" + currentNodeId).children_d;
    $.each(childNodes, function (index, value) {
        $("#" + idTree).jstree("disable_node", "#" + value);
        TreeAndSelectData.push({ id: value, text: $("#" + idTree).jstree("get_text", "#" + value) });
    });
    //remove from select
    $.each(TreeAndSelectData, function (index, value) {
        $("#" + idSelect + " option[value='" + value.id + "']").remove();
    });

    //select parent
    if (parentNodeId > 0) {
        $("#" + idSelect).val(parentNodeId).change();
    }
    else {
        $("#" + idSelect).val(0).change();
    }
}
//OnUnloadTreeAndSelect("tree_phongban", "ddlPhongBan", $("#txtPhongBanIdHidden").val());
function OnUnloadTreeAndSelect(idTree, idSelect, currentNodeId) {
    //enable node tree
    $("#" + idTree).jstree("enable_node", "#" + currentNodeId);
    var childNodes = $("#" + idTree).jstree("get_node", "#" + currentNodeId).children_d;
    $.each(childNodes, function (index, value) {
        $("#" + idTree).jstree("enable_node", "#" + value);
    });
    //reappend options
    if (currentNodeId > 0) {
        $.each(TreeAndSelectData, function (index, value) {
            var selectoption = new Option(value.text, value.id);
            $("#" + idSelect).append(selectoption);
        });
    }
    TreeAndSelectData = [];
}

// #endregion

//reset input trong form, ví dụ: ResetChildrenByType(document.getElementById("processChuSuDung"));
function ResetChildrenByType(element) {
    for (var i = 0; i < element.childNodes.length; i++) {
        var e = element.childNodes[i];
        if (e.tagName) switch (e.tagName.toLowerCase()) {
            case "input":
                switch (e.type) {
                    case "radio":
                    case "checkbox": e.checked = false; break;
                    case "button":
                    case "submit":
                    case "image": break;
                    default: e.value = ""; break;
                }
                break;
            case "select": e.selectedIndex = 0; break;
            case "textarea": e.value = ""; break;
            default: ResetChildrenByType(e);
        }
    }
}

//reset select2 trong form, ví dụ ResetChildrenSelect2ById("ddlQuanHuyen")
function ResetChildrenSelect2ById(id) {
    $("#" + id).val("0").change();
}

//canh giữa modals
function centerModal() {
    $(".modal.in").each(function (index, value) {
        var $dialog = $(this).find(".modal-dialog.modal-center"),
    offset = ($(window).height() - $dialog.height()) / 2,
    bottomMargin = parseInt($dialog.css("marginBottom"), 10);
        if (offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    });
}

//Loading
function loading(show) {
    if (show)
        $("html").loadingModal({
            position: "auto",
            text: "Đang xử lý...",
            color: "#fff",
            opacity: "0.7",
            backgroundColor: "rgb(0,0,0)",
            animation: "fadingCircle"
        });
    else
        $("html").loadingModal("destroy");
}
//Xử lý ajax error
function OnError(xhr, errorType, exception) {
    loading(false);
    var responseText;
    var showText = "";
    try {
        responseText = jQuery.parseJSON(xhr.responseText);
        showText += "<div><div><b>" + errorType + " " + exception + "</b></div>";
        showText += "<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>";
        showText += "<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>";
        showText += "<div><u>Message</u>:<br /><br />" + responseText.Message + "</div></div>";
    } catch (e) {
        responseText = xhr.responseText;
        showText = responseText;
    }
    Lobibox.alert("error", {
        title: "Lỗi",
        msg: showText
    });
}

//Chuyển đổi ngày tháng
function DateTimeConvert(string, options) {
    var settings = $.extend({
        time: false
    }, options);
    var date;
    var daysname = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    var monthsname = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    if (Object.prototype.toString.call(string) === "[object String]") {
        date = new Date(parseInt(string));
    } else {
        date = new Date(string);
    }
    var month = date.getMonth();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var am = true;
    //if (hours > 12) {
    //    am = false;
    //    hours -= 12;
    //} else if (hours == 12) {
    //    am = false;
    //} else if (hours == 0) {
    //    hours = 0;
    //}
    var result = "";
    if (settings.time) {
        result += date.getDate() + "/" + monthsname[month] + "/" + date.getFullYear() + " " + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    } else {
        result += date.getDate() + "/" + monthsname[month] + "/" + date.getFullYear();
    }
    return result;
}

//convert val từ datepicker sang dạng mm/dd/yy
//ví dụ GetDefaultDate("#txtNgayTimKiemTu");
function GetDefaultDate(id) {
    return $.datepicker.formatDate("dd/mm/yy", $(id).datepicker("getDate"));
}

//Ẩn hiện table nếu tìm kiếm bên ngoài
//ví dụ ToggleSearchResult(CustomSearch, settings.aoData.length);
function ToggleSearchResult(customSearch, result) {
    if (customSearch) {
        if (result < 1) {
            $("#dvKetQuaTimKiemEmpty").css({ "display": "block" });
            $("#dvKetQuaTimKiem").css({ "visibility": "hidden" });
        }
        else {
            $("#dvKetQuaTimKiemEmpty").css({ "display": "none" });
            $("#dvKetQuaTimKiem").css({ "visibility": "visible" });
        }
    }
    CustomSearch = false;
}

//confirm
function Confirm(message, functionName) {
    $.confirm({
        title: "Xác nhận",
        text: message,
        confirmButton: "Đồng ý",
        cancelButton: "Thoát",
        confirm: function () {
            functionName();
        },
        cancel: function () {
        }
    });
}

//thêm dấu phẩy cho số, ví dụ AddCommas(123456) hoặc AddCommas("123456")
function AddCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

//Set content tinymce
function SetContentTinymce(control, content) {
    tinymce.get(control).setContent(content);
}

//Get content tinymce
function GetContentTinymce(control) {
    return tinymce.get(control).getContent({ format: "raw" });
}

//HTML string sang javascript var, ví dụ DomToVar(document.getElementById("data_table").innerHTML); document.body.innerHTML += encoded; alert(unescape(encoded));
function DomToVar(html) {
    encodedHtml = escape(html);
    encodedHtml = encodedHtml.replace(/\//g, "%2F");
    encodedHtml = encodedHtml.replace(/\?/g, "%3F");
    encodedHtml = encodedHtml.replace(/=/g, "%3D");
    encodedHtml = encodedHtml.replace(/&/g, "%26");
    encodedHtml = encodedHtml.replace(/@@/g, "%40");
    return encodedHtml;
}

//lọc mảng đơn thành các phần tử độc nhất
function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    return Object.keys(temp);
}

//lọc mảng đa thành các phần tử độc nhất
function ArrMulNoDupe(a) {
    var flags = [], output = [];
    for (var i = 0; i < a.length; i++) {
        if (flags[a[i].id]) continue;
        flags[a[i].id] = true;
        output.push(a[i]);
    }
    return output;
}

// Convert array to object
function ConvertToObj(array) {
    var thisEleObj = new Object();
    if (typeof array === "object") {
        for (var i in array) {
            var thisEle = ConvertToObj(array[i]);
            thisEleObj[i] = thisEle;
        }
    } else {
        thisEleObj = array;
    }
    return thisEleObj;
}

//chuyển tiếng việt có dấu thành không dấu
function ConvertToEn(str, options) {
    var settings = $.extend({
        lower: false,
        removespaces: false
    }, options);
    if (settings.lower) {
        str = str.toLowerCase();
    }
    // In thường
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // In hoa
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Á|Ậ|Ẩ|Ẫ|Ă|Ằ|Á|Ặ|Ẳ|Ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
    str = str.replace(/Đ/g, "d");
    if (settings.removespaces) {
        str = str.replace(/\s/g, "");
    }
    return str; // Trả về chuỗi đã chuyển
}

// #endregion

// #region  self invoked anonymous functions


//cấu hình modal
//modal.[add,edit,remove]("modalId",name);
//ví dụ modal.add("mdlChiTietCaNhan", "cá nhân");
var modal = function () {
    return {
        add: function (id, text) {
            ResetChildrenByType(document.getElementById(id));
            ResetChildrenSelect2ById(id);
            $("#" + id + "").removeClass().addClass("modal Add");
            $("#" + id + "").find(".panel-body > div.row > div:first-child").show();
            $("#" + id + "").find(".panel-body > div.row > div:last-child").hide();
            $("#" + id + "").find(".panel").removeClass().addClass("panel panel-primary");
            $("#" + id + "").find(".panel-title > span").text("Thêm " + text + "");
            $("#" + id + "").find(".panel-footer .pull-right > a:first-child").html("<i class='fa fa-plus'></i> Lưu").removeClass().addClass("btn btn-primary hover-effect BindButton").show();
            $("#" + id + "").find(".panel-footer .pull-right > a:nth-child(2)").hide();
        },
        edit: function (id, text) {
            $("#" + id + "").removeClass().addClass("modal Edit");
            $("#" + id + "").find(".panel-body > div.row > div:first-child").show();
            $("#" + id + "").find(".panel-body > div.row > div:last-child").hide();
            $("#" + id + "").find(".panel").removeClass().addClass("panel panel-success");
            $("#" + id + "").find(".panel-title > span").text("Sửa " + text + "");
            $("#" + id + "").find(".panel-footer .pull-right > a:first-child").html("<i class='fa fa-edit'></i> Cập nhật").removeClass().addClass("btn btn-success hover-effect BindButton").show();
            $("#" + id + "").find(".panel-footer .pull-right > a:nth-child(2)").hide();
        },
        remove: function (id, text) {
            $("#" + id + "").removeClass().addClass("modal Remove");
            $("#" + id + "").find(".panel-body > div.row > div:first-child").hide();
            $("#" + id + "").find(".panel-body > div.row > div:last-child").html("<h4><b>Bạn chắc chắn muốn xóa " + text + " này?</b></h4>").show();
            $("#" + id + "").find(".panel").removeClass().addClass("panel panel-danger");
            $("#" + id + "").find(".panel-title > span").text("Xóa " + text + "");
            $("#" + id + "").find(".panel-footer .pull-right > a:first-child").hide();
            $("#" + id + "").find(".panel-footer .pull-right > a:nth-child(2)").html("<i class='fa fa-trash-o'></i> Đồng ý").removeClass().addClass("btn btn-danger hover-effect BindButton").show();
        }
    };
}();

//cấu hình alertify
//alertify.[default,info,warning,error,success]("[tl,tr,tc,bl,br]", message)
var alertify = function () {
    function AlertifyNotify(type, pos, mes) {
        var msgtitle = "";
        switch (type) {
            case "default":
                msgtitle = "Thông báo";
                break;
            case "info":
                msgtitle = "Thông tin";
                break;
            case "warning":
                msgtitle = "Cảnh báo";
                break;
            case "error":
                msgtitle = "Thất bại";
                break;
            case "success":
                msgtitle = "Thành công";
                break;
        }
        switch (pos) {
            case "tc":
                pos = "top center";
                break;
            case "tl":
                pos = "top left";
                break;
            case "tr":
                pos = "top right";
                break;
            case "bl":
                pos = "bottom left";
                break;
            case "br":
                pos = "bottom right";
                break;
        }
        Lobibox.notify(type, {
            sound: false,
            delayIndicator: true,
            position: pos,
            title: msgtitle,
            msg: mes,
            messageHeight: "auto"
        }).$el.css("word-wrap", "break-word");
    }
    function AlertifyConfirm(mes, yescallback, nocallback) {
        //$.confirm({
        //    title: "Xác nhận",
        //    text: mes,
        //    confirmButton: "Đồng ý",
        //    cancelButton: "Thoát",
        //    confirm: function () {
        //        if (typeof yescallback === "function") {
        //            yescallback.call(this);
        //        }
        //    },
        //    cancel: function () {
        //        if (!nocallback) {
        //            return false;
        //        } else {
        //            if (typeof nocallback === "function") {
        //                nocallback.call(this);
        //            }
        //        }
        //    }
        //});
        Lobibox.confirm({
            //iconClass: false,
            title: "Xác nhận",
            msg: mes,
            callback: function ($this, type, ev) {
                if (type === "yes") {
                    if (typeof yescallback === "function") {
                        yescallback.call(this);
                    }
                } else if (type === "no") {
                    if (!nocallback) {
                        return false;
                    } else {
                        if (typeof nocallback === "function") {
                            nocallback.call(this);
                        }
                    }
                }
            }
        });
    }
    function AlertifyAlert(mes, options) {
        var settings = $.extend({}, options);
        var buttonsList = {};
        var buttonStyle = loopArr(["primary", "warning", "danger", "default", "success", "info"], { loop: true });
        $.each(settings, function (index, value) {
            var indexNew = ConvertToEn(index, { lower: true, removespaces: true });
            //if (index === Object.keys(settings)[Object.keys(settings).length - 1])
            buttonsList[indexNew] = { "class": "btn btn-" + buttonStyle.next(), closeOnClick: true, text: index };
        });
        Lobibox.alert("info", {
            msg: mes,
            title: "Thông báo",
            //buttons: ['ok', 'cancel', 'yes', 'no'],
            //Or more powerfull way
            buttons: buttonsList,
            callback: function (lobibox, type) {
                for (key in settings) {
                    if (type === ConvertToEn(key, { lower: true, removespaces: true })) {
                        settings[key]();
                    }
                }
            }
        });
    }
    return {
        default: function (pos, mes) {
            AlertifyNotify("default", pos, mes);
        },
        info: function (pos, mes) {
            AlertifyNotify("info", pos, mes);
        },
        warning: function (pos, mes) {
            AlertifyNotify("warning", pos, mes);
        },
        error: function (pos, mes) {
            AlertifyNotify("error", pos, mes);
        },
        success: function (pos, mes) {
            AlertifyNotify("success", pos, mes);
        },
        confirm: function (mes, yescallback, nocallback) {
            AlertifyConfirm(mes, yescallback, nocallback);
        },
        alert: function (mes, options) {
            AlertifyAlert(mes, options);
        }
    };
}();

//chuyển mảng thành vòng lặp để lấy giá trị lần lượt hoặc ngẫu nhiên next, prev, cur và ran
var loopArr = function (arr, options) {
    var settings = $.extend({
        loop: false
    }, options);
    var cur = 0;
    arr.next = (function () { return (++cur >= this.length) ? (settings.loop ? this[0] : false) : this[cur]; });
    arr.prev = (function () { return (--cur < 0) ? false : this[cur]; });
    arr.cur = (function () { return this[cur]; });
    arr.ran = (function () { return this[Math.floor(Math.random() * this.length)]; });
    return arr;
};
// #endregion

// #region self invoked anonymous functions with a parameter called "$"
(function ($) {

    //Kết hợp dữ liệu các phần tử và gộp vào phần tử đầu tiên 
    //ví dụ $("CaNhan, DiaChi, GiayToTuyThan").collectData({ stringify: true, object: true });
    $.fn.collectData = function (options) {
        var settings = $.extend({
            stringify: false,
            object: false
        }, options);
        var data = this.selector.split(", ");
        var mainObj = $(data[0]).getSavedData();
        for (var i = 1; i < data.length; i++) {
            var name = data[i];
            var value = $(data[i]).getSavedData();
            mainObj[name] = value;
        }
        if (settings.object) {
            if (settings.stringify) {
                return JSON.stringify(ConvertToObj(mainObj));
            } else {
                return ConvertToObj(mainObj);
            }
        } else {
            if (settings.stringify) {
                return JSON.stringify(mainObj);
            } else {
                return mainObj;
            }
        }
    };

    //Tạo Array/Object và xuất String từ dữ liệu offline
    //xxx.getSavedData({ stringify: true, object: true })
    $.fn.getSavedData = function (options) {
        var settings = $.extend({
            stringify: false,
            object: false
        }, options);
        var collection = db.getCollection(this.selector);
        var list = collection.find();
        var data = [];
        $.each(list, function (index, value) {
            delete value["$loki"];
            delete value["meta"];
            data.push(value);
        });
        if (settings.object) {
            if (settings.stringify) {
                return JSON.stringify(ConvertToObj(data));
            } else {
                return ConvertToObj(data);
            }
        } else {
            if (settings.stringify) {
                return JSON.stringify(data);
            } else {
                return data;
            }
        }
    };

    //Chuyển đổi Form thành Json
    //xxx.formToJson({ stringify: true }, function (key, val) {
    //    return {
    //        name: key,
    //        value: encodeURIComponent(val)
    //    };
    //})
    $.fn.formToJson = function (options, decorator) {
        var settings = $.extend({
            stringify: false
        }, options);
        var obj = {},
        arr = this.serializeArray({ checkboxesAsBools: true }),
        that;
        $.each(arr, function () {
            that = this;
            if ($.isFunction(decorator)) {
                that = decorator(that.name, that.value);
            }
            if (obj[this.name] !== undefined) {
                if (!obj[that.name].push) {
                    obj[that.name] = [obj[that.name]];
                }
                obj[that.name].push(that.value || "");
            } else {
                obj[that.name] = that.value || "";
            }
        });
        if (settings.stringify) {
            return JSON.stringify(obj);
        } else {
            return obj;
        }
    };

    //Chuyển đổi Form thành array (hỗ trợ hàm formToJson)
    $.fn.serializeArray = function (options) {
        var o = $.extend({
            checkboxesAsBools: false
        }, options || {});
        var rselectTextarea = /select|textarea/i;
        var rinput = /text|file|password|search/i;
        return this.map(function () {
            return this.elements ? $.makeArray(this.elements) : this;
        })
        .filter(function () {
            return this.name && !this.disabled &&
                (this.checked
                || (o.checkboxesAsBools && this.type === "checkbox")
                || rselectTextarea.test(this.nodeName)
                || rinput.test(this.type));
        })
            .map(function (i, elem) {
                var val = $(this).val();
                return val === null ?
                null :
                $.isArray(val) ?
                $.map(val, function (val, i) {
                    return { name: elem.name, value: val };
                }) :
             {
                 name: elem.name,
                 value: (o.checkboxesAsBools && this.type === "checkbox") ?
                        (this.checked ? "true" : "false") :
                        val
             };
            }).get();
    };

    //Chuyển đổi Json gán lên Form
    $.fn.jsonToForm = function (data) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        $.each(this.find("*[name]"), function () {
            var inputType = $(this).attr("type"),
                dataValue = data[$(this).attr("name")];
            if (inputType === "radio" || inputType === "checkbox") {
                if ($.isArray(dataValue)) {
                    $(this).prop("checked", $.inArray($(this).val(), dataValue) > -1);
                }
                else {
                    $(this).prop("checked", dataValue === "true");
                }
            } else if (inputType === "file") {
                $(this).siblings(".fileinput-filename").text(dataValue);
                $(this).siblings(".fileinput-filename").css({ "display": "block" });
            } else {
                $(this).val(dataValue);
            }
        });
    };

    //option: {{title, text, confirmButton, cancelButton, post, submitForm, confirmButtonClass, cancelButtonClass, dialogClass, modalOptionsBackdrop, modalOptionsKeyboard}}
    $.fn.confirm = function (options) {
        if (typeof options === "undefined") {
            options = {};
        }
        this.click(function (e) {
            e.preventDefault();
            var newOptions = $.extend({
                button: $(this)
            }, options);
            $.confirm(newOptions, e);
        });
        return this;
    };

    $.confirm = function (options, e) {
        //nếu không có option thì log error rồi exit
        if (typeof options === "undefined") {
            console.error("No options given.");
            return;
        }

        if ($(".confirmation-modal").length > 0)
            return;

        var dataOptions = {};
        if (options.button) {
            var dataOptionsMapping = {
                "title": "title",
                "text": "text",
                "confirm-button": "confirmButton",
                "submit-form": "submitForm",
                "cancel-button": "cancelButton",
                "confirm-button-class": "confirmButtonClass",
                "cancel-button-class": "cancelButtonClass",
                "dialog-class": "dialogClass",
                "modal-options-backdrop": "modalOptionsBackdrop",
                "modal-options-keyboard": "modalOptionsKeyboard"
            };
            $.each(dataOptionsMapping, function (attributeName, optionName) {
                var value = options.button.data(attributeName);
                if (typeof value !== "undefined") {
                    dataOptions[optionName] = value;
                }
            });
        }

        // Default options
        var settings = $.extend({}, $.confirm.options, {
            confirm: function () {
                if (dataOptions.submitForm
                    || (typeof dataOptions.submitForm === "undefined" && options.submitForm)
                    || (typeof dataOptions.submitForm === "undefined" && typeof options.submitForm === "undefined" && $.confirm.options.submitForm)
                ) {
                    e.target.closest("form").submit();
                } else {
                    var url = e && (("string" === typeof e && e) || (e.currentTarget && e.currentTarget.attributes["href"].value));
                    if (url) {
                        if (options.post) {
                            var form = $("<form method='post' class='hide' action='" + url + "'></form>");
                            $("body").append(form);
                            form.submit();
                        } else {
                            window.location = url;
                        }
                    }
                }
            },
            cancel: function (o) {
            },
            button: null
        }, options, dataOptions);

        // Modal
        var modalHeader = "";
        if (settings.title !== "") {
            modalHeader =
                "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "<h4 class='modal-title'>" + settings.title + "</h4>" +
                "</div>";
        }
        var cancelButtonHtml = "";
        if (settings.cancelButton) {
            cancelButtonHtml =
                "<button class='cancel btn " + settings.cancelButtonClass + "' type='button' data-dismiss='modal'>" +
                    settings.cancelButton +
                "</button>";
        }
        var modalHTML =
                "<div class='confirmation-modal modal' tabindex='-1' role='dialog'>" +
                    "<div class='" + settings.dialogClass + "'>" +
                        "<div class='modal-content'>" +
                            modalHeader +
                            "<div class='modal-body'>" + settings.text + "</div>" +
                            "<div class='modal-footer'>" +
                                "<button class='confirm btn " + settings.confirmButtonClass + "' type='button' data-dismiss='modal'>" +
                                    settings.confirmButton +
                                "</button>" +
                                cancelButtonHtml +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>";

        var modal = $(modalHTML);

        // Apply modal options
        if (typeof settings.modalOptionsBackdrop !== "undefined" || typeof settings.modalOptionsKeyboard !== "undefined") {
            modal.modal({
                backdrop: settings.modalOptionsBackdrop,
                keyboard: settings.modalOptionsKeyboard
            });
        }

        modal.on("show.bs.modal", function () {
            modal.find(".btn-primary:first").focus();
            centerModal();
        });
        modal.on("hidden.bs.modal", function () {
            modal.remove();
        });
        modal.find(".confirm").click(function () {
            settings.confirm(settings.button);
        });
        modal.find(".cancel").click(function () {
            settings.cancel(settings.button);
        });

        // Show the modal
        $("body").append(modal);
        modal.modal("show");
    };
    //cấu hình options
    $.confirm.options = {
        text: "Are you sure?",
        title: "",
        confirmButton: "Yes",
        cancelButton: "Cancel",
        post: false,
        submitForm: false,
        confirmButtonClass: "btn-primary",
        cancelButtonClass: "btn-default",
        dialogClass: "modal-dialog modal-center",
        modalOptionsBackdrop: true,
        modalOptionsKeyboard: true
    };
})(jQuery);
// #endregion

// #region events listener

//bind nút enter
$(document).on("keypress", function (event) {
    if (event.keyCode === 13) {
        if ($(".modal.in").length === 0) {
            if ($("#dvMain").find("ul.nav-tabs").length === 0) {
                $("#dvMain").find(".BindButton").click();
            }
            else {
                $("#dvMain").find(".tab-pane.active").find(".BindButton").click();
            }
        }
        else {
            //nothing
        }
    }
});

//bind modals events
$(document).on("show.bs.modal", ".modal", function () {
    var zIndex = 1050 + (10 * $(".modal.in").length);
    $(this).css("z-index", zIndex);
    DynamicSelect2 = zIndex + 10;
    $(".modal.in").each(function () {
        if ($(this).css("z-index") < zIndex) {
            $(this).hide();
        }
    });
});
$(document).on("shown.bs.modal", ".modal", function () {
    isAlreadyPressed = true;
    centerModal();
    $(this).append("<input type='text' id='btnAutoFocus' style='opacity:0' />");
    $(this).find("#btnAutoFocus").focus();
    $(this).off("keypress").on("keypress", function (event) {
        if (event.keyCode === 13) {
            if ($(this).find("ul.nav-tabs").length === 0) {
                $(this).find(".BindButton").click();
            }
            else {
                $(this).find(".tab-pane.active").find(".BindButton").click();
            }
        }
    });
});
$(document).on("hide.bs.modal", ".modal", function () {
    $(this).find("#btnAutoFocus").remove();
    var index_highest = 0;
    var index_current = parseInt($(this).css("z-index"), 10);
    if (index_current > index_highest) {
        index_highest = index_current;
    }
    $(".modal.in").each(function () {
        if (parseInt($(this).css("z-index")) === index_highest - 10) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
$(document).on("hidden.bs.modal", ".modal", function () {
    if ($(".modal.in").length === 0) {
        $(".modal").css("z-index", "");
    }
    centerModal();
});

//bind tabs events
$("a[data-toggle='tab']").on("shown.bs.tab", function (e) {
    $(e.target).closest(".modal").find("#btnAutoFocus").focus();
});

//bind select2 events
$(document).on("select2:open", ".select2", function (evt) {
    $("body > span > span.dynamic-select2").css("z-index", DynamicSelect2);
});

//bind window resize event
$(window).on("resize", function () {
    centerModal();
});

// #endregion

// #region Cấu hình mặc định cho các plugins

//cấu hình tinymce
if (window.tinyMCE) {
    tinymce.init({
        selector: ".editable",
        //language: "en_US",
        language: "vi_VN",
        height: 200,
        theme: "modern",
        plugins: [
          "advlist autolink lists link charmap print preview hr anchor pagebreak",
          "searchreplace wordcount visualblocks visualchars code fullscreen",
          "insertdatetime nonbreaking save table contextmenu directionality",
          "emoticons template paste textcolor colorpicker textpattern"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        image_advtab: true,
        templates: [
          { title: "Test template 1", content: "Test 1" },
          { title: "Test template 2", content: "Test 2" }
        ],
        content_css: [
          "../../Assets/plugins/tinymce/codepen.min.css"
        ],
        force_br_newlines: true,
        force_p_newlines: false,
        forced_root_block: false
    });
}

//Lobibox
if (Lobibox) {
    Lobibox.base.OPTIONS = $.extend({}, Lobibox.base.OPTIONS, {
        buttons: {
            ok: {
                "class": "lobibox-btn lobibox-btn-default",
                text: "OK",
                closeOnClick: true
            },
            cancel: {
                "class": "lobibox-btn lobibox-btn-cancel",
                text: "Đóng",
                closeOnClick: true
            },
            yes: {
                "class": "btn btn-primary",
                text: "Đồng ý",
                closeOnClick: true
            },
            no: {
                "class": "btn btn-danger",
                text: "Hủy",
                closeOnClick: true
            }
        }
    });
}

//cấu hình mặc định cho datepicker và timepicker
if ($.datepicker) {
    $.datepicker.setDefaults({
        currentText: "Hiện tại",
        closeText: "Đóng",
        autoSize: false,
        showButtonPanel: true,
        //showOn: "both",
        changeMonth: true,
        changeYear: true,
        prevText: "&#x3C;Trước",
        nextText: "Tiếp&#x3E;",
        monthNames: ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
        "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"],
        monthNamesShort: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
        dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        weekHeader: "Tu",
        dateFormat: "dd/mm/yy",
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "",
        duration: "fast",
        hideIfNoPrevNext: true,
        numberOfMonths: 1,
        showWeek: true,
        yearRange: "1900:2099"
        //altField: "#alternate",
        //altFormat: "DD, d MM, yy"
    });
}
if ($.timepicker) {
    $.timepicker.setDefaults({
        currentText: "Hiện tại",
        closeText: "Đóng",
        timeOnlyTitle: "Chọn giờ",
        timeText: "Thời gian",
        hourText: "Giờ",
        minuteText: "Phút",
        secondText: "Giây",
        millisecText: "Mili giây",
        microsecText: "Micrô giây",
        timezoneText: "Múi giờ",
        controlType: "select",
        oneLine: true,
        timeInput: true,
        //timeFormat: "hh:mm tt",
        timeSuffix: "",
        amNames: ["sáng", "S"],
        pmNames: ["chiều", "C"],
        isRTL: false
    });
}

//cấu hình datepicker
$(".datepicker").datepicker();
$(".datepicker-from").datepicker({
    onSelect: function (selectedDateTime) {
        $(".datepicker-to").datepicker("option", "minDate", $(".datepicker-from").datepicker("getDate"));
    }
});
$(".datepicker-to").datepicker({
    onSelect: function (selectedDateTime) {
        $(".datepicker-from").datepicker("option", "maxDate", $(".datepicker-to").datepicker("getDate"));
    }
});
if ($().mask) {
    $(".datepicker").mask("00/00/0000");
    $(".money").mask("#,##0", { reverse: true });
    $(".number").mask("#0", { reverse: true });
}
//ấn nút Hôm nay tự động chọn ngày hôm nay
$.datepicker._gotoToday = function (id) {
    //var inst = this._getInst($(id)[0]);
    //var date = new Date();
    //this._selectDay(id, date.getMonth(), date.getFullYear(), inst.dpDiv.find("td.ui-datepicker-today"));
    $(id).datepicker("setDate", new Date()).datepicker("hide").blur();
};

//cấu hình datetimepicker
$(".datetimepicker").datetimepicker();
$(".datetimepicker-from").datetimepicker({
    onSelect: function (selectedDateTime) {
        $(".datetimepicker-to").datetimepicker("option", "minDate", $(".datetimepicker-from").datetimepicker("getDate"));
    }
});
$(".datetimepicker-to").datetimepicker({
    onSelect: function (selectedDateTime) {
        $(".datetimepicker-from").datetimepicker("option", "maxDate", $(".datetimepicker-to").datetimepicker("getDate"));
    }
});

//cấu hình datatable
if ($.fn.dataTable) {
    $.fn.dataTable.ext.errMode = 'none';
}
$("table").css({ "width": "100%" });

// #endregion