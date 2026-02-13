"use client";

import { useState } from "react";
import type { UserPath } from "@/types/playground";
import SelectionScreen from "@/components/playground/SelectionScreen";
import WorkflowEngine from "@/components/playground/WorkflowEngine";
import WaitlistFlow from "@/components/playground/WaitlistFlow";

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
        <WaitlistFlow
          path={selectedPath}
          onClose={() => setShowWaitlist(false)}
        />
      )}
    </>
  );
}
