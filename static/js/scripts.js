import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/EXRLoader.js';
import {gsap} from 'https://cdn.skypack.dev/gsap@3.10.4';
import * as lilGui from 'https://cdn.skypack.dev/lil-gui@0.17.0';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.10.4/ScrollTrigger.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js'

/* stat.js */
// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom )

const canvas = document.querySelector('canvas');
var mixer;


/* ---------------------------------Renderer-------------------------------- */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
// THREE.ColorManagement.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

/* ---------------------------------Scene-------------------------------- */
const scene = new THREE.Scene();

const exr = new EXRLoader().load('../static/texture/venice_sunset_1k.exr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //scene.background = texture;
    scene.environment = texture;
});
var clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
gltfLoader.load('../static/model/modelV4.gltf', 
function (gltf){
    gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
    })
    const model = gltf.scene;
    
    scene.add(model);
    mixer = new THREE.AnimationMixer( model );
        
        gltf.animations.forEach( ( clip ) => {
          
            mixer.clipAction( clip ).play();
          
        } );

});

/* ---------------------------------Camera-------------------------------- */
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

/* Sets orbit control to move the camera around */
// const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-3, 1.5, 6);
camera.rotation.set(0, -0.3, 0);

// orbit.update();



/* GUI Configurator */
//   const gui = new lilGui.GUI();
  // add the camera to the GUI
    // gui
    //   .add(camera.position, 'x')
    //   .min(-100)
    //   .max(100)
    //   .step(0.001)
    //   .name('Camera X Axis Position');
    // gui
    //   .add(camera.position, 'y')
    //   .min(-100)
    //   .max(100)
    //   .step(0.001)
    //   .name('Camera Y Axis Position');
    // gui
    //   .add(camera.position, 'z')
    //   .min(-100)
    //   .max(100)
    //   .step(0.001)
    //   .name('Camera Z Axis Position');
    // gui
    //   .add(camera.rotation, 'x')
    //   .min(-360)
    //   .max(360)
    //   .step(0.001)
    //   .name('Camera X Axis Rotation');
    // gui
    //   .add(camera.rotation, 'y')
    //   .min(-360)
    //   .max(360)
    //   .step(0.001)
    //   .name('Camera Y Axis Rotation');
      
    // gui
    //   .add(camera.rotation, 'z')
    //   .min(-360)
    //   .max(360)
    //   .step(0.001)
    //   .name('Camera Z Axis Rotation');

    
    


/* ------------------------------------------------light------------------------------------------------ */
/*  Ambient Light */
const al = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(al);

/* Point Light */
const pointL1 = new THREE.PointLight( 0xffffff, 0.5, 100 );
pointL1.position.set( 0, 6, -3 );
pointL1.castShadow = true;

scene.add( pointL1 );

pointL1.shadow.mapSize.width = 2048; 
pointL1.shadow.mapSize.height = 2048; 
pointL1.shadow.camera.near = 0.5; 
pointL1.shadow.camera.far = 500; 
pointL1.shadow.bias = -0.0005;

const pointL2 = new THREE.PointLight( 0xffffff, 0.5, 100 );
pointL2.position.set( 0, 6, 3 );
pointL2.castShadow = true;

scene.add( pointL2 );

pointL2.shadow.mapSize.width = 2048; 
pointL2.shadow.mapSize.height = 2048; 
pointL2.shadow.camera.near = 0.5; 
pointL2.shadow.camera.far = 500; 
pointL2.shadow.bias = -0.0005;

/* Point Light Helper */
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointL1, sphereSize );
// scene.add( pointLightHelper );

const pointLightHelper1 = new THREE.PointLightHelper( pointL2, sphereSize );
// scene.add( pointLightHelper1 );

/* Spot Light */
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 0, 7, 0 );
spotLight.penumbra = 0.07;
spotLight.angle = Math.PI/13;

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 500;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.bias = -0.0005;

scene.add( spotLight );

/* Spot Light Helper */
const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );

