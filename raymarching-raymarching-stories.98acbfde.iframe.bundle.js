"use strict";(self.webpackChunkweb3d_sandbox=self.webpackChunkweb3d_sandbox||[]).push([[360],{"./src/raymarching/raymarching.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Raymarching:()=>Raymarching,__namedExportsOrder:()=>__namedExportsOrder,default:()=>raymarching_stories});var react=__webpack_require__("./node_modules/react/index.js"),three_module=__webpack_require__("./node_modules/three/build/three.module.js"),threejs=__webpack_require__("./src/utils/threejs.js");const skin_drmanhattan_namespaceObject=__webpack_require__.p+"static/media/skin_drmanhattan.6f0f9385.png",nature_solar_namespaceObject=__webpack_require__.p+"static/media/nature_solar.4ca222a2.png",raymarching_stories={title:"Raymarching"},Raymarching=()=>{const ref=(0,react.useRef)(),uniforms=(0,react.useRef)({time:{value:0},matcap:{value:(new three_module.dpR).load(skin_drmanhattan_namespaceObject)},matcap1:{value:(new three_module.dpR).load(nature_solar_namespaceObject)},resolution:{value:new three_module.Ltg(0,0,1.5)}});return(0,react.useLayoutEffect)((()=>{const plane=new three_module.Kj0(new three_module._12(1,1,1,1),new three_module.jyz({extensions:{derivatives:"#extension GL_OES_standard_derivatives : enable"},side:three_module.ehD,uniforms:uniforms.current,vertexShader:"varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"varying vec2 vUv;\nuniform float time;\n// uniform float progress;\nuniform sampler2D matcap, matcap1;\n// uniform vec2 mouse;\nuniform vec4 resolution;\nuniform sampler2D tDiffuse;\nconst float PI = 3.14159265359;\nconst vec2 mouse = vec2(0.25);\n// const float progress = 0.0;\n\nmat4 rotationMatrix(vec3 axis, float angle) {\n    axis = normalize(axis);\n    float s = sin(angle);\n    float c = cos(angle);\n    float oc = 1.0 - c;\n    \n    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n                0.0,                                0.0,                                0.0,                                1.0);\n}\n\nvec3 rotate(vec3 v, vec3 axis, float angle) {\n\tmat4 m = rotationMatrix(axis, angle);\n\treturn (m * vec4(v, 1.0)).xyz;\n}\n\nfloat smin( float a, float b, float k ){\n  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );\n  return mix( b, a, h ) - k*h*(1.0-h);\n}\n\nfloat sdSphere(vec3 p, float s) {\n  return length(p)-s;\n}\n\nfloat sdBox(vec3 p, vec3 b) {\n  vec3 q = abs(p) - b;\n  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);\n}\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvec2 sdf(vec3 p) {\n  float type = 0.;\n  vec3 p1 = rotate(p, vec3(1.), time / 5.);\n  float box = smin(sdBox(p1, vec3(0.2)), sdSphere(p, 0.2), 0.3);\n  float realSphere = sdSphere(p1, 0.3);\n  float final = mix(box, realSphere, 0.5 + 0.5 * sin(time / 3.));\n\n  for (float i = 0.; i < 10.; i++) {\n    float randOffset = rand(vec2(i, 0.));\n    float progr = 1. - fract(time / 3. + randOffset);\n    vec3 pos =  vec3(sin(randOffset * 2. * PI), cos(randOffset * 2. * PI), 0.);\n    float gotoCenter = sdSphere(p - pos * progr, 0.1);\n    final = smin(final, gotoCenter, 0.3);\n  }\n\n  float sphere = sdSphere(p - vec3(mouse * resolution.zw * 2., 0.), 0.2 + 0.1 * sin(time));\n  if (sphere < final) type = 1.;\n  return vec2(smin(final, sphere, 0.4), type);\n}\n\nvec3 calcNormal(in vec3 p) {\n  const float eps = 0.0001;\n  const vec2 h = vec2(eps,0);\n  return normalize( vec3(sdf(p+h.xyy).x - sdf(p-h.xyy).x,\n                          sdf(p+h.yxy).x - sdf(p-h.yxy).x,\n                          sdf(p+h.yyx).x - sdf(p-h.yyx).x ) );\n}\n\nvec2 getMatcap(vec3 eye, vec3 normal) {\n  vec3 reflected = reflect(eye, normal);\n  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );\n  return reflected.xy / m + 0.5;\n}\n\nvoid main() {\n  float dist = length(vUv - vec2(0.5));\n  vec3 bg = mix(vec3(0.3), vec3(0.0), dist);\n  vec2 newUv = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);\n  vec3 camPos = vec3(0., 0., 2.);\n  vec3 ray = normalize(vec3((vUv -vec2(0.5)) * resolution.zw, -1));\n\n  vec3 rayPos = camPos;\n  float t = 0.;\n  float tMax = 5.;\n  float type = -1.;\n  for (int i = 0; i < 256; ++i) {\n    vec3 pos = camPos + t * ray;\n    float h = sdf(pos).x;\n    type = sdf(pos).y;\n    if (h < 0.0001 || t > tMax) break;\n    t += h;\n  }\n\n  vec3 color = bg;\n  if (t < tMax) {\n    vec3 pos = camPos + t * ray;\n    color = vec3(1.);\n    vec3 normal = calcNormal(pos);\n    color = normal;\n    float diff = dot(vec3(1.), normal);\n    vec2 matcapUV = getMatcap(ray, normal);\n    color = vec3(diff);\n    if (type < 0.5) {\n      color = texture2D(matcap, matcapUV).rgb;\n    } else {\n      color = texture2D(matcap1, matcapUV).rgb;\n    }\n\n    float fresnel = pow(1. + dot(ray, normal), 3.);\n    color = mix(color, bg, fresnel);\n  }\n\n  gl_FragColor = vec4(color, 1.);\n}\n"})),camera=new three_module.iKG(-.5,.5,.5,-.5,-1e3,1e3);camera.position.set(0,0,2);const dispose=(0,threejs.S1)(ref.current,plane,camera,(render=>{uniforms.current.time.value+=.1,render()}));return()=>{dispose()}}),[]),react.createElement("div",{ref})},__namedExportsOrder=["Raymarching"]},"./src/utils/threejs.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S1:()=>init,cF:()=>initPostprocess});var three_module=__webpack_require__("./node_modules/three/build/three.module.js"),OrbitControls=__webpack_require__("./node_modules/three/examples/jsm/controls/OrbitControls.js"),EffectComposer=__webpack_require__("./node_modules/three/examples/jsm/postprocessing/EffectComposer.js"),RenderPass=__webpack_require__("./node_modules/three/examples/jsm/postprocessing/RenderPass.js"),ShaderPass=__webpack_require__("./node_modules/three/examples/jsm/postprocessing/ShaderPass.js");const default_namespaceObject="varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",frag_default_namespaceObject="varying vec2 vUv;\nuniform sampler2D tDiffuse;\nvoid main() {\n  vec4 color = texture2D(tDiffuse, vUv);\n  gl_FragColor = color;\n}\n",createManyMesh=()=>{const geometry=new three_module.DvJ(10,10,10),object=new three_module.Tme;for(let i=0;i<100;i++){const material=new three_module.RSm,mesh=new three_module.Kj0(geometry,material);mesh.position.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),mesh.position.multiplyScalar(100*Math.random()),mesh.rotation.set(2*Math.random(),2*Math.random(),2*Math.random()),object.add(mesh)}return object};function init(elem,mesh,camera,render){const renderer=new three_module.CP7;renderer.setSize(window.innerWidth,window.innerHeight),renderer.setPixelRatio(window.devicePixelRatio);const scene=new three_module.xsS;scene.add(mesh);new OrbitControls.z(camera,renderer.domElement);elem.appendChild(renderer.domElement);let end=!1;return function animate(){end||(requestAnimationFrame(animate),render((()=>{renderer.render(scene,camera)})))}(),()=>{end=!0,scene.remove(mesh),dispose(mesh)}}function initPostprocess(elem,{uniforms,frag,vert}={}){const camera=new three_module.cPb(70,window.innerWidth/window.innerHeight,.01,1e3);camera.position.z=100;const scene=new three_module.xsS,mesh=createManyMesh();scene.add(mesh);const renderer=new three_module.CP7({antialias:!0});renderer.setSize(window.innerWidth,window.innerHeight);const composer=new EffectComposer.x(renderer);composer.addPass(new RenderPass.C(scene,camera));const refUniforms={tDiffuse:{value:null,type:"t"},time:{type:"f",value:0},resolution:{type:"v2",value:new three_module.FM8(window.innerWidth,window.innerHeight)},...uniforms},shader=new three_module.jyz({uniforms:refUniforms,vertexShader:vert||default_namespaceObject,fragmentShader:frag||frag_default_namespaceObject}),effect=new ShaderPass.T(shader);composer.addPass(effect),elem.appendChild(renderer.domElement);let end=!1;return function animate(){end||(requestAnimationFrame(animate),mesh.rotation.x+=.0025,mesh.rotation.y+=.005,composer.render(),refUniforms.time.value+=.05)}(),()=>{end=!0,shader.dispose(),scene.remove(mesh),dispose(mesh)}}function dispose(obj){obj.geometry&&obj.geometry.dispose(),obj.material&&obj.material.dispose(),obj.children.forEach((o=>{dispose(o)}))}}}]);