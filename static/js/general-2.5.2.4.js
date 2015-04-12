function getCookie(c_name){
    try{
        return $.cookie(c_name);
    } catch (e) {
        return null;
    } 
}

function setCookie(c_name, value, expiredays){
    if (expiredays){
        $.cookie(c_name, value, { expires: expiredays,path: '/' });
    }else{
        $.cookie(c_name, value, { path: '/' });
    }
    
}

function delCookie(name)
{
    $.cookie(name,'', { expires: -1,path: '/' });
}

function noty_alert(msg,alerttype){
    noty({text : msg,type : alerttype,dismissQueue: true,layout : "bottom",buttons : false,timeout : 3000});
}

function noty_tips(msg,timeout,lay){
    if(!lay){
        lay = "topRight";
    }
    var n = noty({text : msg,type : 'warning',dismissQueue: true,layout : lay,buttons : false,timeout : timeout});
    return n;
}


function noty_warning(msg,timeout){
    var n = noty({text : msg,type : 'error',dismissQueue: true,layout : "topCenter",buttons : false,timeout : timeout});
    return n;
}

function noty_notice(msg,timeout,color){
    if(!color){
        color='info';
    }
    var n = noty({text : msg,type : color,dismissQueue: true,layout : "center",buttons : false,timeout : timeout,});
    return n;
}

function noty_confirm(msg,methodonok,methodoncancel){
    noty({
        text        : msg,
        type        : "confirm",
        dismissQueue: true,
        layout      : "bottom",
        buttons     : [
            {addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                $noty.close();
                choice = true;
                noty({force: true, text: '你已点击"Ok"按钮。', type: 'success', layout: 'bottom',timeout : 3000});
                methodonok();
            }
            },
            {addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                $noty.close();
                choice = false;
                noty({force: true, text: '你已点击"Cancel"按钮。', type: 'error', layout: 'bottom',timeout : 3000});
                methodoncancel();
            }
            }
        ]
    });
}


function xmonlink(active_e) {
    var turl = active_e.attr('turl');
    window.open(turl);
}

var intd=0;
function cp4versionclick(active_e){
    var turl = active_e.attr('turl');
    if(intd == 0)
        intd = 1;
    window.open(turl);
}


function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}

jQuery.fn.extend({
    enter: function(fn){
        $(this).bind('keydown',function(event){var e = event || window.event;if(!e.ctrlKey && e.keyCode ==13){if(typeof(fn)!='undefined')fn.call(this)}});
        return this;
    }
});

// $.ajaxSetup({
//     beforeSend : function(xhr){
//         var fingerprint = new Fingerprint().get();
//         console.log("fingerprint=" + fingerprint);
//         if (this.data){
//             this.data += "&fingerprint=" + fingerprint;
//         }else{
//             if (this.url.indexOf("rop") > 0 || this.url.indexOf("ropv2") > 0){
//                 if (this.url.indexOf("?") < 0){
//                     this.url += "/?fingerprint=" + fingerprint;
//                 }else{
//                     this.url += "&fingerprint=" + fingerprint;
//                 }
//             }
//         }
        
//         return true;
//     }
// });

function set_fingerprint(){
    var fingerprint = new Fingerprint().get();
    setCookie("fingerprint",fingerprint);
}

set_fingerprint();

