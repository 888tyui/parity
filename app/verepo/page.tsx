"use client";

import { Suspense } from "react";
import VerepoClient from "@/components/verepo/VerepoClient";

export default function VerepoPage() {
    return (
        <Suspense>
            <VerepoClient />
        </Suspense>
    );
}
