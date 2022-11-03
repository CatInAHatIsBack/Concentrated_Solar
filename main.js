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


function initSky() {
  // Add Sky
  sky = new Sky();
  sky.scale.setScalar( 450000);
  scene.add( sky );

  sun = new THREE.Vector3();


  const effectController = {

    // Lighting
    turbidity: 0,
    rayleigh: .1,
    exposure: renderer.toneMappingExposure,

    // Mirror position
    mirror_x:5,
    mirror_y:0,
    mirror_z:10,
    
    // Camera
    camera_x:0,
    camera_y:10,
    camera_z:0,
    
    // Scaler
    index: 0,
    scaler:10,
    mirror_size: 5,

  };
  
  mirror = new Reflector( new THREE.CircleGeometry(effectController.mirror_size*effectController.scaler), {
    color: new THREE.Color(0x00ffff),
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio
  } );

  const mirror_center= new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1) 
  // Color keeps box invisible
  ,{
    color: new THREE.Color(0xffffff), 
  },
  );
  mirror_center.add(mirror)

  // Arrow though mirror axis
  // let arrow = new Reflector( new THREE.CylinderGeometry(1,1,2000), {
  //   // color: new THREE.Color(0x7f7f7f),
  //   color: new THREE.Color(0x00ffff),
  //   textureWidth: window.innerWidth * window.devicePixelRatio,
  //   textureHeight: window.innerHeight * window.devicePixelRatio
  // } );
  // mirror_center.add(arrow)
  // arrow.rotation.x = degrees_to_radians(-90)

  let ball = new THREE.Mesh(
    new THREE.SphereGeometry(10,10,10)
    // Color keeps sphere invisible
    ,{
      color: new THREE.Color(0xffffff), 
    },
  )
  
  // ball.position.set(0,0,)
  
  ball.scale.setScalar( 450000);
  scene.add(ball)
  // scene.add(arrow)
  scene.add(mirror_center)

  // scene.add(mirror)

  /// GUI

  function changeGui() {
    guiChanged()
    guiChanged()

  }

  function guiChanged() {

    let index = effectController.index

    let a = sun_altitude_angle[index]
    let b = sun_azimuth_angle[index]

    let c = mirror_altitude_angle[index]
    let d = mirror_azimuth_angle[index]

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;

    // Set sun position
    const Sun_phi = THREE.MathUtils.degToRad( 90 - a);
    const Sun_theta = THREE.MathUtils.degToRad( 180 - b);
    sun.setFromSphericalCoords( 1, Sun_phi, Sun_theta );
    console.log(`index ${index}`)
    // console.log(`Sun.x ${sun.position.x}`)

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

    camera.position.set( effectController.camera_x*effectController.scaler, effectController.camera_y*effectController.scaler, effectController.camera_z *effectController.scaler);

    
    // Ball for rotating the mirror towards
    let ball_orbit= 1000000
    const mirror_phi = THREE.MathUtils.degToRad( 90 - c);
    const mirror_theta = THREE.MathUtils.degToRad( 180 - d); 
    ball.position.setFromSphericalCoords( ball_orbit, mirror_phi, mirror_theta )

   
    // Sets mirror position
    let mirror_pos_x = effectController.mirror_x * effectController.scaler 
    let mirror_pos_y = effectController.mirror_y * effectController.scaler 
    let mirror_pos_z = effectController.mirror_z * effectController.scaler 
    mirror_center.position.set(mirror_pos_x,mirror_pos_y,mirror_pos_z)

    // Mirror is rotated towards ball above
    mirror_center.lookAt(ball.position.x,ball.position.y,ball.position.z)

    // Camera looks at mirror
    camera.lookAt(mirror_pos_x,mirror_pos_y,mirror_pos_z)
  
    // Mirror size
    let mirror_size = effectController.mirror_size/10
    mirror.scale.set( mirror_size, mirror_size, mirror_size)
  }

  // Menu options
  const gui = new GUI();

  const light_folder = gui.addFolder('Lighting')
  light_folder.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( changeGui );
  light_folder.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( changeGui );
  light_folder.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( changeGui );


  const mirror_folder= gui.addFolder('Mirror position') 
  mirror_folder.add( effectController, 'mirror_x', -10, 50, 1 ).onChange( changeGui );
  mirror_folder.add( effectController, 'mirror_y', -10, 50, 1 ).onChange( changeGui );
  mirror_folder.add( effectController, 'mirror_z', -10, 50, 1 ).onChange( changeGui );
  

  const camera_folder = gui.addFolder('Camera') 
  camera_folder.add( effectController, 'camera_x', 0, 1000, 1 ).onChange( changeGui );
  camera_folder.add( effectController, 'camera_y', 0, 1000, 1 ).onChange( changeGui );
  camera_folder.add( effectController, 'camera_z', 0, 1000, 1 ).onChange( changeGui );

  
  const sclaer =gui.addFolder('Scaler')  
  sclaer.add( effectController, 'index', 0, sun_altitude_angle.length-1, 1 ).onChange( changeGui ); 
  sclaer.add( effectController, 'scaler', 0, 50, 1 ).onChange( changeGui ); 
  sclaer.add( effectController, 'mirror_size', 0, 20, 1 ).onChange( changeGui );
   
  guiChanged();

}

function init() {
  let forward = new Vector3(100,100,100) 
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
  

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

