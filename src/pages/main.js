import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CreateModal from "./create";
import ViewModal from "./view";
import { Navbar, Nav, Container, Table, Card, Pagination, Button, Tab, Tabs } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import localStorageUtil from "./localStorageUtil";

function Main() {
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState("cards");
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const fileInputRef = useRef(null);

    const fetchNotes = async () => {
        const allNotes = localStorageUtil.getData();
        const pageSize = 8;
        const startIdx = currentPage * pageSize;
        const paginated = allNotes.slice(startIdx, startIdx + pageSize);

        setNotes(paginated);
        setTotalPages(Math.ceil(allNotes.length / pageSize));
    };

    useEffect(() => {
        fetchNotes();
    }, [currentPage]);

    const handleNoteCreated = () => {
        fetchNotes();
    };

    const handleNoteUpdate = (updatedNote) => {
        if (!updatedNote) {
            fetchNotes();
            return;
        }
        setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
    };

    const handleExport = () => {
        localStorageUtil.exportToFile();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        localStorageUtil.importFromFile(
            file,
            () => {
                alert("✅ 데이터 가져오기 완료!");
                setCurrentPage(0);
                fetchNotes();
            },
            (err) => {
                alert("⚠️ 잘못된 파일 형식입니다.");
                console.error(err);
            }
        );
    };

    return (
        <>
            <style>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #1E1E1E;
                    color: #EAEAEA;
                }
                .nav-tabs .nav-link {
                    font-size: 0.8rem;
                    color: #EAEAEA !important;
                }
                .pagination .page-link {
                    color: #EAEAEA !important;
                    background-color: #2C2C2C !important;
                    border: 1px solid #555 !important;
                }
                .pagination .page-item.active .page-link {
                    z-index: 1;
                    color: #FFF !important;
                    font-weight: bold;
                    background-color: #444 !important;
                    border-color: #555 !important;
                }
                .pagination .page-link:focus, .pagination .page-link:hover {
                    color: #FFF !important;
                    background-color: #333 !important;
                    border-color: #555 !important;
                }
                .custom-button {
                    background-color: #444 !important;
                    border: none !important;
                    color: white !important;
                    padding: 8px 8px !important;
                    font-size: 0.8rem !important;
                    border-radius: 8px !important;
                    transition: background-color 0.3s ease !important;
                }
                .custom-button:hover {
                    background-color: #555 !important;
                }
                .dark-card {
                    background-color: #2C2C2C !important;
                    color: #EAEAEA !important;
                    border: none !important;
                }
                .dark-table {
                    background-color: #2C2C2C !important;
                    color: #EAEAEA !important;
                    border-collapse: collapse !important;
                    width: 100% !important;
                    border: 1px solid #555 !important;
                }
                .dark-table th, .dark-table td {
                    border: 1px solid #555 !important;
                    padding: 10px !important;
                    background-color: #2C2C2C !important;
                    color: #EAEAEA !important;
                }
                .dark-table th {
                    background-color: #444 !important;
                    color: #FFF !important;
                }
                .dark-table tr:hover {
                    background-color: #333 !important;
                }
                .nav-link.active {
                    color: black !important;
                }
            `}</style>

            <Navbar style={{ backgroundColor: "#121212" }} variant="dark" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/">🎮 My Game</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto d-flex align-items-center gap-2">
                            <Button variant="outline-light" className="custom-button" onClick={handleExport}>
                                💾 내보내기
                            </Button>
                            <Button variant="outline-light" className="custom-button" onClick={handleImportClick}>
                                📂 가져오기
                            </Button>
                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <Card className="p-4 text-center shadow-sm dark-card">
                    <h2 style={{ fontSize: "1.8rem" }}>🎮 내 게임 기록</h2>
                    <p style={{ fontSize: "1rem", color: "#CCC" }}>소중한 기록을 남겨보세요.</p>
                </Card>

                <div className="d-flex justify-content-end mt-4">
                    <Button className="custom-button" onClick={() => setShowModal(true)}>새 게임 후기 작성</Button>
                    <CreateModal onNoteCreated={handleNoteCreated} show={showModal} handleClose={() => setShowModal(false)} />
                </div>

                <Tabs activeKey={viewMode} onSelect={(k) => setViewMode(k)} className="mt-4">
                    <Tab eventKey="cards" title="카드 보기">
                        <div className="d-flex flex-wrap justify-content-center mt-4">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <Card key={note.id} className="m-3 shadow-sm dark-card"
                                          style={{ width: "18rem", cursor: "pointer" }}
                                          onClick={() => {
                                              setSelectedNote(note);
                                              setShowViewModal(true);
                                          }}>
                                        <Card.Img variant="top"
                                                  src={note.imageUrl || `https://picsum.photos/300/200?random=${note.id}`}
                                                  alt="Note Image" />
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: "1rem" }}>{note.title}</Card.Title>
                                            <div>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} size={16}
                                                            color={i < note.rating ? "#ffc107" : "#e4e5e9"} />
                                                ))}
                                            </div>
                                            <Card.Text style={{
                                                fontSize: "0.85rem",
                                                color: "#BBB"
                                            }}>{note.createdAt}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-muted">데이터가 없습니다.</p>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="table" title="테이블 보기">
                        <Table bordered className="mt-2 shadow-sm text-center dark-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>별점</th>
                                <th>작성일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <tr key={note.id} onClick={() => {
                                        setSelectedNote(note);
                                        setShowViewModal(true);
                                    }}
                                        style={{ cursor: "pointer" }}>
                                        <td>{note.id}</td>
                                        <td>{note.title}</td>
                                        <td>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={16}
                                                        color={i < note.rating ? "#ffc107" : "#e4e5e9"} />
                                            ))}
                                        </td>
                                        <td>{note.createdAt}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">데이터가 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>

                <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                     disabled={currentPage === 0} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index} active={index === currentPage}
                                         onClick={() => setCurrentPage(index)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                     disabled={currentPage === totalPages - 1} />
                </Pagination>

                <ViewModal
                    show={showViewModal}
                    handleClose={() => setShowViewModal(false)}
                    note={selectedNote}
                    onUpdate={(updatedNote) => handleNoteUpdate(updatedNote)}
                />
            </Container>
        </>
    );
}

export default Main;
