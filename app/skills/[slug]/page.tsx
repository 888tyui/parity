import { loadSkillBySlug, getAllSkillSlugs } from "@/lib/skills-loader";
import SkillDetailClient from "./SkillDetailClient";
import { notFound } from "next/navigation";

// Generate static params for all skills
export function generateStaticParams() {
    return getAllSkillSlugs().map((slug) => ({
        slug,
    }));
}

interface SkillPageProps {
    params: Promise<{ slug: string }>;
}

export default async function SkillPage({ params }: SkillPageProps) {
    const { slug } = await params;
    const skill = loadSkillBySlug(slug);

    if (!skill) {
        notFound();
    }

    return <SkillDetailClient skill={skill} />;
}
