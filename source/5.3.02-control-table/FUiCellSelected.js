with(MO){
   //==========================================================
   // <T>表格选择单元格。</T>
   //
   // @class
   // @author maocy
   // @version 150123
   //==========================================================
   MO.FUiCellSelected = function FUiCellSelected(o){
      o = RClass.inherits(this, o, FCell);
      //..........................................................
      // @property
      o._dataName  = '_select';
      //..........................................................
      // @style
      o._styleEdit = RClass.register(o, new AStyle('_styleEdit'));
      //..........................................................
      // @html
      o._hSelected = null;
      //..........................................................
      // @event
      o.onBuild    = FUiCellSelected_onBuild;
      // @event
      o.onSelected = FUiCellSelected_onSelected;


      // @method
      //o.buildForm     = FUiCellSelected_buildForm;
      //o.refreshStyle  = FUiCellSelected_refreshStyle;
      //o.isDataChanged = RMethod.emptyFalse;
      //o.get           = RMethod.empty;
      //o.reget         = RMethod.empty;
      //o.set           = RMethod.empty;
      //o.dispose       = FUiCellSelected_dispose;
      return o;
   }

   //==========================================================
   // <T>建立显示框架。</T>
   //
   // @method
   // @param p:argements:SArgements 参数集合
   //==========================================================
   MO.FUiCellSelected_onBuild = function FUiCellSelected_onBuild(p){
      var o = this;
      o.__base.FCell.onBuild.call(o, p)
      // 创建底板
      var c = o._column;
      var h = o._hPanel;
      h.align = 'center';
      var hs = o._hSelected = RBuilder.appendCheck(h, o.styleName('Edit'));
      hs.parent = o;
      hs.onclick = o.onSelected;
   }

   //==========================================================
   //<T>选中事件处理。</T>
   //
   //@method
   //==========================================================
   MO.FUiCellSelected_onSelected = function FUiCellSelected_onSelected(p){
      var o = this;
      //var r = o.parent.row;
      //var t = o.parent.table;
      //if(o.checked){
         //t.selectRow(r, false, true);
      //}else{
        //t.clearSelectRow(r);
      //}
   }








   //==========================================================
   //<T>ˢ�µ�Ԫ����ʽ��</T>
   //
   //@method
   //==========================================================
   MO.FUiCellSelected_refreshStyle = function FUiCellSelected_refreshStyle(){
      var o = this;
      var r = o.row;
      var t = r.table;
      var p = null;
      if(t.dispSelected){
         o.hPanel.style.display = 'block';
         if(r.isSelect){
            o._hSelected.checked = true;
            o.hPanel.style.backgroundColor = '#CEE7FF';
         }else{
            o._hSelected.checked = false;
            o.hPanel.style.backgroundColor = '#FFFFFF';
         }
      }else{
         o.hPanel.style.display = 'none';
      }
   }

   //==========================================================
   // <T>释放对象。</T>
   //
   // @method
   //==========================================================
   MO.FUiCellSelected_dispose = function FUiCellSelected_dispose(){
      var o = this;
      o.base.FCellEditControl.dispose.call(o);
      o._hSelected = null;
   }
}
