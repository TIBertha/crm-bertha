import React, { useEffect, useState } from "react";

export default function LoadingScreen({ load, classStyle }) {
    let display = (load == true ? "on" : "off") + "-loading-screen";

    return (
        <div className={classStyle + " " + display}>
            <div className="loader-pendulums"></div>
        </div>
    );
}
