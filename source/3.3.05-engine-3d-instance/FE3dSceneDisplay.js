 //==========================================================
// <T>场景显示对象。</T>
//
// @author maocy
// @history 150115
//==========================================================
function FE3dSceneDisplay(o){
   o = RClass.inherits(this, o, FE3dSprite, MListenerLoad);
   //..........................................................
   // @attribute
   o._dataReady        = false;
   o._optionPlay       = false;
   o._optionMovie      = false;
   o._movieMatrix      = null;
   // @attribute
   o._resource         = null;
   // @attribute
   o._materials        = null;
   o._parentMaterials  = null;
   o._movies           = null;
   o._template         = null;
   o._sprite           = null;
   //..........................................................
   // @method
   o.construct         = FE3dSceneDisplay_construct;
   // @method
   o.meshRenderables   = FE3dSceneDisplay_meshRenderables;
   o.loadResource      = FE3dSceneDisplay_loadResource;
   o.loadTemplate      = FE3dSceneDisplay_loadTemplate;
   o.processLoad       = FE3dSceneDisplay_processLoad;
   // @method
   o.clone             = FE3dSceneDisplay_clone;
   return o;
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FE3dSceneDisplay_construct(){
   var o = this;
   o.__base.FE3dSprite.construct.call(o);
   o._movieMatrix = new SMatrix3d();
}

//==========================================================
// <T>获得网格渲染集合。</T>
//
// @method
//==========================================================
function FE3dSceneDisplay_meshRenderables(){
   var o = this;
   var sprite = o._template.sprite();
   return sprite.meshRenderables();
}

//==========================================================
// <T>加载空间资源。</T>
//
// @method
// @param resource:FE3sSceneSpace 空间资源
//==========================================================
function FE3dSceneDisplay_loadResource(resource){
   var o = this;
   var instanceConsole = RConsole.find(FE3dInstanceConsole);
   o._resource = resource;
   // 设置矩阵
   o._code = resource.code();
   o._matrix.assign(resource.matrix());
   // 加载动画集合
   var movieResources = resource.movies();
   if(movieResources){
      var movieCount = movieResources.count();
      var movies = o._movies = new TObjects();
      for(var i = 0; i < movieCount; i++){
         var movieResource = movieResources.at(i);
         // 创建场景动画
         var movie = instanceConsole.create(EE3dInstance.SceneMovie);
         movie.loadResource(movieResource);
         movies.push(movie);
      }
   }
   // 设置材质集合
   var materialResources = resource.materials();
   if(materialResources){
      var materialCount = materialResources.count();
      var materials = o._materials = new TDictionary();
      var parentMaterials = o._parentMaterials = new TDictionary();
      for(var i = 0; i < materialCount; i++){
         var materialResource = materialResources.at(i);
         // 创建场景资源
         var material = instanceConsole.create(EE3dInstance.SceneMaterial);
         material._display = o;
         material.loadSceneResource(materialResource);
         materials.set(materialResource.guid(), material);
         parentMaterials.set(materialResource.parentGuid(), material);
      }
   }
   // 加载显示内容
   var templateGuid = resource.templateGuid();
   o._template = RConsole.find(FE3dTemplateConsole).allocByGuid(o, templateGuid);
}

//==========================================================
// <T>加载模板。</T>
//
// @param template:FE3dTemplate 模板
//==========================================================
function FE3dSceneDisplay_loadTemplate(template){
   var o = this;
   var resource = o._resource;
   // 设置材质
   var materials = o._materials;
   var parentMaterials = o._parentMaterials;
   var sprite = o._sprite = template.sprite();
   var renderables = sprite.renderables();
   var count = renderables.count();
   for(var n = 0; n < count; n++){
      // 增加渲染对象
      var renderable = renderables.at(n);
      // 设置材质关联
      var material = renderable.material();
      var materialGuid = material.guid();
      var displayMaterial = parentMaterials.get(materialGuid);
      displayMaterial._parentMaterial = material;
      displayMaterial.reloadResource();
   }
   o.pushDisplay(sprite);
   // 设置动画
   var animations = sprite.animations();
   if(animations){
      var animationCount = animations.count();
      for(var n = 0; n < animationCount; n++){
         var animation = animations.at(n);
         // 获得资源
         var animationResource = animation.resource();
         var animationGuid = animationResource.guid();
         // 获得场景动画资源
         var sceneAnimationResource = resource.findAnimation(animationGuid);
         if(!sceneAnimationResource){
            sceneAnimationResource = resource.syncAnimation(animationGuid);
            sceneAnimationResource._guid = animationResource._guid;
            sceneAnimationResource._code = animationResource._code;
            sceneAnimationResource._label = animationResource._label;
         }
         // 创建场景动画
         var sceneAnimation = RClass.create(FE3dSceneAnimation);
         sceneAnimation.loadAnimation(animation);
         sceneAnimation.loadSceneResource(sceneAnimationResource);
         sceneAnimation.reloadResource();
         o.pushAnimation(sceneAnimation);
      }
   }
}

//==========================================================
// <T>加载处理。</T>
//
// @method
//==========================================================
function FE3dSceneDisplay_processLoad(){
   var o = this;
   if(o._ready){
      return true;
   }
   // 加载模板
   var template = o._template;
   if(!template.testReady()){
      return false;
   }
   o.loadTemplate(template);
   o._ready = true;
   // 事件处理
   o.processLoadListener(o);
   return true;
}

//==========================================================
// <T>复制加载处理。</T>
//
// @method
//==========================================================
function FE3dSceneDisplay_clone(){
}