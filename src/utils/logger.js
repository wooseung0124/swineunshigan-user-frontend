/**
 * 간단한 콘솔 로거. 모듈 prefix로 출처를 구분합니다.
 * @param {string} scope
 */
export function createLogger(scope) {
  const prefix = `[${scope}]`;

  return {
    /** @param {...unknown} args */
    info: (...args) => console.info(prefix, ...args),
    /** @param {...unknown} args */
    warn: (...args) => console.warn(prefix, ...args),
    /** @param {...unknown} args */
    error: (...args) => console.error(prefix, ...args),
  };
}