var App = function() {
    var config = {
        sidebar: {
            enabled:true,
            tar_day:''
        },
        filter: true,
        page: '',
        usernotice : ''
    };

    var rophome = function() {
        $('#maindiv').jplist({ 
            items_box: '#mono',
            item_path: '.img_info',
            panel_path: '.intro_info'
        });
        var urenabled=$("#urenabled").val();
        if(urenabled=='False')
        {
           noty_tips('发布窗口关闭原因：<br><br><br><strong>'+$("#closereason").val()+'</strong>',600*1000,'ropRightCenter');
        }
        var cp4info = new Array();

        setInterval(ajax_cp4(activeday,datesource), 600*1000);
        function ajax_cp4(activeday,datesource){
            console.log("cp4", new Date());
            $.getJSON('/ropv2/api/getcp4?date='+activeday+'&datesource='+datesource, function(data){
                var cp4data = data["cp4info"];
                for (var i=0; i < cp4data.length; i++){
                    var cp4html = "<div class='col-md-12 row-fluid jirainfo'><div class='filter_panel panel panel-info'><div class='panel-heading jiratitle'><label class='panel-title versionname' style='color:#8DB3E2;'>版本名称：<a href='javascript:;' onclick='cp4versionclick($(this))' turl='"+cp4data[i]["jiraurl"]+"' style='font-weight:normal !important;'>"+cp4data[i]["projectname"]+"</a></label></div><div class='panel-body'><div class='filter'><span><p><span style='font-weight:bold;'>版本类型：</span>"+cp4data[i]["versiontype"]+"</p><p><span style='font-weight:bold;'>版本描述：</span></p><p>"+cp4data[i]["versiondescription"]+"</p><p><span style='font-weight:bold;'>所属项目：</span><a href='javascript:;' onclick='cp4versionclick($(this))' turl='"+cp4data[i]["versionurl"]+"' target='_blank' style='color:#8DB3E2;'>"+cp4data[i]["versionname"]+"</a></p><p><span style='font-weight:bold;'>项目ID：</span>"+cp4data[i]["cp4versionid"]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;'>ROI重要性：</span>"+cp4data[i]["importancelog"]+"</p><p><span style='font-weight:bold;'>项目目标：</span>"+cp4data[i]["target"]+"</p></span></div></div></div></div>"
                    cp4info[cp4data[i]["ropid"]] = cp4html;
                }
            });
        }

        $("#mono").mousemove(function(e){
            $(".markarraw").remove();
            $(".markmain").css("left", e.pageX-377+"px");
            $(".markmain").css("top", e.pageY-325+"px");
            $(".markcontent").css("padding", "5px 10px");
        });

        var roppop_temp = '<div class="popover markmain" role="tooltip"><div class="arrow markarraw"></div><h3 class="popover-title"></h3><div class="popover-content markcontent"></div></div>';
        var cp4pop_temp = '<div class="popover cp4main" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content cp4content"></div></div>';
        var default_temp = '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';

        function bindpopover(name,msg,placement,templatestr,hidetime,triggertype){
            $("."+name+"[data-toggle=popover]")
            .popover({
                  html:true,
                  content:msg,
                  trigger:triggertype,
                  delay: { show: 0, hide: hidetime },
                  placement:placement,
                  template:templatestr
            });
        }

        bindpopover("roplist","点击以至操作界面！","auto",roppop_temp,0,"hover");
        bindpopover("ropv2list","单击跳转至ROP2.0","auto",roppop_temp,0,"hover");

        $(".pscss").bind("mouseenter",function(){
            $(".pscss[data-toggle=popover]").popover('destroy');
            $(".roplist[data-toggle=popover]").popover('destroy');
            $(".ropv2list[data-toggle=popover]").popover('destroy');

            var ropid = $(this).attr("ropid");
            var msg = cp4info[ropid];
            if(msg == undefined){
                bindpopover("pscss","<span style='color:#000;'>此版本详情为空！<span>","auto",default_temp,0,'manual');
            }else{
                bindpopover("pscss",msg,"right",cp4pop_temp,2000,'manual');
            }
            $(this).popover('toggle');
        });

        $(".pscss").bind("mouseleave",function(){
            $(this).popover('toggle');
            bindpopover("roplist","点击以至操作界面！","auto",roppop_temp,0,"hover");
            bindpopover("ropv2list","单击跳转至ROP2.0","auto",roppop_temp,0,"hover");
        });

        $("#mono .roplist .rop").click(function(){
            var ropid = $(this).parent().attr("id");
            if (intd == 0){
                window.location.href="/ropv2/ropeditor/?ropid=" + ropid;
            }else{
                intd = 0;
            }
        });

        $("#mono .ropv2list .rop").click(function(){
            var ropid = $(this).parent().attr("id");
            if (intd == 0){
                window.location.href="/rop/ropeditor/?keyword=" + ropid;
            }else{
                intd = 0;
            }
        });

        var reloadhandle = setInterval(function(){window.location.reload();},120*1000);
    };

    var ropeditor = function (ropid,roptype,roppermission,release_group,test_group,today,enddate,cr_disableday,warden) {
        var urenabled=$("#urenabled").val();
//        if(urenabled)
//        {
//           noty_tips('发布窗口关闭原因：<br><br><br><strong>'+$("#closereason").val()+'</strong>',600*1000,'ropRightCenter');
//        }

        var prodflag = eval('['+ $("#departname").attr('productflag') +']');

        getxmoninfo();
        function getxmoninfo(){
            $('.xmon').each(function() {
                var webid = $(this).attr('id').split('_')[0];
                var url = 'http://xmon.sh.ctripcorp.com/rest/'+webid+'/' + webid;
                var htmlobj = $.ajax({url:url,async:false});
                var datas = $.parseJSON(htmlobj.responseText);
                if(parseInt(datas.status) == 1){
                    var appid = datas.appId;
                    $("#"+webid+"_xmon").html('<a href="http://xmon.sh.ctripcorp.com/index.jsp#/template/app/details?app='+appid+'&web='+webid+'" target="_blank"><img style="height:16px;width:16px;" src="/static/ropv2/img/xmon-normal.png"></a>');
                }else if(parseInt(datas.status) == 2 || parseInt(datas.status) == 3){
                    var appid = datas.appId;
                    $("#"+webid+"_xmon").html('<a href="http://xmon.sh.ctripcorp.com/index.jsp#/template/app/details?app='+appid+'&web='+webid+'" target="_blank"><img style="height:16px;width:16px;" src="/static/ropv2/img/xmon-warning.gif"></a>');
                }else{
                    $("#"+webid+"_xmon").html('<img style="height:16px;width:16px;" src="/static/ropv2/img/xmon-none.png" title="采集不到告警信息">');
                }
            });
        }
        setInterval(getxmoninfo,60*1000);
        $("body").css("height",$(window).height()+0.5);
        var tar_tab = getCookie(ropid+"_tab");
        if (tar_tab){
            $("a[href='#"+tar_tab+"']").click();
        }else{
            $('ul#app_detail li:first-child a').click();
        }

        $('ul#app_releasenote_fat li:first-child a').click();
        $('ul#app_releasenote_uat li:first-child a').click();
        $('ul#app_releasenote_prod li:first-child a').click();

        var tipnoty=null;

        var flow_progress = new Array();

        var fat_checked = new Object();
        var uat_checked = new Object();
        var pro_checked = new Object();

        function fill_progress(){
            $('.fat.flow-progress.inner-title').html("<table class='inner_table'><tr><td width='4%'>编译</td><td width='4%'>发布</td><td width='4%'>测试</td></tr></table>");
            $('.uat.flow-progress.inner-title').html("<table class='inner_table'><tr><td width='4%'>编译</td><td width='4%'>发布</td><td width='4%'>测试</td></tr></table>");
            $('.prod.flow-progress.inner-title').html("<table class='inner_table'><tr><td width='4%'>堡垒发布</td><td width='4%'>堡垒测试</td><td width='4.5%'>Baking发布</td><td width='4.5%'>Baking测试</td><td width='4%'>Rolling</td></tr></table>");

            for (var appkey in flow_progress){
                var appdict = flow_progress[appkey];
                for (var key in appdict){
                    var target = "#" + key + ".flow-progress";
                    $(target).html(appdict[key]);
                }
            }
        }

        function draw_flowprogress(app){
            var app_progress = new Array();
            var app_key = app.crappid + "_key";

            //fat_table
            var fat_key = app.crappid + "_fat";
            var fat_htmlstr = "<table class='inner_table'><tr>";
            var fatbuild = "<td width='4%'>";
            if (app.fatbuildstatus == 0){
                fatbuild += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.fatbuildstatus == 1){
                fatbuild += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.fatbuildstatus == 2){
                fatbuild += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.fatbuildstatus == 3){
                fatbuild += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            fatbuild += "</td>";

            var fatrelease = "<td width='4%'>";
            if (app.fatbuildstatus != 1 && app.fatreleaseresult == 0){
                fatrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.fatreleaseresult == 0){
                fatrelease += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.fatreleaseresult == 1){
                fatrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.fatreleaseresult == 2){
                fatrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.fatreleaseresult == 3){
                fatrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            fatrelease += "</td>";

            var fattest = "<td width='4%'>";
            if (app.fatreleaseresult != 1 && app.fattestresult == 0){
                fattest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.fattestresult == 0){
                fattest += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.fattestresult == 1){
                fattest += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.fattestresult == 2){
                fattest += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }
            fattest += "</td>";

            fat_htmlstr += fatbuild;
            fat_htmlstr += fatrelease;
            fat_htmlstr += fattest;

            fat_htmlstr += "</tr></table>";

            //uat_table
            var uat_key = app.crappid + "_uat";
            var uat_htmlstr = "<table class='inner_table'><tr>";
            var uatbuild = "<td width='4%'>";
            if(app.fattestresult != 1 && app.uatbuildstatus == 0){
                uatbuild += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if (app.uatbuildstatus == 0){
                uatbuild += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.uatbuildstatus == 1){
                uatbuild += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.uatbuildstatus == 2){
                uatbuild += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.uatbuildstatus == 3){
                uatbuild += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            uatbuild += "</td>";

            var uatrelease = "<td width='4%'>";
            if (app.uatbuildstatus != 1 && app.uatreleaseresult == 0){
                uatrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.uatreleaseresult == 0){
                if (app.uatwaveinfo){
                    uatrelease += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png' title='"+ app.uatwaveinfo +"'>";
                }else{
                    uatrelease += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
                }    
            }else if(app.uatreleaseresult == 1){
                uatrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.uatreleaseresult == 2){
                uatrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.uatreleaseresult == 3){
                uatrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            uatrelease += "</td>";

            var uattest = "<td width='4%'>";
            if (app.uatreleaseresult != 1 && app.uattestresult == 0){
                uattest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.uattestresult == 0){
                uattest += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.uattestresult == 1){
                uattest += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.uattestresult == 2){
                uattest += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }
            uattest += "</td>";

            uat_htmlstr += uatbuild;
            uat_htmlstr += uatrelease;
            uat_htmlstr += uattest;

            uat_htmlstr += "</tr></table>";

            //prod_table
            var prod_key = app.crappid + "_prod";
            var prod_htmlstr = "<table class='inner_table'><tr>";

            var smokingrelease = "<td width='4%'>";
            if (app.releasetype == 0 || app.releasemode == 1){
                smokingrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png' title='无法检测，请到生产发布单中查看。'>";
            }else if(app.releasetype != 3 || app.releasemode == 1){
                smokingrelease += "<img style='height:15px;width:15px;margin-bottom:1px;' src='/static/ropv2/img/icon-None.png'>";
            }else if(app.uattestresult != 1 && app.smokingreleaseresult == 0){
                smokingrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.smokingreleaseresult == 0){
                smokingrelease += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png' title='"+ app.prodwaveinfo +"'>";
            }else if(app.smokingreleaseresult == 1){
                smokingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.smokingreleaseresult == 2){
                smokingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.smokingreleaseresult == 3 && app.releasetoprod == 2){
                smokingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.smokingreleaseresult == 3){
                smokingrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            smokingrelease += "</td>";

            var smokingtest = "<td width='4%'>";
            if (app.releasetype == 0 || app.releasemode == 1){
                smokingtest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png' title='无法检测，请到生产发布单中查看。'>";
            }else if(app.releasetype != 3 || app.releasemode == 1){
                smokingtest += "<img style='height:15px;width:15px;margin-bottom:1px;' src='/static/ropv2/img/icon-None.png'>";
            }else if(app.smokingreleaseresult != 1 && app.smokingtestresult == 0){
                smokingtest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.smokingtestresult == 0){
                smokingtest += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.smokingtestresult == 1){
                smokingtest += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.smokingtestresult == 2){
                smokingtest += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }
            smokingtest += "</td>";

            var bakingrelease = "<td width='4.5%'>";
            if (app.releasetype == 0 || app.releasemode == 1){
                bakingrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png' title='无法检测，请到生产发布单中查看。'>";
            }else if(app.releasetype != 3 || app.releasemode == 1){
                bakingrelease += "<img style='height:15px;width:15px;margin-bottom:1px;' src='/static/ropv2/img/icon-None.png'>";
            }else if(app.smokingtestresult != 1 && app.bakingreleaseresult == 0){
                bakingrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.bakingreleaseresult == 0){
                bakingrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }else if(app.bakingreleaseresult == 1){
                bakingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.bakingreleaseresult == 2){
                bakingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.bakingreleaseresult == 3 && app.releasetoprod == 2){
                bakingrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }else if(app.bakingreleaseresult == 3){
                bakingrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>";
            }
            bakingrelease += "</td>";

            var bakingtest = "<td width='4.5%'>";
            if (app.releasetype == 0 || app.releasemode == 1){
                bakingtest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png' title='无法检测，请到生产发布单中查看。'>";
            }else if(app.releasetype != 3 || app.releasemode == 1){
                bakingtest += "<img style='height:15px;width:15px;margin-bottom:1px;' src='/static/ropv2/img/icon-None.png'>";
            }else if(app.bakingreleaseresult != 1 && app.bakingtestresult == 0){
                bakingtest += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>";
            }else if(app.bakingtestresult == 0 && app.releasetoprod != 1){
                bakingtest += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>";
            }else if(app.releasetoprod == 1 && app.bakingtestresult == 0){
                bakingtest += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>";
            }else if(app.bakingtestresult == 2){
                bakingtest += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>";
            }
            bakingtest += "</td>";

            var prodrelease = "<td width='4%'>";
            if (app.releasetype != 3 || app.releasemode == 1){
                prodrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png' title='无法检测，请到生产发布单中查看。'>"
                // if (app.uattestresult != 1 && app.releasetoprod == 0){
                //     prodrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>"
                // }
                // else if (app.releasetoprod == 0){
                //     prodrelease += "<img style='height:23px;width:23px;margin-top:2px;' src='/static/ropv2/img/icon-Init.png'>"
                // }
                // else if (app.releasetoprod == 1){
                //     prodrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>"
                // }
                // else if (app.releasetoprod == 2){
                //     prodrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>"
                // }
                // else if (app.releasetoprod == 3){
                //     prodrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>"
                // }
            }else{
                if (app.bakingreleaseresult != 1){
                    prodrelease += "<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Wait.png'>"
                }
                else if (app.bakingreleaseresult == 1 && app.releasetoprod == 3){
                    prodrelease += "<img style='height:17px;width:17px;margin-bottom:3px;' src='/static/ropv2/img/icon-Running.png'>"
                }
                else if (app.releasetoprod == 1){
                    prodrelease += "<img style='height:15px;width:15px;margin-bottom:2px;' src='/static/ropv2/img/icon-Complete.png'>"
                }
                else if (app.releasetoprod == 2){
                    prodrelease += "<img style='height:15px;width:15px;margin-bottom:2px;margin-left:2px;' src='/static/ropv2/img/icon-Fail.png'>"
                }
            }

            prodrelease += "</td>";

            prod_htmlstr += smokingrelease;
            prod_htmlstr += smokingtest;
            prod_htmlstr += bakingrelease;
            prod_htmlstr += bakingtest;
            prod_htmlstr += prodrelease;
            prod_htmlstr += "</tr></table>";

            app_progress[fat_key] = fat_htmlstr;
            app_progress[uat_key] = uat_htmlstr;
            app_progress[prod_key] = prod_htmlstr;

            flow_progress[app_key] = app_progress;
        }

        function showtip(msg,timeout){
            if (tipnoty){
                tipnoty.close();
                tipnoty = null;
            }
            tipnoty = noty_tips(msg,timeout);
            var cookiename = ropid+ '_tips';
            // setCookie(cookiename,msg,1);
        }

        // var cache_tips = getCookie(ropid+ '_tips');
        // if (cache_tips){
        //     showtip(cache_tips,120*1000);
        // }

        var current_plandate = $("#plandate").val();
        if ($.inArray(current_plandate, cr_disableday) != -1){
            var timeout = 180 * 1000;
//            showtip('<strong>没有对应的发布窗口！</strong><br><br>发布计划日期当天无对应类型的生产发布窗口，请修改计划发布时间。<br><br>在此情况下的发布计划，将无法发布生产!',timeout);
            if(urenabled=='False')
                {
                   noty_tips('发布窗口关闭原因：<br><br><br><strong>'+$("#closereason").val()+'</strong>',600*1000,'ropRightCenter');
                }
            else{
                noty_tips('<strong>没有对应的发布窗口！</strong><br><br>发布计划日期当天无对应类型的生产发布窗口，请修改计划发布时间。<br><br>在此情况下的发布计划，将无法发布生产!',timeout,'ropRightCenter');
                }
        }

        function loadui(){
            if (roppermission){
                if (!roppermission.departinfo){
                    $(".departinfo").attr("disabled","disabled");
                }
                if (!roppermission.propqa){
                    $(".propqa").attr("disabled","disabled");
                }
                if (!roppermission.propowner){
                    $(".propowner").attr("disabled","disabled");
                }
                if (!roppermission.saveprop){
                    $(".saveprop").attr("disabled","disabled");
                }
                if (!roppermission.addapp){
                    $(".addapp").attr("disabled","disabled");
                }
                if (!roppermission.firetry){
                    $(".firetry").attr("disabled","disabled");
                }
            }
        }
        loadui();

        function loadcontrolui(active_e){
            var parent = active_e.parent("td");
            if (parent.hasClass('fat')){
                loadinternal('fat');
            }else if (parent.hasClass('uat')){
                loadinternal('uat');
            }else if (parent.hasClass('prod')){
                loadinternal('prod');
            }
        }

        function loadinternal(progress){
            var applist = get_selectedapp(progress);
            if (progress == 'fat'){
                var map = {'fat_testpass':null,'fat_testfail':null,'fat_release':null,'fat_build':null,'fat_stopbuild':null};
            }else if (progress == 'uat'){
                var map = {'uat_build':null,'uat_stopbuild':null,'uat_release':null,'uat_testpass':null,'uat_testfail':null};
            }else if (progress == 'prod'){
                var map = {'smoking_testpass':null,'smoking_testfail':null,'baking_testpass':null,'baking_testfail':null,'prod_release':null};
            }
            for (var i=0,len=applist.length;i<len;i++){
                var appkey="app_"+applist[i];

                if(!roppermission[appkey]){
                    window.location.reload();
                }

                $.each(map, function(key){
                    if (map[key]){
                        map[key].value = map[key].value && roppermission[appkey][key].value;
                    }else{
                        map[key] = {'value':null,'msg':''};
                        map[key].value = roppermission[appkey][key].value;
                    }
                    if (roppermission[appkey][key].msg != ""){
                        map[key].msg += "[" + applist[i] + "] " + roppermission[appkey][key].msg + " ";
                    }
                });
            }

            $.each(map, function(key,value){
                var target = '.'+key;
                var msg = target+'_msg';
                $(target).removeAttr("disabled");
                if(!$(msg).hasClass("hide")){
                    $(msg).addClass("hide");
                }
                $(msg).removeAttr("tooltip");
                if(value){
                    if(!value.value){
                        $(target).attr("disabled","disabled");
                        $(msg).attr("title",value.msg);
                        $(msg).removeClass("hide");
                    }
                }
            });
        }

        $('#app_detail a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
        });

        $('.plan_date').datetimepicker({
            startView: 2,
            minView: 2,
            format: "yyyy-mm-dd",
            autoclose: 1,
            todayHighlight: 1,
            startDate: today,
            endDate: enddate,
            daysOfDisabled: cr_disableday,
            showactive: 1
        });

        var depart_val = null;
        $("#departname").change(function (){
            var v = $(this).val();
            var category = $(this).attr("category")
            var hoduid = $(this).attr("hoduid")
            depart_val = v;
            var selector = "#prodname[category='"+category +"']"
            $(selector).load();
            if((roptype == 'UR' && prodflag.indexOf(parseInt(depart_val)) != -1)){ //ur48
                $("#hodtd").remove();
                $("#hodsl").remove();
                if(hoduid){
                    $("#roptr").append("<td id='hodtd'>紧急单审批人：</td><td class='value_td' id='hodsl'><select disabled='"+disabled+"' id='hoduser' class='departinfo' category='{{rop.id}}'><option>请选择...</option></select></td>");
                    }
                else{
                    $("#roptr").append("<td id='hodtd'>紧急单审批人：</td><td class='value_td' id='hodsl'><select id='hoduser' class='departinfo' category='{{rop.id}}'><option>请选择...</option></select></td>");
                }

                turl = "/ropv2/api/gethodlist/"+v;
                htmlobj=$.ajax({url:turl,async:false});
                var datas = $.parseJSON(htmlobj.responseText)
                $("#hoduser").find("option").remove()
                $("#hoduser").append("<option>请选择...</option>");
                for (var i=0;i<datas.length;i++)
                {
                    if(datas[i].id==hoduid){
                        $("#hoduser").append("<option value='"+datas[i].id+"' selected>"+datas[i].name+"</option>");
                    }else{
                     $("#hoduser").append("<option value='"+datas[i].id+"'>"+datas[i].name+"</option>");
                        }

                }
            }else{
                $("#hodtd").remove();
                $("#hodsl").remove();
            }

            ur_getname();
        });

        function warden_init(){
            var depart_val = $("#departname").val();
            var prod_val = $("#prodname").val();
            if (!(prod_val && depart_val))
                return;

            var warden_api = "/ropv2/api/wardenlist/?departname="+depart_val+"&prodname="+prod_val;

            $('#warden textarea').textext('destroy');
            $('#warden').html('<textarea rows="1" style="width: 900px; resize: none;"></textarea>');
            $('#warden textarea')
                .textext({
                    plugins : 'autocomplete filter tags ajax prompt',
                    prompt  : '填入邮件地址，按回车继续……',
                    ajax : {
                        url : warden_api,
                        dataType : 'json',
                        cacheResults : true
                    }
                })
                .bind('isTagAllowed', function(e,data){
                    if(checkEmail(data.tag)){
                        data.result = true;
                    }else{
                        noty_alert("邮件地址不合法！",'error');
                        data.result = false;
                    }
                });

            var tags = [];
            if (warden){
                $.each(warden,function(key){
                    var wemail = warden[key]
                    var tag = $("#warden textarea").data('textext').itemManager().stringToItem(wemail);
                    if (tag && tag != '')
                        tags.push(tag);
                });

                $("#warden textarea").data('textext').tags().addTags(tags);
            }
        }

        $("#prodname").load(function (){
            if (depart_val != null){
                get_option($(this),depart_val);
                $(".product[category='UR']").change();
                warden_init();
            }
        });

        warden_init();

        $("#prodname").change(function(){
            warden_init();
        });

        function ur_getname(){
            if (roptype != 'UR')
                return

            var plandate =$("#plandate").val();
            if (!plandate){
                return
            }

            var prodname =$("#prodname").val();
            if (!prodname){
                return
            }

            url = "/ropv2/api/getprojectname/?prodname=" + prodname + "&created_time=" + plandate;
            var htmlobj=$.ajax({url:url,async:false});
            var projectname = htmlobj.responseText;
            $("#projectname").text("发布版本名称："+projectname);
        }

        $('.plan_date').on('changeDate', ur_getname);

        function get_option(active_e,depart_val){
            turl = "/ropv2/api/get_productinfo/"+depart_val;
            htmlobj=$.ajax({url:turl,async:false});
            var datas = $.parseJSON(htmlobj.responseText)
            active_e.find("option").remove()
            for (var i=0;i<datas.length;i++)
            {
                 active_e.append("<option value='"+datas[i].id+"'>"+datas[i].name+"</option>");
                 active_e.selectedIndex = -1;
            }
        }

        $('#save_ropinfo').click(function(){
            var departname = $("#departname").val();
            var prodname = $("#prodname").val();
            var plandate = $("#plandate").val();
            var release_owner = $("#release_owner").val();
            var test_owner = $("#test_owner").val();
            var urreason = $("#urreason").val();
            var hoduid =$("#hoduser").val();
            var wardenlist = $("#warden textarea").data('textext').hiddenInput().val();

            if (departname == "请选择..." || departname == null || departname==-1){
                noty_alert("一级产品线不能为空或Unknown，保存失败！",'error');
            }else if (prodname == "" || prodname == null){
                noty_alert("二级产品线为空，保存失败！",'error');
            }else if (plandate == "" || plandate == null){
                noty_alert("计划发布时间为空，保存失败！",'error');
            }else if (release_owner == "" || release_owner == null){
                noty_alert("发布负责人为空，保存失败！",'error');
            }else if ($.inArray(release_owner, release_group)== -1){
                noty_alert("发布负责人异常，保存失败！",'error');
                showtip("<strong>发布负责人异常！</strong><br><br>RM组近期调整过发布负责人权限，如果本文框中输入你的中文名字没有待选项时，表示你可能已没有权限。<br><br>如有疑问请联系<a href='mailto:CSO_rm@Ctrip.com?subject=ROP2.5发布负责人保存异常'>流程组</a>",120*1000);
            }else if (test_owner == "" || test_owner == null){
                noty_alert("测试负责人为空，保存失败！",'error');
            }else if ($.inArray(test_owner, test_group)== -1){
                noty_alert("测试负责人异常，保存失败！",'error');
            }else if (roptype == "UR" && (urreason == "请选择..." || urreason == null)){
                noty_alert("紧急发布原因，保存失败！",'error');
            }else if(roptype == "UR" && (hoduid == "请选择..." || hoduid == null) && prodflag.indexOf(parseInt(departname)) != -1){ //ur48
                noty_alert("紧急单必须选择紧急单审批人，保存失败！",'error');
            }
            else{
                $.get("/ropv2/api/saverop/",
                {
                    ropid:ropid,
                    departname:departname,
                    prodname:prodname,
                    release_owner:release_owner,
                    plandate:plandate,
                    test_owner:test_owner,
                    urreason:urreason,
                    hoduid:hoduid,
                    warden:wardenlist
                },
                function(data,status){
                    var ret = $.parseJSON(data);
                    if (ret.msg){
                        noty_alert(ret.msg,'error');
                        return;
                    }
                    noty_alert("保存成功！",'success');
                    window.location.href="/ropv2/ropeditor/?ropid="+ret.ropid;
                });
            }
        });

        var cb = getCookie(ropid + "_cb");
        if (cb == "true"){
            $(".coll-btn[category='ropconfig']").addClass("active");
        }else if(cb == 'false'){
            $(".coll-btn[category='ropconfig']").removeClass("active");
        }

        var ca = getCookie(ropid + "_ca");
        if (ca == "true"){
            $(".coll-btn[category='ropapp']").addClass("active");
        }else if(ca == 'false'){
            $(".coll-btn[category='ropapp']").removeClass("active");
        }

        if((!$(".coll-btn[category='ropconfig']").hasClass("active"))){
            $(".ropconfig_body").slideUp(0);
            $(".coll-btn[category='ropconfig']").html("<i class='glyphicon glyphicon-chevron-down'></i>");
        }else{
            $(".coll-btn[category='ropconfig']").html("<i class='glyphicon glyphicon-chevron-up'></i>");
        }

        if(!$(".coll-btn[category='ropapp']").hasClass("active")){
            $(".ropconfig_apps").slideUp(0);
            $(".coll-btn[category='ropapp']").html("<i class='glyphicon glyphicon-chevron-down'></i>");
        }else{
            $(".coll-btn[category='ropapp']").html("<i class='glyphicon glyphicon-chevron-up'></i>");
        }

        function removeall(){
            for (var i=0,len=handler.length;i<len;i++){
                window.clearTimeout(handler[i]);
                delete handler[i];
            }
            $("td").removeClass('header-active');
            $(".app-row td").removeClass('panel-active');
            $(".app-panel").addClass('hide');
            $(".release_log").addClass('hide');
        }

        function mouseenter(target){
            var td = "td"+target;
            var row = ".app-row "+target;
            var panel = ".app-panel"+target;
            var note = ".release_log"+target;

            removeall();
            $(td).addClass('header-active');
            $(row).removeClass('header-active');
            $(row).addClass('panel-active');
            $(panel).removeClass('hide');
            $(note).removeClass('hide');
        }

        function mouseleave(target){
            var td = "td"+target;
            var row = ".app-row "+target;
            var panel = ".app-panel"+target;
            var note = ".release_log"+target;

            $(td).removeClass('header-active');
            $(row).removeClass('panel-active');
            $(panel).addClass('hide');
            $(note).addClass('hide');
        }

        var handler = [];

        function progress_to_checkbox(progress){
            $('.cb_center.check-box').addClass("flow-progress");
            $('.cb_center.check-box').removeClass("check-box");

            var target = "td"+progress;
            var progress_str = progress.substring(1);
            $.each($(target),function(){
                $(this).removeClass("flow-progress");
                $(this).addClass("check-box");

                if ($(this).attr('crappid') == null){
                    var html_str = "<input type='checkbox' id='"+progress_str+"_selectall' crappid='-1' progress='"+progress+"'>全选</i>";
                    $(this).html(html_str);
                }else{
                    var crappid = $(this).attr('crappid');
                    var apptype = $(this).attr('apptype');
                    var releasetoprod = $(this).attr('releasetoprod');
                    var html_str = "<input type='checkbox' releasetoprod='"+releasetoprod+"' crappid='"+crappid+"' class='app_"+crappid+"' progress='"+progress+"' apptype='"+apptype+"'></i>";
                    $(this).html(html_str);
                }
                if (progress == '.fat'){
                    setcheckedvalue(fat_checked, crappid);
                }else if (progress == '.uat'){
                    setcheckedvalue(uat_checked, crappid);
                }else if (progress == '.prod'){
                    setcheckedvalue(pro_checked, crappid);
                }
            });

            function setcheckedvalue(object_checked, crappid){
                if (object_checked[crappid] == undefined && object_checked['-1'] == true) {
                    $('input.app_' + crappid).prop('checked', true);
                }else if(object_checked[crappid] != undefined){
                    $('input.app_' + crappid).prop('checked', object_checked[crappid]);
                }
            }

            $("input[type='checkbox']").click(function(){
                var crappid=$(this).attr('crappid');
                var progress = $(this).attr('progress');
                var value = $(this).prop('checked');
                if (progress == '.fat'){
                    fat_checked[crappid] = value;
                }else if (progress == '.uat'){
                    uat_checked[crappid] = value;
                }else if (progress == '.prod'){
                    pro_checked[crappid] = value;
                }
                var cb_group = $("input[crappid='"+crappid+"']");
                var index=$.inArray($(this)[0],cb_group);
                cb_group.splice(index,1);
                cb_group.prop("checked",false);
                if (crappid != -1){
                    $("input[crappid='-1']").prop("checked",false);
                    loadcontrolui($(this));
                }
                var progress = $(this).attr("progress");
                $(".ctrl-header[progress='"+progress+"']").click();
            });

            $('#'+progress_str+'_selectall').click(function() {
                var progress = $(this).attr("progress");
                selectall($(this),progress);
                loadinternal(progress.substring(1));
                $(".ctrl-header[progress='"+progress+"']").click();
            });
        }

        $(".ctrl-header").click(function(){
            var progress = $(this).attr("progress");
            $(".ctrl-header-active").addClass("ctrl-header");
            $(".ctrl-header-active").removeClass("ctrl-header-active");
            progress_list = ['.fat','.uat','.prod']
            for (var i in progress_list){
                if (progress == progress_list[i])
                    continue;
                mouseleave(progress_list[i]);
            }
            $(this).addClass("ctrl-header-active");
            $(this).removeClass("ctrl-header");
            mouseenter(progress);

            progress_to_checkbox(progress);
            fill_progress();
        });

        var in_controlfield = null;

        $(".fat").on('mouseenter',function(){
            in_controlfield = 'in';
        });
        $(".uat").on('mouseenter',function(){
            in_controlfield = 'in';
        });
        $(".prod").on('mouseenter',function(){
            in_controlfield = 'in';
        });

        $(".ctrl-header").on('mouseenter',function(){
            in_controlfield = 'in';
        });

        $(".ctrl-header").on('mouseleave',function(){
            in_controlfield = "left";
        });

        $(".fat").on('mouseleave',function(){
            in_controlfield = "left";
        });
        $(".uat").on('mouseleave',function(){
            in_controlfield = "left";
        });
        $(".prod").on('mouseleave',function(){
            in_controlfield = "left";
        });

        $("#fat_env").click(function(){
            in_controlfield = 'in';
        });

        $("body").click(function(){
            if (!in_controlfield || in_controlfield != 'left'){
                return;
            }
            $(".ctrl-header-active").addClass("ctrl-header");
            $(".ctrl-header-active").removeClass("ctrl-header-active");
            progress_list = ['.fat','.uat','.prod']
            for (var i in progress_list){
                target = progress_list[i];
                mouseleave(target);

                var target_ele = "td"+target;
                $.each($(target_ele),function(){
                    $(this).removeClass("check-box");
                    $(this).addClass("flow-progress");
                });
            }

            fill_progress();
        });

        function selectall(active_e,target){
            var checked = active_e.prop('checked');
            $("input[type='checkbox']").prop('checked',false);
            $(target+" input[type='checkbox']").prop('checked',checked);
            $(".app-row.hide "+target+" input[type='checkbox']").prop('checked',false);
        }

        $(".ropconfig_title").click(function(){
            var obj = $(this).find(".coll-btn");
            console.log(obj);
            collclick(obj);
        });

        function collclick(active_e){
            var target = active_e.attr("category");
            var filter = "";
            var cookiename = "";
            if (target=="ropconfig"){
                filter = ".ropconfig_body";
                cookiename = ropid + "_cb";
            }else if (target=="ropapp"){
                filter = ".ropconfig_apps";
                cookiename = ropid + "_ca";
            }

            if (active_e.hasClass("active")){
                active_e.removeClass("active");
                $(filter).slideUp(300);
                active_e.html("<i class='glyphicon glyphicon-chevron-down'></i>");
                setCookie(cookiename, 'false', 5);
            }else{
                active_e.addClass("active");
                $(filter).slideDown(300);
                active_e.html("<i class='glyphicon glyphicon-chevron-up'></i>");
                setCookie(cookiename, 'true', 5);
            }
        }

        var modelhtml = "<div class='modal fade' id='iframe' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button></div><div class='modal-body'><iframe src='%url%'></iframe></div></div></div></div>";

        function bindreload(){
            $("#iframe").on("hidden.bs.modal",function(){
                loadapp(false);
            });
        }

        function bindiframe(){
            $(".frame").click(function(){
                var url = $(this).attr("link");
                fillmodal(url);
            });
        }

        function binddisplayapp(){
            $(".displayapp").click(function (){
                var crappid = $(this).attr('crappid');
                var state = $(this).attr('viewable');
                var msg = '';
                if (state == '0'){
                    msg = "禁用此APP之后将只有发布负责人可以启用。确定禁用？";
                }else{
                    msg = "启用此APP之后可能造成应用冲突。确定启用？";
                }

                noty_confirm(
                    msg,
                    function(){
                        turl = "/ropv2/api/displayapp/?crappid="+crappid+"&state="+state+"&ropid="+ropid;
                        htmlobj=$.ajax({url:turl,async:false});
                        result = $.parseJSON(htmlobj.responseText);
                        if(result.status=='OK'){
                            window.location.reload();
                        }else{
                            noty_alert(result.msg,'error');
                        }
                    },
                    function(){}
                );
            });
        }

        bindiframe();

        function fillmodal(url){
            var str = modelhtml.replace(/%url%/g,function(all){
                return url || all;
            })
            $("#tabcontainer").html(str);
            bindreload();
        }

        $(".addsub").click(function(){
            var apptype= $(this).attr("apptype");
            url = "/ropv2/api/createsubrop/?apptype=" + apptype + "&ropid=" + ropid;
            var htmlobj=$.ajax({url:url,async:false});
            var retdata = JSON.parse(htmlobj.responseText);
            if (retdata.msg){
                noty_alert(retdata.msg,'error');
                return;
            }else{
                fillmodal(retdata.configurl);
                $('#iframe').modal({backdrop:'static'});
                $('#iframe').modal('show');
            }
        });

        function get_selectedapp(progress){
            var target = "td." + progress + " input[type='checkbox']:checked";
            var applist = [];
            $(target).each(function(){
                var value = $(this).attr('crappid');
                if (value != '-1')
                    applist.push(value);
            });
            return applist;
        }

        function need_confirm(progress){
            if (progress != 'fat'){
                return;
            }

            var target = "td." + progress + " input[type='checkbox']:checked";
            result = false;
            $(target).each(function(){
                var value = $(this).attr('apptype');
                if (value) {
                    var releasetoprod = $(this).attr('releasetoprod');
                    var needconfirmapp = ['ios','adnroid','uislot','gsh5','h5hybrid','netui'];
                    if (needconfirmapp.indexOf(value.toLowerCase()) != -1 && releasetoprod == '1')
                        result = true;
                }
            });

            return result;
        }

        function release_tips(env){
            var timeout=180*1000;
            if (env==4){
                timeout = 600*1000;
                showtip('<strong>你点击了生产发布（PROD）！</strong><br><br>非LD发布应用，请点击该应用最新的生产发布单号，跳转至CROLLER操作。<br><br>非LD生产发布完成后，如需重新发布，请在回退完成后进行!',timeout);
            }else if (env==301){
                showtip('<strong>你点击了集成测试（UAT）发布！</strong><br><br>非LD发布应用，等待发布完成后开始测试！<br><br>LD应用，仅有计划发布时间为当天的LD应用才会被自动触发uat发布。<br><br>发布计划为当天的LD应用，请等待每10分钟一次的LD自动发布！如长时间未发布，请联系CROLLER组！',timeout);
            }else{
                showtip('<strong>你点击了功能测试（FAT）发布！</strong><br><br>请等待发布完成后开始测试！如果发布状态为[FAT]发布失败，表示fat目标环境发布失败，请点击记录中发布日志纠错！',timeout);
            }
        }

        function build_release_internal(applist,progress,env){
            $.post("/ropv2/api/buildapp/",
            {
                "applist":applist,
                "progress":progress,
                "autorelease":env,
                "ropid":ropid
            },
            function(data,status){
                loadapp(true);
                var state = JSON.parse(data)['status']
                if (state == 'OK'){
                    noty_alert(JSON.parse(data)['msg'],'information');
                }else{
                    noty_alert(JSON.parse(data)['msg'],'error');
                }
                release_tips(env);
            });
        }

        $(".build_release").click(function(){
            var progress = $(this).attr("progress");
            var applist = get_selectedapp(progress);
            if(applist.length==0){
                noty_alert("请选择目标APP！",'error');
                return
            }
            var env = $("#"+progress+"_env").val();
            if (env=="请选择..." && progress=="fat"){
                noty_alert("请选择发布环境！",'error');
                return;
            }else if (progress=="uat"){
                env=301;
            }
            console.log(applist);

            if (need_confirm(progress)){
                noty_confirm(
                    "点击OK将重置发布流程，已发布生产版本的不会回退，确定继续？",
                    function(){
                        build_release_internal(applist,progress,env)
                    },
                    function(){}
                );
            }else{
                build_release_internal(applist,progress,env);
            }
        });

        $(".release").click(function(){
            var progress = $(this).attr("progress");
            var applist = get_selectedapp(progress);
            if(applist.length==0){
                noty_alert("请选择目标APP！",'error');
                return
            }
            var env = $("#"+progress+"_env").val();
            if (env=="请选择..." && progress=="fat"){
                noty_alert("请选择发布环境！",'error');
                return;
            }else if (progress=="uat"){
                env=301;
            }

            tarapplist = []
            if (progress=="prod") {
                $.each(applist,function(key){
                    var crappid = applist[key]
                    var tars_url = $("." + crappid + "_header").attr("tarsdashboard");

                    if (tars_url){
                        window.open(tars_url);
                    }else{
                        tarapplist.push(crappid);
                    }
                });
            }else{
                tarapplist = applist;
            }

            console.log(tarapplist);
            console.log(env);
            $.post("/ropv2/api/releaseapp/",
            {
                "applist":tarapplist,
                "env":env,
                "ropid":ropid
            },
            function(data,status){
                var state = JSON.parse(data)['status'];
                if (state == 'OK'){
                    noty_alert(JSON.parse(data)['msg'],'information');
                }else{
                    noty_alert(JSON.parse(data)['msg'],'error');
                }
                
                release_tips(env);
            });
        });

        function refresh_app(apps){
            for (var i=0,len=apps.length;i<len;i++){
                var planwindow = "#" + apps[i].crappid + "_planwindow";
                var status = "#" + apps[i].crappid + "_status";
                var xmonlink = "#" + apps[i].crappid + "_xmonlink";
                var ldwarning = "#" + apps[i].crappid + "_ldwarning";
                var hodflag ="#" + apps[i].crappid+"_hod";
                if ($(status).length == 0 && apps[i].enabled == 1){
                    window.location.reload();
                }

                $(planwindow).text(apps[i].planwindow);
                $(status).html("<span data-toggle='popover'>"+apps[i].status+"</span>");
                if (apps[i].xmonlink){
                    $(xmonlink).html("[<a href='"+apps[i].xmonlink+"' target='_blank' style='color: red;'>刹车记录</a>]");
                    $(xmonlink).removeClass('hide');
                }else{
                    $(xmonlink).html('');
                    $(xmonlink).addClass('hide');
                }
                hod=apps[i].hodflag.toString();
                if(hod!=''){
                    if (hod =='1'){
                        $(hodflag).html("<img style='height:16px;width:16px;' src='/static/ropv2/img/icon-Complete.png' title='"+apps[i].hodtitle+"'>");
                    }else if(hod =='2'){
                        $(hodflag).html("<img style='height:16px;width:16px;' src='/static/ropv2/img/icon-Fail.png' title='"+apps[i].hodtitle+"'>");
                    }else if(hod =='0'){
                        $(hodflag).html("<img style='height:21px;width:21px;' src='/static/ropv2/img/icon-Init.png' title='"+apps[i].hodtitle+"'>");
                    }
                }
                else{
                    $(hodflag).html("");
                }

                if (apps[i].ldwarning){
                    $(ldwarning).html("[<span style='color:red;' title='" + apps[i].ldwarning + "'>冲突警告</span>]");
                    $(ldwarning).removeClass('hide');
                }else{
                    $(ldwarning).html('');
                    $(ldwarning).addClass('hide');
                }

                if ('arrangeinfo' in apps[i]){
                    var arrangeinfo_temp = '<div class="popover" role="tooltip" style="width: 600px; max-width: 600px; top: 278px; left: 85px; display: block;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
                    $(status+" span[data-toggle=popover]").popover({
                          html:true,
                          content:apps[i].arrangeinfo,
                          trigger:"hover",
                          placement:"top",
                          template:arrangeinfo_temp,
                          delay: { show: 0, hide: 2000 }
                    });
                }
                $('#'+apps[i].crappid+'_status').removeClass('redfont');
                if ('rollbackfail' in apps[i] || 'prodfailmsg' in apps[i]){
                    var keystr = '';
                    if (apps[i].rollbackfail) {
                        keystr = "回退失败";
                        var content = keystr + ",原因如下:" + apps[i].rollbackfail + ",有问题请联系<a href='mailto:RDrelease@Ctrip.com'>Croller</a>";
                    }else if(apps[i].prodfailmsg){
                        keystr = "生产发布失败";
                        var content = keystr + ",原因如下:" + apps[i].prodfailmsg + ",有问题请联系<a href='mailto:RDrelease@Ctrip.com'>Croller</a>";
                        $('#'+apps[i].crappid+'_status').addClass('redfont');
                    }
                    if (keystr){
                        var fail_temp = '<div class="popover" role="tooltip" style="width: 600px; max-width: 600px; top: 278px; left: 85px; display: block;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
                        $(status+" span[data-toggle=popover]").popover({
                              html:true,
                              content:content,
                              trigger:"hover",
                              placement:"top",
                              template:fail_temp,
                              delay: { show: 0, hide: 2000 }
                        });
                    }
                }
                if ("buildlog" in apps[i]){
                    var buildlog = "#" + apps[i].crappid + "_buildlog";
                    $(buildlog).html("<a data-toggle='modal' data-target='#iframe' class='frame' href='javascript:;' link="+apps[i].buildlog+"'>编译日志</a>");
                }
                if (apps[i].show_rollback){
                    var rollback = "#" + apps[i].crappid + "_rollback";
                    $(rollback).html("<a url='"+apps[i].rollback+"' crappid='"+apps[i].crappid+"' class='rollback'>回退</a>");
                }

                $("#"+apps[i].crappid+"_fat").attr("releasetoprod",apps[i].releasetoprod);
                $("#"+apps[i].crappid+"_uat").attr("releasetoprod",apps[i].releasetoprod);
                $("#"+apps[i].crappid+"_prod").attr("releasetoprod",apps[i].releasetoprod);

                //  if (apps[i].autorelease && apps[i].status.indexOf("BuildOK") > 0 && apps[i].autorelease != 0){
                    // $.post("/ropv2/api/releaseapp/",
                    // {
                    //     "applist":[apps[i].crappid],
                    //     "env":-1,
                    //     "ropid":ropid
                    // },
                    // function(data,status){
                    //     noty_alert(JSON.parse(data)['msg'],'information');    
                    // });
                //  }

                draw_flowprogress(apps[i]);

            }

            fill_progress();
        }

        function fill_appconfig(apps,apptype,isowner){
            var header = '<tr><td width="48%">应用名称</td><td width="10%">添加人</td><td width="10%">更改人</td><td width="10%">应用配置</td><td width="12%">更新时间</td><td width="10%">隐藏操作</td></tr>';
            var body = '<tr>';

            $.each(apps,function(key){
                var app = apps[key];
                if (apptype.indexOf('ld') != -1){
                    body += '<td width="48%" title="' + app.itempath + '">' + app.appname + '</td>';
                }else{
                    body += '<td width="48%">' + app.appname + '</td>';
                }

                body += '<td width="10%">' + app.owner + '</td>';
                body += '<td width="10%">' + app.updater + '</td>';
                body += '<td width="10%"><a data-toggle="modal" data-backdrop="static" data-target="#iframe" class="frame" href="javascript:;" link="' + app.appconfig + '">应用配置</a></td>';
                body += '<td width="12%">' + app.modifiedtime + '</td>';
                if (!isowner && app.enabled == 0){
                    body += '<td>启用</td>';
                }else{
                    body += '<td width="10%"><a href="javascript:;" crappid="' + app.crappid + '" class="displayapp" ';
                    if (app.enabled == 0){
                        body += 'viewable="1">启用';
                    }else{
                        body += 'viewable="0">禁用';
                    }
                    body += '</a></td>';
                }

                body += '</tr>';
            });

            var tablehtml = header + body;
            $('table[apptype="'+apptype+'"]').html(tablehtml);
        }

        function fill_notetable(notes,env,isld){
            var body = "";
            for (var i=0,nlen=notes.length;i<nlen;i++){
                for (var j=0,rlen=notes[i].rows.length;j<rlen;j++){
                    var count = notes[i].count;
                    var row = notes[i].rows[j];

                    if(row.enabled == 0){
                        body += "<tr class='app-row hide'>";
                    }else{
                        body += "<tr class='app-row'>";
                    }
                    if(row.crplanid != 0){
                        if("releaseconfig" in row){
                            if (isld && row.releasetype == '常规单'){
                                body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.release+"' target='_Blank' style='margin-right:20px;'>"+row.crplanid+"</a></td>";
                            }else if (isld && row.releasetype == '回退单'){
                                body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.release+"' target='_Blank' style='margin-left:20px;'>"+row.crplanid+"</a></td>";
                            }else if ((!isld) && row.releasetype == '常规单'){
                                body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.release+"' class='btn btn-primary' target='_Blank' style='margin-right:20px;'>至发布单-"+row.crplanid+"</a></td>";
                            }else if ((!isld) && row.releasetype == '回退单'){
                                body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.release+"' class='btn btn-primary' target='_Blank' style='margin-left:20px;'>至发布单-"+row.crplanid+"</a></td>";
                            }
                        }else{
                            body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.release+"' target='_Blank'>"+row.crplanid+"</a></td>";
                        }
                        body += "<td class='cb_center' rowspan='"+count+"'>"+row.env+"</td>";
                        body += "<td class='cb_center' rowspan='"+count+"'>"+row.planst+"</td>";
                        if ( row.env == 'prod' || row.env == 'pro') {
                            body += "<td class='cb_center' rowspan='" + count + "'>" + row.releasetype + "</td>";
                        }
                        body += "<td class='cb_center' rowspan='"+count+"'><a href='"+row.releaselog+"' target='_blank'>发布日志</a></td>";
                    }
                    body += "<td class='cb_center'>"+row.appname+"</td>";
                    body += "<td class='cb_center'>"+row.appst+"</td>";
                    if("releaseconfig" in row){
                        if (row.apptype == 'DB'){
                            body += "<td class='cb_center'>无配置</td>";
                        }else{
                            body += "<td class='cb_center'><a href='"+row.releaseconfig+"' target='_blank'>发布配置</a></td>";
                        }
                    }else if (env == 'prod'){
                        body += "<td class='cb_center'>无配置</td>";
                    }
                    body += "<td class='cb_center'>"+row.lastmodidied+"</td>";
                    body += "<td class='cb_center'>" + row.createdtime + "</td>";
                    if(row.crplanid != 0 && "releaseconfig" in row) {
                        if (row.planst == 'Fail' && row.enginefail) {
                            body += "<td class='cb_center' rowspan='" + count + "'><button type='button' class='retrybtn btn btn-danger' planid='"+row.crplanid+"' ldable='" + row.ldable + "'>错误处理</button></td>";
                        } else {
                            body += "<td class='cb_center' rowspan='" + count + "'></td>";
                        }
                    }
                    body += "</tr>";
                }
            }

            return body;
        }

        function fill_releaselog(alldata){
            var hideclass = "class='hide'";
            if ($(".releasenote[progress='"+alldata.env+"']").attr("view") == 1){
                hideclass = "";
            }
            var header = "<table width='100%'"+ hideclass +"><tr class='app-row'><td>发布单号</td><td>环境</td><td>发布单状态</td>";
            if ( alldata.env == 'prod') {
                header += "<td>发布单类型</td>";
            }
            header += "<td>发布日志</td><td>应用名称</td><td>应用发布状态</td>";
            if (alldata.env == 'prod'){
                header += "<td>发布配置</td>";
            }
            header += "<td>执行时间</td><td>创建时间</td>";
            if ( alldata.env == 'prod') {
                header += "<td>操作</td>";
            }
            header += "</tr>";
            var footer = "</table>";

            if (alldata.appnotes){
                $('li.apprelease').removeClass('hide');
                var table = header + fill_notetable(alldata.appnotes,alldata.env,false) + footer;
                $(".release_log."+alldata.env+" #AppRelease_"+alldata.env).removeClass('hide');
                $(".release_log."+alldata.env+" #AppRelease_"+alldata.env).html(table);
            }else{
                $('li.apprelease').addClass('hide');
                $(".release_log."+alldata.env+" #AppRelease_"+alldata.env).addClass('hide');
            }

            if (alldata.ldnotes){
                $('li.ldrelease').removeClass('hide');
                var table = header + fill_notetable(alldata.ldnotes,alldata.env,true) + footer;
                $(".release_log."+alldata.env+" #LDRelease_"+alldata.env).removeClass('hide');
                $(".release_log."+alldata.env+" #LDRelease_"+alldata.env).html(table);
            }else{
                $('li.ldrelease').addClass('hide');
                $(".release_log."+alldata.env+" #LDRelease_"+alldata.env).addClass('hide');
            }

            if (alldata.ldnotes || alldata.appnotes){
                $('li.allrelease').removeClass('hide');
                var table = header + fill_notetable(alldata.appnotes,alldata.env,false) + fill_notetable(alldata.ldnotes,alldata.env,true) + footer;
                $(".release_log."+alldata.env+" #AllRelease_"+alldata.env).removeClass('hide');
                $(".release_log."+alldata.env+" #AllRelease_"+alldata.env).html(table);
            }else{
                $('li.allrelease').addClass('hide');
                $(".release_log."+alldata.env+" #AllRelease_"+alldata.env).addClass('hide');
            }
        }

        $(document).on('click', '.retrybtn', function(){
            var crplanid = $(this).attr('planid');
            var ldable = $(this).attr('ldable');
            $('#retryModel').attr('planid', crplanid);
            $('#retryModel').attr('ldable', ldable);
            $('#retryLabel').html("发布单"+crplanid+"错误处理");
            var ropid = $('.departinfo').attr('category');
            $.getJSON('/ropv2/api/getplanidigapp/?crplanid='+crplanid+'&ropid='+ropid+'&ldable='+ldable, function(data){
                if(data.result){
                    var retrynum = data.retrynum;
                    $('#retryModel').attr('retrynum', retrynum);
                    var result = data.applists;
                    var enginetipshtml = "<div class='hisinfo hide' applen= '"+result.length+"'></div><div style='color:red;margin-bottom: 20px;'>(操作者要明确点火失败对应用的影响并承担其风险，关于“点火接口”请咨询<a href='mailto:RDkjts@Ctrip.com'>R&D框架TS</a>，【<a href='http://conf.ctripcorp.com/pages/viewpage.action?pageId=34835071' target='_blank'>点火帮助指南</a>】)</div>";
                    $('.enginetips').html(enginetipshtml);
                    var igapptable = "<tr><th colspan='4' style='font-size: large;width:80%;border-bottome:8px;'>本次发布第"+data.retrynum+"次错误处理选择</th></tr><tr><th style='width:20%;'>应用名称</th><th style='width:10%;'>发布负责人</th><th style='width:10%;'>所属RopId</th><th style='width:30%;'>错误处理选项</th></tr>";
                    for(var i=0;i<result.length;i++){
                        igapptable += '<tr><td style="width:20%;">'+result[i].appname+'</td>';
                        igapptable += '<td style="width:10%;">'+result[i].operator+'</td>';
                        igapptable += '<td style="width:10%;">'+result[i].ropid+'</td>';
                        igapptable += '<td class="hide">'+result[i].crappid+'</td>';
                        if (ropid == result[i].ropid &&  result[i].enabled == 1){
                            if (ldable == 'ld') {
                                igapptable += '<td><p><span class="input-group-addon"><input name="radio' + i + '" type="radio" value="' + result[i].crappid + '_0">废弃并回滚此应用</span></p>';
                            }else{
                                igapptable += '<td>';
                            }
                            igapptable += '<p><span class="input-group-addon"><input name="radio'+i+'" type="radio" value="'+result[i].crappid+'_1">重试点火并校验点火结果</span></p>';
                            igapptable += '<p><span class="input-group-addon"><input name="radio'+i+'" type="radio" value="'+result[i].crappid+'_2">重试点火并忽略点火结果</span></p>';
                        }else if(ropid == result[i].ropid && result[i].enabled == 0){
                            igapptable += '<td>此应用已被废弃';
                        }else{
                            if (result[i].enabled == 0 || result[i].ignitiontype == 0){
                                igapptable += '<td>此应用已被废弃';
                            }else if(result[i].ignitiontype == 1){
                                igapptable += '<td>用户已选择重试点火并校验点火结果';
                            }else if(result[i].ignitiontype == 2){
                                igapptable += '<td>用户已选择重试点火并忽略点火结果';
                            }else{
                                igapptable += '<td>用户尚未选择错误处理方式';
                            }
                        }
                        igapptable += '</td></tr>';
                    }
                    $("#igapptable").html(igapptable);
                    for(var i=0;i<result.length;i++) {
                        var radioname = 'radio' + i;
                        if (result[i].ignitiontype > 0){
                            $("input[name='" + radioname + "']").eq(+result[i].ignitiontype).attr('checked', 'true');
                        }
                    }
                    if (data.showhis){
                        $('.hisrecords').html('<button type="button" class="btn btn-primary showhistory" style="float:left;">本次发布历史错误重试选择详情</button>');
                    }
                }else{
                    noty_alert(data.msg,'error');
                }
            });
            $('#retryModel').modal('show');
        });

        $(document).on('click', '.showhistory', function(){
            var classnames = $(this).attr('class');
            if ((classnames.indexOf('hide') == -1 && classnames.indexOf('message') == -1) || (classnames.indexOf('hide') != -1 && classnames.indexOf('message') == -1)) {
                requesthisinfo();
            } else if (classnames.indexOf('hide') == -1 && classnames.indexOf('message') != -1) {
                $(this).addClass('hide');
            } else {
                $(this).removeClass('hide');
            }
        });

        function requesthisinfo(){
            var crplanid = $('#retryModel').attr('planid');
            var his = new Array();
            $.getJSON('/ropv2/api/getigfaillog/?crplanid='+crplanid, function(data){
                if (data.status){
                    his = data.response;
                    if(his.length == 0){
                        var rehtml = '没有错误重试的历史提交记录';
                    }else{
                        var rehtml = '<tr><td>重试序号</td><td>应用名称</td><td>发布负责人</td><td>所属RopId</td><td>错误处理</td></tr>';
                        for(var i=0;i<his.length;i++){
                            rehtml += '<tr><td>'+his[i].retrynum+'</td><td>'+his[i].appname+'</td><td>'+his[i].operator+'</td><td>'+his[i].ropid+'</td>';
                            if(his[i].ignitiontype == 0){
                                rehtml += '<td>此应用已被废弃</td>';
                            }else if(his[i].ignitiontype == 1){
                                rehtml += '<td>用户已选择重试点火并校验点火结果</td>';
                            }else if(his[i].ignitiontype == 2){
                                rehtml += '<td>用户已选择重试点火并忽略点火结果</td></tr>';
                            }else if(his[i].ignitiontype == -1 && his[i].enabled == 0){
                                rehtml += '<td>此应用已被废弃</td></tr>';
                            }else{
                                rehtml += '<td>用户未选择重试处理方式</td></tr>';
                            }
                        }
                    }
                    $('#hisapptable').html(rehtml);
                }else{
                    noty_alert('历史数据获取失败', 'error');
                    return;
                }
            });
        }

        $('.submitretry').click(function(){
            var crappidtypelist = new Array();
            var applen = $('.hisinfo').attr('applen');
            var chooseed = false;
            var hasdisabledapp = false;
            for(var i=0;i<applen;i++){
                var radioname = 'radio' + i;
                var crappidtype = $("input[name='"+radioname+"']:checked").val();
                if(crappidtype != undefined){
                    if(crappidtype.indexOf('_0') != -1){
                        hasdisabledapp = true;
                    }
                    chooseed = true;
                    crappidtypelist.push(crappidtype);
                }
            }
            if (!chooseed){
                noty_alert("请选择处理方式后提交",'error');
                return;
            }
            if(hasdisabledapp) {
                noty_confirm(
                    '废弃此应用后,应用将会回滚, 确定废弃?',
                    function(){
                        submitrequest(crappidtypelist);
                    },
                    function () {}
                );
            }else{
                submitrequest(crappidtypelist);
            }
        });

        //传LD标志
        function submitrequest(crappidtypelist){
            var crplanid = $('#retryModel').attr('planid');
            var retrynum = $('#retryModel').attr('retrynum');
            var ropid = $('.departinfo').attr('category');
            var ldable = $('#retryModel').attr('ldable');
            var args = "planid=" + crplanid + "&retrynum=" + retrynum + "&ropid=" + ropid + "&crappidtypelist=" + crappidtypelist + "&ldable=" + ldable;
            $.getJSON('/ropv2/api/submitretry/?' + args, function (data) {
                if (data["response"].result) {
                    if (data["response"].msg){
                        noty_alert(data["response"].msg, 'info');
                    }else{
                        noty_alert('重试请求成功', 'info');
                    }
                } else {
                    noty_alert(data["response"].msg, 'error');
                }
            });
        }

        function loadapp(force){
            if(!ropid){
                return;
            }
            url = "/ropv2/api/get_appstatus/?ropid=" +ropid+ "&force=" + force;
            var htmlobj=$.ajax({
                url:url,
                async:true,
                success:function(data){
                    var object = JSON.parse(data);
                    if (!object.status){
                        alert(object.msg);
                        window.location.reload();
                        return;
                    }
                    var rop = object.rop;
                    roppermission = JSON.parse(rop.permission);
                    loadui();
                    loadinternal('fat');
                    loadinternal('uat');
                    loadinternal('prod');
                    if (rop.subdb){
                        refresh_app(rop.subdb.apps);
                        fill_appconfig(rop.subdb.apps,'db',rop.isowner);
                    }
                    if (rop.subweb){
                        refresh_app(rop.subweb.apps);
                        fill_appconfig(rop.subweb.apps,'web',rop.isowner);
                    }
                    if (rop.subapp){
                        refresh_app(rop.subapp.apps);
                        fill_appconfig(rop.subapp.apps,'app',rop.isowner);
                    }
                    if (rop.subld){
                        for (var ldc=0,ldclen=rop.subld.length;ldc<ldclen;ldc++){
                            refresh_app(rop.subld[ldc].apps);
                            fill_appconfig(rop.subld[ldc].apps, 'ld_'+rop.subld[ldc].ldname, rop.isowner);
                        }
                    }
                    if ('releasenote' in rop){
                        for (var i=0,len=rop.releasenote.length;i<len;i++){
                            fill_releaselog(rop.releasenote[i]);
                        }
                    }

                    if (rop.rmstatus == 1 || rop.rmstatus == 3 ){
                        $('#operate_alert').html(rop.windowclosealert);
                    }else if (rop.rmstatus == 2) {
                        var alertmsg = '<a href="/ropv2/review/?ropid='+rop.id+'" target="_blank" style="color:red;">拒绝，' + rop.reviewinfo + '</a>';
                        $('#operate_alert').html(alertmsg);
                    }else{
                        var alertmsg = "待审核，" + rop.reviewinfo;
                        $('#operate_alert').html(alertmsg);
                    }

                    bindiframe();
                    binddisplayapp();
                }
            });

        }

        ajax_apphandle = setInterval(function(){loadapp(false);},10000);

        function testresult_tips(progress,result){
            var timeout = 180 * 1000;
            if (progress == 'fat' && result == 1){
                showtip('<strong>你点击了功能测试（FAT）测试通过！</strong><br><br>功能测试（FAT）测试通过的APP，可到集成测试（UAT）阶段继续操作。',timeout);
            }else if(progress == 'fat' && result == 0){
                showtip('<strong>你点击了功能测试（FAT）测试失败！</strong><br><br>功能测试（FAT）测试失败的APP，请重新走功能测试（FAT）发布流程。',timeout);
            }else if(progress == 'uat' && result == 1){
                showtip('<strong>你点击了集成测试（UAT）测试通过！</strong><br><br>此发布计划需要DB和静态资源发布生产成功，才可以发布其他应用。<br><br>此外，还需要评审通过才可以走LD和非LD APP的生产发布流程。请关注评审结果旁的提示信息。<br><br>仅有计划发布时间为当天的LD应用才会被自动触发生产发布。<br><br>各LD Pool的发布生产时间不同(默认18:00)，请耐心等待。',timeout);
            }else if(progress == 'uat' && result == 0){
                showtip('<strong>你点击了集成测试（UAT）测试失败！</strong><br><br>集成测试（UAT）测试失败的APP，请重新走集成测试（UAT）发布流程。',timeout);
            }else if(progress == 'smoking' && result == 1){
                showtip('<strong>你点击了Smoking测试通过！</strong><br><br>Smoking测试通过的APP，会在其LD中其他所有APP都Smoking测试通过之后开始发Baking，请耐心等待！',timeout);
            }else if(progress == 'baking' && result == 1){
                showtip('<strong>你点击了Baking测试通过！</strong><br><br>Baking测试通过的APP，会在其LD中其他所有APP都Baking测试通过之后开始Rolling，请耐心等待！',timeout);
            }else if(progress == 'smoking' && result == 0){
                showtip('<strong>你点击了Smoking测试失败！</strong><br><br>Smoking测试失败的APP，会自动回滚并退到集成测试（UAT）待编译状态！',timeout);
            }else if(progress == 'baking' && result == 0){
                showtip('<strong>你点击了Baking测试失败！</strong><br><br>Baking测试失败的APP，会自动回滚并退到集成测试（UAT）待编译状态！',timeout);
            }
        }

// TODO: 点击堡垒失败,baking失败和回退按钮时,弹窗提示输入操作原因

        $(".matchclick").bind('click', function(){
            var data = $('#refered').val();
            $('#addselect').html("<select id='reflected' multiple='multiple'></select>");
            $('#reflected').multiSelect();
            var url = '/ropv2/api/getmatchinfo/?data='+data;
            var leftvalues = new Array();
            $.getJSON(url, function(data){
                if (data['status']){
                    leftvalues = data['result'];
                }else{
                    noty_alert(data['msg'], 'error');
                }
                $('#reflected').multiSelect('addOption', leftvalues);
            });
        });
        $(document).on('click', '.rollback', function(){
            $("#rbModalLabel").html("请填写回退原因；如误点，请直接取消．");
            $(".submitreason").attr("id", "rollback_rb");
            document.getElementById('applsit').value = $(this).parent("td").attr('id').split('_')[0];
            $('#rbreasonModel').modal('show');
        });

        $(".smoking_testfail").bind('click', function(){
            $("#rbModalLabel").html("堡垒测试失败，请填写失败原因；如误点，请直接取消．");
            $(".submitreason").attr("id", "smoking_rb");
            checkrbapp();
        });

        $(".baking_testfail").bind('click', function(){
            $("#rbModalLabel").html("Baking测试失败，请填写失败原因；如误点，请直接取消．");
            $(".submitreason").attr("id", "baking_rb");
            checkrbapp();
        });

        function checkrbapp(){
            var rbcrapplist = get_selectedapp('prod');
            if (rbcrapplist == undefined || rbcrapplist.length == 0){
                noty_alert("请选择目标APP！",'error');
                return;
            }
            document.getElementById('applsit').value = rbcrapplist;
            $('#rbreasonModel').modal('show');
        }

        $(".submitreason").click(function(){
            var typeid = $(this).attr('id');
            if (typeid == 'smoking_rb') {
                var progress = "smoking";
            } else if(typeid == 'baking_rb'){
                progress = "baking";
            } else {
                progress = "rollback";
            }
            var cp4names = new Array();
            $(".ms-selection .ms-selected span").each(function()
            {
                cp4names.push($(this).html());
            });
            var crappidlist = document.getElementById('applsit').value.split(',');
            var reason = $.trim(document.getElementById('rbapp').value);
            if ((!reason) || reason.length == 0){
                noty_alert("操作理由不得为空,请重新填写.", 'error');
                return;
            }
            var needreflect = $('#reflectcheckbox').attr('name');
            if (needreflect){
                var noreflect = $("input[name='noreflected']:checked").val();
                var updateflag = 0;
                if (noreflect == undefined){
                    if (cp4names.length == 0){
                        noty_alert('非紧急回退，必须填写受影响的项目名称或编号', 'error');
                        return;
                    }
                    updateflag = 1;
                }
                save_rollbackresult(progress,crappidlist,0,reason,cp4names,updateflag);
            }else{
                save_rollbackresult(progress,crappidlist,0,reason);
            }
            $('#rbreasonModel').modal('hide');
        });

        function save_rollbackresult(progress,applist,result) {
            var url = '';
            $.ajaxSetup({
                async:false
            });
            $.post("/ropv2/api/savetestresult/",
                {
                    "applist": applist,
                    "env": progress,
                    "result": result,
                    "ropid": ropid,
                    "appreason": arguments[3] ? arguments[3] : '',
                    "cp4names": arguments[3] ? arguments[4] : [],
                    "updateflag":arguments[3] ? arguments[5] : 0
                },
                function (data, status) {
                    loadapp(true);
                    var state = JSON.parse(data)['status'];
                    if (state == 'OK') {
                        noty_alert(JSON.parse(data)['msg'], 'information');
                        if(progress == 'uat' && result ==1){
                            noty_notice('<strong>提示：</strong><br><br>你已点击uat通过按钮，发布生产需手动点击"生产发布"按钮.<br>请确保知晓该流程！',3600 * 1000,'success');
                        }
                    } else {
                        noty_alert(JSON.parse(data)['msg'], 'error');
                    }
                    testresult_tips(progress,result);
                    if (progress == 'rollback' && state == 'OK') {
                        url = $('#' + applist[0] + '_rollback').children('a').attr('url');
                    }
                });
            if (url){
                window.open(url);
            }
        }

        function save_testresult(active_e,result){
            var progress = active_e.attr("progress");
            if (progress == 'baking' && result == 1){
                noty_alert("非法操作",'error');
                return;
            }
            var eprogress = '';
            if (progress == 'smoking' || progress == 'baking'){
                eprogress = 'prod';
            }else{
                eprogress = progress;
            }
            var applist = get_selectedapp(eprogress);
            if(applist.length==0){
                noty_alert("请选择目标APP！",'error');
                return;
            }
            save_rollbackresult(progress,applist,result);
        }

        $(".smoking_testpass").click(function(){
            var applist = get_selectedapp('prod');
            if(applist.length==0) {
                noty_alert("请选择目标APP！", 'error');
                return;
            }
//            var applist=["110154"];
            var appliststr="";
            for (var i = 0; i < applist.length; i++) {
               if(i==0){
                   appliststr+=applist[i];
               }else{
                   appliststr+=','+applist[i];
               }
            }
//            appliststr="109827,109828"
            $.getJSON('/ropv2/api/getappmachineinfo/?applist='+appliststr,
                function (data) {
                    if (data.result.length>0){
                        $("#smkapptable").html("");
                        $("#smkapptable").append("<tr><td colspan='3'><input type='hidden' id='applists' value='"+data.applists+"'/></td></tr>");
                        $("#smkapptable").append("<tr style='border:1px solid #000000;'><td style='border:1px solid #000000;'>应用名称</td><td style='border:1px solid #000000;'>堡垒机ip</td><td style='border:1px solid #000000;'>是否堡垒测试通过(全选<input type='checkbox' id='mccheckall'>)</td></tr>");
                        $.each(data.result,function(i,item){
                            $.each(item.mcinfos,function(k,mcinfo){
                                if(k==0) {
                                    $("#smkapptable").append("<tr style='border:1px solid #000000;'><td style='border:1px solid #000000;' rowspan="+item.mccount+">" + item.appname + "</td><td style='border:1px solid #000000;'>" + mcinfo.ip + "</td><td style='border:1px solid #000000;' align='center'><input type='checkbox' class='mcdetail' name='mcdetail'></td></tr>");
                                }else{
                                    $("#smkapptable").append("<tr style='border:1px solid #000000;'><td style='border:1px solid #000000;'>" + mcinfo.ip + "</td><td style='border:1px solid #000000;' align='center'><input type='checkbox' class='mcdetail' name='mcdetail'></td></tr>");
                                }
                            });

                        });
                        $(".submitsmkpass").unbind("click");
                        $("#mccheckall").click(function(){
                            var checked=$(this).prop('checked');
                            $(".mcdetail").prop('checked',checked);
                        });
                        $(".submitsmkpass").click(function(){
//                            var applist=$("#applists").val().split(',');
//                              console.log(applist);
                            if ($(":checkbox[name='mcdetail']:checked").length==$(":checkbox[name='mcdetail']").length){
                                save_rollbackresult('smoking',applist,1);
                                $('#smktestpass_info').modal('hide');
                            }
                            else{
                                $('#smktestpass_info').modal('hide');
                                noty_alert('只有堡垒机全部确认才提交确认。','error');
                            }
                        })
                        $('#smktestpass_info').modal('show');
                    }
                    else{
                        save_rollbackresult('smoking',applist,1);
                    }
                });
        });

        $(".test_pass").click(function(){
            save_testresult($(this),1);
        });

        $(".test_fail").click(function(){
            save_testresult($(this),0)
        });

        $(".releasenote").click(function(){
            var view = $(this).attr("view");
            var progress = $(this).attr("progress");

            if(view != '0'){
                $(this).attr("view",0);
                $(this).text("查看发布单");
                $(".release_log."+progress+" table").addClass('hide');
            }else{
                $(this).attr("view",1);
                $(this).text("收起发布单");
                $(".release_log."+progress+" table").removeClass('hide');
            }

        });

        $(".stop_build").click(function(){
            var progress = $(this).attr("progress");
            var applist = get_selectedapp(progress);
            if(applist.length==0){
                noty_alert("请选择目标APP！",'error');
                return
            }
            $.post("/ropv2/api/cancelbuild/",
            {
                "applist":applist,
                "ropid":ropid
            },
            function(data,status){
                loadapp(true);
                var state = JSON.parse(data)['status'];
                var msg = JSON.parse(data)['msg'];
                if(state == 'OK') {
                    noty_alert(msg,'information');
                }else{
                    noty_alert(msg,'error');
                }    
            });
        });

        // $(".addsub").click(function(){
        //     var apptype = $(this).attr("apptype");
        // });

        // function rollback(active_e){
        //     turl = "/ropv2/api/rollback/?app="+active_e.attr("crappid");
        //     htmlobj=$.ajax({url:turl,async:false});
        //     var url = htmlobj.responseText;
        //     if (url != "None"){
        //         window.open(url);
        //     }
        // }

        binddisplayapp();

        function sync_rmstatus(){
            turl = "/ropv2/api/get_rmstatus/?ropid="+ropid;
            htmlobj=$.ajax({url:turl,async:true,
                success:function(data){
                    var object = $.parseJSON(data);
                    if(object.status == '拒绝'){
                        $("#rmstatus").html('<a href="/ropv2/review/?ropid='+ropid+'" target="_blank">'+object.status+'&nbsp;&nbsp;&nbsp;<span style="color:#FF8000;">'+object.msg+'</span></a>');
                        $("#rmstatus_title").html('<h4>操作执行 &nbsp;&nbsp;<a href="/ropv2/review/?ropid='+ropid+'" target="_blank"><span style="color: rgb(255, 39, 0);font-size:15px;">拒绝&nbsp;&nbsp;&nbsp;'+object.msg+'</span></a></h4>');
                    }else if (object.status == '待审核'){
                        $("#rmstatus").html(object.status+'&nbsp;&nbsp;&nbsp;<span style="color:#FF8000;">'+object.msg+'</span>');
                        $("#rmstatus_title").html('<h4>操作执行 &nbsp;&nbsp;<span style="color: rgb(255, 39, 0);font-size:15px;">待审核&nbsp;&nbsp;&nbsp;'+object.msg+'</span></h4>');
                    }else{
                        $("#rmstatus").text(object.status);
                        $("#rmstatus_title").html('<h4>操作执行 &nbsp;&nbsp;</h4>');
                    }
                }});
        }

        var reloadhandle = setInterval(sync_rmstatus,240*1000);

        $("a[data-toggle='tab']").click(function(){
            if ($(this).attr('href-type')!="apptype") return;

            var act_tab = $(this).attr('href').substr(1);
            setCookie(ropid+"_tab",act_tab,8);
        });


        $("#btn_releaselog").click(function(){
            window.open("/ropv2/releaselog/?ropid="+ropid);
        });

        loadapp(false);

        function selectme(data,serverid){
            var owners_list = eval(data);
            var result = '';
            
            $.each(owners_list,function(key){
                var person = owners_list[key];
                if(person.indexOf(serverid) != -1){
                    result = person;
                }
            });

            return result;
        }

        $("#selectme_release").click(function(){
            var data = $("#release_owner").attr('data-source');
            var serverid = $('.username').attr('serverid');
            var person = selectme(data,serverid);
            if (person != ''){
                $("#release_owner").val(person);
            }else{
                noty_alert('列表中没有与'+ serverid +'匹配的数据，请手动输入。','error');
            }
            
        });

        $("#selectme_test").click(function(){
            var data = $("#test_owner").attr('data-source');
            var serverid = $('.username').attr('serverid');
            var person = selectme(data,serverid);
            if (person != ''){
                $("#test_owner").val(person);
            }else{
                noty_alert('列表中没有与'+ serverid +'匹配的数据，请手动输入。','error');
            }
            
        });
    };

    var add_ld = function(ropid) {
        $('#LD_panel').multiselect2side({
            selectedPosition: 'right',
            moveOptions: false,
            labelsx: '待发布应用：',
            labeldx: '已选应用：',
            autoSort: true,
            autoSortAvailable: true
            });

        $("#DepartName").change(function(){
            var departname = $(this).val();
            url = "/ropv2/api/get_ldpool/?departname=" + departname + "&ropid=" +ropid;
            var htmlobj=$.ajax({url:url,async:false});
            var ldpools = JSON.parse(htmlobj.responseText);

            var htmltext = "<option>Default</option>"
            for (var i in ldpools){
                for (var key in ldpools[i]){
                    htmltext += "<option value='"+ldpools[i][key][1]+"' poolname='"+key+"' lineid='"+ldpools[i][key][0]+"'>"+key+"</option>";
                }
            }
            $("#PoolName").html(htmltext);
        });

        $("#PoolName").change(function(){
            var poolid = $(this).val();
            url = "/ropv2/api/get_ldlist/?poolid=" + poolid +"&ropid=" +ropid;
            var htmlobj=$.ajax({url:url,async:false});
            var ldinfo = JSON.parse(htmlobj.responseText);
            $("#LD_panel").multiselect2side('clear');
            for (var i=0,len=ldinfo.length; i<len; i++){
                var ld = ldinfo[i];
                
                $("#LD_panel").multiselect2side('addOption',{name: ld.name, value: ld.value, selected: false, cnremove: false});
                if (ld.selected){
                    $("#ms2side__sx option[value='"+ ld.value +"']").attr('disabled','disabled');
                    $("#ms2side__sx option[value='"+ ld.value +"']").attr('title',ld.title);
                    $("#LD_panel option[value='"+ ld.value +"']").attr('disabled','disabled');
                    $("#LD_panel option[value='"+ ld.value +"']").attr('title',ld.title);
                }
            }
        });

        $("#save_ldapps").click(function(){
            var ropid = $(this).attr("ropid");
            var applist = [];
            $("#ms2side__dx option").each(function()
            {
                applist.push($(this).val());
            });
            var poolid = $("#PoolName").val();
            var poolname = $("option[value='"+poolid+"']").attr("poolname");
            var ldid = $("option[value='"+poolid+"']").attr("lineid");
            // console.log(ropid);
            // console.log(applist);
            // console.log(poolname);
            $.post("/ropv2/api/save_ldapp/",
            {
                "applist":applist,
                "poolname":poolname,
                "ropid":ropid,
                "ldid":ldid,
                "poolid":poolid
            },
            function(data,status){
                var obj = $.parseJSON(data);
                if (obj.msg){
                    alert(obj.msg);
                }else{
                    parent.window.location.reload();
                }
            });
        });
    };

    var notice_editor = function() {
        $('.add_noticeaction').click(function() {
            var message = $("#notice").val();
            if (message == "" || message == null){
                noty_alert("存啥呀……",'error');
            }else{
                var r = confirm('你确定要保存吗？');
                if (r){
                    $.post("/notice/addnotice/",
                    {
                        message:message
                    },
                    function(data,status){
                        if (status =="success"){
                            noty_alert('保存成功！','success');
                        }
                        window.location.reload();
                    });
                }
            }
        });
    };

    var ldmanage = function() {
        var ajaxhandler = null;
        var ropid = "";
        var crappid = "";
        var operate = "";

        function clearhandler(){
            window.clearInterval(ajaxhandler);
            ajaxhandler = null;
        }

        $('.departchangeaction').change(function() {
            if(ajaxhandler){
                clearhandler();
            }

            var depart = $("#departname").val();
            if (depart != null && depart != "请选择..."){
                var turl = "/ropv2/api/getroplist/?depart=" + depart;
                var htmlobj=$.ajax({url:turl,async:false});
                var roplist = $.parseJSON(htmlobj.responseText);
                $("#td_roplist").html("<input type='text' class='span4 m-wrap roplist' value='' autocomplete='off'/>");
                $(".roplist").typeahead({source:roplist});
            }
        });

        function loadapplist(){
            var rop = $.trim($(".roplist").val());
            if (!isNaN(rop) && rop){
                var turl = "/ropv2/api/getldapps/?ropid=" + rop;
            }else if(!rop){
                if (ajaxhandler){
                    clearhandler();
                }else{
                    noty_alert("请输入ROPID。",'error');
                }
                return 0;
            }else{
                if (ajaxhandler){
                    clearhandler();
                }
                return 0;
            }
            var htmlobj=$.ajax({url:turl,
                async:true,
                success:function(data){
                    $(".lddiv").html(data);
                    bindldaction();
                }});

            return 1;
        }

        $("#searchld").click(function(){
            var result = loadapplist();
            if (result == 1){
                ajaxhandler = setInterval(function(){loadapplist();},10000);
            }
        });

        $("#submit").click(function (){
            if (!(operate && crappid && ropid)){
                return;
            }
            var msg = $("#operate_reason").val();
            $('#reasonModel').modal('hide');
            if (operate == 'leaveld'){
                $.post("/ropv2/api/leaveld/",
                {
                    crappid:crappid,
                    ropid:ropid,
                    reason:msg
                },
                function(data,status){
                    data = JSON.parse(data)
                    if ("msg" in data){
                        noty_alert(data.msg,'error');
                    }
                    loadapplist();
                });
            }else if (operate == 'ld_to_app'){
                noty_confirm(
                    '使用此方法脱离LD之后将转换成常规发布模式，不可转回，确定操作？',
                    function(){
                        $.post("/ropv2/api/ld_to_app/",
                        {
                            crappid:crappid,
                            ropid:ropid,
                            reason:msg
                        },
                        function(data,status){
                            data = JSON.parse(data)
                            if ("msg" in data){
                                noty_alert(data.msg,'error');
                            }
                            loadapplist();
                        });
                    },
                    function(){}
                );
            }
        });

        function bindldaction(){
            $('.addldaction').bind("click",function(){
                crappid = $(this).attr('crappid');
                ropid = $(this).attr('ropid');
                var turl = "/ropv2/api/addld/?crappid=" + crappid + "&ropid=" + ropid;
                var htmlobj=$.ajax({url:turl,async:false});
                data = JSON.parse(htmlobj.responseText)
                if ("msg" in data){
                    noty_alert(data.msg,'error');
                }
                loadapplist();
            });

            $('.leaveldaction').bind("click",function(){
                crappid = $(this).attr('crappid');
                ropid = $(this).attr('ropid');
                operate = 'leaveld';
                $("#reasonModelLabel").text("脱离LD");
            });

            $('.ld_to_app').bind("click",function(){
                crappid = $(this).attr('crappid');
                ropid = $(this).attr('ropid');
                operate = 'ld_to_app';
                $("#reasonModelLabel").text("彻底脱离LD");
            });
        }
    };

    var releaselog = function() {
        $("#searchlog").click(function(){
            var rop = $.trim($("#ropid").val());
            if (!isNaN(rop) && rop){
                var turl = "/ropv2/api/get_releaselog/?ropid=" + rop;
            }else if(!rop){
                noty_alert("请输入VerisonID。",'error');
                return;
            }else{
                noty_alert("请输入合法VerisonID。",'error');
                return;
            }
            var htmlobj=$.ajax({url:turl,async:false});
            $("#logdiv").html(htmlobj.responseText);
        });

        var params = document.URL.match(/ropid=([^&]*)/);
        if (params){
            var ropid = params[1];
            $("#ropid").attr("value",ropid);
            $("#searchlog").click();
        }
    };

    var releasehelp = function(){
        $("#searchrop").click(function(){
              if(!$("#bgdate").val())
              {
                  noty_alert("请选择开始日期",'error');
                  return;
              }
              if(!$("#enddate").val())
              {
                  noty_alert("请选择结束日期",'error');
                  return;
              }
              if($("#bgdate").val()>$("#enddate").val())
              {
                  noty_alert("结束日期不能大于开始日期",'error');
                  return;
              }
            var urls="/ropv2/api/get_releasehelp/?bgdate="+$("#bgdate").val()+"&enddate="+$("#enddate").val()+"&srtype="+$("#srtype").val();
            var htmlcontent= $.ajax({url:urls,async:false});
            $("#ropdiv").html(htmlcontent.responseText);
        });
        $("#bgdate,#enddate").datetimepicker({
            minView:"month",
            format:"yyyy-mm-dd",
            language:"zh-CN",
            autoclose:true
        });
    };

    var editcrapp=function(isadmin){
        $('.crappbtn').click(function(){
            if(isadmin == 'False'){
                noty_alert("您无操作权限",'error');
            }else {
                var types = $(this).attr("st")
                var crappid = $.trim($("#crappid").val());
                if (!isNaN(crappid) && crappid){
                    var ropid = $(this).attr("ropid")
                    var turl = "/ropv2/api/get_editcrapp/?crappid=" + crappid+"&types="+types+"&ropid"+ropid;
                    var htmlcontent=$.ajax({url:turl,async:false});
                    $("#ropdiv").html(htmlcontent.responseText);
                }else if(!crappid){
                    noty_alert("请输入crappid。",'error');
                    return;
                }else{
                    noty_alert("请输入合法crappid。",'error');
                    return;
                }
            }
        })

    }

    var bughelper=function(isadmin){

            if (isadmin == 'False') {
                noty_alert("您无操作权限", 'error');
            } else {
                $('.menuli').click(function () {
                    $(".contentbody ul > li").attr("class", "menuli")
                    $(this).attr("class", "current menuli")
                    $("#maincontent").html("<img src='/static/img/cat.gif'  alt='玩命加载中...' style='padding-left: 40%; padding-top: 300px;'/>加载中。。。");
                    var turl = $(this).attr("url");
                    if (turl) {
                        var htmlcontent = $.ajax({url: turl, async: false});
                        $("#maincontent").html(htmlcontent.responseText);
                    }
                    else {
                        $("#maincontent").html("<font style='color:red;'>url为空，请检查菜单url代码</font>");
                        return;
                    }
                })
            }
    };

    var editappbyropid=function(isadmin){
        var targettab = "";
        $('#searchapp').click(function() {
            if(isadmin=='False'){
                noty_alert("您无操作权限",'error');
            }
            else{
                if (targettab == "" || targettab == "datamanual"){
                    fill_datamanual();
                }else if(targettab == "uatmanual"){
                    fill_uatmanual();
                }else{
                    fill_scmanual();
                }
            }
        });

        $(".datamanual a").click(function(){
            if(targettab == "datamanual"){
                return;
            }

            fill_datamanual();
            $(".datamanual").addClass('active');
            $(".uatmanual").removeClass('active');
            $(".scmanual").removeClass('active');
            targettab = "datamanual";
        });

        $(".uatmanual a").click(function(){
            if(targettab == "uatmanual"){
                return;
            }

            fill_uatmanual();
            $(".uatmanual").addClass('active');
            $(".datamanual").removeClass('active');
            $(".scmanual").removeClass('active');
            targettab = "uatmanual";
        });

        $(".scmanual a").click(function(){
            if(targettab == "scmanual"){
                return;
            }

            fill_scmanual();
            $(".scmanual").addClass('active');
            $(".datamanual").removeClass('active');
            $(".uatmanual").removeClass('active');
            targettab = "scmanual";
        });

        function fill_datamanual(){
            var ropid = $.trim($("#ropid").val());
            if (!isNaN(ropid) && ropid){
                var turl = "/ropv2/api/get_rop_apps/?ropid=" + ropid;
                var htmlcontent=$.ajax({url:turl,async:false});
                $("#ropdiv").html(htmlcontent.responseText);
                if (targettab == ""){
                    $("#manualTab").removeClass('hide');
                }
                
                $('.crappbtn').click(function(){
                    if(isadmin=='False'){
                        noty_alert("您无操作权限",'error');
                    }else{
                        var types=$(this).attr("st");
                        var crappid =$(this).attr("crappid");
                        var status = $(this).attr("status");
                        if (!isNaN(crappid) && crappid){
                            var turl = "/ropv2/api/get_editcrapp/?crappid=" + crappid+"&types="+types;
                            var htmlcontent=$.ajax({url:turl,async:false});
                            var htmltxt = "<p>"+htmlcontent.responseText+"</p>";
                            if (status == "0"){
                                htmltxt = "<p>请确认CROLLER已经将错误数据修复，否则请通知CROLLER此APP的LD发布单未脱离干净后再点击一次此按钮。</p>" + htmltxt;
                            }
                            $("#messagediv").html(htmltxt);
                        }else if(!crappid){
                            noty_alert("请输入crappid。",'error');
                            return;
                        }else{
                            noty_alert("请输入合法crappid。",'error');
                            return;
                        }
                    }
                 });

                $("#messagediv").html('');

                $(".flowbutton").click(function(){
                    var data = $(this).attr("value");
                    $.post("/ropv2/api/setflowstatus/",
                    {
                        "data":data,
                    },
                    function(data,status){
                        var state = JSON.parse(data)['result']
                        if (state){
                            noty_alert(JSON.parse(data)['msg'],'information');
                            fill_datamanual();
                        }else{
                            noty_alert(JSON.parse(data)['msg'],'error');
                        }
                    });
                });
            }else if(!ropid){
                noty_alert("请输入ropid。",'error');
                return;
            }else{
                noty_alert("请输入合法ropid。",'error');
                return;
            }
        }

        function fill_uatmanual(){
            var ropid = $.trim($("#ropid").val());
            if (!isNaN(ropid) && ropid){
                var turl = "/ropv2/api/get_rop_uat_apps/?ropid=" + ropid;
                var htmlcontent=$.ajax({url:turl,async:false});
                $("#ropdiv").html(htmlcontent.responseText);
                if (targettab == ""){
                    $("#manualTab").removeClass('hide');
                }


                $("#messagediv").html('');
            }else if(!ropid){
                noty_alert("请输入ropid。",'error');
                return;
            }else{
                noty_alert("请输入合法ropid。",'error');
                return;
            }
        }

        function fill_scmanual(){
            var ropid = $.trim($("#ropid").val());
            if (!isNaN(ropid) && ropid){
                var turl = "/ropv2/api/getrop_ldenabled/?ropid=" + ropid;
                var htmlcontent=$.ajax({url:turl,async:false});
                $("#ropdiv").html(htmlcontent.responseText);
                if (targettab == ""){
                    $("#manualTab").removeClass('hide');
                }

                $("#messagediv").html('');
            }else if(!ropid){
                noty_alert("请输入ropid。",'error');
                return;
            }else{
                noty_alert("请输入合法ropid。",'error');
                return;
            }
        }
    }

    var ownersqlexec=function(isadmin){
        $('#execsql').click(function() {
        if(isadmin=='False'){
            noty_alert("您无操作权限",'error');
        }
        else{
            var sqlstr = $.trim($("#sqlstr").val());
            if (sqlstr){
                $.post("/ropv2/api/ownersqlexec/",
                    {"sqlstr":sqlstr},
                    function(msg)
                    {
                        $("#ropdiv").html(msg.msg);
                    },
                    "json"
                );

            }else if(!sqlstr){
                noty_alert("请输入要执行的语句。",'error');
                return;
            }
        }
        })
    }

    var ldwindow = function(isadmin) {
        $('#middle_content').jplist({ 
            items_box: '#mono',
            item_path: '.img_info',
            panel_path: '.intro_info'
        }); 

        $('.edit_deadlines').click(function(){
            if(isadmin == 'False'){
                noty_alert("您无操作权限,调整请联系<a href='mailto:CSO_rm@Ctrip.com?subject=请求调整LD上堡垒时间,堡垒时长'>产品管理RM组</a>",'error');
            }else{
                var active_e = $(this);
                product_onload(active_e);
                var poolid = active_e.attr('poolid');
                var poolname = active_e.attr('poolname');
                $("#edit_"+poolid).html("<a href='javascript:void(0);' class='add_deadline' paras='0' poolid='"+poolid+"' poolname='"+poolname+"'>存为当天</a>&nbsp;&nbsp;<a href='javascript:void(0);' class='add_deadline' paras='1' poolid='"+poolid+"' poolname='"+poolname+"'>存默认值");
                bindaddclick();
            }
        });

        function bindeditclick(){
            $('.edit_deadlines').bind("click",function(){
                var active_e = $(this);
                product_onload(active_e);
                var poolid = active_e.attr('poolid');
                var poolname = active_e.attr('poolname');
                $("#edit_"+poolid).html("<a href='javascript:void(0);' class='add_deadline' paras='0' poolid='"+poolid+"' poolname='"+poolname+"'>存为当天</a>&nbsp;&nbsp;<a href='javascript:void(0);' class='add_deadline' paras='1' poolid='"+poolid+"' poolname='"+poolname+"'>存默认值");
                bindaddclick();
            });
        }

        function product_onload(active_e){
            var poolid = active_e.attr('poolid');
            $('.time_'+poolid).removeAttr('readonly');
            var nows = new Date();
            $('#uattime_'+poolid).timepicker({'timeFormat': 'H:i', 'step': 15, 'minTime': '00:00', 'maxTime': '23:59'});
        }

        function isTimePart(timeStr){
            var parts = timeStr.split(':');
            if(parts.length !== 2){
                return false;
            }else if(isNaN(parts[0]) || isNaN(parts[1])){
                return false;
            }
            if(( parts[0] < 0 || parts[0] > 23) || (parts[1]%15 !== 0)){
                return false;
            }
            return true;
        }

        function bindaddclick(){
            $('.add_deadline').bind("click",function(){
                var active_e = $(this);
                var args = "flag="+active_e.attr('paras');
                var poolname = active_e.attr('poolname');
                var poolid = active_e.attr('poolid');
                var uat = $("#uattime_"+poolid).val();
                var smoke = $("#smoketime_"+poolid).val();
                if(uat == ""){
                    if(parseInt(smoke) == smoke && smoke > 0){
                        args +="&poolid="+poolid+"&smoketime="+smoke;
                    }else if(smoke == ""){
                        noty_alert("堡垒测试时长不能设置为空!",'error');
                        return
                    }else{
                        noty_alert("堡垒测试时长设置错误!",'error');
                        return
                    }
                }else if(isTimePart(uat)){
                    uat += ':00';
                    args +="&poolid="+poolid+"&uattime="+uat;
                    if(smoke !== ""){
                        if(parseInt(smoke) == smoke && smoke > 0){
                            args +="&smoketime="+smoke;
                        }else{
                            noty_alert("堡垒测试时长不符合格式!",'error');
                            return
                        }
                    }else{
                        noty_alert("堡垒测试时长不能设置为空!",'error');
                        return
                    }
                }else{
                    noty_alert("开始堡垒时间设置不符合格式!",'error');
                    return
                }
                $.getJSON('/ropv2/api/set_deadlines/?'+args, function(data){
                    if(data["result"]){
                        $("#edit_"+poolid).html("<a href='javascript:void(0);' class='edit_deadlines' poolid='"+poolid+"' poolname='"+poolname+"'>编辑</a>");
                        $('.time_'+poolid).attr('readonly',"");
                        bindeditclick();
                    }else{
                        noty_alert(data["message"],'error');
                    }
                });
            });
        }
    };

    var review = function(isadmin) {
        jQuery(document).ready(function() { 
            $('.num_id').tooltipster({fixedWidth: 250});
            $('.projectname').tooltipster({fixedWidth: 750});
            set_tooltips();
            var fixHelper = function(e, ui) {  
                ui.children().each(function() { 
                    $(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了  
                }); 
                return ui;
            }; 
            setInterval(enable_refresh, 20000);

            function enable_refresh(){
                var lasttime = document.getElementById("lasttime").innerHTML;
                if (lasttime !== '至今尚未自动评审过' && lasttime){
                    $.getJSON('/ropv2/api/get_lastreviewtime?lasttime='+lasttime,function(data){
                        if (data["result"]){
                            location.reload();
                        }
                    });
                }
            }
            // 保存seq失败
           $( "#list2" ).sortable({ 
                opacity: 0.5 ,
                axis: 'y',
                cursor: "move" ,
                items: "tbody > tr" ,
                scroll: true ,
                delay: 100 , 
                handle: 'td:first', 
                helper: fixHelper, 
                placeholder: '.ui-state-highlight',
                update: function( event, ui ) {
                     $this = $(ui.item);  
                     var array_id = new Array();   
                     var a=0;
                     var array_s = "";
                     $this.parents("tbody").children("tr").each(function(){   
                        array_id[a++] = $(this).attr("id");
                        array_s += "A" + (a-1) + array_id[a-1];
                     });
                     $.getJSON('/ropv2/api/save_seq?seq='+array_s,function(data){  
                        noty_alert("saved place",'information');
                    });
                }
            }); 

           $(".showdetail").click(function(){
             var sid = $(this).attr("sid");
             var ropid = $(this).attr("ropid");
             var pcategory_name = $(this).attr("pcatename");
             var jiraid = $(this).attr("jiraid");
             var rop_name = $(this).attr("ropname");
             operation(sid,ropid,jiraid,pcategory_name,rop_name);
           })

           $(".detail_dispaly").click(function(){
             var rmid = $(this).attr("rmid");
             var ropid = $(this).attr("ropid"); 
             var pcategory_name = $(this).attr("pcatename");
             var jiraid = $(this).attr("jiraid");
             var rop_name = $(this).attr("ropname");
             detail_info_display(rmid,ropid,jiraid,pcategory_name,rop_name);
           })

        });

        function operation(id, rm_prop_id, jiraid, pcategory_name, rop_name){
            var today = new Date();
            var month = today.getMonth() + 1;
            if(month<10){
                month = '0'+ month;
            }
            if(isadmin == "False"){
                $.dialog({
                        width: 300,
                        height: 80,
                        title: 'Message',
                        content:"您没有权限操作!",
                        lock: true
                    });
            }else{
                $.dialog({
                    width: 800,
                    height: 40,
                    fixed: false,
                    title: 'Message',
                    content:'<div class="left_box ser_shadow"><p><i class="icon-map-marker"></i><span class="dialog_ctrip_label">项目简介</span></p><p><span class="dialog_ctrip_label">Prop_id:</span><span class="dialog_ctrip_info">'+rm_prop_id+'</span></p><p><span class="dialog_ctrip_label">产品线:</span><span class="dialog_ctrip_info">'+pcategory_name+'</span></p><p><span class="dialog_ctrip_label">Jiraid:</span><span class="dialog_ctrip_info">'+jiraid+'</span></p><p id="p_name"><span class="dialog_ctrip_label">项目名称:</span><span class="dialog_ctrip_info" id="ropname" style="word-break:break-all"></span></p></div><div class="right_box"><p><i class="icon-bookmark"></i><span class="dialog_ctrip_label">评审详情:</span></p><p><textarea id="detailinfo_log" style="font-size:13px;color:gray;width: 335px;height: 340px;"></textarea></p></div>',
                    lock: true,
                    button:[
                        {
                            value: '通过',
                            callback: function(){
                                var area = $("#detailinfo_log").val();
                                if(area == ""){
                                    $.dialog({
                                        width: 300,
                                        height: 80,
                                        title: 'Message',
                                        content:"评审记录不能为空,请重新填写后提交!",
                                        lock: true
                                    });
                                }else{
                                    var ropid = $(this).attr('ropid');
                                    var change_state = "state="+1+"&id="+id+"&area="+area+"&ropid="+ropid;
                                    $.getJSON('/ropv2/api/operation_submit?'+change_state, function(data){
                                        location.reload();
                                    });
                                }
                            }
                        },{
                            value: '驳回',
                            callback: function(){
                                var area = $("#detailinfo_log").val();
                                if(area == ""){
                                    $.dialog({
                                        width: 300,
                                        height: 80,
                                        title: 'Message',
                                        content:"评审记录不能为空,请重新填写后提交!",
                                        lock: true
                                    });
                                }else{
                                    var ropid = $(this).attr('ropid');
                                    var change_state = "state="+0+"&id="+id+"&area="+area+"&ropid="+ropid;
                                    $.getJSON('/ropv2/api/operation_submit?'+change_state, function(data){
                                        location.reload();
                                    });
                                }
                            }
                        }
                    ]
                });
                $("#ropname").html(rop_name);
            }
        }

        function detail_info_display(release_id,ropid,jiraid,pcategory_name,rop_name){
            $.getJSON('/ropv2/api/operation_log_detail?rm_id='+release_id, function(data){
                var vale = "";
                for(var i = 0; i<data["result"].length; i++){
                    var info_detail = data["result"][i];
                    vale = vale + "<p><span style='font-size:13px;color:gray;'>"+info_detail["date"]+" "+ info_detail["user"] + " " + info_detail["oper_type"] + "发布单,详情:"+ info_detail["reason"]+"</span></p>";
                }
                $.dialog({
                    width: 800,
                    height: 400,
                    title: 'Detail Info',
                    content:'<div class="left_box ser_shadow"><p><i class="icon-map-marker"></i><span class="dialog_ctrip_label">项目简介</span></p><span class="dialog_ctrip_label">Prop_id:</span><span class="dialog_ctrip_info">'+ropid+'</span></p><p><span class="dialog_ctrip_label">产品线:</span><span class="dialog_ctrip_info">'+pcategory_name+'</span></p><p><span class="dialog_ctrip_label">Jiraid:</span><span class="dialog_ctrip_info">'+jiraid+'</span></p><p id="p_name"><span class="dialog_ctrip_label">项目名称:</span><span class="dialog_ctrip_info" id="ropname" style="word-break:break-all"></span></p></div><div class="right_box"><p><i class="icon-bookmark"></i><span class="dialog_ctrip_label">项目评审记录:</span></p><p id="vale_rminfo"></p></div>',
                    lock: true
                });
                $("#ropname").html(rop_name);
                $("#vale_rminfo").html(vale);
            });
        }

        // 让网页打开时把第一栏信息汇总折叠起来
        if ($('.col_clarify').hasClass("collapse")) {
            $('.col_clarify').removeClass("collapse").addClass("expand");
            $('.col_clarify img').attr('src','/static/ropv2/img/portlet-expand-icon-white.png');
            $('.col_clarify').closest(".panel").children(".panel-body").slideUp(1);
            $('#sumInfoTitle').after("<div class='panel-body' id='collapseTips' style='text-align:center; vertical-align: middle; font-size: 14px;color:gray;'><a href='#'>点击查看更多内容...</a></div>");
        }

        $('body').on('click', '.panel .tools .collapse, .panel .tools .expand', function (e) {
            e.preventDefault();
            var el = $(this).closest(".panel").children(".panel-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                $('.col_clarify img').attr('src', '/static/ropv2/img/portlet-expand-icon-white.png');
                el.slideUp(200,backfuntion('add'));  
            } else if ($(this).hasClass("expand")) {
                $(this).removeClass("expand").addClass("collapse");
                $('.col_clarify img').attr('src', '/static/ropv2/img/portlet-collapse-icon-white.png');
                $('#collapseTips').html("");
                el.slideDown(200,backfuntion('remove'));
            }
        });

        function backfuntion(flag){
            if(flag=='add'){
                $('#sumInfoTitle').after("<div class='panel-body' id='collapseTips' style='text-align:center; vertical-align: middle; font-size: 14px;color:gray;'><a href='#'>点击查看更多内容...</a></div>");
            }else if(flag=='remove'){
                $('#collapseTips').detach();
            }
        }

        $('body').on('click', '#collapseTips', function (e) {
            if($( ".panel .tools a" ).hasClass("collapse")){
                $(".panel .tools .collapse" ).trigger( "click" );
            }else if($( ".panel .tools a" ).hasClass("expand")){
                $(".panel .tools .expand" ).trigger( "click" );
            }
        });

        function set_tooltips(){
            $(".get_info_collide").mouseenter(function(){
                $(".get_info_collide").tooltipster({
                    fixedWidth: 750,
                    interactive: true,
                    trigger: 'hover'
                });
            });
        }

        $(".datesource").click(function (){
            var source = $(this).attr('sourcetype');
            var params = document.URL.match(/date=([^&]*)/);
            var date = '';
            if (params){
                date = $.trim(params[1].toLowerCase());
            }

            var url='?datesource=' +source;
            if (date != ''){
                url += '&date=' + date;
            }
            window.location.href = url;
        });
    };

    var timetable = function(username,isadmin,pws){
        function testalert()
        {
            $(window).focus();
            //console.log("$(window).focus()");
        }

        setTimeout(function(){testalert();},2000);

        var g_event = null;

        function update_event_title(event,update)
        {
            var d = event.start;
            var d2 = event.end;
            
            //console.log(d,d2);
            if (d != null && d2 != null && d.getMonth() == d2.getMonth() && d.getDate() == d2.getDate())
            {
                event.title = get_time_str(d) + "   --   " + get_time_str(d2);
                //console.log(event.title);
            }
            else
            {
                event.title = get_datetime_str(d) + " -- " + get_datetime_str(d2);
            }
            
            if (update)
            {
                $('#calendar').fullCalendar('updateEvent', event);
            }
        }

        function update_event_range(event,start,end)
        {
            //if (start == null || start == undefinded) return;
            
            event.start = start;
            
            if (start){
                end.setFullYear(start.getFullYear());
                end.setMonth(start.getMonth());
                end.setDate(start.getDate());
            }
            event.end = end;
            $('#calendar').fullCalendar('updateEvent', event);
        }

        function get_datetime_str(d)
        {
            if (d == null)
            {
                return "--";
            }
            //return d.toTimeString();
            //return d.toISOString();
            //return d.toLocaleString();
            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() +":" + d.getMinutes();
        }

        function get_date_str(d)
        {
            if (d == null)
            {
                return "--";
            }
            //return d.toTimeString();
            //return d.toISOString();
            //return d.toLocaleString();
            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        }

        function get_time_str(d)
        {
            if (d == null)
            {
                return "--";
            }
            var t = d.getHours() +":" + d.getMinutes();
            if (d.getMinutes() == 0)
            {
                t += "0";
            }
            return t;
        }

        function get_datetime_from_str(str)
        {
            var dayarray = new Array();
            var stimearray = new Array();
            var etimearray = new Array();
            dayarray = str.split(' ')[0].split('-');
            timearray = str.split(' ')[1].split(':');
            var d = new Date(dayarray[0],dayarray[1]-1,dayarray[2],timearray[0],timearray[1],0);
            if (d.toString() === 'Invalid Date') return null;
            return d;
        }

        function get_time_from_str(str)
        {
            var d = new Date(str);
            return d;
        }

        $('document').ready(function(){
               $('#dtpick1').datetimepicker({
                autoclose: 1
               });
               $('#dtpick2').datetimepicker({
                   autoclose: 1
               });
           
           $('#starttime').timepicker( {'timeFormat': 'H:i'} );
           $('#endtime').timepicker({'timeFormat': 'H:i'});
            
            //保存时间修改
            $("#saverange").click(function(){
                var starttext = get_date_str(g_event.start);

                var starttime = $("#starttime").val();
                starttime = starttext + " " + starttime;
                var endtime = $("#endtime").val();
                endtime = starttext + " " + endtime;
                
                var d1 = get_datetime_from_str(starttime);
                var d2 = get_datetime_from_str(endtime);

                if (d1 == null || d2 == null)
                {
                    alert("非法时间格式！");
                    return false;
                }
                if (d1 > d2)
                {
                    alert("结束时间不能小于开始时间!");
                    return false;
                }

                $('#datetimedialog').modal('hide');
                
                update_event_range(g_event,d1,d2);
                
                update_event_title(g_event,true);
                
                var pid = g_event.pid;
                if (pid == null | pid == undefined) pid=0;
                var plantype = g_event.plantype;
                
                $.post
                (
                    "/plan/changewindow/",
                    {starttime:starttime,endtime:endtime,pid:pid,plantype:plantype,username:username},
                    function(msg)
                    {
                        g_event.pid = msg.pid;
                    },
                    "json"
                )
            });
                
            //删除区间
            $("#deleterange").click(function(){
                var pid=g_event.pid;
                console.log("remove",g_event.pid);
                //g_event.remove();
                $('#datetimedialog').modal('hide');
                
                update_event_range(g_event,null,null);
                g_event = null;
                if (pid == null || pid == undefined) return;
                $.get("/plan/removewindow/" + pid + "/");
            });
                
           $('#external-events div.external-event').each(function() {
                
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($(this).text()), // use the element's text as the event title
                    color: $(this).attr("color"),
                    starttime:$(this).attr("starttime"),
                    endtime:$(this).attr("endtime"),
                    plantype:$(this).attr("plantype")
                };
                
                // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);
                
                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });
                
            });
                
            /* initialize the calendar
            -----------------------------------------------------------------*/
                
            $('#calendar').fullCalendar({
                header: {
                    left: '',
                    center: 'title',
                    right: 'prev,next,month'
                },
                editable: function(isadmin){
                    if (isadmin == "True"){
                        return true;
                    }else{
                        return false;
                    }
                },
                droppable: function(isadmin){
                    if (isadmin == "True"){
                        return true;
                    }else{
                        return false;
                    }
                },
                // if (isadmin == "True"){
                //     editable: true,
                //     droppable: true, // this allows things to be dropped onto the calendar !!!
                // }
                drop: function(date, allDay) { // this function is called when something is dropped
                    //console.log("drop",date, allDay);
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);
                    
                    var st = originalEventObject.starttime;
                    var end = originalEventObject.endtime;
                    
                    var s = st.split(":");
                    date.setHours(parseInt(s[0]));
                    date.setMinutes(parseInt(s[1]));
                    
                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    
                    var endday = new Date(date);
                    s = end.split(":");
                    endday.setHours(parseInt(s[0]));
                    endday.setMinutes(parseInt(s[1]));
                    copiedEventObject.end = endday;
                    
                    copiedEventObject.allDay = allDay;
                    
                    var d = copiedEventObject.start;
                    var d2 = copiedEventObject.end;
                    copiedEventObject.title = get_datetime_str(d) + " -- " + get_datetime_str(d2);
                    
                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
                },
                eventAfterRender:function( event, element, view ) {
                    //console.log("eventAfterRender",event.start,event.end);
                    
                    //console.log(element);
                    update_event_title(event,false);
                },
                eventRender:function( event, element, view ) {
                    //console.log("eventRender",event.start,event.end);
                    
                    //console.log(element);
                    update_event_title(event,false);
                },
                eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
                    update_event_title(event,true);
                },
                eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
                    update_event_title(event,true);
                },
                eventClick: function(calEvent, jsEvent, view) {
                    //console.log('Event: ',calEvent.start,calEvent.end);
                    //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                    //alert('View: ' + view.name);
                    //console.log(calEvent);
                    //console.log(jsEvent);
                    
                    var starttext = get_time_str(calEvent.start);
                    //console.log(starttext);
                    $("#starttime").val(starttext);
                    if (calEvent.end)
                    {
                        var endtext = get_time_str(calEvent.end);
                        $("#endtime").val(endtext);

                        //console.log(endtext);
                    }
                    
                    if(isadmin == "True"){
                        g_event = calEvent;
                        $('#datetimedialog').modal('show');
                    }
                    // change the border color just for fun
                    $(this).css('border-color', 'red');
                },
                events:function(start,end,callback){ 
                    var events = [];
                    for (var i in pws){
                        events.push({
                            title: "",
                            start: new Date(pws[i][0], pws[i][1]-1, pws[i][2],pws[i][3],pws[i][4]),
                            end: new Date(pws[i][0], pws[i][1]-1, pws[i][2],pws[i][5],pws[i][6]),
                            color:pws[i][7],
                            pid:pws[i][8],
                            plantype:pws[i][9],
                            lazyFetching:false
                        });
                    }
                    callback(events);
                }
            });
                
            $('#calendar').fullCalendar('render');

            $("#disableplan").click(plan_disable);
            $("#disableplancheck").click(plan_disable);    

            $("#saveplanoper").click(post_plan_disable);

            $("#saveexpire").click(post_expire);

            $(".fc-button").click(function(){
                //update_event_title(g_event,true);
                //$('#calendar').fullCalendar('updateEvent');
                $('#calendar').fullCalendar('render');
            });
        });

        function plan_disable() {
            var v = parseInt($("#disableplan").attr("disvalue"));
            
            if (v == 0)
            {
                $("#planoper").modal("show");
                $("#reason").focus();
            }
            else
            {
                post_plan_disable();
            }
        }

        function post_plan_disable()
        {
            var v = parseInt($("#disableplan").attr("disvalue"));
            if (v == 1) {
                v = 0;
            }
            else{
                v = 1;
            }

            var turl = "/plan/change_plan_oper/";
            var reason = $("#reason").val();
            //console.log(reason);

            $.post
            (
                turl,
                {oper:"plandisable",value:v,reason:reason},
                function(msg)
                {
                    $("#disableplan").attr("disvalue",v);

                    $("#planoper").modal("hide");

                    window.location.reload();
                },
                "json"
            )
        }

        function post_expire()
        {
            var turl = "/plan/save_expire/";
            var d = {};
            d['expiretime1'] = $("#firsttime").val();
            d['expiretime2'] = $("#secondtime").val();

            d['year1'] = $("#firsttime").attr("year");
            d['year2'] = $("#secondtime").attr("year");

            d['weeknum1'] = $("#firsttime").attr("weeknum");
            d['weeknum2'] = $("#secondtime").attr("weeknum");

            $.post
            (
                turl,
                d,
                function(msg)
                {
                    alert("保存成功");
                },
                "json"
            )
        }
    };

    var releasedashboard = function(isadmin){
        $('.search_date').datetimepicker({
            startView: 2,
            minView: 2,
            format: "yyyy-mm-dd",
            autoclose: 1,
            todayHighlight: 1,
            showactive: 1
        });

        function bind_event(){
            $(".applink").click(function(){
	            var orgname = $(this).attr("orgname");
	            var columntype = $(this).attr("columntype");
	            var starttime = $("#begintime").val();
	            var endtime = $("#termtime").val();
	            var type = "rop";

	            window.open("/ropv2/release_plan/?orgname="+orgname+"&columntype="+columntype+"&starttime="+starttime+"&endtime="+endtime+"&type="+type);
	        });

	        $(".roplink").click(function(){
	            var apptype = $(this).attr("apptype");
	            var appflowstatus = $(this).attr("appflowstatus");

	            var starttime = $("#begintime").val();
	            var endtime = $("#termtime").val();
	            var orgname = $(this).attr("orgname");
	            var type = "app"

	            request_url = "/ropv2/release_plan/?apptype="+apptype+"&appflowstatus="+appflowstatus+"&starttime="+starttime+"&endtime="+endtime+"&type="+type;
	            if (orgname != ''){
	                request_url += "&orgname="+orgname;
	            }
	            window.open(request_url);
	        });
        }

        $(".submit").click(function(){
            var starttime = $("#begintime").val();
            var endtime = $("#termtime").val();
            var deptname = $("#deptname").val();
            if (starttime){
                if(endtime){
                        if(Date.parse(starttime) > Date.parse(endtime)){
                        noty_alert("输入截止时间必须大于等于起始时间！","error");
                        return;
                    }
                }
            }else{
                if(endtime){
                    noty_alert("如截止时间不为空，则必须输入起始时间！","error");
                    return;
                }
            }

            var turl = "/ropv2/api/releasedata/";
            if (deptname || starttime || endtime){
                turl += "?";
                var haveparam = false;
                if (deptname){
                    turl += "deptname="+deptname;
                    haveparam = true;
                }
                if (starttime){
                    if (haveparam){
                        turl += "&";
                    }
                    turl += "selecttime="+starttime;
                    haveparam = true;
                }
                if (endtime){
                    if (haveparam){
                        turl += "&"
                    }
                    turl += "endtime="+endtime;
                    haveparam = true;
                }
            }
            var htmlobj=$.ajax({url:turl,async:false});
            $("#dashboard_container").html(htmlobj.responseText);

            bind_event();
        });
		
		bind_event();
    }

    var releaseplan = function(isadmin){
        $("#mono .roplist .rop").click(function(){
            var ropid = $(this).parent().attr("id");
            if (intd == 0){
                window.location.href="/ropv2/ropeditor/?ropid=" + ropid;
            }else{
                intd = 0;
            }
        });
    }

    var addtype = function(){
        $("#savetype").click(function(){
            var dlltypename=$("#dlltypename").val()
            if(dlltypename){
                var turl = "/ropv2/api/savedlltype/?dlltypename="+dlltypename+"&addr=";
    		    var htmlobj=$.ajax({url:turl,async:false});
    		    data = $.parseJSON(htmlobj.responseText);
                if(data.status){
                    noty_alert("保存成功！","success")
                }else{
                    noty_alert("保存失败！","error")
                }
            }else{
                noty_alert("名称不能为空！","error");
            }
        });
    }
    var appmanager = function(ismanager){
        $('#middle_content').jplist({
            items_box: '#rows',
            item_path: '.img_info',
            panel_path: '.intro_info'
        });
        function reset_checkbox(active_e){
			var chystrix_value = active_e.attr("chystrix");
			if (chystrix_value == "1"){
				active_e.addAttr("checked");
			}else{
				active_e.removeAttr("checked");
			}
    	}
        $(".checkbox").click(function(){
    		if (ismanager != "True"){
    			reset_checkbox($(this));
    			noty_alert("你没有足够的权限！","error");
    			return;
    		}

    		var value = "0";
    		if ($(this).is(':checked')){
    			value = "1";
    		}
    		var orgid = $(this).attr("orgid");
            var webid=$(this).attr("webid")
            var env=$(this).attr('env');
            var dlltype=$("#dllid").val()
    		var turl = "/ropv2/api/setappmanager/?orgid="+orgid+"&enabled="+value+"&webid="+webid+"&env="+env+"&dlltype="+dlltype;
    		var htmlobj=$.ajax({url:turl,async:false});

    		data = $.parseJSON(htmlobj.responseText);
    		if (data.status){
    			$(this).attr("chystrix",data.chystrix);
//    			noty_alert("操作成功！",'success');
    		}else{
    			reset_checkbox($(this));
    			noty_alert(data.msg,"error");
    		}
    	});
        $("#dlltype").change(function (){
            var dllid=$("#dlltype").val()
            var turl = "/ropv2/api/getappmanagelist/?dllid=" + dllid;
            var htmlcontent=$.ajax({url:turl,async:false});
            var htmltxt = htmlcontent.responseText;
            $("#dllid").val(dllid)
            $("#applistcontext").html(htmltxt);
            $(".checkbox").click(function(){
    		if (ismanager != "True"){
    			reset_checkbox($(this));
    			noty_alert("你没有足够的权限！","error");
    			return;
    		}

    		var value = "0";
    		if ($(this).is(':checked')){
    			value = "1";
    		}
    		var orgid = $(this).attr("orgid");
            var webid=$(this).attr("webid")
            var env=$(this).attr('env');
            var dlltype=$("#dllid").val()
    		var turl = "/ropv2/api/setappmanager/?orgid="+orgid+"&enabled="+value+"&webid="+webid+"&env="+env+"&dlltype="+dlltype;
    		var htmlobj=$.ajax({url:turl,async:false});

    		data = $.parseJSON(htmlobj.responseText);
    		if (data.status){
    			$(this).attr("chystrix",data.chystrix);
//    			noty_alert("操作成功！",'success');
    		}else{
    			reset_checkbox($(this));
    			noty_alert(data.msg,"error");
    		}
    	});
        });
    }
    var chystrixmanage = function(ismanager){
        $('#middle_content').jplist({ 
            items_box: '#rows',
            item_path: '.img_info',
            panel_path: '.intro_info'
        }); 

    	function reset_checkbox(active_e){
			var chystrix_value = active_e.attr("chystrix");
			if (chystrix_value == "1"){
				active_e.addAttr("checked");
			}else{
				active_e.removeAttr("checked");
			}
    	}

    	$(".checkbox").click(function(){
    		if (ismanager != "True"){
    			reset_checkbox($(this));
    			noty_alert("你没有足够的权限！","error");
    			return;
    		}

    		var value = "0";
    		if ($(this).is(':checked')){
    			value = "1";
    		}
    		var poolid = $(this).attr("poolid");

    		var turl = "/ropv2/api/setchystrix/?poolid="+poolid+"&enabled="+value;
    		var htmlobj=$.ajax({url:turl,async:false});

    		data = $.parseJSON(htmlobj.responseText);
    		if (data.status){
    			$(this).attr("chystrix",data.chystrix);
    			// noty_alert("操作成功！",'success');
    		}else{
    			reset_checkbox($(this));
    			noty_alert(data.msg,"error");
    		}
    	});
    }

    return {
        init: function(options) {
            $.extend(config, options);

            var userAgent = navigator.userAgent.toLowerCase();    
  
            // Figure out what browser is being used      
            var browser = {    
            version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],    
            chrome: /chrome/.test( userAgent ),
            firefox: /firefox/.test( userAgent ),
            safari: /safari/.test( userAgent )
            };

            if (!(browser.chrome || browser.firefox || browser.safari)){
                alert("此版本暂不支持IE浏览器，请使用Firefox或者Chrome。");
            }

            if ((window.location.host.indexOf('mgr.release.ctripcorp.com') == -1 && window.location.host.indexOf('192.168.83.130') == -1) && config.page != 'add_ld'){
                var turl = 'http://mgr.release.ctripcorp.com' + window.location.pathname + window.location.search;
                noty_warning('<strong>请不要直接通过IP地址访问！</strong><br><br>点击[<a href="'+ turl +'">此处</a>]跳转至域名访问方式。',3600*1000);
            }

            if (config.usernotice != '' && config.page != 'add_ld'){
                noty_notice(config.usernotice,3600 * 1000,'info');
            }

            function sync_planwindow(){
                htmlobj=$.ajax({url:'/ropv2/api/getplanwindow',async:false});

                if (config.page != 'add_ld' &&  htmlobj.responseText && htmlobj.responseText != 'closedwindow'){
                    $("a.toplan[data-toggle=popover]")
                    .popover({
                          html:true,
                          content:htmlobj.responseText,
                          trigger:"hover"
                    })
                    .click(function(e) {
                        e.preventDefault();
                    })
                }else if(htmlobj.responseText && htmlobj.responseText == 'closedwindow'){
                    $('#pw_content').html("<img src='/static/ropv2/img/calender_new.gif' style='margin: 0; margin-top: -5px;'></img>&nbsp;发布窗口暂时关闭");
                    $('#pw_content').css("color","red");
                }
            }

            sync_planwindow();
            pwajax_apphandle = setInterval(function(){sync_planwindow();},60*1000);

            function sync_xmonwarning(){
                if (config.page !== 'add_ld' &&  htmlobj.responseText){
                    htmlobj=$.ajax({url:'http://xmon.sh.ctripcorp.com/common/clusters/badhealth',async:false});
                    data = $.parseJSON(htmlobj.responseText);

                    if (data.success){
                        var htmlstr = "";

                        badhealth = data.data
                        if (badhealth.length>0){
                            htmlstr += "<div class='fc-event fc-event-hori fc-event-draggable fc-event-start fc-event-end ui-draggable' style='width: 200px; height: 22px; top: 136px;border:0px;' unselectable='on'><div class='fc-event-inner'>";
                            htmlstr +="<span class='fc-event-title' style='float:left;width:100%;height:100%;background-color: #fff;color:black;'>应用告警数量</span>";
                            htmlstr += "</div><div class='ui-resizable-handle ui-resizable-e'>&nbsp;&nbsp;&nbsp;</div></div>";
                            for (i in badhealth){
                                htmlstr += "<div class='fc-event fc-event-hori fc-event-draggable fc-event-start fc-event-end ui-draggable' style='width: 200px; height: 22px; top: 136px;border:0px;' unselectable='on'><div class='fc-event-inner'>";
                                htmlstr +="<span class='fc-event-title xmonwarning' turl='"+badhealth[i].buLink+"' style='float:left;width:90%;height:100%;background-color: #fff;color:black;border: 1px solid #FF6767;padding: 1px;' onclick='xmonlink($(this));'>"+badhealth[i].buName+"</span><span class='fc-event-title xmonwarning' turl='"+badhealth[i].buLink+"' style='float:right;width:10%;background-color: #FF6767;text-align: center;height:100%;border: 1px solid #FF6767;padding: 1px;' onclick='xmonlink($(this));'>"+badhealth[i].count+"</span>";
                                htmlstr += "</div><div class='ui-resizable-handle ui-resizable-e'>&nbsp;&nbsp;&nbsp;</div></div>";
                            }
                            $(".xmoninfo").css('color','#FF6767');
                        }else{
                            htmlstr += "<div class='fc-event fc-event-hori fc-event-draggable fc-event-start fc-event-end ui-draggable' style='width: 200px; height: 22px; top: 136px;border:0px;' unselectable='on'><div class='fc-event-inner'>";
                            htmlstr +="<span class='fc-event-title' style='float:left;width:100%;height:100%;background-color: #fff;color:black;'>当前无应用告警</span>";
                            htmlstr += "</div><div class='ui-resizable-handle ui-resizable-e'>&nbsp;&nbsp;&nbsp;</div></div>";
                            $(".xmoninfo").css('color','#999');
                        }
                        $("a.xmoninfo[data-toggle=popover]")
                        .popover({
                              html:true,
                              content:htmlstr,
                              delay: { show: 0, hide: 2000 },
                              trigger:"hover"
                        });
                    }
                }
            }

            sync_xmonwarning();
            xwajax_apphandle = setInterval(function(){sync_planwindow();},240*1000);

            $('.toplan').click(function() {
                window.open("/plan/home/");
            });

            
            $("#search").click(function(){
                var keyword = $("#search_text").val();
                if (!keyword.trim()){
                    noty_alert('请输入关键字', 'error');
                    return;
                }
                if(config.page == "review"){
                    window.location.href = "/ropv2/review/?ropid="+keyword;
                }else{
                    window.location.href = "/ropv2/api/search/?keyword="+keyword;
                }
            });

            $("#search_text").enter(function(){
                $("#search").click();
            });

            if (config.sidebar.enabled){
                $('.form_date').datetimepicker({
                    startView: 2,
                    minView: 2,
                    format: "yyyy-mm-dd",
                    todayBtn: "linked",
                    initialDate : config.sidebar.tar_day
                });

                $('.sub-list-none').slideUp(0);

                $('#datepicker')
                .on('changeDate', function(ev){
                    turl= '?date=' + $('#datevalue').val();
                    todate(turl);
                });

                // $('.item-title').click(function(){
                //     itemcoll($(this));
                // });

                function itemcoll(active_e){
                    var date = active_e.text();
                    var target = $("[date='"+date+"']");
                    var noneclass = 'sub-list-none';
                    var activeclass = 'sub-list';
                    if (target.hasClass(noneclass)){
                        $('.sub-list').slideUp(300);
                        $('.sub-list').addClass(noneclass);
                        $('.sub-list').removeClass(activeclass);
                        $('.item-list').removeClass('list-active');
                        $(target).removeClass(noneclass);
                        $(target).addClass(activeclass);
                        $(target).slideDown(300);
                        active_e.parent(".item-list").addClass('list-active');
                    }else{
                        $(target).slideUp(300);
                        $(target).removeClass(activeclass);
                        active_e.parent(".item-list").removeClass('list-active');
                        $(target).addClass(noneclass);
                    }
                }

                $(".datesource").click(function (){
                    var source = $(this).attr("sourcetype");
                    var params = document.URL.match(/date=([^&]*)/);
                    var date = '';
                    if (params){
                        date = $.trim(params[1].toLowerCase());
                    }

                    var url='?datesource=' +source;
                    if (date != ''){
                        url += '&date=' + date;
                    }
                    window.location.href = url;
                });

                function todate(turl){
                    var datesource = '';
                    if ($("#ropsource").hasClass("active")){
                        datesource = 'rop';
                    }else if ($("#jirasource").hasClass("active")){
                        datesource = 'jira';
                    }

                    window.location.href = turl + '&datesource=' +datesource;
                }

                $(".sub-item").click(function(){
                    var item = $(this).find("a");
                    todate(item.attr('turl'));
                });

                $(".item-list").click(function(){
                    var item = $(this).find("a");
                    itemcoll(item);
                });

                $("#notice").bind("mouseenter",function(){
                    var item = $(this).find('a');
                    if (!$("#collapseOne").hasClass("in")){
                        item.click();
                    }
                });
                $("#notice").bind("mouseleave",function(){
                    var item = $(this).find('a');
                    if ($("#collapseOne").hasClass("in")){
                        item.click();
                    }
                });
            }

            if (config.filter){
                var nameArray = ((getCookie("depart")==null) ? 'none' : getCookie("depart"));
                if (config.page == "rophome"){
                    var statusArray = ((getCookie("roptype")==null) ? 'none' : getCookie("roptype"));
                    var rmArray = (($("#rows .img_info[depart][roptype][rmstatus]").length == 0 || getCookie("rmstatus")==null) ? 'none' : getCookie("rmstatus"));
                }
                $("a.label").click(function(){
                    var value = $(this).attr("value");
                    var category = $(this).attr("category");

                    if ($(this).attr("class") == "label pull-left"){
                        var text = $(".label-info[category='"+category+"']").html();
                        if(text != undefined)
                        {
                            text = text.substring(0,text.length-28);
                            $(".label-info[category='"+category+"']").html(text);
                        }
                        $(".label-info[category='"+category+"']").removeClass("label-info")
                        $(this).addClass("label-info");
                        text = $(this).html() + "  <i class='glyphicon glyphicon-remove'></i>"
                        $(this).html(text)
                        //enable
                        if (category == "depart"){
                            nameArray = value;
                        }
                        if (category == "roptype"){
                            statusArray = value;
                        }
                        if (category == "rmstatus"){
                            rmArray = value;
                        }
                        showtiles();
                    }
                    else
                    {
                        $(this).removeClass("label-info");
                        var text = $(this).html();
                        text = text.substring(0,text.length-29);
                        $(this).html(text);
                        //disable
                        if (category == "depart"){
                            nameArray = 'none';
                        }
                        if (category == "roptype"){
                            statusArray = 'none';
                        }
                        if (category == "rmstatus"){
                            rmArray = 'none';
                        }
                        showtiles();
                    }

                    $(window).resize(); 
                });

                function showtiles(){
                    var query= "#rows ";
                    var target= "#rows .img_info[depart]";
                    var depart="[depart]";
                    if(nameArray=='none'){
                        delCookie('depart');
                    }
                    else{
                        temp_target = "a.label[category='depart'][value='"+nameArray+"']";
                        if($(temp_target).length > 0){
                            depart="[depart*='"+nameArray+"']";
                            setCookie('depart', nameArray, 8);
                        }
                    }
                    subquery = ".img_info" + depart;

                    if (config.page == "rophome"){
                        target += "[roptype]";
                        var roptype="[roptype]";
                        if(statusArray=='none'){
                            delCookie('roptype');
                        }
                        else{
                            temp_target = "a.label[category='roptype'][value='"+statusArray+"']";
                            if($(temp_target).length > 0){
                                roptype="[roptype='"+statusArray+"']";
                                setCookie('roptype', statusArray, 8);
                            }
                        }
                        subquery += roptype;
                        var rmstatus="[rmstatus]";
                        if(rmArray=='none'){
                            if ($("#rows .img_info[depart][roptype][rmstatus]").length >0){
                                delCookie('rmstatus');
                            }
                        }
                        else{
                            temp_target = "a.label[category='rmstatus'][value='"+rmArray+"']";
                            if($(temp_target).length > 0){
                                rmstatus="[rmstatus='"+rmArray+"']";
                                setCookie('rmstatus', rmArray, 8);
                            }
                            subquery += rmstatus;
                            target += "[rmstatus]"
                        }
                    }
                    query += subquery;
                    $(target).hide();
                    $(query).show();
                }

                if (config.page == "rophome"){
                    if (nameArray!= 'none') {
                        target = "a.label[category='depart'][value='"+nameArray+"']";
                        $(target).click();
                    }
                    if (statusArray!= 'none') {
                        target = "a.label[category='roptype'][value='"+statusArray+"']";
                        $(target).click();
                    }
                    if (rmArray!= 'none') {
                        target = "a.label[category='rmstatus'][value='"+rmArray+"']";
                        $(target).click();
                    }
                }
            }
        },

        rophome: function() {
            rophome();
        },
        ropeditor: function(ropid,roptype,roppermission,release_group,test_group,today,enddate,cr_disableday,warden) {
            ropeditor(ropid,roptype,roppermission,release_group,test_group,today,enddate,cr_disableday,warden);
        },
        add_ld: function(ropid) {
            add_ld(ropid);
        },
        notice_editor: function() {
            notice_editor();
        },
        ldmanage: function() {
            ldmanage();
        },
        releaselog: function() {
            releaselog();
        },
        ldwindow: function(isadmin) {
            ldwindow(isadmin);
        },
        review: function(isadmin) {
            review(isadmin);
        },
        timetable: function(username,isadmin,pws) {
            timetable(username,isadmin,pws);
        },
        releasehelp:function(){
            releasehelp();
        },
        editcrapp:function(isadmin){
            editcrapp(isadmin);
        },
        bughelper:function(isadmin){
            bughelper(isadmin);
        },
        editappbyropid:function(isadmin){
            editappbyropid(isadmin);
        },
        ownersqlexec:function(isadmin){
            ownersqlexec(isadmin);
        },
        releasedashboard:function(){
            releasedashboard();
        },
        releaseplan:function(isadmin){
          releaseplan(isadmin);
        },
        chystrixmanage:function(ismanager){
        	chystrixmanage(ismanager);
        },
        addtype:function(){
          addtype();
        },
        appmanager:function(ismanager){
            appmanager(ismanager);
        },
    };
}();
