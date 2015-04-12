
(function($, undefined){

	Date.prototype.Format = function(fmt)   
	{ //author: meizz   
	  var o = {   
	    "M+" : this.getMonth()+1,                 //月份   
	    "d+" : this.getDate(),                    //日   
	    "h+" : this.getHours(),                   //小时   
	    "m+" : this.getMinutes(),                 //分   
	    "s+" : this.getSeconds(),                 //秒   
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	    "S"  : this.getMilliseconds()             //毫秒   
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
	}

	var inited = false;
	function preinit(data){
		if (inited){
			$('#org_container').highcharts().destroy();
			$('#pool_container').highcharts().destroy();
			$('#apptype_container').highcharts().destroy();
			$("#datatable").bootstrapTable('destroy');
		}

		$("#org_tab").html("");
		$("#apptype_tab").html("");
	}

	var filter_enabled = false;
	function fillfilter(data){
		for (i in data.orglist){
			var button = "<button type='button' class='btn btn-timeline btn-timeline-tab' orgname='"+ data.orglist[i] +"'>"+ data.orglist[i] +"</button>";
			if (data.org_enabled.indexOf(data.orglist[i]) > -1 && data.org_enabled){
				$(button).addClass('active').appendTo("#org_tab");
			}else{
				$(button).appendTo("#org_tab");
			}
		}

		for (i in data.apptypelist){
			var button = "<button type='button' class='btn btn-timeline btn-timeline-tab' apptype='"+ data.apptypelist[i] +"'>"+ data.apptypelist[i] +"</button>";
			if (data.apptype_enabled.indexOf(data.apptypelist[i]) > -1 && data.apptype_enabled){
				$(button).addClass('active').appendTo("#apptype_tab");
			}else{
				$(button).appendTo("#apptype_tab");
			}
		}

		$(".btn-timeline-tab").click(function(){
			if ($(this).hasClass("active")){
				$(this).removeClass("active");
			}else{
				$(this).addClass("active");
			}
		});

		$(".closefilter").click(function(){
			$(".i-openfilter").show();
			$(".i-closefilter").hide();
			$(".openedfilter").slideUp(350);
			$(".closedfilter").slideDown(350);
			filter_enabled = false;
		});

		$(".openfilter").click(function(){
			$(".i-openfilter").hide();
			$(".i-closefilter").show();
			$(".closedfilter").slideUp(350);
			$(".openedfilter").slideDown(350);
			filter_enabled = true;
		});

		if (filter_enabled){
			$(".openfilter").click();
		}else{
			$(".closefilter").click();
		}
	}

	function cleanfilter(){
		$(".btn-timeline-tab").removeClass('active');
		$("#poolname").val("");
	}

	function filltimeline(data){
		if (inited){
			$("#datetimemodifiable").dateTimeRangeSlider("setOption",["bounds",{min:data.boundmin, max:data.boundmax}]);
			$("#datetimemodifiable").dateTimeRangeSlider("setValue",[data.min,data.max]);
		}else{
			$("#datetimemodifiable").dateTimeRangeSlider({bounds:{min:data.boundmin, max:data.boundmax},defaultValues: {min:data.min, max:data.max},formatter:'datetime',changeEvent:buildchart});
		}
	}



	function fillchart(data){
		$('#org_container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        credits:{
	            enabled : false
	        },
	        title: {
	            text: '产线发布情况'
	        },
	        xAxis: {
	            categories: [
	                ''
	            ]
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '发布单数'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
					name = this.series.name.substring(0,this.series.name.lastIndexOf('('));
					return '<tr><td style="color:'+this.series.color+';padding:0">'+name+': </td><td style="padding:0"><b>'+this.point.y+'</b></td></tr>';
				},
	            shared: false,
	            useHTML: true
	        },

	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: data.org_data
		});
		$('#pool_container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        credits:{
	            enabled : false
	        },
	        title: {
	            text: 'Pool 发布情况'
	        },
	        xAxis: {
	            categories: [
	                ''
	            ]
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '发布单数'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
					name = this.series.name.substring(0,this.series.name.lastIndexOf('('));
					return '<tr><td style="color:'+this.series.color+';padding:0">'+name+': </td><td style="padding:0"><b>'+this.point.y+'</b></td></tr>';
				},
	            shared: false,
	            useHTML: true
	        },

	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: data.pool_data
		});
		$('#apptype_container').highcharts({
	        chart: {
	            type: 'column'
	        },
	        credits:{
	            enabled : false
	        },
	        title: {
	            text: '应用发布情况'
	        },
	        xAxis: {
	            categories: [
	                ''
	            ]
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '发布单数'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
					name = this.series.name.substring(0,this.series.name.lastIndexOf('('));
					return '<tr><td style="color:'+this.series.color+';padding:0">'+name+': </td><td style="padding:0"><b>'+this.point.y+'</b></td></tr>';
				},
	            shared: false,
	            useHTML: true
	        },

	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: data.app_data
		});
	}

	function fillmodal(crappid){
		var modelhtml = "";
		modelhtml += "<div class='modal fade' id='iframe' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
		modelhtml += "<div class='modal-dialog'>"
		modelhtml += "<div class='modal-content'>"
		modelhtml += "<div class='modal-header'>"
		modelhtml += "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
		modelhtml += "</div>"
		modelhtml += "<div class='modal-body'>"
		modelhtml += "<div style='width:100%;min-height:650px;padding:10px;'>"
		modelhtml += "<ul class='nav nav-tabs'>"
		modelhtml += "<li class='active'><a href='#Plan' data-toggle='tab' href-type='apptype'>发布单操作流水</a></li>"
		modelhtml += "<li><a href='#Machine' data-toggle='tab' href-type='apptype'>服务器操作流水</a></li>"
		modelhtml += "</ul>"
		modelhtml += "<div class='tab-content'>"
		modelhtml += "<div class='tab-pane active' id='Plan'>"
		modelhtml += "<table id='planmsg_table'><thead><tr>"
		modelhtml += "<th data-field='crplanid'>CRPlanId</th>"
		modelhtml += "<th data-field='planstate'>发布单状态</th>"
		modelhtml += "<th data-field='appstate'>应用状态</th>"
		modelhtml += "<th data-field='push_time'>时间</th>"
		modelhtml += "</tr></thead></table></div>"
		modelhtml += "<div class='tab-pane fade' id='Machine'>"
		modelhtml += "<table id='machinemsg_table'><thead><tr>"
		modelhtml += "<th data-field='crplanid'>CRPlanId</th>"
		modelhtml += "<th data-field='ipaddress'>服务器IP</th>"
		modelhtml += "<th data-field='plugintype'>操作</th>"
		modelhtml += "<th data-field='push_time'>时间</th>"
		modelhtml += "</tr></thead></table></div></div></div></div></div></div>"

		$("#tabcontainer").html(modelhtml);

        var url = "/ropv2/api/gettimelinelog/?crappid=" + crappid;
        var htmlobj=$.ajax({url:url,async:false});
        var retdata = JSON.parse(htmlobj.responseText);

		$("#planmsg_table").bootstrapTable({
	        data: retdata.planlog,
			search: true,
			showColumns:true,
			showRefresh:true,
			showToggle:true,
			pagination:true,
			pageSize:15
	    });

		$("#machinemsg_table").bootstrapTable({
	        data: retdata.machinelog,
			search: true,
			showColumns:true,
			showRefresh:true,
			showToggle:true,
			pagination:true,
			pageSize:15
	    });
	}

	function bindclickevent(){
		$(".data-tab .bootstrap-table tbody tr").unbind();
	    $(".data-tab .bootstrap-table tbody tr").click(function(){
	    	crappid = $(this).find(".crplanlink").text();
	    	fillmodal(crappid);
	    	$('#iframe').modal({backdrop:'static'});
            $('#iframe').modal('show');
	    });
	}

	function filltable(data){
		$("#datatable").bootstrapTable({
	        data: data.table_data,
			search: true,
			showColumns:true,
			showRefresh:true,
			showToggle:true,
			pagination:true,
			pageSize:50
	    });

	    $("#datatable").on("page-change.bs.table",function(){
            bindclickevent();
        });

	    bindclickevent();
	}

	function query_data(){
		var selected_org = []
		$.each($("#org_tab .btn-timeline-tab.active"),function(){
			selected_org.push($(this).attr('orgname'));
		});

		var poolname = $("#poolname").val();

		var selected_apptype = []
		$.each($("#apptype_tab .btn-timeline-tab.active"),function(){
			selected_apptype.push($(this).attr('apptype'));
		});

		endtime = $("[name='datetimemodifiableright']").val();

		starttime = $("[name='datetimemodifiableleft']").val();

		requestdata = {
			"selected_org":selected_org,
			"poolname":poolname,
			"selected_apptype":selected_apptype,
			"starttime":starttime,
			"endtime":endtime
		}

		r = $.ajax({
		  type: "POST",
		  url: "/ropv2/api/timeline_ajax/",
		  data: requestdata,
		  async: false
		});

		return $.parseJSON(r.responseText);
	}

	function buildchart(){
		$(".loading-div").removeClass("hide");
		var data = query_data();

	    preinit(data);
		filltimeline(data);
		fillfilter(data);
		fillchart(data);
		filltable(data);
		inited = true;
		$(".loading-div").addClass("hide");
	}

	$(document).ready(function(){
		$(".btn-timeline-submit").click(function(){
			buildchart();
		}); //trigger in jQRangeSlider.js line 820 when timeslider moved

		$(".btn-timeline-cancel").click(function(){
			cleanfilter();
		});

		buildchart();
	});

})(jQuery);