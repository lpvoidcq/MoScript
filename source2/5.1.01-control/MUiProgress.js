with(MO){
   //==========================================================
   // <T>处理接口。</T>
   //
   // @face
   // @author maocy
   // @version 150102
   //==========================================================
   MO.MUiProgress = function MUiProgress(o){
      o = RClass.inherits(this, o);
      // @method
      o.oeProgress = RMethod.virtual(o, 'oeProgress');
      return o;
   }
}
