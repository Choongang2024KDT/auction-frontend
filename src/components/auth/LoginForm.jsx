import { Form, Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';

const LoginForm = () => (
    <div className={styles.container}>
        <Form method="post" className={styles.form}>
            <h1 className={styles.title}> 로그인 </h1>

            <div className={styles.inputGroup}>
                <label htmlFor="email" autofocus >Email</label>
                <input id="email" type="email" name="email" required />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required />
            </div>

            <div className={styles.actions}>
                <button type="submit" className={styles.loginButton}>Login</button>
            </div>

            <div className={styles.registerText}>
                아직 계정이 없으신가요? <Link to="/signup">회원가입 하러가기</Link>
            </div>
        </Form>
    </div>
);

export default LoginForm;
