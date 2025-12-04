"use client"
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

const useGetUser = () => {
    const user = useSelector((state:RootState)=>state.auth.user);
     const accessToken = useSelector((state:RootState)=>state.auth.accessToken);
     const refreshToken = useSelector((state:RootState)=>state.auth.refreshToken);
     return {user,accessToken,refreshToken}
 
}

export default useGetUser