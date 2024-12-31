
import React, { createContext, useState, useContext, ReactNode } from 'react';


type LoadingContextType = {
    loading:boolean;
    setLoading: (loading:boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () =>{
    const context = useContext(LoadingContext);
    if(!context){
        throw new Error('useLoading must be used within a Loading Provider');
    }
    return context;
};

export const LoadingProvider = ({children} : { children:ReactNode}) =>{
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading}}>
            {children}
        </LoadingContext.Provider>
    );
}