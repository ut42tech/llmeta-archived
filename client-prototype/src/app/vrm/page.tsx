"use client";

import { Loader } from "@react-three/drei";
import { VRMCanvas } from "@/components/spatial/vrm/VRMCanvas";

function VRMPage() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <VRMCanvas />
    </div>
  );
}

export default VRMPage;
