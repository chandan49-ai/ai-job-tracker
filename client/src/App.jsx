import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL; 

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  

  
const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
const [jobs, setJobs] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [sortOrder, setSortOrder] = useState("newest");
const totalJobs = jobs.length;
const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
const interviewJobs = jobs.filter((job) => job.status === "Interview").length;
const offerJobs = jobs.filter((job) => job.status === "Offer").length;
const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length;
const pendingJobs = jobs.filter(
  (job) => job.status === "Applied"
).length;
const [showAddJob, setShowAddJob] = useState(false);
const [editingJobId, setEditingJobId] = useState(null);

const [jobForm, setJobForm] = useState({
  company: "",
  position: "",
  location: "",
  status: "Applied",
  jobUrl: "",
  notes: "",
  appliedDate: "",
});



const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/jobs`
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setJobs(data.jobs);
      console.log("Jobs:", data.jobs);
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error("Fetch jobs error:", error);
  }
};
const getStatusStyle = (status) => {
  switch (status) {
    case "Applied":
      return {
        background: "#e8f5e9",
        color: "#2e7d32",
      };

    case "Interview":
      return {
        background: "#e3f2fd",
        color: "#1565c0",
      };

    case "Offer":
      return {
        background: "#f3e5f5",
        color: "#7b1fa2",
      };

    case "Rejected":
      return {
        background: "#ffebee",
        color: "#c62828",
      };

    default:
      return {
        background: "#eeeeee",
        color: "#333",
      };
  }
};

const handleAddJob = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/jobs`
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobForm),
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Job added successfully! 🎉");

      setJobForm({
        company: "",
        position: "",
        location: "",
        status: "Applied",
        jobUrl: "",
        notes: "",
        appliedDate: "",
      });

      setShowAddJob(false);

      fetchJobs();
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    console.error("Add job error:", error);
    setMessage("Job add nahi ho pa raha");
  }
};

const handleDeleteJob = async (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) {
  return;
}
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/jobs/${jobId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Job deleted successfully! 🗑️");
      fetchJobs();
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    console.error("Delete job error:", error);
    setMessage("Job delete nahi ho pa raha");
  }
};
const handleUpdateJob = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/jobs/${editingJobId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobForm),
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Job updated successfully! ✏️");

      setEditingJobId(null);
 setShowAddJob(false);
      setJobForm({
        company: "",
        position: "",
        location: "",
        status: "Applied",
        jobUrl: "",
        notes: "",
        appliedDate: "",
      });

      fetchJobs();
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    console.error("Update job error:", error);
    setMessage("Job update nahi ho pa raha");
  }
};

useEffect(() => {
  if (isLoggedIn) {
    fetchJobs();
  }
}, [isLoggedIn]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

  if (data.success) {
  localStorage.setItem("token", data.token);
  setIsLoggedIn(true);
  setMessage("Login successful! 🎉");

  
} else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server se connect nahi ho pa raha");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
         setIsLoggedIn(true);
        setMessage("Registration successful! 🎉");
        console.log("Register response:", data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server se connect nahi ho pa raha");
    }
  };

  if (isLoggedIn) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.topBar}>
<h1
  style={{
    margin: 0,
    fontSize: "32px",
    lineHeight: "1.2",
    flex: 1,
    minWidth: 0,
  }}
>
  AI Job Tracker 🚀
</h1>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setShowLogin(true);
      setMessage("");
    }}
    style={styles.logoutButton}
  >
    Logout
  </button>
