<<<<<<< HEAD
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
      const res = await api.get("/api/jobs");
      setJobs(res?.data?.jobs || []);
    } catch (error) {
      console.error("loadJobs error:", error);
      setJobs([]);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/api/stats");
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

      await api.post("/api/jobs", {
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
      await api.delete(`/api/jobs/${id}`);
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
=======
import { useState, useEffect } from "react"

const API = "http://localhost:4000"

export default function App(){

  const [jobs,setJobs] = useState([])
  const [title,setTitle] = useState("")
  const [company,setCompany] = useState("")
  const [location,setLocation] = useState("")
const [selectedFile,setSelectedFile] = useState(null)
  const [candidateSkill,setCandidateSkill] = useState("")
  const [matchedJobs,setMatchedJobs] = useState([])

  const [role,setRole] = useState("")

  async function loadJobs(){
    const res = await fetch(API + "/api/jobs")
    const data = await res.json()
    setJobs(data.jobs)
  }

  useEffect(()=>{
    loadJobs()
  },[])

  async function addJob(){
    const job = {
  id: Date.now().toString(),
  title,
  company,
  location,
  salary: "12-15 triệu",
  createdAt: new Date().toISOString().slice(0,10),
  status: "Đang tuyển",
  fileName: selectedFile ? selectedFile.name : ""
}

    await fetch(API + "/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    })

    setTitle("")
setCompany("")
setLocation("")
setSelectedFile(null)
loadJobs()
  }

  async function deleteJob(id){
    await fetch(API + "/api/jobs/" + id, {
      method: "DELETE"
    })
    loadJobs()
    setMatchedJobs(prev => prev.filter(job => job.id !== id))
  }

  function findMatchingJobs(){
    const keyword = candidateSkill.trim().toLowerCase()

    if(!keyword){
      setMatchedJobs([])
      return
    }

    const results = jobs.filter(job => {
      const text = `${job.title} ${job.company} ${job.location}`.toLowerCase()
      return text.includes(keyword)
    })

    setMatchedJobs(results)
  }

  function logout(){
    setRole("")
    setMatchedJobs([])
  }

  if(!role){
    return (
      <div style={{padding:40,fontFamily:"Arial",maxWidth:600,margin:"40px auto"}}>
        <h1>JobMatch Mini</h1>
        <h2>Chọn vai trò đăng nhập</h2>

        <div style={{display:"flex",gap:20,marginTop:20}}>
          <button onClick={()=>setRole("admin")} style={{padding:"12px 18px"}}>
            Đăng nhập Admin
          </button>

          <button onClick={()=>setRole("viewer")} style={{padding:"12px 18px"}}>
            Đăng nhập Người tra cứu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{padding:40,fontFamily:"Arial",maxWidth:1000,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1>JobMatch Mini</h1>
        <div>
          <strong>Vai trò:</strong> {role === "admin" ? "Admin" : "Người tra cứu"}
          <button onClick={logout} style={{marginLeft:12,padding:"8px 12px"}}>
            Đăng xuất
          </button>
>>>>>>> 4699bdc9cb3ce5c4fbe1e3a36aa000ad8fc3594d
        </div>
      </div>

      {role === "admin" && (
<<<<<<< HEAD
        <div className="card">
          <h2>Thêm tin tuyển dụng</h2>
=======
        <>
          <h2>1. Thêm tin tuyển dụng</h2>
>>>>>>> 4699bdc9cb3ce5c4fbe1e3a36aa000ad8fc3594d

          <input
            placeholder="Vị trí"
            value={title}
<<<<<<< HEAD
            onChange={(e) => setTitle(e.target.value)}
=======
            onChange={e=>setTitle(e.target.value)}
            style={{display:"block",width:"100%",marginBottom:10,padding:10}}
>>>>>>> 4699bdc9cb3ce5c4fbe1e3a36aa000ad8fc3594d
          />

          <input
            placeholder="Công ty"
            value={company}
<<<<<<< HEAD
            onChange={(e) => setCompany(e.target.value)}
=======
            onChange={e=>setCompany(e.target.value)}
            style={{display:"block",width:"100%",marginBottom:10,padding:10}}
>>>>>>> 4699bdc9cb3ce5c4fbe1e3a36aa000ad8fc3594d
          />

          <input
            placeholder="Địa điểm"
            value={location}
<<<<<<< HEAD
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
=======
            onChange={e=>setLocation(e.target.value)}
            style={{display:"block",width:"100%",marginBottom:10,padding:10}}
          />
<input
  type="file"
  onChange={e=>setSelectedFile(e.target.files[0] || null)}
  style={{display:"block",width:"100%",marginBottom:10,padding:10}}
/>

{selectedFile && (
  <p style={{marginTop:0, marginBottom:10}}>
    File đã chọn: <strong>{selectedFile.name}</strong>
  </p>
)}
          <button onClick={addJob} style={{padding:"10px 16px"}}>
            Thêm
          </button>
        </>
      )}

      <h2 style={{marginTop:40}}>
        {role === "admin" ? "2. Tra cứu việc phù hợp" : "1. Tra cứu việc phù hợp"}
      </h2>

      <input
        placeholder="Nhập kỹ năng hoặc vị trí, ví dụ: hàn, MIG, cơ khí..."
        value={candidateSkill}
        onChange={e=>setCandidateSkill(e.target.value)}
        style={{display:"block",width:"100%",marginBottom:10,padding:10}}
      />

      <button onClick={findMatchingJobs} style={{padding:"10px 16px"}}>
        Tìm việc phù hợp
      </button>

      <div style={{marginTop:20}}>
        {matchedJobs.length > 0 ? (
          matchedJobs.map(job => (
            <div
              key={job.id}
              style={{
                border:"1px solid #16a34a",
                background:"#f0fdf4",
                padding:12,
                marginBottom:12,
                borderRadius:8
              }}
            >
              <h3 style={{margin:"0 0 8px 0"}}>{job.title}</h3>
              <p style={{margin:"4px 0"}}><strong>Công ty:</strong> {job.company}</p>
              <p style={{margin:"4px 0"}}><strong>Địa điểm:</strong> {job.location}</p>
{job.fileName ? (
  <p style={{margin:"4px 0"}}><strong>File:</strong> {job.fileName}</p>
) : null}
<p style={{margin:"4px 0"}}><strong>Trạng thái:</strong> {job.status}</p>
            </div>
          ))
        ) : (
          <p style={{color:"#666"}}>Chưa có kết quả phù hợp.</p>
        )}
      </div>

      <h2 style={{marginTop:40}}>
        {role === "admin" ? "3. Danh sách tin tuyển dụng" : "2. Danh sách tin tuyển dụng"}
      </h2>

      {jobs.length === 0 ? (
        <p>Chưa có tin tuyển dụng.</p>
      ) : (
        jobs.map(job => (
          <div
            key={job.id}
            style={{
              border:"1px solid #ccc",
              padding:12,
              marginBottom:12,
              borderRadius:8
            }}
          >
            <h3 style={{margin:"0 0 8px 0"}}>{job.title}</h3>
            <p style={{margin:"4px 0"}}><strong>Công ty:</strong> {job.company}</p>
            <p style={{margin:"4px 0"}}><strong>Địa điểm:</strong> {job.location}</p>
	    {job.fileName ? (
  <p style={{margin:"4px 0"}}><strong>File:</strong> {job.fileName}</p>
) : null}
            {role === "admin" && (
              <button onClick={()=>deleteJob(job.id)} style={{marginTop:8,padding:"8px 14px"}}>
                Xóa
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
>>>>>>> 4699bdc9cb3ce5c4fbe1e3a36aa000ad8fc3594d
}