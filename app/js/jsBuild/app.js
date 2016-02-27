var appModule=angular.module("app",["ui.router","ui.bootstrap","ngResource","ngMessages"]);appModule.run(["$rootScope","$state","$stateParams",function($rootScope,$state,$stateParams){$rootScope.state=$state,$rootScope.$stateParams=$stateParams,$rootScope.$on("$stateChangeStart",function(){window.isPass||(location.hash="/index")})}]).config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/index"),$stateProvider.state("index",{url:"/index",controller:"mainCtrl",templateUrl:"tpls/main.html"})}]).config(function($httpProvider){$httpProvider.interceptors.push("requestUrl"),$httpProvider.interceptors.push("responseUrl"),$httpProvider.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8"});
appModule.directive("pageutil",function(){return{restrict:"A",replace:!0,scope:{headurl:"@",bodyurl:"@",pageutil:"=pageutil",param:"=param",filter:"=filter"},controller:["$scope","$http","clickDown","$filter","$uibModal",function($scope,$http,clickDown,$filter,$uibModal){$scope.pageutil||($scope.pageutil={}),$scope.pageutil.parameter={},$scope.pageutil.pageNum=1,$scope.pageutil.pageSize=10,$scope.pageutil.orderBy="",$scope.pageutil.buttons=[],$scope.param&&($scope.pageutil.parameter=$scope.param),$scope.getHead=function(){$http.get($scope.headurl).success(function(data){for(var i in data.ctrlShow)data.ctrlShow[i].desc=!1,data.ctrlShow[i].asc=!1,data.ctrlShow[i].sortFlag=!1;data.ctrlShow.enThead=function(obj){obj.sortFlag?obj.asc=!0:obj.desc=!0},data.ctrlShow.leThead=function(obj){obj.desc=!1,obj.asc=!1},data.ctrlShow.descClick=function(obj){obj.sortFlag=!0,obj.desc=!1,obj.asc=!0,$scope.pageutil.orderBy=obj.key+" desc",$scope.getBody()},data.ctrlShow.ascClick=function(obj){obj.sortFlag=!1,obj.desc=!0,obj.asc=!1,$scope.pageutil.orderBy=obj.key+" asc",$scope.getBody()},$scope.pageutil.ctrlShow=data.ctrlShow})},$scope.getBody=function(){$http.post($scope.bodyurl,{pageNum:$scope.pageutil.pageNum,pageSize:$scope.pageutil.pageSize,parameter:$scope.pageutil.parameter,orderBy:$scope.pageutil.orderBy}).success(function(data){if($scope.pageutil.data=data,$scope.filter)for(var i in $scope.pageutil.data.list)for(var j in $scope.pageutil.data.list[i])for(var k=0;k<$scope.filter.length;k++)j==$scope.filter[k].name&&($scope.pageutil.data.list[i][j]=$filter($scope.filter[k].name)($scope.pageutil.data.list[i][j],$scope.filter[k].param));data.list._selected=!1;for(var i=0;i<data.list.length;i++){var o=data.list[i];o._selected=!1,o._selectItem=function(fn){this._selected=!this._selected,fn&&fn();for(var j=0;j<data.list.length;j++)if(!(data.list._selected=data.list[j]._selected))return}}data.list._selectAll=function(){data.list._selected=!data.list._selected;for(var i=0;i<data.list.length;i++)data.list[i]._selected=data.list._selected},$scope.pageutil._getSelectedItems=function(attr){for(var result=[],i=0;i<data.list.length;i++)data.list[i]._selected&&result.push(attr?data.list[i][attr]:data.list[i]);return result};var btnsLength=5,start=$scope.pageutil.pageNum-Math.floor(btnsLength/2),end=$scope.pageutil.pageNum+Math.floor(btnsLength/2);start=1>start?1:start,end=end>data.pages?data.pages:end,$scope.pageutil.buttons.length=0;for(var i=start;end>=i;i++)$scope.pageutil.buttons.push(i);$scope.pageutil.clickDown=function(name,num,item,$event){clickDown(name,num,item,$event)},$scope.$emit("pageData",$scope.pageutil)}).error(function(){console.log("请求失败")})},$scope.pageutil.go=function(pageNum){pageNum&&($scope.pageutil.pageNum=1>pageNum?1:pageNum,$scope.pageutil.data&&($scope.pageutil.pageNum=pageNum>$scope.pageutil.data.pages?$scope.pageutil.data.pages:pageNum)),$scope.getHead(),$scope.getBody()},$scope.options=[{value:10,name:"10"},{value:20,name:"20"},{value:50,name:"50"}],$scope.pageutil.go(1),$scope.pageutil.ctrlTableShow=function(size){$uibModal.open({templateUrl:"tpls/common/ctrlTableShow.html",controller:function($scope,$uibModalInstance,show){$scope.show=show.data.ctrlShow.sort(function(a,b){return a.sort-b.sort}),$scope.up=function(index,obj){index>0&&($scope.show[index].sort=obj.sort-1,$scope.show[index-1].sort=show.data.ctrlShow[index-1].sort+1,$scope.show.sort(function(a,b){return a.sort-b.sort}))},$scope.down=function(index,obj){index<$scope.show.length&&($scope.show[index].sort=obj.sort+1,$scope.show[index+1].sort=show.data.ctrlShow[index+1].sort-1,$scope.show.sort(function(a,b){return a.sort-b.sort}))},$scope.ok=function(){$uibModalInstance.close()},$scope.reDefualt=function(){},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")}},size:size,resolve:{show:function(){return $http.get($scope.headurl).success(function(data){$scope.data=data.ctrlShow})}}})}}],templateUrl:"tpls/common/table.html"}}),appModule.directive("grid",function(){return{restrict:"E",transclude:!0,scope:{obj:"@"},controller:function($scope,$http){}}}).directive("gridTr",function(){return{require:"^gird",restrict:"E",transclude:!0,scope:{name:"@"},link:function(scope){}}}),appModule.directive("myTabs",function(){return{restrict:"E",transclude:!0,scope:{},controller:["$scope",function($scope){var panes=$scope.panes=[];$scope.select=function(pane){angular.forEach(panes,function(pane){pane.selected=!1}),pane.selected=!0},this.addPane=function(pane){panes.length||$scope.select(pane),panes.push(pane)}}],templateUrl:"tpls/common/my-tabs.html"}}).directive("myPane",function(){return{require:"^myTabs",restrict:"E",transclude:!0,scope:{title:"@"},link:function(scope,element,attrs,myTabsCtrl){myTabsCtrl.addPane(scope)},templateUrl:"tpls/common/my-pane.html"}}),appModule.directive("tag",function(){return{restrict:"AE",replace:!0,controller:["$scope","$rootScope",function($scope,$rootScope){$scope.tags=[],$scope.tagHistory=[],$scope.appendTag=function(obj){for(var i in $scope.tags)$scope.tags.hasOwnProperty(i)&&($scope.tags[i].current=!1);var flag;for(var i in $scope.tags){if($scope.tags[i].code==obj.code){obj=$scope.tags[i],flag=!0;break}flag=!1}if(flag||$scope.tags.push(obj),$scope.tags.indexOf(obj)<0&&$scope.tags.push(obj),$scope.tagHistory[$scope.tagHistory.length-1]!=obj&&$scope.tagHistory.push(obj),obj.current=!0,!$rootScope.wrapperShow)for(var i in $rootScope.roleMenu)$rootScope.roleMenu[i].active&&($rootScope.roleMenu[i].active=!$rootScope.roleMenu[i].active)},$scope.remove=function(obj){for(var h_index;(h_index=$scope.tagHistory.indexOf(obj))>=0;)$scope.tagHistory.splice(h_index,1);$scope.tags.splice($scope.tags.indexOf(obj),1),$scope.tagHistory.length&&$scope.appendTag($scope.tagHistory[$scope.tagHistory.length-1])}}],templateUrl:"tpls/common/tags.html"}});
appModule.factory("rightMenu",["$rootScope","$interval",function($rootScope,$interval){$interval(function(){$rootScope.rightMenus&&window.showContextMenu!=$rootScope.rightMenus.show&&($rootScope.rightMenus.show=window.showContextMenu)},10);var rightMenu=function(params,event){$rootScope.rightMenus=params,$rootScope.rightMenus.X=event.pageX+"px",$rootScope.rightMenus.Y=event.pageY+"px",window.showContextMenu=!0,$rootScope.rightMenus.close=function($event){2==$event.button&&($rootScope.rightMenus.X=$event.pageX+"px",$rootScope.rightMenus.Y=$event.pageY+"px",window.showContextMenu=!1)},window.rightMenus=$rootScope.rightMenus};return rightMenu}]),appModule.factory("clickDown",function(){var one=null,two=null,clickDown=function(name,num,item,$event){0==$event.button&&item._selectItem(function(){if($event.shiftKey&&$event.ctrlKey)console.log("all");else if($event.shiftKey){null!=one?two=num:one=num;var start=one,end=two;one>two&&(start=two,end=one);for(var i=start;end>=i;i++)name.data.list[i]._selected=name.data.list[two]._selected;one=two,two=null}else if($event.shiftKey||$event.ctrlKey)$event.ctrlKey&&(one=num);else{one=num;for(var i=0,length=name.data.list.length;length>i;i++)i!=num&&(name.data.list[i]._selected=!1)}})};return clickDown}),appModule.factory("dialog",["dialoginit","$http",function(dialoginit,$http){return function(obj){return obj.check?obj.url?void $http.get(obj.url,obj.data).success(function(data){return dialoginit(obj.size,obj.tpls,obj.ctrl,data,obj.backdrop)}):dialoginit(obj.size,obj.tpls,obj.ctrl,obj.data,obj.backdrop):console.log("不满足操作条件")}}]),appModule.factory("dialoginit",["$uibModal",function($uibModal){return function(size,tpls,ctrl,data,backdrop){$uibModal.open({animation:!0,backdrop:backdrop,templateUrl:tpls,controller:ctrl,size:size,resolve:{data:function(){return data}}})}}]),appModule.factory("au_dialog",["dialoginit","$http",function(dialoginit,$http){return function(obj){obj.msg.obj={};var ctrl;return"add"==obj.status&&(ctrl=["$scope","$http","$uibModalInstance",function($scope,$http,$uibModalInstance){$scope.submit=function(){$http.post(obj.addurl,obj.msg.obj).success(function(data){data&&obj.msg.go()})},$scope.cancel=$uibModalInstance.dismiss("cancel")}]),dialoginit("lg",obj.tpls,ctrl,obj.msg.obj,"default")}}]),appModule.factory("",function(){}),appModule.factory("rts",["$http",function($http){return function(url,param,fn){fn?$http.post(url,param).success(function(data){data&&console.log("请求成功")}):console.log("请求条件不满足")}}]),appModule.factory("requestUrl",["$rootScope","$q","$injector",function($rootScope,$q,$injector){var requestUrl={request:function(config){return $rootScope.loading=!1,$rootScope.width="0%",config&&($rootScope.loading=!0,$rootScope.width="70%"),config},requestError:function(rejectReason){return $rootScope.loading=!1,$rootScope.width="0%","requestRejector"===rejectReason?{transformRequest:[],transformResponse:[],method:"GET",url:"http://localhost:63342/wuliuModule/app/index.html#/index",headers:{Accept:"application/json, text/plain, */*"}}:$q.reject(rejectReason)}};return requestUrl}]),appModule.factory("responseUrl",["$rootScope","$q","$injector",function($rootScope,$q,$injector){var responseUrl={response:function(response){return $rootScope.loading&&"70%"==$rootScope.width&&($rootScope.width="100%"),response&&($rootScope.loading=!1),response},responseError:function(response){if(200!=response.status){var deferred=$q.defer();return console.log(deferred.notify),console.log(deferred.resolve),void console.log(deferred.reject)}return $q.reject(response)}};return responseUrl}]);
appModule.filter("status",function(){return function(input,param){return 1==param?"ENABLED"==input?"生效":"DISABLE"==input?"失效":input:void 0}});
appModule.controller("mainCtrl",["$rootScope","$scope","$http","$state","rightMenu","$interval","$filter",function($rootScope,$scope,$http,$state,rightMenu,$interval,$filter){window.isPass=!0,$rootScope.loading=!1,$rootScope.wrapperShow=!0,$rootScope.wrapperShowSm=!1,$rootScope.wrapperWidth="200px",$interval(function(){return $rootScope.nowTime=new Date,$rootScope.nowTime=$filter("date")($rootScope.nowTime,"yyyy-MM-dd HH:mm:ss"),$rootScope.nowTime},1),$scope.sysActive=[];for(var i=0;4>i;i++)$scope.sysActive.push(!1);$scope.sysFalse=function(){for(var i=0;4>i;i++)$scope.sysActive[i]=!1},$rootScope.wrapperBtn=function(){if($rootScope.wrapperShow=!$rootScope.wrapperShow,$rootScope.wrapperShow)$rootScope.wrapperWidth="200px";else{$rootScope.wrapperWidth="50px";for(var i in $rootScope.roleMenu)$rootScope.roleMenu[i].active&&($rootScope.roleMenu[i].active=!$rootScope.roleMenu[i].active)}},$scope.bisSys=function(){$http.get("testJson/bisNavleft.json").success(function(data){$rootScope.roleMenu=data.resultValue,$scope.sysFalse(),$scope.sysActive[0]=!0})},$scope.omsSys=function(){$http.get("testJson/omsNavleft.json").success(function(data){$rootScope.roleMenu=data.resultValue,$scope.sysFalse(),$scope.sysActive[1]=!0})},$scope.wmsSys=function(){$http.get("testJson/wmsNavleft.json").success(function(data){$rootScope.roleMenu=data.resultValue,$scope.sysFalse(),$scope.sysActive[2]=!0})},$scope.tmsSys=function(){$http.get("testJson/tmsNavleft.json").success(function(data){$rootScope.roleMenu=data.resultValue,$scope.sysFalse(),$scope.sysActive[3]=!0})},$scope.toggle=function(list){if(list.childMenus=list.childMenus||[],0==list.childMenus.length)tabs.append(list);else{for(var i in $rootScope.roleMenu)list!=$rootScope.roleMenu[i]&&($rootScope.roleMenu[i].active=!1);list.active=!list.active}},$scope.showRightMenus=function(index,tab,$event){2==$event.button&&rightMenu([{text:"关闭当前",click:function(){console.log(tab),tab.remove()}},{text:"关闭所有",click:function(){tabs.history.length=0,tabs.length=0,$state.go("index")}},{text:"关闭其他",click:function(){tabs.history.length=0,tabs.length=0,tabs.append(tab)}}],$event)}}]);
appModule.controller("bisWarehouse",["$scope","dialog","rts","au_dialog",function($scope,dialog,rts,au_dialog){$scope.warehousefilter=[{name:"status",param:1}],$scope.param={},$scope.$on("pageData",function($event,msg){$scope.check=function(){if(msg._getSelectedItems.length)for(var i in msg._getSelectedItems())return"生效"==msg._getSelectedItems()[i].status&&"2"==msg._getSelectedItems()[i].name},$scope.detailCheck=function(){return 1==msg._getSelectedItems().length?!0:void 0},$scope.enableCheck=function(){if(msg._getSelectedItems.length)for(var i in msg._getSelectedItems())return"失效"==msg._getSelectedItems()[i].status},$scope["delete"]=function(){return dialog({size:"sm",check:$scope.check(),tpls:"tpls/bis/bisWarehouselist/dialog/delete.html",ctrl:"wareDeleteCtrl",data:msg._getSelectedItems("id"),backdrop:"static"})},$scope.detail=function(){return dialog({size:"lg",check:$scope.detailCheck(),tpls:"tpls/bis/bisWarehouselist/dialog/detail.html",ctrl:"wareDetailCtrl",data:msg._getSelectedItems("id"),backdrop:"default",url:"testJson/updateWare.json"})},$scope.enable=function(){return rts("enable-url.do",msg._getSelectedItems("id"),$scope.enableCheck())},$scope.search=function(){dialog({size:"md",check:!0,tpls:"tpls/bis/bisWarehouselist/dialog/search.html",ctrl:"wareSearch",backdrop:"default"})},$scope.asearch=function(){dialog({size:"lg",check:!0,tpls:"tpls/bis/bisWarehouselist/dialog/search.html",ctrl:"wareDetailCtrl",backdrop:"default"})},$scope.xxx=function(){console.log("hahaha")}})}]),appModule.controller("wareDeleteCtrl",["$scope","$uibModalInstance","data",function($scope,$uibModalInstance,data){$scope.ok=function(){console.log(data),$uibModalInstance.close()},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")}}]),appModule.controller("wareDetailCtrl",["$scope","$http","$uibModalInstance","data",function($scope,$http,$uibModalInstance,data){$scope.detail=data,$scope.ok=function(){$uibModalInstance.close()},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")}}]),appModule.controller("wareSearch",["$scope","$http",function($scope,$http){$http.get("testJson/ctrlTable.json").success(function(data){$scope.title=data.ctrlShow}),$scope.data=[{value:"=",key:"等于"},{value:">",key:"大于"},{value:"<",key:"小于"}],$scope.colname="",$scope.condition="",$scope.newSearch=[{}],$scope.whereCond="",$scope.value="",$scope.changeCol=function(){for(var i in $scope.title)$scope.colname==$scope.title[i].key&&($scope.newSearch[$scope.newSearch.length-1].colname=$scope.colname,$scope.newSearch[$scope.newSearch.length-1].colnameText=$scope.title[i].colName)},$scope.valueKeyDown=function(){$scope.newSearch[$scope.newSearch.length-1].value=$scope.value},$scope.changeCond=function(){for(var i in $scope.data)$scope.condition==$scope.data[i].value&&($scope.newSearch[$scope.newSearch.length-1].condition=$scope.condition,$scope.newSearch[$scope.newSearch.length-1].conditionText=$scope.data[i].key)},$scope.connectJson=[{connect:"and",connectText:"并且"},{connect:"or",connectText:"或者"}],$scope.connectFn=function(i){$scope.newSearch.length&&!$scope.newSearch[$scope.newSearch.length-1].connect&&($scope.newSearch[$scope.newSearch.length-1].connect=$scope.connectJson[i].connect,$scope.newSearch[$scope.newSearch.length-1].connectText=$scope.connectJson[i].connectText,$scope.newSearch.push({}),$scope.colname="",$scope.condition="",$scope.value="")},$scope.andClick=function(){return $scope.connectFn(0)},$scope.orClick=function(){return $scope.connectFn(1)},$scope.searchGo=function(){}}]);
