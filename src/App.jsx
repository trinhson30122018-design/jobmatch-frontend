import { useEffect, useState } from "react";
import api from "./lib/api";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0 });

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  async function login() {
    try {
      if (!loginUsername.trim() || !loginPassword.trim()) {
        alert("Nhập tài khoản và mật khẩu");
        return;
      }

      const res = await api.post("/auth/login", {
        username: loginUsername.trim(),
        password: loginPassword.trim()
      });

      const newToken = res?.data?.token || "";
      const newRole = res?.data?.role || "";
      const newUsername = res?.data?.username || "";

      localStorage.setItem("token", newToken);
      localStorage.setItem("role", newRole);
      localStorage.setItem("username", newUsername);

      setToken(newToken);
      setRole(newRole);
      setUsername(newUsername);

      setLoginUsername("");
      setLoginPassword("");
      alert("Đăng nhập thành công");
    } catch (error) {
      console.error("login error:", error);
      alert(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setToken("");
    setRole("");
    setUsername("");
    setJobs([]);
    setStats({ totalJobs: 0, activeJobs: 0 });
  }

  async function loadJobs() {
    try {
      const res = await api.get("/jobs");
      setJobs(res?.data?.jobs || []);
    } catch (error) {
      console.error("loadJobs error:", error);
      setJobs([]);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/stats");
      setStats({
        totalJobs: res?.data?.totalJobs || 0,
        activeJobs: res?.data?.activeJobs || 0
      });
    } catch (error) {
      console.error("loadStats error:", error);
      setStats({ totalJobs: 0, activeJobs: 0 });
    }
  }

  useEffect(() => {
    if (token) {
      loadJobs();
      loadStats();
    }
  }, [token]);

  async function addJob() {
    try {
      if (!title.trim() || !company.trim() || !location.trim()) {
        alert("Nhập đủ vị trí, công ty, địa điểm");
        return;
      }

      await api.post("/jobs", {
        id: Date.now().toString(),
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary.trim() || "Thỏa thuận",
        createdAt: new Date().toISOString().slice(0, 10),
        status: "Đang tuyển"
      });

      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");

      await loadJobs();
      await loadStats();
      alert("Đã thêm tin tuyển dụng");
    } catch (error) {
      console.error("addJob error:", error);
      alert(error?.response?.data?.message || "Không thêm được tin");
    }
  }

  async function deleteJob(id) {
    try {
      await api.delete(`/jobs/${id}`);
      await loadJobs();
      await loadStats();
      alert("Đã xóa tin");
    } catch (error) {
      console.error("deleteJob error:", error);
      alert(error?.response?.data?.message || "Không xóa được tin");
    }
  }

  if (!token) {
    return (
      <div className="page">
        <div className="card auth-card">
          <h1>JobMatch AI</h1>
          <h2>Đăng nhập hệ thống</h2>

          <input
            placeholder="Tên đăng nhập"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button onClick={login}>Đăng nhập</button>

          <div className="hint">
            <p>Tài khoản test:</p>
            <p>Admin: admin / 123456</p>
            <p>Viewer: viewer / 123456</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1>JobMatch AI</h1>
          <p>
            <strong>Tài khoản:</strong> {username} | <strong>Vai trò:</strong> {role}
          </p>
        </div>
        <button onClick={logout}>Đăng xuất</button>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3>Tổng tin tuyển dụng</h3>
          <div className="big-number">{stats.totalJobs}</div>
        </div>
        <div className="card">
          <h3>Tin đang tuyển</h3>
          <div className="big-number">{stats.activeJobs}</div>
        </div>
      </div>

      {role === "admin" && (
        <div className="card">
          <h2>Thêm tin tuyển dụng</h2>

          <input
            placeholder="Vị trí"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Công ty"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            placeholder="Địa điểm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            placeholder="Mức lương"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <button onClick={addJob}>Thêm tin</button>
        </div>
      )}

      <div className="card">
        <h2>Danh sách tin tuyển dụng</h2>

        {jobs.length === 0 ? (
          <p>Chưa có tin tuyển dụng.</p>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Công ty:</strong> {job.company}</p>
                <p><strong>Địa điểm:</strong> {job.location}</p>
                <p><strong>Lương:</strong> {job.salary}</p>
                <p><strong>Trạng thái:</strong> {job.status}</p>

                {role === "admin" && (
                  <button onClick={() => deleteJob(job.id)}>Xóa</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}