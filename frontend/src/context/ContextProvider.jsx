/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { UserContext } from './UserContext'

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const savedUser = localStorage.getItem("user");
  
      if (savedUser ) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, []);
    useEffect(() => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }, [user]);
  return (
   <UserContext.Provider value={{ user,loading, setUser}}>
    {children}
   </UserContext.Provider>
  )
}

export default ContextProvider