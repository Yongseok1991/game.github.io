import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaStar, FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import localStorageUtil from "./localStorageUtil"; // 🔥 추가됨

function ViewModal({ show, handleClose, note, onUpdate }) {
    const [title, setTitle] = useState(note?.title || "");
    const [date, setDate] = useState(note ? `${note.createdAt}` : "");
    const [content, setContent] = useState(note?.contents || "");
    const [rating, setRating] = useState(note?.rating || 0);
    const [imageUrl, setImageUrl] = useState(note?.imageUrl || "");
    const [isEditing, setIsEditing] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editable: isEditing,
    });

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setDate(`${note.createdAt}`);
            setContent(note.contents);
            setRating(note.rating || 0);
            setImageUrl(note.imageUrl || "");
            editor?.commands.setContent(note.contents);
        }
    }, [note, editor]);

    useEffect(() => {
        if (editor) {
            editor.setOptions({ editable: isEditing });
            if (isEditing) {
                editor.commands.setContent(content);
            }
        }
    }, [isEditing, editor, content]);

    useEffect(() => {
        if (!show) {
            setIsEditing(false);
        }
    }, [show]);

    const handleUpdate = () => {
        if (!title.trim() || !editor?.getHTML().trim()) {
            alert("제목과 내용을 입력해주세요!");
            return;
        }

        const updatedNote = {
            ...note,
            title,
            contents: editor.getHTML(),
            rating,
            imageUrl,
        };

        try {
            localStorageUtil.updateItem(note.id, updatedNote);
            setIsEditing(false);
            onUpdate(updatedNote);
        } catch (error) {
            console.error("업데이트 중 오류 발생:", error);
            alert("업데이트에 실패했습니다.");
        }
    };

    const handleDelete = () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            localStorageUtil.deleteItem(note.id);
            alert("삭제되었습니다.");
            handleClose();
            onUpdate(null);
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Body style={{ backgroundColor: "#1E1E1E", color: "#EAEAEA" }}>
                <Card className="p-4 border-0" style={{ backgroundColor: "#1E1E1E", color: "#EAEAEA" }}>
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mb-2"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    color: "#FFF",
                                    border: "none",
                                    flex: "1",
                                }}
                            />
                        ) : (
                            <h4 className="text-center flex-grow-1">🎮 {title}</h4>
                        )}

                        <div className="d-flex gap-2">
                            <Button
                                className="w-[36px] h-[36px] p-1 d-flex align-items-center justify-content-center rounded-lg"
                                variant={isEditing ? "success" : "light"}
                                onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
                            >
                                {isEditing ? <FaCheck size={16} /> : <FaEdit size={16} />}
                            </Button>

                            <Button
                                className="w-[36px] h-[36px] p-1 d-flex align-items-center justify-content-center rounded-lg"
                                variant="danger"
                                onClick={handleDelete}
                            >
                                <FaTrash size={16} />
                            </Button>
                        </div>
                    </div>

                    <p className="text-center">{date}</p>

                    {imageUrl && (
                        <div className="text-center mb-3">
                            <img
                                src={imageUrl}
                                alt="게임 표지"
                                className="rounded shadow-sm"
                                style={{ width: "200px", height: "280px", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    <div className="text-center mb-3">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                size={20}
                                color={i < rating ? "#ffc107" : "#e4e5e9"}
                                style={{ cursor: isEditing ? "pointer" : "default" }}
                                onClick={() => isEditing && setRating(i + 1)}
                            />
                        ))}
                    </div>

                    <div
                        className="border p-3 rounded"
                        style={{
                            minHeight: "300px",
                            border: "1px solid #555",
                            backgroundColor: isEditing ? "rgba(255, 255, 255, 0.05)" : "#1E1E1E",
                            color: "#FFF",
                        }}
                    >
                        {editor ? <EditorContent editor={editor} /> : <p>로딩 중...</p>}
                    </div>
                </Card>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#1E1E1E", color: "#EAEAEA" }}>
                <Button
                    variant="secondary"
                    style={{ fontSize: "0.8em", color: "#222", background: "#fff", border: "1px solid #ccc" }}
                    onClick={handleClose}
                >
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewModal;
