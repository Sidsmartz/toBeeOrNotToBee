import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function TextMesh() {
    const gltf = useLoader(
      GLTFLoader,
      `${import.meta.env.BASE_URL}models/text.glb` // Use BASE_URL for Vite
    );
    useEffect(()=>{
        gltf.scene.scale.set(5,5,5);
        gltf.scene.position.set(-0.5,0,0);
        gltf.scene.traverse((object)=>{
            if(object instanceof Mesh){
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapintensity = 10;
            }
        });
    },[gltf]);

    return <primitive object={gltf.scene} />

}