//==========================================================
// <T>主菜单。</T>
//
// @author maocy
// @history 141231
//==========================================================
function FDsSceneCatalog(o){
   o = RClass.inherits(this, o, FUiDataTreeView, MListenerSelected);
   //..........................................................
   // @event
   o.onBuild       = FDsSceneCatalog_onBuild;
   // @event
   o.onNodeClick   = FDsSceneCatalog_onNodeClick;
   //..........................................................
   // @listeners
   o.lsnsSelect    = null;
   //..........................................................
   // @method
   o.construct     = FDsSceneCatalog_construct;
   // @method
   o.buildTheme    = FDsSceneCatalog_buildTheme;
   o.buildDisplay  = FDsSceneCatalog_buildDisplay;
   o.buildTemplate = FDsSceneCatalog_buildTemplate;
   // @method
   o.selectObject  = FDsSceneCatalog_selectObject;
   // @method
   o.dispose       = FDsSceneCatalog_dispose;
   return o;
}

//==========================================================
// <T>构建树目录。</T>
//
// @method
// @param p:event:TEventProcess 处理事件
//==========================================================
function FDsSceneCatalog_onBuild(p){
   var o = this;
   o.__base.FUiDataTreeView.onBuild.call(o, p);
   // 注册事件
   o.lsnsClick.register(o, o.onNodeClick);
   // 加载定义
   o.loadUrl('/cloud.describe.tree.ws?action=query&code=design3d.template');
}

//==========================================================
// <T>构建树目录。</T>
//
// @method
// @param p:event:TEventProcess 处理事件
//==========================================================
function FDsSceneCatalog_onNodeClick(t, n){
   var o = this;
   var s = n.dataPropertyGet('linker');
   o.selectObject(s);
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FDsSceneCatalog_construct(){
   var o = this;
   o.__base.FUiDataTreeView.construct.call(o);
}

//==========================================================
// <T>根据模板主题建立目录。</T>
//
// @method
// @param r:node:FTreeNode 父节点
// @param t:theme:FRs3TemplateTheme 模板主题
//==========================================================
function FDsSceneCatalog_buildTheme(pn, pt){
   var o = this;
   // 创建主题节点
   var n = o.createNode();
   n.setLabel(pt.code());
   n.setTypeName('theme');
   n.dataPropertySet('linker', pt);
   pn.appendNode(n);
   // 创建材质集合
   var s = pt.materials();
   var c = s.count();
   if(c > 0){
      var mc = RConsole.find(FRs3MaterialConsole);
      for(var i = 0; i < c; i++){
         var m = s.value(i);
         var mg = mc.findGroup(m.groupGuid());
         // 创建节点
         var mn = o.createNode();
         mn.setLabel(mg.code());
         mn.setTypeName('material');
         mn.dataPropertySet('linker', m);
         n.appendNode(mn);
      }
   }
}

//==========================================================
// <T>根据模板主题建立目录。</T>
//
// @method
// @param r:node:FTreeNode 父节点
// @param t:theme:FRs3TemplateTheme 模板主题
//==========================================================
function FDsSceneCatalog_buildDisplay(pn, pt){
   var o = this;
   // 创建主题节点
   var n = o.createNode();
   n.setLabel(pt.code());
   n.setTypeName('theme');
   n.dataPropertySet('linker', pt);
   pn.appendNode(n);
   // 创建材质集合
   var s = pt.materials();
   var c = s.count();
   if(c > 0){
      var mgc = RConsole.find(FRs3MaterialGroupConsole);
      for(var i = 0; i < c; i++){
         var m = s.value(i);
         var mg = mgc.find(m.groupGuid());
         // 创建节点
         var mn = o.createNode();
         mn.setLabel(mg.code());
         mn.setTypeName('material');
         mn.dataPropertySet('linker', m);
         n.appendNode(mn);
      }
   }
}

//==========================================================
// <T>根据模板建立目录。</T>
//
// @method
// @param p:template:FTemplate3d 渲染模板
//==========================================================
function FDsSceneCatalog_buildTemplate(p){
   var o = this;
   var r = p._resource;
   // 新建场景节点
   var nr = o.createNode();
   nr.setLabel(r.code());
   nr.setTypeName('template');
   nr.dataPropertySet('linker', p);
   o.appendNode(nr);
   // 新建技术节点
   var nt = o.createNode();
   nt.setLabel('Technique');
   nt.setTypeName('template');
   nt.dataPropertySet('linker', p);
   nr.appendNode(nt);
   // 新建区域节点
   var nt = o.createNode();
   nt.setLabel('Region');
   nt.setTypeName('template');
   nt.dataPropertySet('linker', p);
   nr.appendNode(nt);
   // 新建区域相机节点
   var ntc = o.createNode();
   ntc.setLabel('Camera');
   ntc.setTypeName('template');
   ntc.dataPropertySet('linker', p);
   nt.appendNode(ntc);
   // 新建区域光源节点
   var ntc = o.createNode();
   ntc.setLabel('Light');
   ntc.setTypeName('template');
   ntc.dataPropertySet('linker', p);
   nt.appendNode(ntc);
   // 新建主题节点
   //var ts = r.themes();
   //var c = ts.count();
   //if(c > 0){
   //   var ns = o.createNode();
   //   ns.setLabel('Themes');
   //   ns.setTypeName('themes');
   //   nr.appendNode(ns);
   //   for(var i = 0; i < c; i++){
   //      o.buildTheme(ns, ts.get(i));
   //   }
   //}
   // 新建显示节点
   var ds = p.layers();
   var c = ds.count();
   if(c > 0){
      var ns = o.createNode();
      ns.setLabel('Layers');
      ns.setTypeName('displays');
      nr.appendNode(ns);
      for(var i = 0; i < c; i++){
         var d = ds.get(i);
         //var r = d.resource();
         //var rd = r.model();
         //var rm = r.mesh();
         var n = o.createNode();
         n.setLabel('Layer');
         n.setTypeName('display');
         n.dataPropertySet('linker', d);
         ns.appendNode(n);
      }
   }
}

//==========================================================
// <T>选中对象。</T>
//
// @method
// @param p:value:Object 对象
//==========================================================
function FDsSceneCatalog_selectObject(p){
   var o = this;
   if(p != null){
      o.processSelectedListener(p)
   }
}

//==========================================================
// <T>释放处理。</T>
//
// @method
//==========================================================
function FDsSceneCatalog_dispose(){
   var o = this;
   // 父处理
   o.__base.FUiDataTreeView.dispose.call(o);
}
