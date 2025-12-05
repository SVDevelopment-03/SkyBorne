"use client";
import { removeTokens } from "@/lib/token";
import { storage } from "@/lib/storage";

import { useEffect, useState } from "react";
import { useLazyGetMeQuery } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import useGetUser from "./useGetUser";

export default function useFetchUser() {
  const [isUserUpdate, setUserUpdated] = useState(false);
  const dispatch = useDispatch();
  const [getMe] = useLazyGetMeQuery();
  const { accessToken, refreshToken } = useGetUser();

  useEffect(() => {
    if (!accessToken) return;
    if (isUserUpdate) return;

    const fetchUser = async () => {
      try {
        const res = await getMe(undefined).unwrap();

        console.log("res", res);
        const userData = { ...res?.user, id: res?.user?._id };
        storage.set(process.env.NEXT_PUBLIC_USER as string, userData);

        dispatch(
          setCredentials({
            user: userData,
            accessToken,
            refreshToken: refreshToken as string,
          })
        );
        setUserUpdated(true);
      } catch (err) {
        removeTokens();
        //  if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        console.log("ME API Error", err);
      }
    };

    fetchUser();
  }, [accessToken]);
}
