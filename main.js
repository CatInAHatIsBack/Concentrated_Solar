import './style.css'

import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import { SphereGeometry, Vector3 } from 'three';
import { sun_altitude_angle, sun_azimuth_angle, mirror_altitude_angle, mirror_azimuth_angle} from './angles';
let camera, scene, renderer;

let sky, sun, mirror;

init();
render();

// let r = 450000
// let thick = 200
// const ring_geometry = new THREE.RingGeometry( r-thick, r+thick , 32 );
// const ring_material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
// const mesh = new THREE.Mesh( ring_geometry, ring_material );
// scene.add( mesh );
// mesh.rotation.x = degrees_to_radians(90)



function initSky() {
  // Add Sky
  sky = new Sky();
  sky.scale.setScalar( 450000);
  scene.add( sky );

  sun = new THREE.Vector3();

  // let sun_altitude_angle = [0,45,90,135,180,2.15,4.85,7.59,10.31,12.98,15.6,18.15,20.62,23,25.29,27.46,29.51,31.43,33.18,34.78,36.18,37.39,38.39,39.16,39.7,39.99,40.03,39.82,39.37,38.67,37.75,36.61,35.27,33.74,32.03,30.17,28.16,26.03,23.78,21.42,18.98,16.45,13.86,11.2,8.5,5.76,3.03,0.43]
  // let sun_azimuth_angle = [0,45,90,135,180,107.89,110.2,112.57,115.01,117.53,120.15,122.87,125.72,128.69,131.81,135.08,138.52,142.13,145.91,149.87,154.01,158.31,162.76,167.34,172.01,176.75,181.52,186.27,190.98,195.59,200.08,204.44,208.63,212.65,216.49,220.16,223.65,226.97,230.14,233.16,236.04,238.8,241.45,244,246.46,248.85,251.17,253.43]
  // let mirror_altitude_angle = [0,45,90,135,180,44.57340393,47.73077399,50.92448532,54.10708469,57.25656924,60.37816691,63.45424101,66.49255053,69.47743527,72.42207282,75.30689868,78.13554423,80.88641066,83.49907034,85.82772388,87.1626391,86.32305822,84.23193646,81.82542761,79.34453297,76.8415467,74.34074952,71.85683259,69.38692709,66.93908439,64.51615773,62.10746825,59.72541215,57.3625778,55.01763921,52.69388691,50.38845062,48.10834833,45.84272676,43.59357684,41.37194801,39.16400459,36.9827145,34.81807554,32.68405887,30.57533778,28.52080771,26.58906289]
  // let mirror_azimuth_angle = [ 0,45,90,135,180,59.78513571, 61.80570688, 63.81235686, 65.81531454, 67.83168458, 69.88961769, 72.00895823, 74.2564031, 76.67099745, 79.37408261, 82.54846542, 86.54615504, 92.07941121, 101.029557, 118.9686366, 160.9065671, 209.0015092, 230.9642422, 241.1892605, 247.1785679, 251.2764659, 254.3951332, 256.9378099, 259.1341728, 261.0681434, 262.8414165, 264.4962233, 266.0562817, 267.5471084,268.9802291, 270.3824302, 271.7479629, 273.0929002, 274.4257034, 275.7453941, 277.0601442, 278.3748481, 279.6954356, 281.0213648, 282.3569277, 283.7092047, 285.0746549, 286.452931]
  


  
  // console.log(sun_altitude_angle.length)
  // console.log(sun_azimuth_angle.length)
  // console.log(mirror_altitude_angle.length)
  // console.log(mirror_azimuth_angle.length)
  

  const effectController = {
    index: 0,
    turbidity: 0,
    rayleigh: .1,
    
    // elevation: 0,
    // azimuth: 0,

    exposure: renderer.toneMappingExposure,

    camera_x:0,
    camera_y:10,
    camera_z:0,
    
    mirror_x:5,
    mirror_y:0,
    mirror_z:10,
    mirror_size: 5,
  
    // mirror_rotate_x:0,
    // mirror_rotate_y:0,
    // mirror_rotate_z:0,

    // mirror_altitude:0,
    // mirror_azimuth:0,
    


    scaler:10,

  };
  
  // effectController.elevation= a
  // effectController.azimuth= b
  // effectController.mirror_altitude= c
  // effectController.mirror_azimuth= d

  // let mirror_size = 10
  mirror = new Reflector( new THREE.CircleGeometry(effectController.mirror_size*effectController.scaler), {
    // color: new THREE.Color(0x7f7f7f),
    color: new THREE.Color(0x00ffff),
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio
  } );
  const mirror_center= new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1) 
  ,{
    color: new THREE.Color(0xffffff), 
  },
  );
  // mirror.rotateX(degrees_to_radians(-90))
  mirror_center.add(mirror)

  let arrow_z = 1000000
  let arrow = new Reflector( new THREE.CylinderGeometry(1,1,arrow_z), {
    // color: new THREE.Color(0x7f7f7f),
    color: new THREE.Color(0x00ffff),
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio
  } );
  arrow.rotation.x = degrees_to_radians(-90)
  let ball = new THREE.Mesh(
    new THREE.SphereGeometry(10,10,10)
    ,{
      color: new THREE.Color(0xffffff), 
    },
  )
  
  // ball.position.set(0,0,)
  // ball.add(arrow)
  ball.scale.setScalar( 450000);
  scene.add(ball)
  // mirror_center.add(arrow)
  // scene.add(arrow)
  scene.add(mirror_center)

  // scene.add(mirror)

  /// GUI

  

  function guiChanged() {

    let index = effectController.index
    let a = sun_altitude_angle[index]
    let b = sun_azimuth_angle[index]
    let c = mirror_altitude_angle[index]
    let d = mirror_azimuth_angle[index]

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;

    // const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    // const theta = THREE.MathUtils.degToRad( 180 - effectController.azimuth );
    const phi = THREE.MathUtils.degToRad( 90 - a);
    const theta = THREE.MathUtils.degToRad( 180 - b);


    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

    camera.position.set( effectController.camera_x*effectController.scaler, effectController.camera_y*effectController.scaler, effectController.camera_z *effectController.scaler);

    // mirror.position.set(effectController.mirror_x*scale,effectController.mirror_y*scale,effectController.mirror_z*scale)
    // mirror_center.position.setFromSphericalCoords( 1, degrees_to_radians(effectController.mirror_altitude),degrees_to_radians(effectController.mirror_azimuth));
 


    // arrow.rotation.set(degrees_to_radians(-90 +effectController.mirror_rotate_x),degrees_to_radians(effectController.mirror_rotate_y),degrees_to_radians(effectController.mirror_rotate_z))

    // let ball_rotation = new THREE.Spherical(arrow_z,degrees_to_radians(90-effectController.mirror_altitude), degrees_to_radians(effectController.mirror_azimuth))
    let ball_rotation = new THREE.Spherical(arrow_z,degrees_to_radians(90-c), degrees_to_radians(180-d))
    // ball.position.setFromSpherical(ball_rotation)
    ball.position.setFromSphericalCoords(arrow_z,degrees_to_radians(90-c), degrees_to_radians(180-d))

    // const quaternion = new THREE.Quaternion();

    // quaternion.setFromAxisAngle( new THREE.Vector3(degrees_to_radians( effectController.quaterion_x), degrees_to_radians(effectController.quaterion_y), degrees_to_radians(effectController.quaterion_z) ), Math.PI/2 );
    // quaternion.setFromAxisAngle( new THREE.Vector3(degrees_to_radians(qu ), degrees_to_radians(effectController.quaterion_y), degrees_to_radians(effectController.quaterion_z) ), Math.PI/2 );
    
    // arrow.applyQuaternion( quaternion );
    // console.log(ball.position.x)
    // console.log(ball.position.y)
    // console.log(ball.position.z)
    mirror.scale.set(effectController.mirror_size/10,effectController.mirror_size/10,effectController.mirror_size/10 )
    // mirror_center.position.set(effectController.mirror_x*effectController.scaler,effectController.mirror_y*effectController.scaler,effectController.mirror_z*effectController.scaler)
    let mirror_pos_x = effectController.mirror_x * effectController.scaler 
    let mirror_pos_y = effectController.mirror_y * effectController.scaler 
    let mirror_pos_z = effectController.mirror_z * effectController.scaler 

    mirror_center.position.set(mirror_pos_x,mirror_pos_y,mirror_pos_z)
    mirror_center.lookAt(ball.position.x,ball.position.y,ball.position.z)

    camera.lookAt(mirror_pos_x,mirror_pos_y,mirror_pos_z)
    // console.log(sun.position.x)
    // camera.lookAt(mirror_pos_x,mirror_pos_y,mirror_pos_z)
    console.log(mirror_center.position)
  }

  const gui = new GUI();

  const light_folder = gui.addFolder('Lighting')
  light_folder.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
  light_folder.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
  light_folder.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

  // const sun_folder = gui.addFolder('Sun')
  // sun_folder.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
  // sun_folder.add( effectController, 'azimuth', 0, 360, 0.1 ).onChange( guiChanged );

  const mirror_folder= gui.addFolder('Mirror position') 
  mirror_folder.add( effectController, 'mirror_x', -10, 50, 1 ).onChange( guiChanged );
  mirror_folder.add( effectController, 'mirror_y', -10, 50, 1 ).onChange( guiChanged );
  mirror_folder.add( effectController, 'mirror_z', -10, 50, 1 ).onChange( guiChanged );
  
  // const mirror_rotation_folder= gui.addFolder('Mirror rotation') 
  // mirror_rotation_folder.add( effectController, 'mirror_rotate_x', 0, 360, 1 ).onChange( guiChanged );
  // mirror_rotation_folder.add( effectController, 'mirror_rotate_y', 0, 360, 1 ).onChange( guiChanged );
  // mirror_rotation_folder.add( effectController, 'mirror_altitude', 0, 360, 1 ).onChange( guiChanged );
  // mirror_rotation_folder.add( effectController, 'mirror_azimuth', 0, 360, 1 ).onChange( guiChanged );

  const camera_folder = gui.addFolder('Camera') 
  camera_folder.add( effectController, 'camera_x', 0, 1000, 1 ).onChange( guiChanged );
  camera_folder.add( effectController, 'camera_y', 0, 1000, 1 ).onChange( guiChanged );
  camera_folder.add( effectController, 'camera_z', 0, 1000, 1 ).onChange( guiChanged );

  
  const sclaer =gui.addFolder('scaler')  
  sclaer.add( effectController, 'scaler', 0, 50, 1 ).onChange( guiChanged ); 
  sclaer.add( effectController, 'mirror_size', 0, 20, 1 ).onChange( guiChanged );
  sclaer.add( effectController, 'index', 0, sun_altitude_angle.length-1, 1 ).onChange( guiChanged ); 
  // const quaterion_folder =  gui.addFolder('quaterion') 
  // quaterion_folder.add( effectController, 'quaterion_x', 0, 360, 1 ).onChange( guiChanged ); 
  // quaterion_folder.add( effectController, 'quaterion_y', 0, 360, 1 ).onChange( guiChanged ); 
  // quaterion_folder.add( effectController, 'quaterion_z', 0, 360, 1 ).onChange( guiChanged ); 
    
  // const axis_folder =  gui.addFolder('axis') 
  // axis_folder.add( effectController, 'rot_x', 0, Math.PI, .01 ).onChange( guiChanged );  
  // axis_folder.add( effectController, 'rot_y', 0,  Math.PI, .01 ).onChange( guiChanged );  
  // axis_folder.add( effectController, 'rot_z', 0,  Math.PI, .01 ).onChange( guiChanged );  

  guiChanged();

}

function init() {
  let forward = new Vector3(100,100,100) 
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
  // camera = new THREE.OrthographicCamera( width / - 2, width / 2, h / 2, h / - 2, 1, 1000 );
  // camera.position.set( 0, 100, 0 );
  // camera.lookAt(0,0,0)

  scene = new THREE.Scene();
  let size = 1000
  const helper = new THREE.GridHelper( size, size/100, 0xffffff, 0xffffff );
  scene.add( helper );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  //controls.maxPolarAngle = Math.PI / 2;
  controls.enableZoom = false;
  controls.enablePan = false;

  
  initSky();

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function render() {

  renderer.render( scene, camera );

}
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
