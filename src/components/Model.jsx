import React, { useRef } from 'react';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import * as THREE from 'three'; 

function Render(props) {
  const { scene } = useGLTF("/towel_stack.glb");
  return <primitive object={scene} {...props} />
}

const Model = () => {
  const orbitControlsRef = useRef();

  const setDirection = (direction) => {
    const { current: controls } = orbitControlsRef;
    const camera = controls.object;

    switch (direction) {
      case 'top':
        camera.position.set(0, 10, 0); 
        controls.target.set(0, 0, 0);
        controls.update();
        break;
        case 'right':
        camera.position.set(-10, 0, 0); 
        controls.target.set(0, 0, 0);
        controls.update();
        break;
        case 'left':
        camera.position.set(10,0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
        break;
      case 'bottom':
        camera.position.set(0, -10, 0);
        controls.target.set(0, 0, 0);
        controls.update();
        break;
      case 'perspective':
        controls.reset();
        setTimeout(() => {
          controls.update();
        }, 500);
        break;
      default:
        break;
    }
  };
 

  return (
    <div className="w-full h-[100vh] flex flex-col items-center p-0 justify-center bg-gray-900 text-white">
      <div className="w-full h-full relative">
        <Canvas className="w-full h-full" dpr={[1, 2]} shadows camera={{ fov: 45 }}>
          <color attach="background" args={["#101010"]} />
          <Stage environment={"sunset"} className="w-full h-full">
            <Render scale={0.5} />
            <OrbitControls ref={orbitControlsRef} />
          </Stage>
        </Canvas>
        <div className="absolute bottom-0 right-0 p-4">
          <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setDirection('top')}>Top</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setDirection('bottom')}>Bottom</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setDirection('left')}>Left</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setDirection('right')}>Right</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setDirection('perspective')}>Perspective</button>
        </div>
      </div>
    </div>
  );
}

export default Model;
