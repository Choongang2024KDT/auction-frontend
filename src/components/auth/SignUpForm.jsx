import React, { useState } from "react";
import styles from "./SignUpForm.module.scss";

// 전화번호 (VARCHAR) :국제번호 포함 가능 ex +82 10-1234-5678)
// -, () 같은 형식 유지 가능하도록 추가 구현

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        policy: false,
    });
    const [passwordError, setPasswordError] = useState("");
    const [policyError, setPolicyError] = useState(false);

    // 폼의 각 입력 필드에서 발생한 변경을 처리함
    // event.target을 통해 변경된 입력 값을 가져오고, setFormData를 사용해 상태 업데이트 한다
    // id는 각 입력 필드의 고유 식별자 ! ex. email.name, password 등
    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const register = (event) => {
        event.preventDefault();
        const { password, confirmPassword, policy } = formData;
        const checkConfirmPassword = password === confirmPassword;
        if (!checkConfirmPassword) {
            setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
            return;
        }
        if (!policy) {
            setPolicyError(true);
            return;
        }
        setPasswordError("");
        setPolicyError(false);
        // 여기서 사용자 정보를 서버로 전송하는 로직 추가하면 됩니다.
        console.log("회원가입 성공", formData);
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={register} className={styles.registerForm}>
                {/* 이메일 입력 필드 */}
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </div>

                {/* 이름 입력 필드 */}
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                    />
                </div>

                {/* 비밀번호 입력 필드 */}
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>

                {/* 비밀번호 확인 입력 필드 */}
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        className={passwordError ? styles.invalidInput : ""}
                    />
                    {passwordError && <span className={styles.errorText}>{passwordError}</span>}
                </div>

                {/* 약관 동의 체크박스 */}
                <div className={styles.formGroup}>
                    <label>
                        <input
                            type="checkbox"
                            id="policy"
                            onChange={handleChange}
                            checked={formData.policy}
                            className={policyError ? styles.invalidInput : ""}
                        />
                        이용약관에 동의합니다
                    </label>
                    {policyError && <span className={styles.errorText}>약관에 동의해야 합니다.</span>}
                </div>

                <button type="submit" className={styles.submitButton}>
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;
