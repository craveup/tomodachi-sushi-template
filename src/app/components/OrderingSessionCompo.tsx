"use client"

import {useOrderingSession} from "@/hooks/use-ordering-session";
import {location_Id} from "@/constants";

function OrderingSessionCompo() {
    useOrderingSession(location_Id);

    return (
       <div />
    );
}

export default OrderingSessionCompo;
