import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import axios from "axios";

const Model = ({ taskId }) => {
  const [glbUrl, setGlbUrl] = useState();
  const [glb, setGlb] = useState("/towel_stack.glb");
  const [isSentToBackend, setIsSentToBackend] = useState(false); // Track if GLB URL is sent to backend

  useEffect(() => {
    const fetchGlbUrl = async () => {
      try {
        const headers = { Authorization: `Bearer msy_2LzJblKqKUBtDuToR9kgJgcfXnmMMAfSmJtB` };
        const response = await axios.get(`https://api.meshy.ai/v1/image-to-3d/${taskId}`, { headers });
        
        if (response.data.progress < 100) {
          console.log(response.data.model_url.glb);
          console.log(response.data.progress);
          // If progress is not yet 100%, wait for some time and fetch again
          setTimeout(fetchGlbUrl, 30000); // Fetch again after 2 seconds
        } else {
          // If progress is 100%, set the GLB URL
          setGlbUrl(response.data.model_urls.glb);
          console.log(response.data.model_urls.glb);
          
          // Check if not sent to backend and GLB URL is available, then send to backend
          if (!isSentToBackend && glbUrl) {
            sendUrlToBackend(glbUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching model:", error);
      }
    };
  
    if (taskId) {
      fetchGlbUrl();
    }
  }, [taskId, glbUrl, isSentToBackend]); // Added dependencies

  // Function to send GLB URL to backend
  const sendUrlToBackend = async (url) => {
    try {
      const response = await axios.post('http://localhost:5000/submit-glb-url', { glbUrl: url });
      console.log("GLB URL sent to backend:", response.data);
      setIsSentToBackend(true); // Mark as sent to backend
      if(response.status==200)
      {
        setGlb("/model.glb");
      }
    } catch (error) {
      console.error("Error sending GLB URL to backend:", error);
    }
  };

  function Render(props) {
    const { scene } = useGLTF(glb);
    return <primitive object={scene} {...props} />;
  }

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
        camera.position.set(10, 0, 0);
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
            {<Render scale={0.5} />}
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