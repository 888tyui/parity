"use client";

import { useState } from "react";
import type { UserPath } from "@/types/playground";
import SelectionScreen from "@/components/playground/SelectionScreen";
import WorkflowEngine from "@/components/playground/WorkflowEngine";

export default function PlaygroundPage() {
  const [selectedPath, setSelectedPath] = useState<UserPath | null>(null);

  if (!selectedPath) {
    return <SelectionScreen onSelect={setSelectedPath} />;
  }

  return (
    <WorkflowEngine
      path={selectedPath}
      onReset={() => setSelectedPath(null)}
    />
  );
}
