import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card } from "react-bootstrap";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9090/api/login", {
                username,
                password
            }, {
                withCredentials: true // 🔥 로그인 요청부터 쿠키 저장
            });

            if (response.status === 200) {
                alert("로그인 성공!");
                navigate("/");
            } else {
                alert("로그인 실패. 이메일과 비밀번호를 확인하세요.");
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", padding: "20px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">로그인</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>유저ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="이메일을 입력하세요"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            로그인
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;