import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import * as dat from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js'
import noise from './src/noise/noise.js'

let time = 0

// Debugador
let gui = new dat.GUI()

// Orbit Control

// Localizar Mouse
let mouse = { pos: { x: 0, y: 0 } }
document.addEventListener( 'mousemove', function (event) {
    mouse.pos = { x: event.clientX, y: mouse.pos.y = event.clientY }
})

// Canvas
let canvas = document.querySelector( 'canvas' )

// Cena
let scene = new THREE.Scene()
const helper = new THREE.GridHelper( 10000, 2, 0xffffff, 0xffffff );
scene.add( helper )
/*
let backgroundColor = 'rgba( 26, 26, 26, 1 )'
scene.background = new THREE.Color( backgroundColor )
scene.fog = new THREE.Fog( backgroundColor, 1, 1000 )
*/
let backgroundColor = 'gray'
scene.background = new THREE.Color( backgroundColor )
scene.fog = new THREE.Fog( backgroundColor, 2, 200 )


function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = - 0.001;

}

// iluminação
const light1 = new THREE.PointLight( 0x0f0020, 0.7 );
				light1.position.set( 100, 100, 100 );
				scene.add( light1 )

                const light2 = new THREE.PointLight( 0xff2200, 0.2 );
				light2.position.set( - 100, - 100, - 100 );
				scene.add( light2 )


const hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
scene.add( hemiLight );

addShadowedLight( 1, 1, 1, 0xffffff, .1 );
addShadowedLight( 0.5, 1, - 1, 0xffffff, .5 );
//
const dirLight = new THREE.DirectionalLight( 'white', .2 );
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);
let lightProbe = new THREE.LightProbe();
scene.add( lightProbe );


// Ground

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 600, 600 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
);
plane.rotation.x = - Math.PI / 2;
plane.position.y = - 15.5;

plane.receiveShadow = true;
scene.add( plane );

// Camera
let fov = 75
let aspect = window.innerWidth / window.innerHeight
let camera = new THREE.PerspectiveCamera( fov, aspect, 0.1, 200 )
camera.position.set( 3, 2, 20 )
camera.lookAt( 0, 1, 0 )
scene.add(camera)

/* Materiais */
// geral
let baseMaterial = new THREE.MeshPhysicalMaterial({
    color: 'rgba(255,255,255,1)',
    wireframe: false,
    metalness: 0,
    roughness: 0,
    ior: 2,
    specularIntensify: 1,
    transparent: true
    //reflectivity: 1,
    //refractionRatio: 1
})
// linha
const lineMaterial = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	linewidth: 1,
	linecap: 'round', //ignored by WebGLRenderer
	linejoin:  'round', //ignored by WebGLRenderer
    blending: THREE.AdditiveBlending,
    transparent: true
} )
// particula
function gerarSprite(){
    let canvas = document.createElement( 'canvas' )
    canvas.width = 16
    canvas.height = 16
    let context = canvas.getContext( '2d' )
    let gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    )
    gradient.addColorStop( 0, 'rgba( 255, 255, 255, 1 )' )
    gradient.addColorStop( 0.2, 'rgba( 0, 255, 255, 1 )' )
    gradient.addColorStop( 0.4, 'rgba( 0, 0, 64, 1 )' )
    gradient.addColorStop( 1, 'rgba( 0, 0, 0, 1 )' )
    
    context.fillStyle = gradient
    context.fillRect( 0, 0, canvas.width, canvas.height )
    var texture = new THREE.Texture( canvas )
    texture.needsUpdate = true
    return texture
}
const particulaMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3 ,
    transparent: true,
    blending: THREE.AdditiveBlending,
})

/* Geometrias */
//linha
const points = [ { x: 0, y: 0, z: 0 }, { x: 5, y: 5, z: 5 }, { x: 45, y: 25, z: 15 } ]
const lineGeometry = new THREE.BufferGeometry().setFromPoints( points )
console.log( points )
//esfera
const esferaGeo = new THREE.SphereGeometry( 5, 60, 30 )
//particula
const particulaGeometry = new THREE.BufferGeometry().setFromPoints( points )

/* Objetos */
//linha
const line = new THREE.Line( lineGeometry, lineMaterial )
scene.add(line)
//particula
const particulas = new THREE.Points( particulaGeometry, particulaMaterial )
scene.add( particulas )
//esfera
const esfera = new THREE.Mesh( esferaGeo, baseMaterial )
console.log( esfera.geometry.parameters.radius )


scene.add( esfera )

//OrbitControl
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;
controls.autoRotateSpeed = 4;
controls.maxDistance = 50;
controls.minDistance = 10;
controls.enablePan = false;

/* Renderer */
let renderer = new THREE.WebGLRenderer( { canvas, antialias: true } )
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.render(scene, camera)


function frame() {
    requestAnimationFrame(frame)
    //esfera.rotation.y += 0.002;
    time += 0.01
    esfera.geometry.vertices.map( vertice => {
        vertice.normalize()
        let nois = noise(vertice.x + time, vertice.y + time, vertice.z + time) * 4
        let distance = esfera.geometry.parameters.radius + nois
        vertice.x *= distance
        vertice.y *= distance
        vertice.z *= distance
    });
    esfera.geometry.verticesNeedUpdate = true;
    esfera.geometry.normalsNeedUpdate = true;
    esfera.geometry.computeVertexNormals();
    esfera.geometry.computeFaceNormals();
    renderer.render(scene, camera)
}
frame()

/*

console.log('oi')


let backgroundColor = 0xf1f1f1;
let scene = new THREE.Scene()
scene.background = new THREE.Color(backgroundColor)
scene.fog = new THREE.Fog(backgroundColor, 60, 100);
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 0.1, 1000 )
let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
*/