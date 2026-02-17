"use client";

import SkillDetail from "@/components/skills/SkillDetail";
import ComingSoon from "@/components/ui/ComingSoon";
import type { Skill } from "@/lib/skills";

const isEnabled = process.env.NEXT_PUBLIC_SKILLS_ENABLED === "true";

export default function SkillDetailClient({ skill }: { skill: Skill }) {
    if (!isEnabled) {
        return <ComingSoon title="PARITY SKILLS" />;
    }

    return <SkillDetail skill={skill} />;
}
