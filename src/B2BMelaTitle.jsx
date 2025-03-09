import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function B2BMelaTitle() {
    const gltf = useLoader(
      GLTFLoader,
      `${import.meta.env.BASE_URL}models/B2BMelaTitle.glb` // Use BASE_URL for Vite
    );
    useEffect(()=>{
        gltf.scene.scale.set(1,1,1);
        gltf.scene.position.set(0,0,0);
        gltf.scene.rotation.set(0,0,0)
        gltf.scene.traverse((object)=>{
            if(object instanceof Mesh){
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapintensity = 20;
            }
        });
    },[gltf]);

    return <primitive object={gltf.scene} />
}