</div>



        <h2>Dashboard</h2>
      <div style={styles.statsContainer}>

  <div style={styles.statCard}>
    <h3>Total Jobs</h3>
    <p style={styles.statNumber}>{totalJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Applied</h3>
    <p style={styles.statNumber}>{appliedJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Interviews</h3>
    <p style={styles.statNumber}>{interviewJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Offers</h3>
    <p style={styles.statNumber}>{offerJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Rejected</h3>
    <p style={styles.statNumber}>{rejectedJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Pending</h3>
    <p style={styles.statNumber}>{pendingJobs}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Success Rate</h3>
    <p style={styles.statNumber}>
      {totalJobs === 0
        ? 0
        : Math.round(
            ((interviewJobs + offerJobs) / totalJobs) * 100
          )}%
    </p>
  </div>

</div>

        <p>Welcome to your Job Tracker!</p>
        <div style={styles.chartCard}>
  <h3>📊 Job Status Overview</h3>

  <div style={styles.chartRow}>
    <span>Applied</span>
    <div style={styles.chartBarBackground}>
      <div
        style={{
          ...styles.chartBar,
          width: `${totalJobs ? (appliedJobs / totalJobs) * 100 : 0}%`,
        }}
      />
    </div>
    <strong>{appliedJobs}</strong>
  </div>

  <div style={styles.chartRow}>
    <span>Interview</span>
    <div style={styles.chartBarBackground}>
      <div
        style={{
          ...styles.chartBar,
          width: `${totalJobs ? (interviewJobs / totalJobs) * 100 : 0}%`,
        }}
      />
    </div>
    <strong>{interviewJobs}</strong>
  </div>

  <div style={styles.chartRow}>
    <span>Offer</span>
    <div style={styles.chartBarBackground}>
      <div
        style={{
          ...styles.chartBar,
          width: `${totalJobs ? (offerJobs / totalJobs) * 100 : 0}%`,
        }}
      />
    </div>
    <strong>{offerJobs}</strong>
  </div>

  <div style={styles.chartRow}>
    <span>Rejected</span>
    <div style={styles.chartBarBackground}>
      <div
        style={{
          ...styles.chartBar,
          width: `${totalJobs ? (rejectedJobs / totalJobs) * 100 : 0}%`,
        }}
      />
    </div>
    <strong>{rejectedJobs}</strong>
  </div>
</div>

       
          <h3>My Jobs</h3>
          <div style={styles.filterContainer}>

    <input
      type="text"
      placeholder="🔍 Search company or position..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={styles.searchInput}
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={styles.select}
    >
      <option value="All">All Status</option>
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Offer">Offer</option>
      <option value="Rejected">Rejected</option>
    </select>
    <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    style={styles.select}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>

  </div>
          <button
    onClick={() => {
    setShowAddJob(!showAddJob);
    setEditingJobId(null);
    setMessage("");
  }}
    style={styles.button}
  >
    {showAddJob ? "Cancel" : "+ Add New Job"}
  </button>
  {showAddJob && (
    <div style={{ marginTop: "20px" }}>
      <h3>{editingJobId ? "Edit Job" : "Add New Job"}</h3>

      <input
        type="text"
        placeholder="Company"
        value={jobForm.company}
        onChange={(e) =>
          setJobForm({
            ...jobForm,
            company: e.target.value,
          })
        }
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Position"
        value={jobForm.position}
        onChange={(e) =>
          setJobForm({
            ...jobForm,
            position: e.target.value,
          })
        }
        style={styles.input}
    />

    <input
      type="text"
      placeholder="Location"
      value={jobForm.location}
      onChange={(e) =>
        setJobForm({
          ...jobForm,
          location: e.target.value,
        })
      }
      style={styles.input}
    />

    <select
      value={jobForm.status}
      onChange={(e) =>
        setJobForm({
          ...jobForm,
          status: e.target.value,
        })
      }
      style={styles.input}
    >
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Offer">Offer</option>
      <option value="Rejected">Rejected</option>
    </select>
    <input
  type="date"
  value={jobForm.appliedDate}
  onChange={(e) =>
    setJobForm({
      ...jobForm,
      appliedDate: e.target.value,
    })
  }
  style={styles.input}
/>

    <input
      type="text"
      placeholder="Job URL"
      value={jobForm.jobUrl}
      onChange={(e) =>
        setJobForm({
          ...jobForm,
          jobUrl: e.target.value,
        })
      }
      style={styles.input}
    />

    <textarea
      placeholder="Notes"
      value={jobForm.notes}
      onChange={(e) =>
        setJobForm({
          ...jobForm,
          notes: e.target.value,
        })
      }
      style={styles.input}
    />

    <button
  onClick={editingJobId ? handleUpdateJob : handleAddJob}
  style={styles.button}
>
  {editingJobId ? "Update Job" : "Add Job"}
</button>
{editingJobId && (
  <button
    onClick={() => {
      setEditingJobId(null);
      setShowAddJob(false);
      setJobForm({
        company: "",
        position: "",
        location: "",
        status: "Applied",
        jobUrl: "",
        notes: "",
        appliedDate: "",
      });
      setMessage("");
    }}
    style={{
      ...styles.button,
      background: "#777",
    }}
  >
    Cancel Edit
  </button>
)}
  </div>
)}

{jobs.length === 0 ? (
  <p>No jobs found.</p>
) : (
 jobs
  .filter((job) => {
    const matchesSearch =
      job.company
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.position
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortOrder === "newest"
      ? dateB - dateA
      : dateA - dateB;
  })
  .map((job) => (
    <div key={job._id} style={styles.jobCard}>

  <div style={styles.jobHeader}>
    <div>
      <h3 style={styles.companyName}>{job.company}</h3>
      <p style={styles.position}>{job.position}</p>
    </div>

    <select
  value={job.status}
  onChange={async (e) => {
    const newStatus = e.target.value;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${job._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Status updated! ✅");
        fetchJobs();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      setMessage("Status update nahi ho pa raha");
    }
  }}
 style={{
  ...styles.statusBadge,
  ...getStatusStyle(job.status),
  border: "none",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  padding: "7px 28px 7px 12px",
  fontSize: "12px",
  fontWeight: "700",
}}
>
  <option value="Applied">Applied</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>
  </div>

  <div style={styles.jobDetails}>

    <p>
      📍 <strong>Location:</strong> {job.location || "Not specified"}
    </p>

    {job.appliedDate && (
      <p>
        📅 <strong>Applied:</strong>{" "}
        {new Date(job.appliedDate).toLocaleDateString()}
      </p>
    )}

  </div>

  {job.notes && (
    <p style={styles.notes}>
      📝 {job.notes}
    </p>
  )}

  <div style={styles.jobActions}>

    {job.jobUrl && (
      <a
        href={
          job.jobUrl.startsWith("http")
            ? job.jobUrl
            : `https://${job.jobUrl}`
        }
        target="_blank"
        rel="noreferrer"
        style={styles.viewButton}
      >
        🔗 View Job
      </a>
    )}

    <button
      onClick={() => {
        setEditingJobId(job._id);
        setShowAddJob(true);

        setJobForm({
          company: job.company || "",
          position: job.position || "",
          location: job.location || "",
          status: job.status || "Applied",
          jobUrl: job.jobUrl || "",
          notes: job.notes || "",
          appliedDate: job.appliedDate
            ? job.appliedDate.slice(0, 10)
            : "",
        });
      }}
      style={styles.editButton}
    >
      ✏️ Edit
    </button>

    <button
      onClick={() => handleDeleteJob(job._id)}
      style={styles.deleteButton}
    >
      🗑️ Delete
    </button>

  </div>

</div>
  ))
)}

        
      </div>
    </div>
  );
}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>AI Job Tracker</h1>

        <p style={styles.subtitle}>
          Track your job applications easily
        </p>

        <div style={styles.tabs}>
          <button
            onClick={() => {
              setShowLogin(true);
              setMessage("");
            }}
            style={showLogin ? styles.activeTab : styles.tab}
          >
            Login
          </button>

          <button
            onClick={() => {
              setShowLogin(false);
              setMessage("");
            }}
            style={!showLogin ? styles.activeTab : styles.tab}
          >
            Register
          </button>
        </div>

        {showLogin ? (
          // LOGIN FORM
          <div>
            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={handleLogin}
              style={styles.button}
            >
              Login
            </button>

            <p>{message}</p>
          </div>
        ) : (
          // REGISTER FORM
          <div>
            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={handleRegister}
              style={styles.button}
            >
              Register
            </button>

            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
topBar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
  width: "100%",
  flexWrap: "wrap",
  boxSizing: "border-box",
},
logoutButton: {
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  background: "#d32f2f",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  flexShrink: 0,
},

card: {
  width: "800px",
  maxWidth: "calc(100% - 30px)",
  padding: "30px",
  boxSizing: "border-box",
  background: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 10px 35px rgba(0,0,0,0.10)",
  border: "1px solid #e8e8e8",
},

  subtitle: {
    color: "#666",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    background: "#eee",
    cursor: "pointer",
  },

  activeTab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#222",
    color: "white",
    cursor: "pointer",
  },

input: {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "15px",
  minHeight: "44px",
},

 button: {
  width: "100%",
  padding: "13px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#111827",
  color: "#ffffff",
  cursor: "pointer",
  marginBottom: "10px",
  fontSize: "15px",
  fontWeight: "600",
  letterSpacing: "0.2px",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
},

  statsContainer: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
  margin: "20px 0",
},

 statCard: {
  padding: "20px 15px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  boxSizing: "border-box",
},

  statNumber: {
  fontSize: "30px",
  fontWeight: "700",
  margin: "8px 0 0",
  color: "#222",
},

  filterContainer: {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
  width: "100%",
},
  chartCard: {
  marginTop: "20px",
  marginBottom: "25px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
},

chartRow: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
},

chartBarBackground: {
  flex: 1,
  height: "14px",
  background: "#e9ecef",
  borderRadius: "20px",
  overflow: "hidden",
  minWidth: 0,
},

chartBar: {
  height: "100%",
  background: "#222",
  borderRadius: "20px",
  transition: "width 0.4s ease",
},

 searchInput: {
  flex: 1,
  minWidth: "200px",
  padding: "12px 14px",
  border: "1px solid #dfe3e8",
  borderRadius: "10px",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
  background: "#fafafa",
},

select: {
  padding: "12px 14px",
  border: "1px solid #dfe3e8",
  borderRadius: "10px",
  background: "#ffffff",
  cursor: "pointer",
  boxSizing: "border-box",
  minHeight: "44px",
  fontSize: "14px",
  outline: "none",
},

  jobCard: {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "22px",
  marginBottom: "16px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  boxSizing: "border-box",
  width: "100%",
  overflow: "hidden",
  transition: "all 0.2s ease",
},

  jobHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  flexWrap: "wrap",
},

  companyName: {
    margin: "0 0 5px 0",
    fontSize: "20px",
  },

  position: {
    margin: 0,
    color: "#666",
    fontSize: "15px",
  },

  statusBadge: {
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "85px",
  boxSizing: "border-box",
},

  jobDetails: {
    marginTop: "15px",
    color: "#555",
  },

  notes: {
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    color: "#555",
  },

  jobActions: {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
  flexWrap: "wrap",
  width: "100%",
},

 viewButton: {
  padding: "10px 16px",
  background: "#111827",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  minWidth: "100px",
  textAlign: "center",
  boxSizing: "border-box",
},

editButton: {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "100px",
  textAlign: "center",
  boxSizing: "border-box",
  fontSize: "14px",
  fontWeight: "600",
},

deleteButton: {
  padding: "10px 16px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "100px",
  textAlign: "center",
  boxSizing: "border-box",
  fontSize: "14px",
  fontWeight: "600",
},
};
export default App;