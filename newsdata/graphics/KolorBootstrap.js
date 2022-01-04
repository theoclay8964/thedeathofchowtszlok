var krpano=null;var debug=false;var krpanoLoaded=false;var pluginLoaded=new ktools.Map();var isTourStarted=false;var kolorFullscreen=null;var kolorBrowserDetect=null;var kolorStartIndex=4000;var crossDomainTargetUrl='';var tourLanguage;if(debug){if(typeof(console)=='undefined'){console={log:function(text){}};}}
jQuery(document).ready(function(){kolorBrowserDetect=new ktools.BrowserDetect();kolorBrowserDetect.init();kolorFullscreen=new ktools.Fullscreen(document.getElementById("tourDIV"));kolorFullscreen.supportsFullscreen();kolorFullscreen.setExternal({'enter':krPanoFullscreenEnter,'exit':krPanoFullscreenExit,'change':krpanoFullscreenChange,'resize':krPanoFullscreenResize});});function krPanoFullscreenEnter(){var ki=getKrPanoInstance();if(ki!==null){getKrPanoInstance().call("enterFullScreenFallback");}}
function krPanoFullscreenExit(){var ki=getKrPanoInstance();if(ki!==null){ki.call("exitFullScreenFallback");}}
function krpanoFullscreenChange(state){var ki=getKrPanoInstance();if(ki!==null){if(state){getKrPanoInstance().call("enterFullScreenChangeEvent");}else{getKrPanoInstance().call("exitFullScreenChangeEvent");}}}
function krPanoFullscreenResize(){var ki=getKrPanoInstance();if(ki!==null){getKrPanoInstance().call("resizeFullScreenEvent");}}
function setFullscreen(value){var state;if(typeof value=="string")
state=(value.toLowerCase()=="true");else
state=Boolean(value);if(kolorFullscreen){if(state){kolorFullscreen.request();}else{kolorFullscreen.exit();}}}
function getKrPanoInstance(){if(krpano==null){krpano=document.getElementById('krpanoSWFObject');}
return krpano;}
function invokeKrFunction(fnName){var args=[].slice.call(arguments,1);var callString=fnName+'(';for(var i=0,ii=args.length;i<ii;i++)
{callString+=args[i];if(i!=ii-1){callString+=', ';}}
callString+=');';if(getKrPanoInstance()!==null)
{getKrPanoInstance().call(callString);}}
function getKrValue(identifier,type){if(typeof identifier=="undefined"){return identifier;}
if(getKrPanoInstance()!==null)
{if(getKrPanoInstance().get(identifier)==null){return null;}
switch(type){case "int":return parseInt(getKrPanoInstance().get(identifier));case "float":return parseFloat(getKrPanoInstance().get(identifier));case "string":return String(getKrPanoInstance().get(identifier));case "bool":return Boolean(getKrPanoInstance().get(identifier)==='true'||parseInt(getKrPanoInstance().get(identifier))===1||getKrPanoInstance().get(identifier)==='yes'||getKrPanoInstance().get(identifier)==='on');default:return getKrPanoInstance().get(identifier);}}
else
{return null;}}
function invokePluginFunction(pluginName,functionName){if(debug){console.log("invokePluginFunction("+pluginName+", "+functionName+")");}
var plugin=ktools.KolorPluginList.getInstance().getPlugin(pluginName);if(plugin==null){if(debug){console.log("invokePluginFunction: plugin instance doesn't exist");}
if(pluginLoaded&&pluginLoaded.item(pluginName)){pluginLoaded.update(pluginName,arguments);}else{pluginLoaded.add(pluginName,arguments);}
return false;}
var engine=plugin.getRegistered();if(engine==null){if(debug){console.log("invokePluginFunction: plugin isn't registered");}
if(pluginLoaded&&pluginLoaded.item(pluginName)){pluginLoaded.update(pluginName,arguments);}else{pluginLoaded.add(pluginName,arguments);}
return false;}
var restArgs=[].slice.call(arguments,2);return engine[functionName](restArgs);}
function eventKrpanoLoaded(isWebVr){if(debug){console.log('krpano is loaded');}
if(krpanoLoaded){return false;}
tourLanguage=getKrValue("tour_language","string")
if(typeof tourLanguage=="undefined"){tourLanguage='en';}
ktools.I18N.getInstance().initLanguage(tourLanguage,crossDomainTargetUrl+'newsdata/news_messages_','.xml');krpanoLoaded=true;if(isWebVr){}else{addKolorMenu('panoramaMenu');addKolorBox('websiteViewer');}}
function eventUnloadPlugins(){resetValuesForPlugins();deleteKolorBox('websiteViewer');deleteKolorMenu('panoramaMenu');}
function resetValuesForPlugins(){krpano=null;krpanoLoaded=false;isTourStarted=false;pluginLoaded=new ktools.Map();kolorStartIndex=4000;}
function eventTourStarted(){if(debug){console.log('tour is started');}
isTourStarted=true;}
function eventTourChangeLanguage(pLang){if(debug){console.log('change tour language : '+pLang);}
ktools.I18N.getInstance().initLanguage(pLang,crossDomainTargetUrl+'newsdata/news_messages_','.xml');}
function addKolorBox(pPlugID)
{if(typeof ktools.KolorPluginList.getInstance().getPlugin(pPlugID)=="undefined")
{var kolorBoxCSS=new ktools.CssStyle("KolorBoxCSS",crossDomainTargetUrl+"newsdata/graphics/KolorBox/kolorBox.css");var kolorBoxJS=new ktools.Script("KolorBoxJS",crossDomainTargetUrl+"newsdata/graphics/KolorBox/KolorBox.min.js",[],true);var kolorBoxPlugin=new ktools.KolorPlugin(pPlugID);kolorBoxPlugin.addScript(kolorBoxJS);kolorBoxPlugin.addCss(kolorBoxCSS);ktools.KolorPluginList.getInstance().addPlugin(kolorBoxPlugin.getPluginName(),kolorBoxPlugin,true);showKolorBox(pPlugID,0,true);}}
function showKolorBox(pPlugID,pIndex,pInitOnly)
{if(debug){console.log("showKolorBox "+pPlugID);}
if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized()||typeof KolorBox==="undefined")
{err="KolorBox JS or XML is not loaded !";if(debug){console.log(err);}
setTimeout(function(){showKolorBox(pPlugID,pIndex,pInitOnly);},100);return;}
if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered()===null)
{ktools.KolorPluginList.getInstance().getPlugin(pPlugID).register(new KolorBox(pPlugID,"panoDIV"));}
var kolorBox=ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();if(!kolorBox.isReady())
{var kolorBoxOptions=[];var optionName='';var optionValue='';var optionLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].settings.option.count"));for(var j=0;j<optionLength;j++)
{optionName=getKrValue("ptplugin["+pPlugID+"].settings.option["+j+"].name","string");if(optionName=='zorder'){optionValue=kolorStartIndex+getKrValue("ptplugin["+pPlugID+"].settings.option["+j+"].value",getKrValue("ptplugin["+pPlugID+"].settings.option["+j+"].type","string"));}else{optionValue=getKrValue("ptplugin["+pPlugID+"].settings.option["+j+"].value",getKrValue("ptplugin["+pPlugID+"].settings.option["+j+"].type","string"));}
kolorBoxOptions[optionName]=optionValue;}
kolorBoxOptions['device']=getKrValue('vrtourdevice','string');kolorBox.setKolorBoxOptions(kolorBoxOptions);if(kolorBoxOptions['starts_opened']){pInitOnly=false;}
var kbItem=null;var itemLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata.item.count"));for(var k=0;k<itemLength;k++)
{kbItem=new KolorBoxObject();kbItem.setName(getKrValue("ptplugin["+pPlugID+"].internaldata.item["+k+"].name","string"));kbItem.setTitle(getKrValue("ptplugin["+pPlugID+"].internaldata.item["+k+"].title","string"));kbItem.setCaption(getKrValue("ptplugin["+pPlugID+"].internaldata.item["+k+"].caption","string"));kbItem.setValue(getKrValue("ptplugin["+pPlugID+"].internaldata.item["+k+"].value","string"));if(kbItem.getValue()==="externalData")
kbItem.setData(getKrValue('data['+getKrValue("ptplugin["+pPlugID+"].internaldata.item["+k+"].dataName","string")+'].content','string'));kolorBox.addKolorBoxItem(kbItem);kbItem.init();}
kolorBox.setReady(true);invokeKrFunction("kolorBoxJsReady_"+pPlugID);}
if(typeof pPlugID!=="undefined"&&(typeof pInitOnly==="undefined"||pInitOnly===false))
{if(typeof pIndex==="undefined"){pIndex=0;}
kolorBox.openKolorBox(pIndex);}
if(pluginLoaded&&pluginLoaded.item(pPlugID)){invokePluginFunction.apply(null,pluginLoaded.item(pPlugID));pluginLoaded.remove(pPlugID);}}
function deleteKolorBox(pPlugID)
{if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID)){ktools.KolorPluginList.getInstance().removePlugin(pPlugID);}
var parent=document.getElementById("panoDIV");var child=document.getElementById(pPlugID);if(parent&&child){parent.removeChild(child);}}
function addKolorMenu(pPlugID)
{if(typeof ktools.KolorPluginList.getInstance().getPlugin(pPlugID)=="undefined")
{var kolorMenuCSS=new ktools.CssStyle("KolorMenuCSS",crossDomainTargetUrl+"newsdata/graphics/KolorMenu/kolorMenu.css");var kolorMenuJS=new ktools.Script("KolorMenuJS",crossDomainTargetUrl+"newsdata/graphics/KolorMenu/KolorMenu.min.js",[],true);var kolorMenuPlugin=new ktools.KolorPlugin(pPlugID);kolorMenuPlugin.addScript(kolorMenuJS);kolorMenuPlugin.addCss(kolorMenuCSS);ktools.KolorPluginList.getInstance().addPlugin(kolorMenuPlugin.getPluginName(),kolorMenuPlugin,true);}}
function openKolorMenu(pPlugID)
{if(debug){console.log("openKolorMenu "+pPlugID);}
if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered()||!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized()||typeof KolorMenu=="undefined"){createKolorMenu(pPlugID);}else{ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered().showKolorMenu();}}
function createKolorMenu(pPlugID)
{if(debug){console.log("createKolorMenu "+pPlugID);}
if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized()||typeof KolorMenu=="undefined")
{err="KolorMenu JS or XML is not loaded !";if(debug){console.log(err);}
setTimeout(function(){createKolorMenu(pPlugID);},100);return;}
if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered()==null)
{ktools.KolorPluginList.getInstance().getPlugin(pPlugID).register(new KolorMenu(pPlugID,"panoDIV"));}
var kolorMenu=ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();if(!kolorMenu.isReady())
{var kolorMenuOptions=[];var optionLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].settings.option.count"));for(var i=0;i<optionLength;i++)
{if(getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].name","string")=='zorder'){kolorMenuOptions[getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].name","string")]=kolorStartIndex+getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].value",getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].type","string"));}else{kolorMenuOptions[getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].name","string")]=getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].value",getKrValue("ptplugin["+pPlugID+"].settings.option["+i+"].type","string"));}}
kolorMenuOptions['device']=getKrValue('vrtourdevice','string');kolorMenu.setKolorMenuOptions(kolorMenuOptions);var groupLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata.group.count"));var group=null;var itemLength=0;var item=null;var itemOptionsLength=0;for(var j=0;j<groupLength;j++)
{group=new KolorMenuObject();group.setName(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].name","string"));if(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].titleID","string")!=='')
group.setTitle(ktools.I18N.getInstance().getMessage(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].titleID","string")));group.setI18nText(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].titleID","string"));group.setAction(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].action","string"));group.setThumbnail(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].thumbnail","string"));group.setSubMenu(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].subMenu","bool"));group.setCssClass(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].cssClass","string"));itemLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata.group["+j+"].item.count"));for(var k=0;k<itemLength;k++)
{item=new KolorMenuObject();item.setName(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].name","string"));if(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].titleID","string")!=='')
item.setTitle(ktools.I18N.getInstance().getMessage(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].titleID","string")));item.setI18nText(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].titleID","string"));item.setAction(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].action","string"));item.setThumbnail(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].thumbnail","string"));item.setCssClass(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].cssClass","string"));item.setParent(group);itemOptionsLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].option.count"));for(var l=0;l<itemOptionsLength;l++)
{item.addOption(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].option["+l+"].name","string"),getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].option["+l+"].value",getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].item["+k+"].option["+l+"].type","string")));}
group.addChild(item);}
groupOptionsLength=parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata.group["+j+"].option.count"));for(var m=0;m<groupOptionsLength;m++)
{group.addOption(getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].option["+m+"].name","string"),getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].option["+m+"].value",getKrValue("ptplugin["+pPlugID+"].internaldata.group["+j+"].option["+m+"].type","string")));}
kolorMenu.addKolorMenuGroup(group);}
kolorMenu.setReady(true);invokeKrFunction("kolorMenuJsReady_"+pPlugID);kolorMenu.openKolorMenu();}}
function updateKolorMenu(pPlugID)
{if(debug){console.log("updateKolorMenu "+pPlugID);}
if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized()&&typeof KolorMenu!="undefined"&&ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered()!=null)
{var kolorMenu=ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();if(kolorMenu.isReady())
{var groups=kolorMenu.getKolorMenuGroups();var groupsLength=groups.size();var itemsLength=0;var group,item;for(var i=0;i<groupsLength;i++)
{group=groups.get(i);itemsLength=group.getChildren().size();if(group.getSubMenu()){group.setTitle(ktools.I18N.getInstance().getMessage(group.getI18nText()));}
if(group.hasChildren()&&itemsLength>0){for(var j=0;j<itemsLength;j++){item=group.getChildren().get(j);item.setTitle(ktools.I18N.getInstance().getMessage(item.getI18nText()));}}}}}}
function deleteKolorMenu(pPlugID)
{if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID)){ktools.KolorPluginList.getInstance().removePlugin(pPlugID);}
var parent=document.getElementById("panoDIV");var child=document.getElementById(pPlugID);if(parent&&child){parent.removeChild(child);}}