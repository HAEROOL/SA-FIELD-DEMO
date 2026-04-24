import { useEffect, useRef } from "react";

/**
 * 항상 최신 값을 가리키는 ref를 반환합니다.
 * 콜백을 useCallback으로 감싸지 않고도 stale closure 없이 안전하게 사용할 수 있습니다.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
