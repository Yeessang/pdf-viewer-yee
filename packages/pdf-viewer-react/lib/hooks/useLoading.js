import { useState } from "react";


export function useLoading() {
  const [loadingPercentVisible, setLoadingPercentVisible] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);


  return {
    loadingPercent,
    setLoadingPercent,
    loadingPercentVisible,
    setLoadingPercentVisible
  }
}