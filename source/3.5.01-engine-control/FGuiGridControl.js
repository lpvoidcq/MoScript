with(MO){
   //==========================================================
   // <T>引擎服务进程。</T>
   //
   // @class
   // @author maocy
   // @version 150305
   //==========================================================
   MO.FGuiGridControl = function FGuiGridControl(o){
      o = RClass.inherits(this, o, FProcessServer);
      //..........................................................
      // @attribute
      o._typeName  = null;
      o._groupName = null;
      o._name      = null;
      //..........................................................
      // @method
      o.name  = FGuiGridControl_name;
      return o;
   }

   //==========================================================
   // <T>获得名称。</T>
   //
   // @method
   // @return 名称
   //==========================================================
   MO.FGuiGridControl_name = function FGuiGridControl_name(){
      return this._name;
   }
}
