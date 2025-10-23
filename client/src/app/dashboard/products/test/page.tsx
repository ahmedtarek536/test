"use client";
import Test from "@/components/Test";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function TestPage() {
  const { getToken } = useAuth();

  const fetchToken = async () => {
    try {
      const token = await getToken();
      console.log("Token:", token);
      return token;
    } catch (error) {
      console.error("Failed to fetch token:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      const token = await fetchToken();
      if (token) {
        try {
          const response = await fetch(
            "https://localhost:44352/api/Protected",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    handleFetch();
  }, []);

  return (
    <div>
      test
      <Test />
    </div>
  );
}
