"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { UserPath } from "@/types/playground";
import SelectionScreen from "@/components/playground/SelectionScreen";
import WorkflowEngine from "@/components/playground/WorkflowEngine";

const WaitlistModal = dynamic(
  () => import("@/components/playground/WaitlistModal"),
  { ssr: false },
);

export default function PlaygroundPage() {
  const [selectedPath, setSelectedPath] = useState<UserPath | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);

  if (!selectedPath) {
    return <SelectionScreen onSelect={setSelectedPath} />;
  }

  return (
    <>
      <WorkflowEngine
        path={selectedPath}
        onReset={() => setSelectedPath(null)}
        onConnectWallet={() => setShowWaitlist(true)}
      />
      {showWaitlist && (
        <WaitlistModal
          path={selectedPath}
          onClose={() => setShowWaitlist(false)}
        />
      )}
    </>
  );
}
