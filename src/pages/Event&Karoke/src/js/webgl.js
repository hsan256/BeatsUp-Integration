import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import keys_obj from '../static/Keys_Obj.obj';
import * as THREE from 'three';

export default async function createBackground(backgroundColor) {
  const canvas = document.querySelector('#bg');
  const [scene, camera, renderer] = setupThreeJs(canvas, backgroundColor);

  const keyModels = await createNotes();
  // keyModels[0].position.set(canvas.width / 8, canvas.height / 4, 0);
  // keyModels[1].position.set(canvas.width / 8, 3 * (canvas.height / 4), 0);
  // keyModels[2].position.set(7 * (canvas.width / 8), canvas.height / 4, 0);
  // keyModels[3].position.set(7 * (canvas.width / 8), 3 * (canvas.height / 4), 0);
  for (const [, note] of keyModels.entries()) {
    note.rotation.x += 1.5;
    // note.position.set(canvas.width / 8, canvas.height / 4, 0)
    scene.add(note);
  }

  const [pointLight, ambientLight] = createLights();
  scene.add(pointLight, ambientLight);

  animate(scene, camera, renderer, keyModels);
}

function setupThreeJs(canvas, backgroundColor) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({canvas: canvas});

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);
  camera.position.setX(-3);

  renderer.render(scene, camera);

  return [scene, camera, renderer];
}

async function createNotes() {
  // instantiate a loader
  const loader = new OBJLoader();

  const keyData = await loader.loadAsync(keys_obj);
  for (let i = 0; i < keyData.children.length; i++) {
    const material = new THREE.MeshPhongMaterial({ color: 0xff6347 });
    keyData.children[i] = new THREE.Mesh(keyData.children[i].geometry, material);
  }

  return keyData.children;
}

function createLights() {
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(5, 5, 5);

  const ambientLight = new THREE.AmbientLight(0xffffff);

  return [pointLight, ambientLight];
}

function animate(scene, camera, renderer, meshes) {
  requestAnimationFrame(() => {
    animate(scene, camera, renderer, meshes);
  });

  for (const mesh of meshes) {
    mesh.rotateX(0.01);
  }

  renderer.render(scene, camera);
}