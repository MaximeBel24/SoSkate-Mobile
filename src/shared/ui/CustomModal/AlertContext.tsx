import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import CustomModal, { AlertButton } from "./CustomModal";

type AlertConfig = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    layout?: "horizontal" | "vertical";
};

type AlertContextType = {
    showAlert: (title: string, message?: string, buttons?: AlertButton[], layout?: "horizontal" | "vertical") => void;
};

const AlertContext = createContext<AlertContextType>({
    showAlert: () => {},
});

type AlertProviderProps = {
    children: React.ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

    const showAlert = useCallback((title: string, message?: string, buttons?: AlertButton[], layout?: "horizontal" | "vertical") => {
        setAlertConfig({ title, message, buttons, layout });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig(null);
    }, []);

    const contextValue = useMemo<AlertContextType>(
        () => ({ showAlert }),
        [showAlert],
    );

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
            <CustomModal
                visible={alertConfig !== null}
                title={alertConfig?.title ?? ""}
                message={alertConfig?.message}
                buttons={alertConfig?.buttons}
                onClose={hideAlert}
                layout={alertConfig?.layout}
            />
        </AlertContext.Provider>
    );
};

export const useCustomAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useCustomAlert must be used within an AlertProvider");
    }
    return context;
};
