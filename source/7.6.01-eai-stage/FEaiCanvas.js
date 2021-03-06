with(MO){
   //==========================================================
   // <T>模板画板。</T>
   //
   // @author maocy
   // @history 150130
   //==========================================================
   MO.FEaiCanvas = function FEaiCanvas(o){
      o = RClass.inherits(this, o, FE3dCanvas);
      //..........................................................
      // @attribute
      o._scaleRate          = 1;
      o._optionAlpha        = false;
      // @attribute
      o._activeTemplate     = null;
      // @attribute
      o._capturePosition    = null;
      o._captureRotation    = null;
      // @attribute
      o._stage              = null;
      //..........................................................
      // @event
      o.onEnterFrame        = FEaiCanvas_onEnterFrame;
      // @event
      o.onMouseCaptureStart = FEaiCanvas_onMouseCaptureStart;
      o.onMouseCapture      = FEaiCanvas_onMouseCapture;
      o.onMouseCaptureStop  = FEaiCanvas_onMouseCaptureStop;
      // @event
      o.onResize            = FEaiCanvas_onResize;
      // @event
      o.onTemplateLoad      = FEaiCanvas_onTemplateLoad;
      //..........................................................
      // @method
      o.construct           = FEaiCanvas_construct;
      // @method
      o.build               = FEaiCanvas_build;
      o.setPanel            = FEaiCanvas_setPanel;
      o.loadByGuid          = FEaiCanvas_loadByGuid;
      o.loadByCode          = FEaiCanvas_loadByCode;
      // @method
      o.dispose             = FEaiCanvas_dispose;
      return o;
   }

   //==========================================================
   // <T>每帧处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_onEnterFrame = function FEaiCanvas_onEnterFrame(){
      var o = this;
      var stage = o._stage;
      if(!stage){
         return;
      }
      //..........................................................
      // 按键处理
      var c = stage.camera();
      var d = 0.5;
      var r = 0.05;
      var kw = RKeyboard.isPress(EKeyCode.W);
      var ks = RKeyboard.isPress(EKeyCode.S);
      if(kw && !ks){
         c.doWalk(d);
      }
      if(!kw && ks){
         c.doWalk(-d);
      }
      var ka = RKeyboard.isPress(EKeyCode.A);
      var kd = RKeyboard.isPress(EKeyCode.D);
      if(ka && !kd){
         //c.doStrafe(r);
         c.doYaw(r);
      }
      if(!ka && kd){
         //c.doStrafe(-r);
         c.doYaw(-r);
      }
      var kq = RKeyboard.isPress(EKeyCode.Q);
      var ke = RKeyboard.isPress(EKeyCode.E);
      if(kq && !ke){
         c.doFly(d);
      }
      if(!kq && ke){
         c.doFly(-d);
      }
      var kz = RKeyboard.isPress(EKeyCode.Z);
      var kw = RKeyboard.isPress(EKeyCode.X);
      if(kz && !kw){
         c.doPitch(r);
      }
      if(!kz && kw){
         c.doPitch(-r);
      }
      c.update();
      //..........................................................
      // 旋转模型
      if(o._optionRotation){
         var r = o._rotation;
         // 旋转所有层
         var ls = stage.layers();
         var c = ls.count();
         for(var i = 0; i < c; i++){
            var l = ls.value(i);
            var m = l.matrix();
            m.setRotation(0, r.y, 0);
            m.update();
         }
         // 设置变量
         r.y += 0.01;
      }
   }

   //==========================================================
   // <T>鼠标捕捉开始处理。</T>
   //
   // @method
   // @param p:event:SEvent 事件
   //==========================================================
   MO.FEaiCanvas_onMouseCaptureStart = function FEaiCanvas_onMouseCaptureStart(p){
      var o = this;
      var s = o._activeTemplate;
      if(!s){
         return;
      }
      // 选取物件
      var r = o._activeTemplate.region();
      var st = RConsole.find(FG3dTechniqueConsole).find(o._graphicContext, FG3dSelectTechnique);
      var r = st.test(r, p.offsetX, p.offsetY);
      o._capturePosition.set(p.clientX, p.clientY);
      o._captureRotation.assign(s.camera()._rotation);
   }

   //==========================================================
   // <T>鼠标捕捉处理。</T>
   //
   // @method
   // @param p:event:SEvent 事件
   //==========================================================
   MO.FEaiCanvas_onMouseCapture = function FEaiCanvas_onMouseCapture(p){
      var o = this;
      var s = o._activeTemplate;
      if(!s){
         return;
      }
      var cx = p.clientX - o._capturePosition.x;
      var cy = p.clientY - o._capturePosition.y;
      var c = o._activeTemplate.camera();
      var r = c.rotation();
      var cr = o._captureRotation;
      r.x = cr.x + cy * 0.003;
      r.y = cr.y + cx * 0.003;
   }

   //==========================================================
   // <T>鼠标捕捉结束处理。</T>
   //
   // @method
   // @param p:event:SEvent 事件
   //==========================================================
   MO.FEaiCanvas_onMouseCaptureStop = function FEaiCanvas_onMouseCaptureStop(p){
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   // @param p:template:FTemplate3d 模板
   //==========================================================
   MO.FEaiCanvas_onResize = function FEaiCanvas_onResize(){
      var o = this;
      o.__base.FE3dCanvas.onResize.call(o, event);
      // 获得相机信息
      var c = o._graphicContext;
      var cs = c.size();
      var s = o._activeSpace;
      if(s){
         var rp = s.camera().projection();
         rp.size().set(cs.width, cs.height);
         rp.update();
      }
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   // @param p:template:FTemplate3d 模板
   //==========================================================
   MO.FEaiCanvas_onTemplateLoad = function FEaiCanvas_onTemplateLoad(p){
      var o = this;
      var c = o._graphicContext;
      var s = o._activeTemplate;
      // 设置投影
      var cs = c.size();
      var rp = s.camera().projection();
      rp.size().set(cs.width, cs.height);
      rp.update();
      // 加载完成
      o.processLoadListener(o, s);
   }

   //==========================================================
   // <T>构造处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_construct = function FEaiCanvas_construct(){
      var o = this;
      o.__base.FE3dCanvas.construct.call(o);
      o._rotation = new SVector3();
      o._capturePosition = new SPoint2();
      o._captureRotation = new SVector3();
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_build = function FEaiCanvas_build(hPanel){
      var o = this;
      o.__base.FE3dCanvas.build.call(o, hPanel);
      // 创建舞台
      var stage = o._stage = MO.RClass.create(MO.FEaiStage);
      stage.linkGraphicContext(o);
      stage.region().linkGraphicContext(o);
      stage.selectTechnique(o, FE3dGeneralTechnique);
      // 注册舞台
      RStage.register('eai.stage', stage);
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_setPanel = function FEaiCanvas_setPanel(hPanel){
      var o = this;
      o.__base.FE3dCanvas.setPanel.call(o, hPanel);
      // 设置相机投影
      var stage = o._stage;
      var camera = stage.region().camera();
      var projection = camera.projection();
      projection.size().set(o._hCanvas.offsetWidth, o._hCanvas.offsetHeight);
      projection.update();
      camera.position().set(0, 0, -10);
      camera.lookAt(0, 0, 0);
      camera.update();
      // 注册舞台
      RStage.register('eai.stage', stage);
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_loadByGuid = function FEaiCanvas_loadByGuid(p){
      var o = this;
      var c = o._graphicContext;
      // 收集场景
      var sc = RConsole.find(FE3dSceneConsole);
      if(o._activeTemplate != null){
         sc.free(o._activeTemplate);
      }
      // 监听加载完成
      var s = sc.alloc(o, p);
      s.addLoadListener(o, o.onTemplateLoad);
      s.selectTechnique(c, FG3dGeneralTechnique);
      o._stage = o._activeTemplate = s;
      RStage.register('stage3d', s);
   }

   //==========================================================
   // <T>加载模板处理。</T>
   //
   // @method
   // @param code:String 代码
   //==========================================================
   MO.FEaiCanvas_loadByCode = function FEaiCanvas_loadByCode(code){
      var o = this;
      var context = o._graphicContext;
      // 收集场景
      var templateConsole = RConsole.find(FE3dTemplateConsole);
      if(o._activeTemplate != null){
         templateConsole.free(o._activeTemplate);
      }
      // 监听加载完成
      var template = templateConsole.allocByCode(context, code);
      template.addLoadListener(o, o.onTemplateLoad);
      template.selectTechnique(context, FE3dGeneralTechnique);
      o._stage = o._activeTemplate = template;
      RStage.register('stage.template', template);
   }

   //==========================================================
   // <T>释放处理。</T>
   //
   // @method
   //==========================================================
   MO.FEaiCanvas_dispose = function FEaiCanvas_dispose(){
      var o = this;
      // 释放旋转
      var v = o._rotation;
      if(v){
         v.dispose();
         o._rotation = null;
      }
      // 父处理
      o.__base.FE3dCanvas.dispose.call(o);
   }
}
