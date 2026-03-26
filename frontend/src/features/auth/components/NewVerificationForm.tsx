'use client';

import { useSearchParams } from "next/navigation";
import { useVerificationMutation } from "../hooks";
import { useEffect } from "react";
import { AuthWrapper } from "./AuthWrapper";
import { Loader } from "@/shared/components/ui";

export function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token');

    const {verification} = useVerificationMutation()

    useEffect(() => {
        verification(token)
    }, [token])

    return (
        <AuthWrapper heading="Подтверждение почты">
            <div>
                <Loader />
            </div>
        </AuthWrapper>
    );
}