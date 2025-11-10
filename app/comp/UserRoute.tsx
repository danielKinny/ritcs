import React from "react";
import { PropsWithChildren } from "react";
import { useUser } from "../context/UserContext";

const UserRoute = ({ children }: PropsWithChildren<{}>) => {
    const { currentUser } = useUser();

    if (currentUser === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold notable-regular">Loading...</h1>
            </div>
        );
    }

    if (currentUser === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold notable-regular">Please log in to view this page.</h1>
            </div>
        );
    }

    if (currentUser?.role !== "user") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold notable-regular">Access Denied. Users Only.</h1>
            </div>
        );
    }

    return <>{children}</>;
};

export default UserRoute;