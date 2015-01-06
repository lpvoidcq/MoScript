//==========================================================
// <T>线程。</T>
//
// @class
// @author maocy
// @version 150105
//==========================================================
function FThread(o){
   o = RClass.inherits(this, o, FObject);
   //..........................................................
   // @attribute
   o._name       = null;
   o._statusCd   = EThreadStatus.Sleep;
   o._interval   = 100;
   o._delay      = 0;
   //..........................................................
   // @listener
   o.lsnsProcess = null;
   //..........................................................
   // @method
   o.construct   = FThread_construct;
   o.name        = FThread_name;
   o.statusCd    = FThread_statusCd;
   o.start       = FThread_start;
   o.stop        = FThread_stop;
   o.process     = FThread_process;
   return o;
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FThread_construct(){
   var o = this;
   o.__base.FObject.construct.call(o);
   o.lsnsProcess = new TListeners();
}

//==========================================================
// <T>获得名称。</T>
//
// @method
// @return 名称
//==========================================================
function FThread_name(){
   return this._name;
}

//==========================================================
// <T>获得状态。</T>
//
// @method
// @return 状态
//==========================================================
function FThread_statusCd(){
   return this._statusCd;
}

//==========================================================
// <T>启动处理。</T>
//
// @method
//==========================================================
function FThread_start(){
   this._statusCd = EThreadStatus.Active;
}

//==========================================================
// <T>停止处理。</T>
//
// @method
//==========================================================
function FThread_stop(){
   this._statusCd = EThreadStatus.Finish;
}

//==========================================================
// <T>调用处理。</T>
//
// @method
// @param p:interval:integer 调用间隔
// @return 名称
//==========================================================
function FThread_process(p){
   var o = this;
   if(o._delay <= 0){
      o.lsnsProcess.process(o);
      o._delay = o._interval;
   }else{
      o._delay -= p;
   }
}
