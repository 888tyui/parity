import ComingSoon from "@/components/ui/ComingSoon";
import SkillsHub from "@/components/skills/SkillsHub";
import { loadAllSkills } from "@/lib/skills-loader";

const isEnabled = process.env.NEXT_PUBLIC_SKILLS_ENABLED === "true";

export default function SkillsPage() {
    if (!isEnabled) {
        return <ComingSoon title="PARITY SKILLS" />;
    }

    const skills = loadAllSkills();

    return <SkillsHub skills={skills} />;
}
