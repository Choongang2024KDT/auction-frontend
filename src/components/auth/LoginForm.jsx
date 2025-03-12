import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import styles from "./LoginForm.module.scss";

const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        // 로그인 처리 로직 추가 예정
    };

    return (
        <Container className={styles.loginArea}>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    {/*htmlFor="email" 추후 넣어야함 !!*/}
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button type="submit">Login</Button>

                <div>
                    아직 계정이 없으세요? <Link to="/sign-up">회원가입 하기</Link>
                </div>
            </Form>
        </Container>
    );
};

export default LoginForm;
