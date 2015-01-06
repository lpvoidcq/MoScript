//==========================================================
// <T>渲染可绘制对象。</T>
//
// @author maocy
// @history 141231
//==========================================================
function FRenderable(o){
   o = RClass.inherits(this, o, FObject);
   //..........................................................
   // @attribute
   o._display    = null;
   o._context    = null;
   o._visible    = true;
   o._matrix     = null;
   //..........................................................
   // @method
   o.construct   = FRenderable_construct;
   o.matrix      = FRenderable_matrix;
   o.linkContext = FRenderable_linkContext;
   o.testVisible = FRenderable_testVisible;
   o.update      = FRenderable_update;
   return o;
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FRenderable_construct(){
   var o = this;
   o.__base.FObject.construct.call(o);
   o._matrix = new SMatrix3d();
}

//==========================================================
// <T>获得矩阵。</T>
//
// @method
// @return 矩阵
//==========================================================
function FRenderable_matrix(){
   return this._matrix;
}

//==========================================================
// <T>关联环境。</T>
//
// @param p:context:FRenderContext 环境
//==========================================================
function FRenderable_linkContext(p){
   this._context = p;
}

//==========================================================
// <T>测试是否可见。</T>
//
// @return Boolean 是否可见
//==========================================================
function FRenderable_testVisible(p){
   return this._visible;
}

//==========================================================
// <T>更新处理。</T>
//
// @method
//==========================================================
function FRenderable_update(p){
   var o = this;
   // 更新矩阵
   o._matrix.assign(p);
}
