import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import axios from "axios";

const Model = ({ taskId }) => {
  const [glbUrl, setGlbUrl] = useState("https://assets.meshy.ai/google-oauth2%7C113623441346525699846/tasks/018e5fd3-02fa-775f-8cdb-ed209eb6d9f9/output/model.glb?Expires=1711264087&Signature=gfcaLBCN6ojX9UNVgVo-1hrrL4ZL0Azk7mkJIkX82FGSS59zuUz-XgNzCPZ7p1AElj36cGGZhR4fpA7rqo8AhEeaz9F~hAVtzjdAXdr5XtXaZOETk6dprjZEy4f1v6tHrRN5ruEB4w-TaVcSASsVXq6Oc84DnsrlxOycokivfbXGT13X9W31VS9eNeWFByyxAtOY8y71WrEvBuxWkDzB5398fOIWqBv4ftYMYvekfDnfpL8J3cDe4ybEEu7sXVl~Ht-PU76hR8mfkV5vettpV5Dk01HanskMVK9fmi~uv9yyhHT5zn9ocvqCVgMapKk0C1S1ExvFkm30xOy-eWkuGg__&Key-Pair-Id=KL5I0C8H7HX83");
  const [glb, setGlb] = useState("/towel_stack.glb");
  const [m, setM] = useState();
  const [isSentToBackend, setIsSentToBackend] = useState(false);

  useEffect(() => {
    const fetchGlbUrl = async () => {
      try {
        const headers = { Authorization: `Bearer msy_podjI0ZlCscpQGs4gnVXvKcsJcrTPWL6fH2F` };
        const response = await axios.get(`https://api.meshy.ai/v1/image-to-3d/${taskId}`, { headers });
        
        if (response.data.progress < 100) {
          console.log(response.data.model_url.glb);
          console.log(response.data.progress);
          
          setTimeout(fetchGlbUrl, 2000); 
        } else {
          setGlbUrl(response.data.model_urls.glb);
          console.log(response.data.model_urls.glb);
        }
      } catch (error) {
        console.error("Error fetching model:", error);
      }
    };
  
    if (taskId) {
      fetchGlbUrl();
    }
  }, [taskId, glbUrl]); 


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

  const handleDownload = async () => {
    try {
      if (glbUrl) {
        
        const response = await axios.get(`http://localhost:5000/download-glb?glbUrl=${encodeURIComponent(glbUrl)}`, {
          responseType: 'arraybuffer', 
        });

        console.log(response)
  
        
        const formData = new FormData();
        formData.append('glbFile', new Blob([response.data])); 
  
        await axios.post('http://localhost:5000/save-glb', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        alert('GLB file downloaded and saved to the public folder.');
      } else {
        console.error("Task ID or GLB URL is missing.");
      }
    } catch (error) {
      console.error("Error downloading or saving GLB file:", error);
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
          <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleDownload}>Download</button> {/* Download button */}
        </div>
      </div>
    </div>
  );
}

export default Model;