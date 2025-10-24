"use client"

import { Suspense } from "react";
import {useOrderingSession} from "@/hooks/use-ordering-session";
import {location_Id} from "@/constants";

function OrderingSessionContent() {
    useOrderingSession(location_Id);

    return (
       <div />
    );
}

function OrderingSessionCompo() {
    return (
        <Suspense fallback={<div />}>
            <OrderingSessionContent />
        </Suspense>
    );
}

export default OrderingSessionCompo;
