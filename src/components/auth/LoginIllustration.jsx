import './LoginIllustration.css';

/**
 * 로그인 화면 브랜드 일러스트 영역.
 */
export default function LoginIllustration() {
  return (
    <div className="login-illustration" aria-hidden="true">
      <span className="login-illustration__bubble login-illustration__bubble--1" />
      <span className="login-illustration__bubble login-illustration__bubble--2" />
      <span className="login-illustration__bubble login-illustration__bubble--3" />
      <span className="login-illustration__bubble login-illustration__bubble--4" />
      <span className="login-illustration__bubble login-illustration__bubble--5" />
      <div className="login-illustration__core">
        <span className="login-illustration__logo-mark">쉬</span>
      </div>
    </div>
  );
}
