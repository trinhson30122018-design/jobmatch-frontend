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
        </div>
      </div>

      {role === "admin" && (
        <>
          <h2>1. Thêm tin tuyển dụng</h2>

          <input
            placeholder="Vị trí"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            style={{display:"block",width:"100%",marginBottom:10,padding:10}}
          />

          <input
            placeholder="Công ty"
            value={company}
            onChange={e=>setCompany(e.target.value)}
            style={{display:"block",width:"100%",marginBottom:10,padding:10}}
          />

          <input
            placeholder="Địa điểm"
            value={location}
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
}