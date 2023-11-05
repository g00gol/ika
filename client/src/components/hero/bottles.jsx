import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { World, Body, Plane, Box, Vec3 } from "cannon-es";

export default function PlasticBottlesFall() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08324b); // Adjust background color
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2); // 50% of the container
    mountRef.current.appendChild(renderer.domElement);

    // Physics setup
    const world = new World();
    world.gravity.set(0, -9.82, 0);

    // Ground setup
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x555555,
      side: THREE.DoubleSide,
    });
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      groundMaterial,
    );
    groundMesh.rotateX(-Math.PI / 2);
    scene.add(groundMesh);

    const groundBody = new Body({ mass: 0 });
    groundBody.addShape(new Plane());
    groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x999999);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // 3D Model Loader
    const loader = new GLTFLoader();
    const bottles = [];

    loader.load("/bottle.gltf", (gltf) => {
      const originalBottle = gltf.scene.children.find((child) => child.isMesh);
      const scale = 0.5; // Adjust scale to the size of your model
      originalBottle.scale.set(scale, scale, scale);
      originalBottle.castShadow = true;

      for (let i = 0; i < 100; i++) {
        const bottleClone = originalBottle.clone(); // Clone the original mesh
        bottleClone.position.set(
          (Math.random() - 0.5) * 1,
          Math.random() * 5 + 5,
          (Math.random() - 0.5) * 1,
        );
        scene.add(bottleClone);

        const bottleShape = new Box(new Vec3(0.05, 0.2, 0.05)); // Adjust the Box size to match your model
        const bottleBody = new Body({ mass: 1 });
        bottleBody.addShape(bottleShape);
        bottleBody.position.copy(bottleClone.position);
        world.addBody(bottleBody);

        bottles.push({ mesh: bottleClone, body: bottleBody });
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      world.step(1 / 60);

      // Update the position of the bottles to match their physics bodies
      bottles.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize the canvas when the window is resized
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener("resize", onWindowResize, false);

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose(); // Dispose of the renderer on unmount
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-screen w-[50vw]" />;
}
