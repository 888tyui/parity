"use client";

import Link from "next/link";
import Image from "next/image";

interface SubNavProps {
    /** Current page label shown in center */
    label: string;
    /** Right-side link target & text. If omitted, shows nothing on the right. */
    rightLink?: { href: string; text: string };
    /** Optional extra content on the right (e.g. status indicators) */
    rightContent?: React.ReactNode;
    /** Center-right extra info (e.g. repo name or status) */
    centerExtra?: React.ReactNode;
}

export default function SubNav({ label, rightLink, rightContent, centerExtra }: SubNavProps) {
    return (
        <div className="glass-strong border-b border-white/20 shrink-0">
            <div className="px-5 py-2.5 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/logo-trs.png"
                        alt="Parity"
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px]"
                    />
                    <span className="font-[family-name:var(--font-cs-caleb-mono)] text-xs tracking-[0.2em] text-text-secondary">
                        PARITY
                    </span>
                </Link>

                <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider">
                        {label}
                    </span>
                    {centerExtra}
                </div>

                {rightContent ? (
                    rightContent
                ) : rightLink ? (
                    <Link
                        href={rightLink.href}
                        className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
                    >
                        {rightLink.text}
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4.5 2.5l5 5-5 5" />
                        </svg>
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
