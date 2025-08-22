
import { useLoadingStore } from "@/store/loadingStore";

const { startLoading, stopLoading } = useLoadingStore.getState();

export async function fetchWithLoading<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  try {
    startLoading();
    const response = await fetch(input, init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 합니다.
    throw error;
  } finally {
    stopLoading();
  }
}
