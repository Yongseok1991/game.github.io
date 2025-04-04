import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "./localStorageUtil";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FaStar } from "react-icons/fa";
import axios from "axios"

function CreateModal({ show, handleClose, onNoteCreated }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);


    const defaultContent = `
<p><strong>🎨 그래픽</strong></p>
<p><strong>📖 스토리</strong></p>
<p><strong>⚔️ 타격감</strong></p>
<p><strong>🎵 사운드</strong></p>
<p><strong>🌎 자유도</strong></p>
<p><strong>💬 총평</strong></p>
`;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "내용을 입력하세요...",
                emptyEditorClass: "placeholder-text",
            }),
        ],
        content: defaultContent,
    });

    useEffect(() => {
        if (!show) {
            setTitle("");
            setRating(0);
            setSearchQuery("");
            setImages([]);
            setSelectedImage(null);
            editor?.commands.setContent(defaultContent);
        }
    }, [show]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !editor?.getHTML().trim()) {
            alert("제목과 내용을 입력해주세요!");
            return;
        }

        try {
            LocalStorageUtil.addItem({
                title,
                contents: editor.getHTML(),
                rating,
                imageUrl: selectedImage,
            });

            if (onNoteCreated) {
                onNoteCreated();
            }

            handleClose();
            navigate("/");
        } catch (error) {
            console.error("등록 실패:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton style={{ background: "#222", color: "#fff", borderBottom: "1px solid #444" }}>
                <Modal.Title>✏️ 새 게임 후기 작성</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "#222", color: "#fff" }}>
                <Form onSubmit={handleSubmit} style={{ fontSize: "0.8em" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            style={{ background: "#333", color: "#fff", border: "1px solid #555" }}
                            type="text"
                            placeholder="게임 제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {title && (
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                className="mt-2"
                                onClick={() => {
                                    const query = encodeURIComponent(title);
                                    const url = `https://www.playstation.com/ko-kr/search/?q=${query}&category=games`;
                                    window.open(url, "_blank");
                                }}
                            >
                                🔍 플스에서 이미지 검색
                            </Button>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이미지 URL</Form.Label>
                        <Form.Control
                            style={{ background: "#333", color: "#fff", border: "1px solid #555" }}
                            type="text"
                            placeholder="게임 URL을 입력하세요"
                            value={selectedImage}
                            onChange={(e) => setSelectedImage(e.target.value)}
                        />
                    </Form.Group>

                    {selectedImage && (
                        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                            <img
                                src={selectedImage}
                                alt="미리보기"
                                style={{
                                    width: "120px", // 썸네일 크기
                                    height: "auto",
                                    border: "1px solid #555",
                                    borderRadius: "8px",
                                    marginTop: "10px",
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <div className="border p-3 rounded"
                             style={{ background: "#333", color: "#fff", border: "1px solid #555" }}>
                            <EditorContent editor={editor} style={{ minHeight: "100%", width: "100%" }} />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>별점</Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={24}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: "pointer", marginRight: 5 }}
                                    color={star <= rating ? "#ffc107" : "#555"}
                                />
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ background: "#222", borderTop: "1px solid #444" }}>
                <Button variant="secondary" onClick={handleClose} style={{ fontSize: "0.8em", background: "#444", border: "1px solid #666" }}>취소</Button>
                <Button variant="light" onClick={handleSubmit} style={{ fontSize: "0.8em", color: "#222", background: "#fff", border: "1px solid #ccc" }}>등록</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateModal;
