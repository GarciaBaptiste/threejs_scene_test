window.addEventListener('load', init);

let scene, camera, cameraEmpty, renderer, composer, renderPass;
let model;
let context;
let forwardSpeed = 0,
  straffSpeed = 0;

function init() {
  context = document.getElementById('context');
  setScene();
  renderObjects("scene_sphere"); /////////////////////////////////////////   CHANGER NOM DE FICHIER ICI   ////
  window.addEventListener('resize', windowResized);
  window.addEventListener('mousemove', mouseMoved);
  window.addEventListener('keydown', keyDowned);
  window.addEventListener('keyup', keyUpped);
}

function setScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, .1, 5000);
  camera.rotation.order = "YXZ";
  camera.position.x = -1.5;
  camera.position.y = 1;
  camera.position.z = 1.5;
  camera.rotation.y = -.75;
  camera.rotation.x = -.5;

  hlight = new THREE.AmbientLight(0xffffff, .75);
  scene.add(hlight);

  let lightPos = [3, 3, 3];

  let geometry = new THREE.SphereGeometry(0.1);
  let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(lightPos[0], lightPos[1], lightPos[2]);
  scene.add(sphere);

  let light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(lightPos[0], lightPos[1], lightPos[2]);
  light.castShadow = true;
  scene.add(light);

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  light.shadow.bias = -0.005;

  scene.background = new THREE.CubeTextureLoader()
    .setPath('models/')
    .load([
      'right.png',
      'left.png',
      'top.png',
      'bottom.png',
      'back.png',
      'front.png'
    ]);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  context.appendChild(renderer.domElement);
  setSceneSize();
}

function renderObjects(sceneName) {
  let loader = new THREE.GLTFLoader();
  loader.load('models/' + sceneName + '.gltf',
    function(gltf) {
      gltf.scene.traverse(function(node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
      scene.add(gltf.scene);
      animate();
    },
    function(xhr) {
      document.getElementById('loader').innerText = Math.round(xhr.loaded / xhr.total * 100) + "%";
      if (Math.round(xhr.loaded / xhr.total * 100) == 100) {
        document.getElementById('loader').style.display = "none";
      }
    });
}

function animate() {
  moveCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function setSceneSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function windowResized() {
  setSceneSize();
}

function mouseMoved(evt) {
  camera.rotation.y -= evt.movementX / 100;
  camera.rotation.x -= evt.movementY / 100;
}

function keyDowned(evt) {
  if (evt.key === "z") {
    forwardSpeed = .1;
  } else if (evt.key === "s") {
    forwardSpeed = -.1;
  } else if (evt.key === "q") {
    straffSpeed = -.075;
  } else if (evt.key === "d") {
    straffSpeed = .075;
  }
}

function keyUpped(evt) {
  if (evt.key === "z" || evt.key === "s") {
    forwardSpeed = 0;
  } else if (evt.key === "q" || evt.key === "d") {
    straffSpeed = 0;
  }
}

function moveCamera() {
  camera.position.x = (camera.position.x) + (Math.cos(camera.rotation.y) * straffSpeed) - (Math.sin(camera.rotation.y) * forwardSpeed);
  camera.position.z = (camera.position.z) + (-Math.sin(camera.rotation.y) * straffSpeed) - (Math.cos(camera.rotation.y) * forwardSpeed);
}