// gui
//     .add(pointL1.position, 'x')
//     .min(-100)
//     .max(100)
//     .step(0.001)
//     .name('pointlight x')

// gui
//     .add(pointL1.position, 'z')
//     .min(-100)
//     .max(100)
//     .step(0.001)
//     .name('pointlight z')

/* ------------------------------------------------Scrolling------------------------------------------------ */
 gsap.registerPlugin(ScrollTrigger);

function setPath(){
    var firstTimeline = new gsap.timeline();
    firstTimeline.to(camera.position,{
        x:0,
        y:1.7,
        z:4,
        scrollTrigger:{
            trigger: ".first-move",
            // markers: "true",
            start: "top top",
            end:"+=1900",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    firstTimeline.to(camera.rotation,{
        x:0,
        y:-4.7,
        z:0,
        scrollTrigger:{
            trigger: ".first-move",
            // markers: "false",
            start: "top top",
            end:"+=1900",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    
    firstTimeline.to(camera.position,{
        x:-0.35,
        y:1.7,
        z:0.8,
        scrollTrigger:{
            trigger: ".second-move",
            // markers: "false",
            start: "top bottom",
            end:"+=2100",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    firstTimeline.to(camera.position,{
        x:-0.59,
        y:1.7,
        z:-3.15,
        scrollTrigger:{
            trigger: ".third-move",
            // markers: "false",
            start: "top bottom",
            end:"+=2100",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });

    var secondTimeline = new gsap.timeline();
    secondTimeline.to(camera.position,{
        x:-0.5,
        y:1.7,
        z:-1.6,
        scrollTrigger:{
            trigger: ".fourth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    secondTimeline.to(camera.rotation,{
        x:0,
        y:-6.28,
        z:0,
        scrollTrigger:{
            trigger: ".fourth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    secondTimeline.to(camera.position,{
        x:2.04,
        y:1.2,
        z:-2.05,
        scrollTrigger:{
            trigger: ".fifth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    secondTimeline.to(camera.rotation,{
        x:0,
        y:-6.4,
        z:0,
        scrollTrigger:{
            trigger: ".fifth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });

    var thirdTimeline = new gsap.timeline();
    thirdTimeline.to(camera.position,{
        x:-0.4,
        y:1.4,
        z:-1.3,
        scrollTrigger:{
            trigger: ".sixth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    thirdTimeline.to(camera.rotation,{
        x:0,
        y:-7.8,
        z:0,
        scrollTrigger:{
            trigger: ".sixth-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    }); 
    thirdTimeline.to(camera.position,{
        x:2.2,
        y:1.4,
        z:-0.3,
        scrollTrigger:{
            trigger: ".six-five-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    thirdTimeline.to(camera.position,{
        x:-0.5,
        y:1.4,
        z:3,
        scrollTrigger:{
            trigger: ".seventh-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    var fourthTimeline = new gsap.timeline();
    fourthTimeline.to(camera.position,{
        x:2.05,
        y:1.4,
        z:-3.43,
        scrollTrigger:{
            trigger: ".eight-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    fourthTimeline.to(camera.rotation,{
        x:0,
        y:-8.88,
        z:0,
        scrollTrigger:{
            trigger: ".eight-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    }); 
    fourthTimeline.to(camera.position,{
        x:-3,
        y:1.3,
        z:-1.2,
        scrollTrigger:{
            trigger: ".nine-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    });
    fourthTimeline.to(camera.rotation,{
        x:0,
        y:-8,
        z:0,
        scrollTrigger:{
            trigger: ".nine-move",
            // markers: "false",
            start: "top top",
            end:"+=1000",
            scrub: 1,
            invalidateOnRefresh:true,
        },
    }); 
    
}; 
setPath()


// console.log(renderer.info);



function animate() {
    // stats.begin();
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    renderer.render(scene, camera);

    // stats.end();
}

// renderer.setAnimationLoop(animate);
animate();


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


    

 


