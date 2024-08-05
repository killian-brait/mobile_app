import { createContext, useContext, useState, useEffect } from 'react';

import { getCurrentUser } from '@/lib/appwrite';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

// if logged in before, give access to the current user to decide if we need to redirect the user to the home page
const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCurrentUser().then((res) => {
                if (res) {
                    setIsLoggedIn(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            }
        ).catch((err) => {
            console.log("Error getting current user: ", err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;