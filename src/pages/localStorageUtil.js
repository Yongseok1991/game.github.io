const STORAGE_KEY = 'gameData';

const LocalStorageUtil = {

    async initData() {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData);
        }

        const response = await fetch("/assets/data.json");
        const jsonData = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData));
        return jsonData;
    },

    // 현재 저장된 전체 데이터 가져오기
    getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        if(data) {
           return JSON.parse(data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        } else {
            return []
        }
    },

    // 전체 데이터 저장 (덮어쓰기)
    setData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // 새 아이템 추가
    addItem(item) {
        const current = this.getData();
    
        // 가장 큰 id + 1 방식으로 고유 ID 생성
        const maxId = current.length ? Math.max(...current.map(i => i.id)) : 0;
        const newId = maxId + 1;

        const now = this.getFormattedNow();

        const newItem = {
            ...item,
            id: newId,
            createdAt: now,
            updatedAt: now
        };

        this.setData([...current, newItem]);
    },

    // 특정 id의 아이템 수정
    updateItem(id, updatedFields) {
        const current = this.getData();
        const now = this.getFormattedNow();

        const updated = current.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    ...updatedFields,
                    updatedAt: now
                };
            }
            return item;
        });

        this.setData(updated);
    },

    // 특정 id의 아이템 삭제
    deleteItem(id) {
        const current = this.getData();
        const filtered = current.filter(item => item.id !== id);
        this.setData(filtered);
    },

    // 포맷된 현재 시간 반환
    getFormattedNow() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    },

    exportToFile() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `gameData_backup_${this.getFormattedNow().replace(/[: ]/g, "_")}.json`;
        a.click();

        URL.revokeObjectURL(url);
    },

    importFromFile(file, onSuccess, onError) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (!Array.isArray(json)) throw new Error("잘못된 파일 형식입니다.");
                this.setData(json);
                onSuccess?.();
            } catch (err) {
                onError?.(err);
            }
        };
        reader.readAsText(file);
    }
};

export default LocalStorageUtil;