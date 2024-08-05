// Custom Hook to fetch data from Appwrite

import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn: () => Promise<any>) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fn();

        setData(response);
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        } else {
          Alert.alert(String(error));
        }
      } finally {
        setIsLoading(false); // Done fetching
      }
    };

    fetchData();
  }, []);

  return { data };
};

export default useAppwrite;
