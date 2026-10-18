import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // --------------------------------------------------
  // CREATE PROJECT
  // --------------------------------------------------

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // --------------------------------------------------
  // EDIT PROJECT
  // --------------------------------------------------

  const [editingProject, setEditingProject] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);

  // --------------------------------------------------
  // SELECTED PROJECT
  // --------------------------------------------------

  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // --------------------------------------------------
  // TASKS
  // --------------------------------------------------

  const [myTasks, setMyTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskProject, setTaskProject] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");

  // --------------------------------------------------
  // COMMENTS
  // --------------------------------------------------

  const [taskComments, setTaskComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // --------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);

  // --------------------------------------------------
  // EDIT TASK
  // --------------------------------------------------

  const [editingTask, setEditingTask] = useState(null);
  const [showEditTask, setShowEditTask] = useState(false);

  // --------------------------------------------------
  // CREATE TASK
  // --------------------------------------------------

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  // --------------------------------------------------
  // DARK MODE
  // --------------------------------------------------

  const toggleDarkMode = () => {
    setDarkMode((previous) => {
      const newMode = !previous;

      localStorage.setItem("darkMode", newMode);

      return newMode;
    });
  };

  // --------------------------------------------------
  // FETCH PROJECTS
  // --------------------------------------------------

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/projects/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROJECT DATA:", response.data);

      setProjects(response.data);
    } catch (error) {
      console.error("PROJECT ERROR:", error);

      setMessage("Unable to load projects.");
    }
  };

  // --------------------------------------------------
  // FETCH TASK COMMENTS
  // --------------------------------------------------

  const fetchTaskComments = async (taskId) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/comments/?task=${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskComments(response.data);
    } catch (error) {
      console.error("COMMENTS ERROR:", error);

      setTaskComments([]);
    }
  };

  // --------------------------------------------------
  // FETCH NOTIFICATIONS
  // --------------------------------------------------

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("NOTIFICATIONS:", response.data);

      setNotifications(response.data);
    } catch (error) {
      console.error("NOTIFICATION ERROR:", error);
    }
  };

  // --------------------------------------------------
  // FETCH MY TASKS
  // --------------------------------------------------

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/tasks/?my_tasks=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY TASKS:", response.data);

      setMyTasks(response.data);
    } catch (error) {
      console.error("MY TASKS ERROR:", error);
    }
  };

  // --------------------------------------------------
  // MARK NOTIFICATION AS READ
  // --------------------------------------------------

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `http://127.0.0.1:8000/api/notifications/${notificationId}/`,
        {
          is_read: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("MARK NOTIFICATION ERROR:", error);
    }
  };

  // --------------------------------------------------
  // CONNECT WEBSOCKET
  // --------------------------------------------------

  const connectWebSocket = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    ws.onopen = () => {
      console.log("WEBSOCKET CONNECTED");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("REAL-TIME NOTIFICATION:", data);

      fetchNotifications();
    };

    ws.onclose = () => {
      console.log("WEBSOCKET DISCONNECTED");
    };

    ws.onerror = (error) => {
      console.error("WEBSOCKET ERROR:", error);
    };

    setSocket(ws);
  };

  // --------------------------------------------------
  // EDIT COMMENT
  // --------------------------------------------------

  const editComment = async (commentId, newContent) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/comments/${commentId}/`,
        {
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskComments((previousComments) =>
        previousComments.map((comment) =>
          comment.id === commentId
            ? response.data
            : comment
        )
      );

      setMessage("Comment updated successfully.");
    } catch (error) {
      console.error("EDIT COMMENT ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to edit comment."
      );
    }
  };

  // --------------------------------------------------
  // DELETE COMMENT
  // --------------------------------------------------

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `http://127.0.0.1:8000/api/comments/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskComments((previousComments) =>
        previousComments.filter(
          (comment) => comment.id !== commentId
        )
      );

      setMessage("Comment deleted successfully.");
    } catch (error) {
      console.error("DELETE COMMENT ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to delete comment."
      );
    }
  };

 
const addProjectMember = async (e) => {
  e.preventDefault();

  if (!selectedProject) {
    return;
  }

  if (!memberUsername.trim()) {
    setMessage("Enter a username.");
    return;
  }

  try {
    const token = localStorage.getItem("access_token");

    // Step 1: Find the user by username.
    const userResponse = await axios.get(
      "http://127.0.0.1:8000/api/users/",
      {
        params: {
          username: memberUsername.trim(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const matchingUser = userResponse.data.find(
      (user) =>
        user.username.toLowerCase() ===
        memberUsername.trim().toLowerCase()
    );

    if (!matchingUser) {
      setMessage("User not found. Check the username.");
      return;
    }

    // Step 2: Check whether this user is already a member.
    const alreadyMember = (
      selectedProject.members || []
    ).some(
      (member) => member.user === matchingUser.id
    );

    if (alreadyMember) {
      setMessage("This user is already a project member.");
      return;
    }

    // Step 3: Add the user using their ID.
    const response = await axios.post(
      "http://127.0.0.1:8000/api/projects/members/",
      {
        project: selectedProject.id,
        user: matchingUser.id,
        role: "member",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Step 4: Update the displayed project members.
    const newMember = {
      ...response.data,
      username: matchingUser.username,
    };

    setSelectedProject((previousProject) => ({
      ...previousProject,
      members: [
        ...(previousProject.members || []),
        newMember,
      ],
    }));

    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              members: [
                ...(project.members || []),
                newMember,
              ],
            }
          : project
      )
    );

    setMemberUsername("");
    setShowAddMember(false);
    setMessage("Member added successfully.");


  } catch (error) {
    console.error(
      "ADD MEMBER ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );

    const errorData = error.response?.data;

    setMessage(
      errorData?.detail ||
      errorData?.non_field_errors?.[0] ||
      errorData?.user?.[0] ||
      errorData?.project?.[0] ||
      JSON.stringify(errorData) ||
      error.message ||
      "Unable to add member."
    );
  }
};



  // --------------------------------------------------
  // FETCH PROJECT TASKS
  // --------------------------------------------------

  const fetchProjectTasks = async (projectId) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/tasks/?project=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedProject((previousProject) => ({
        ...previousProject,
        tasks: response.data,
      }));
    } catch (error) {
      console.error("TASK ERROR:", error);
    }
  };

  // --------------------------------------------------
  // DRAG START
  // --------------------------------------------------

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // --------------------------------------------------
  // DRAG DROP
  // --------------------------------------------------

  const handleDrop = async (newStatus) => {
    if (!draggedTask) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${draggedTask.id}/`,
        {
          project: draggedTask.project,
          title: draggedTask.title,
          description: draggedTask.description,
          assigned_to: draggedTask.assigned_to,
          status: newStatus,
          priority: draggedTask.priority,
          due_date: draggedTask.due_date || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDraggedTask(null);

      if (selectedProject) {
        fetchProjectTasks(selectedProject.id);
      }

      setMessage("Task status updated successfully.");
    } catch (error) {
      console.error("DRAG AND DROP ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to update task status."
      );
    }
  };

  // --------------------------------------------------
  // DELETE TASK
  // --------------------------------------------------

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `http://127.0.0.1:8000/api/tasks/${taskId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (selectedProject) {
        fetchProjectTasks(selectedProject.id);
      }

      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setTaskComments([]);
      }

      setMessage("Task deleted successfully.");
    } catch (error) {
      console.error("DELETE TASK ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to delete task."
      );
    }
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      setLoggedIn(true);

      fetchNotifications();
      connectWebSocket();

      setMessage("");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage("Invalid username or password.");
    }
  };

  // --------------------------------------------------
  // CREATE PROJECT
  // --------------------------------------------------

  const createProject = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/projects/",
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((previousProjects) => [
        ...previousProjects,
        response.data,
      ]);

      setProjectName("");
      setProjectDescription("");
      setShowCreateProject(false);

      setMessage("Project created successfully.");
    } catch (error) {
      console.error("CREATE PROJECT ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to create project."
      );
    }
  };

  // --------------------------------------------------
  // EDIT PROJECT
  // --------------------------------------------------

  const updateProject = async () => {
    if (!editingProject) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `http://127.0.0.1:8000/api/projects/${editingProject.id}/`,
        {
          name: editingProject.name,
          description: editingProject.description || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                ...response.data,
              }
            : project
        )
      );

      setSelectedProject((previousProject) =>
        previousProject &&
        previousProject.id === editingProject.id
          ? {
              ...previousProject,
              ...response.data,
            }
          : previousProject
      );

      setShowEditProject(false);
      setEditingProject(null);

      setMessage("Project updated successfully.");
    } catch (error) {
      console.error("UPDATE PROJECT ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to update project."
      );
    }
  };

  // --------------------------------------------------
  // DELETE PROJECT
  // --------------------------------------------------

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) => project.id !== projectId
        )
      );

      setSelectedProject(null);
      setTaskComments([]);
      setSelectedTask(null);
      setCurrentPage("projects");

      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error("DELETE PROJECT ERROR:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to delete project."
      );
    }
  };

  // --------------------------------------------------
  // CREATE TASK
  // --------------------------------------------------

  const createTask = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      setMessage("No project selected.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks/",
        {
          project: selectedProject.id,
          title: taskTitle,
          description: taskDescription,
          assigned_to: taskAssignedTo
            ? Number(taskAssignedTo)
            : null,
          status: taskStatus,
          priority: taskPriority,
          due_date: taskDueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedProject((previousProject) => ({
        ...previousProject,
        tasks: [
          ...(previousProject.tasks || []),
          response.data,
        ],
      }));

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("todo");
      setTaskPriority("medium");
      setTaskAssignedTo("");
      setTaskDueDate("");

      setShowCreateTask(false);

      setMessage("Task created successfully.");
    } catch (error) {
      console.error("CREATE TASK ERROR:", error);

      if (error.response) {
        console.error(
          "SERVER STATUS:",
          error.response.status
        );

        console.error(
          "SERVER RESPONSE:",
          error.response.data
        );

        setMessage(
          error.response.data?.detail ||
            "Unable to create task."
        );
      } else {
        setMessage(
          "Unable to connect to the backend."
        );
      }
    }
  };

  // --------------------------------------------------
  // CHECK LOGIN
  // --------------------------------------------------

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setLoggedIn(true);
    }
  }, []);

  // --------------------------------------------------
  // FETCH PROJECTS WHEN LOGGED IN
  // --------------------------------------------------

  useEffect(() => {
    if (loggedIn) {
      fetchProjects();
    }
  }, [loggedIn]);

  // --------------------------------------------------
  // FETCH MY TASKS
  // --------------------------------------------------

  useEffect(() => {
    if (
      loggedIn &&
      currentPage === "myTasks"
    ) {
      fetchMyTasks();
    }
  }, [loggedIn, currentPage]);

  // --------------------------------------------------
  // LOGIN PAGE
  // --------------------------------------------------

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-brand">

            <div className="login-logo">
              PM
            </div>

            <div>
              <h1>ProjectFlow</h1>
              <p>Project Management Tool</p>
            </div>

          </div>

          <div className="login-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to manage your projects,
              tasks and team.
            </p>

          </div>

          <form onSubmit={login}>

            <div className="form-group">

              <label>Username</label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter your username"
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>

            {message && (
              <p className="error-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>

          <div className="login-footer">
            <span>Collaborate.</span>
            <span>Organize.</span>
            <span>Complete.</span>
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN APPLICATION
  // --------------------------------------------------

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app"
      }
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="navbar">

        <div className="navbar-left">
          <h2>Project Manager</h2>
        </div>

        {/* NOTIFICATIONS */}

        <div className="notification-wrapper">

          <button
            className="notification-button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            title="Notifications"
          >
            🔔

            {notifications.filter(
              (notification) =>
                !notification.is_read
            ).length > 0 && (

              <span className="notification-badge">

                {
                  notifications.filter(
                    (notification) =>
                      !notification.is_read
                  ).length
                }

              </span>

            )}

          </button>

          {showNotifications && (

            <div className="notification-dropdown">

              <div className="notification-header">
                <h3>Notifications</h3>
              </div>

              {notifications.length === 0 ? (

                <div className="no-notifications">
                  No notifications
                </div>

              ) : (

                <div className="notification-list">

                  {notifications.map(
                    (notification) => (

                      <div
                        className={
                          notification.is_read
                            ? "notification-item"
                            : "notification-item unread"
                        }
                        key={notification.id}
                        onClick={() =>
                          markNotificationAsRead(
                            notification.id
                          )
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >

                        <div className="notification-icon">
                          🔔
                        </div>

                        <div className="notification-content">

                          <p>
                            {notification.message}
                          </p>

                          <span>
                            {new Date(
                              notification.created_at
                            ).toLocaleString()}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )}

        </div>

        <div className="navbar-right">

          <button
            className="theme-button"
            onClick={toggleDarkMode}
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <span className="user-name">
            {username}
          </span>

          <button
            className="logout-button"
            onClick={() => {

              if (socket) {
                socket.close();
                setSocket(null);
              }

              localStorage.removeItem(
                "access_token"
              );

              localStorage.removeItem(
                "refresh_token"
              );

              setLoggedIn(false);
              setUsername("");
              setPassword("");
              setProjects([]);
              setSelectedProject(null);
              setSelectedTask(null);
              setTaskComments([]);
              setCurrentPage("dashboard");

            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ==================================================
          MAIN LAYOUT
      ================================================== */}

      <div className="main-layout">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="sidebar">

          <button
            className={
              currentPage === "dashboard"
                ? "sidebar-button active"
                : "sidebar-button"
            }
            onClick={() => {
              setCurrentPage("dashboard");
              setSelectedProject(null);
            }}
          >
            🏠 Dashboard
          </button>

          <button
            className="sidebar-button"
            onClick={() => {
              setSelectedProject(null);
              setCurrentPage("myTasks");
            }}
          >
            📋 My Tasks
          </button>

          <button
            className={
              currentPage === "projects"
                ? "sidebar-button active"
                : "sidebar-button"
            }
            onClick={() => {
              setCurrentPage("projects");
              setSelectedProject(null);
            }}
          >
            📁 My Projects
          </button>

          <button
            className={
              currentPage === "team"
                ? "sidebar-button active"
                : "sidebar-button"
            }
            onClick={() => {
              setCurrentPage("team");
              setSelectedProject(null);
            }}
          >
            👥 Team
          </button>

          <button
            className={
              currentPage === "settings"
                ? "sidebar-button active"
                : "sidebar-button"
            }
            onClick={() => {
              setCurrentPage("settings");
              setSelectedProject(null);
            }}
          >
            ⚙️ Settings
          </button>

        </aside>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <main className="main-content">

          {/* ==================================================
              SELECTED PROJECT
          ================================================== */}

          {selectedProject ? (

            <div className="project-details-page">

              {/* BACK BUTTON */}

              <button
                className="back-button"
                onClick={() => {
                  setSelectedProject(null);
                  setCurrentPage("projects");
                }}
              >
                ← Back to Projects
              </button>

              {/* PROJECT HEADER */}

              <div className="project-details-header">

                <div>

                  <h1>
                    {selectedProject.name}
                  </h1>

                  <p>
                    {selectedProject.description ||
                      "No description provided."}
                  </p>

                </div>

                <div className="project-header-actions">

                  {/* ADMIN ONLY */}

                  {selectedProject.members?.some(
                    (member) =>
                      member.username === username &&
                      member.role === "admin"
                  ) && (

                    <>
                      <button
                        type="button"
                        className="edit-project-button"
                        onClick={() => {
                          setEditingProject({
                            id: selectedProject.id,
                            name:
                              selectedProject.name,
                            description:
                              selectedProject.description ||
                              "",
                          });

                          setShowEditProject(true);
                        }}
                      >
                        ✏️ Edit Project
                      </button>

                      <button
                        type="button"
                        className="delete-project-button"
                        onClick={() =>
                          deleteProject(
                            selectedProject.id
                          )
                        }
                      >
                        🗑️ Delete Project
                      </button>
                    </>

                  )}

                  <button
                    className="add-task-button"
                    onClick={() =>
                      setShowCreateTask(true)
                    }
                  >
                    + Add Task
                  </button>

                </div>

              </div>

              {/* PROJECT INFORMATION */}

              <div className="project-details-info">

                <div className="info-card">

                  <h3>Created By</h3>

                  <p>
                    {selectedProject.created_by_username}
                  </p>

                </div>

                <div className="info-card">

                  <h3>Members</h3>

                  <p>
                    {selectedProject.members?.length ||
                      0}
                  </p>

                </div>

                <div className="info-card">

                  <h3>Tasks</h3>

                  <p>
                    {selectedProject.tasks?.length ||
                      0}
                  </p>

                </div>

              </div>

              {/* ==================================================
                  MEMBERS
              ================================================== */}

              <section className="project-section">

                
<div className="section-header">
  <h2>Project Members</h2>

  {selectedProject.members?.some(
    (member) =>
      member.username === username &&
      member.role === "admin"
  ) && (
    <button
      type="button"
      onClick={() => setShowAddMember(!showAddMember)}
    >
      + Add Member
    </button>
  )}
</div>

{showAddMember && (
  <form onSubmit={addProjectMember}>
    <input
      type="text"
      value={memberUsername}
      onChange={(e) => setMemberUsername(e.target.value)}
      placeholder="Enter username (e.g. member1)"
      required
    />

    <button type="submit">
      Add Member
    </button>
  </form>
)}


                <div className="members-list">

                  {selectedProject.members &&
                  selectedProject.members.length > 0 ? (

                    selectedProject.members.map(
                      (member) => (

                        <div
                          className="member-card"
                          key={member.id}
                        >

                          <div className="member-avatar">

                            {member.username
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <div>

                            <h3>
                              {member.username}
                            </h3>

                            <p>
                              {member.role}
                            </p>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <p>No members found.</p>

                  )}

                </div>

              </section>

              {/* ==================================================
                  TASKS / KANBAN
              ================================================== */}

              <section className="project-section">

                <div className="section-header">
                  <h2>Tasks</h2>
                </div>

                <div className="kanban-board">

                  {/* TO DO */}

                  <div
                    className="kanban-column"
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={() =>
                      handleDrop("todo")
                    }
                  >

                    <h3>To Do</h3>

                    {(selectedProject.tasks || [])
                      .filter(
                        (task) =>
                          task.status === "todo"
                      )
                      .map((task) => (

                        <div
                          className="task-card"
                          key={task.id}
                          draggable={true}
                          onDragStart={() =>
                            handleDragStart(task)
                          }
                          onClick={() => {
                            setTaskProject(
                              selectedProject
                            );

                            setSelectedTask(task);

                            fetchTaskComments(
                              task.id
                            );
                          }}
                          style={{
                            cursor: "grab",
                          }}
                        >

                          <h4>
                            {task.title}
                          </h4>

                          <p>
                            {task.description ||
                              "No description"}
                          </p>

                          <div className="task-card-actions">

                            <button
                              type="button"
                              className="edit-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                setEditingTask(task);
                                setShowEditTask(true);

                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this task?"
                                  )
                                ) {
                                  deleteTask(
                                    task.id
                                  );
                                }

                              }}
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      ))}

                  </div>

                  {/* IN PROGRESS */}

                  <div
                    className="kanban-column"
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={() =>
                      handleDrop("in_progress")
                    }
                  >

                    <h3>In Progress</h3>

                    {(selectedProject.tasks || [])
                      .filter(
                        (task) =>
                          task.status ===
                          "in_progress"
                      )
                      .map((task) => (

                        <div
                          className="task-card"
                          key={task.id}
                          draggable={true}
                          onDragStart={() =>
                            handleDragStart(task)
                          }
                          onClick={() => {

                            setTaskProject(
                              selectedProject
                            );

                            setSelectedTask(task);

                            fetchTaskComments(
                              task.id
                            );

                          }}
                          style={{
                            cursor: "grab",
                          }}
                        >

                          <h4>
                            {task.title}
                          </h4>

                          <p>
                            {task.description ||
                              "No description"}
                          </p>

                          <div className="task-card-actions">

                            <button
                              type="button"
                              className="edit-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                setEditingTask(task);
                                setShowEditTask(true);

                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this task?"
                                  )
                                ) {
                                  deleteTask(
                                    task.id
                                  );
                                }

                              }}
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      ))}

                  </div>

                  {/* DONE */}

                  <div
                    className="kanban-column"
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={() =>
                      handleDrop("done")
                    }
                  >

                    <h3>Done</h3>

                    {(selectedProject.tasks || [])
                      .filter(
                        (task) =>
                          task.status === "done"
                      )
                      .map((task) => (

                        <div
                          className="task-card"
                          key={task.id}
                          draggable={true}
                          onDragStart={() =>
                            handleDragStart(task)
                          }
                          onClick={() => {

                            setTaskProject(
                              selectedProject
                            );

                            setSelectedTask(task);

                            fetchTaskComments(
                              task.id
                            );

                          }}
                          style={{
                            cursor: "grab",
                          }}
                        >

                          <h4>
                            {task.title}
                          </h4>

                          <p>
                            {task.description ||
                              "No description"}
                          </p>

                          <div className="task-card-actions">

                            <button
                              type="button"
                              className="edit-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                setEditingTask(task);
                                setShowEditTask(true);

                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-task-button"
                              onClick={(event) => {

                                event.stopPropagation();

                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this task?"
                                  )
                                ) {
                                  deleteTask(
                                    task.id
                                  );
                                }

                              }}
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      ))}

                  </div>

                </div>

              </section>

            </div>

          ) : null}

          {/* ==================================================
              DASHBOARD PAGE
          ================================================== */}

          {currentPage === "dashboard" &&
            !selectedProject && (

              <div className="dashboard-page">

                <div className="page-header">

                  <div>

                    <h1>Dashboard</h1>

                    <p>
                      Welcome back, {username}!
                      Here's an overview of
                      your projects.
                    </p>

                  </div>

                  <button
                    className="create-project-button"
                    onClick={() =>
                      setShowCreateProject(true)
                    }
                  >
                    + Create Project
                  </button>

                </div>

                {/* STATISTICS */}

                <div className="stats-grid">

                  <div className="stat-card">

                    <div className="stat-icon">
                      📁
                    </div>

                    <div>

                      <h3>
                        Total Projects
                      </h3>

                      <p>
                        {projects.length}
                      </p>

                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon">
                      👥
                    </div>

                    <div>

                      <h3>
                        Total Members
                      </h3>

                      <p>
                        {
                          new Set(
                            projects.flatMap(
                              (project) =>
                                project.members?.map(
                                  (member) =>
                                    member.user
                                ) || []
                            )
                          ).size
                        }
                      </p>

                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon">
                      ✅
                    </div>

                    <div>

                      <h3>
                        Total Tasks
                      </h3>

                      <p>
                        {projects.reduce(
                          (total, project) =>
                            total +
                            (project.tasks
                              ?.length || 0),
                          0
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon">
                      🚀
                    </div>

                    <div>

                      <h3>
                        Active Projects
                      </h3>

                      <p>
                        {projects.length}
                      </p>

                    </div>

                  </div>

                </div>

                {/* RECENT PROJECTS */}

                <section className="projects-section">

                  <div className="section-header">

                    <div>

                      <h2>
                        My Projects
                      </h2>

                      <p>
                        Projects you are
                        currently working on
                      </p>

                    </div>

                    <button
                      className="view-all-button"
                      onClick={() =>
                        setCurrentPage(
                          "projects"
                        )
                      }
                    >
                      View All
                    </button>

                  </div>

                  {projects.length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        📁
                      </div>

                      <h3>
                        No projects yet
                      </h3>

                      <p>
                        Create your first
                        project to get started.
                      </p>

                      <button
                        className="create-project-button"
                        onClick={() =>
                          setShowCreateProject(
                            true
                          )
                        }
                      >
                        + Create Project
                      </button>

                    </div>

                  ) : (

                    <div className="projects-grid">

                      {projects.map(
                        (project) => (

                          <div
                            className="project-card"
                            key={project.id}
                          >

                            <div className="project-card-header">

                              <div className="project-icon">
                                📁
                              </div>

                              <span className="project-status">
                                Active
                              </span>

                            </div>

                            <h3>
                              {project.name}
                            </h3>

                            <p>
                              {project.description ||
                                "No description provided."}
                            </p>

                            <div className="project-card-info">

                              <span>
                                👥{" "}
                                {project.members
                                  ?.length || 0}{" "}
                                members
                              </span>

                              <span>
                                ✅{" "}
                                {project.tasks
                                  ?.length || 0}{" "}
                                tasks
                              </span>

                            </div>

                            <button
                              className="view-button"
                              onClick={() => {

                                console.log(
                                  "OPENED PROJECT MEMBERS:",
                                  project.members
                                );

                                setSelectedProject(
                                  project
                                );

                                fetchProjectTasks(
                                  project.id
                                );

                              }}
                            >
                              View Project
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>

              </div>

            )}

          {/* ==================================================
              MY TASKS PAGE
          ================================================== */}

          {currentPage === "myTasks" &&
            !selectedProject && (

              <div className="my-tasks-page">

                <div className="page-header">

                  <div>

                    <h1>
                      My Tasks
                    </h1>

                    <p>
                      Tasks assigned to you
                      across your projects.
                    </p>

                  </div>

                </div>

                <div className="my-tasks-list">

                  {myTasks.length === 0 ? (

                    <div className="empty-state">

                      <h3>
                        No tasks assigned to you
                      </h3>

                      <p>
                        Tasks assigned to you
                        will appear here.
                      </p>

                    </div>

                  ) : (

                    myTasks.map(
                      (task) => (

                        <div
                          className="my-task-card"
                          key={task.id}
                          onClick={() => {

                            setSelectedTask(
                              task
                            );

                            setTaskProject(
                              projects.find(
                                (project) =>
                                  project.id ===
                                  task.project
                              )
                            );

                            fetchTaskComments(
                              task.id
                            );

                          }}
                        >

                          <div className="my-task-info">

                            <h3>
                              {task.title}
                            </h3>

                            <p>
                              {task.description ||
                                "No description provided."}
                            </p>

                          </div>

                          <div className="my-task-details">

                            <span>
                              Status:{" "}
                              {task.status}
                            </span>

                            <span>
                              Priority:{" "}
                              {task.priority}
                            </span>

                            {task.due_date && (

                              <span>
                                Due:{" "}
                                {task.due_date}
                              </span>

                            )}

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            )}

          {/* ==================================================
              MY PROJECTS PAGE
          ================================================== */}

          {currentPage === "projects" &&
            !selectedProject && (

              <div className="projects-page">

                <div className="page-header">

                  <div>

                    <h1>
                      My Projects
                    </h1>

                    <p>
                      Manage all your projects
                      from one place.
                    </p>

                  </div>

                  <button
                    className="create-project-button"
                    onClick={() =>
                      setShowCreateProject(
                        true
                      )
                    }
                  >
                    + Create Project
                  </button>

                </div>

                {projects.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon">
                      📁
                    </div>

                    <h3>
                      No projects found
                    </h3>

                    <p>
                      Create a project to get
                      started.
                    </p>

                    <button
                      className="create-project-button"
                      onClick={() =>
                        setShowCreateProject(
                          true
                        )
                      }
                    >
                      + Create Project
                    </button>

                  </div>

                ) : (

                  <div className="projects-grid">

                    {projects.map(
                      (project) => (

                        <div
                          className="project-card"
                          key={project.id}
                        >

                          <div className="project-card-header">

                            <div className="project-icon">
                              📁
                            </div>

                            <span className="project-status">
                              Active
                            </span>

                          </div>

                          <h3>
                            {project.name}
                          </h3>

                          <p>
                            {project.description ||
                              "No description provided."}
                          </p>

                          <div className="project-card-info">

                            <span>
                              👥{" "}
                              {project.members
                                ?.length || 0}{" "}
                              members
                            </span>

                            <span>
                              ✅{" "}
                              {project.tasks
                                ?.length || 0}{" "}
                              tasks
                            </span>

                          </div>

                          <button
                            className="view-button"
                            onClick={() => {

                              console.log(
                                "OPENED PROJECT MEMBERS:",
                                project.members
                              );

                              setSelectedProject(
                                project
                              );

                              fetchProjectTasks(
                                project.id
                              );

                            }}
                          >
                            View Project
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          {/* ==================================================
              OLD TASKS PAGE
          ================================================== */}

          {currentPage === "tasks" &&
            !selectedProject && (

              <div className="tasks-page">

                <div className="page-header">

                  <div>

                    <h1>
                      My Tasks
                    </h1>

                    <p>
                      Tasks assigned to you
                      across your projects.
                    </p>

                  </div>

                </div>

                <div className="task-page-grid">

                  {projects.flatMap(
                    (project) =>
                      (project.tasks || []).filter(
                        (task) =>
                          task.assigned_to_username ===
                          username
                      )
                  ).length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        ✅
                      </div>

                      <h3>
                        No tasks assigned
                      </h3>

                      <p>
                        You currently don't
                        have any assigned tasks.
                      </p>

                    </div>

                  ) : (

                    projects.flatMap(
                      (project) =>
                        (project.tasks || [])
                          .filter(
                            (task) =>
                              task.assigned_to_username ===
                              username
                          )
                          .map(
                            (task) => (

                              <div
                                className="task-page-card"
                                key={task.id}
                              >

                                <div className="task-card-top">

                                  <span
                                    className={`priority ${task.priority}`}
                                  >
                                    {task.priority}
                                  </span>

                                  <span
                                    className={`task-status ${task.status}`}
                                  >
                                    {task.status ===
                                    "todo"
                                      ? "To Do"
                                      : task.status ===
                                        "in_progress"
                                      ? "In Progress"
                                      : "Done"}
                                  </span>

                                </div>

                                <h3>
                                  {task.title}
                                </h3>

                                <p>
                                  {task.description ||
                                    "No description provided."}
                                </p>

                                <div className="task-card-footer">

                                  <span>
                                    📁{" "}
                                    {projects.find(
                                      (project) =>
                                        project.tasks?.some(
                                          (item) =>
                                            item.id ===
                                            task.id
                                        )
                                    )?.name ||
                                      "Project"}
                                  </span>

                                  {task.due_date && (

                                    <span>
                                      📅{" "}
                                      {task.due_date}
                                    </span>

                                  )}

                                </div>

                              </div>

                            )
                          )
                    )

                  )}

                </div>

              </div>

            )}

          {/* ==================================================
              TEAM PAGE
          ================================================== */}

          {currentPage === "team" &&
            !selectedProject && (

              <div className="team-page">

                <div className="page-header">

                  <div>

                    <h1>
                      Team
                    </h1>

                    <p>
                      Members across your
                      projects.
                    </p>

                  </div>

                </div>

                <div className="team-grid">

                  {projects.flatMap(
                    (project) =>
                      project.members || []
                  ).length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        👥
                      </div>

                      <h3>
                        No team members
                      </h3>

                      <p>
                        Your project team
                        members will appear
                        here.
                      </p>

                    </div>

                  ) : (

                    projects.flatMap(
                      (project) =>
                        project.members || []
                    ).map(
                      (member) => (

                        <div
                          className="team-member-card"
                          key={member.id}
                        >

                          <div className="team-avatar">

                            {member.username
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <h3>
                            {member.username}
                          </h3>

                          <p className="team-member-role">
                            {member.role}
                          </p>

                          <p className="team-member-project">
                            📁{" "}
                            {member.project_name}
                          </p>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            )}

          {/* ==================================================
              SETTINGS PAGE
          ================================================== */}

          {currentPage === "settings" &&
            !selectedProject && (

              <div className="settings-page">

                <div className="page-header">

                  <div>

                    <h1>
                      Settings
                    </h1>

                    <p>
                      Manage your application
                      preferences.
                    </p>

                  </div>

                </div>

                <div className="settings-section">

                  <div className="settings-card">

                    <h2>
                      Appearance
                    </h2>

                    <p>
                      Change the appearance of
                      your project management
                      tool.
                    </p>

                    <div className="settings-row">

                      <div>

                        <h3>
                          Dark Mode
                        </h3>

                        <p>
                          Use a darker interface
                          for comfortable viewing.
                        </p>

                      </div>

                      <button
                        className="theme-button"
                        onClick={
                          toggleDarkMode
                        }
                      >
                        {darkMode
                          ? "☀️"
                          : "🌙"}
                      </button>

                    </div>

                  </div>

                  <div className="settings-card">

                    <h2>
                      Account
                    </h2>

                    <div className="settings-row">

                      <div>

                        <h3>
                          Username
                        </h3>

                        <p>
                          {username}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )}

          {/* ==================================================
              TASK DETAILS
          ================================================== */}

          {selectedTask && (

            <div className="task-details-page">

              <button
                className="back-button"
                onClick={() => {

                  setSelectedTask(null);
                  setSelectedProject(
                    taskProject
                  );
                  setTaskComments([]);
                  setCommentText("");

                }}
              >
                ← Back to Project
              </button>

              <div className="task-details-header">

                <div>

                  <h1>
                    {selectedTask.title}
                  </h1>

                  <p>
                    {selectedTask.description ||
                      "No description provided."}
                  </p>

                </div>

                <span
                  className={`task-status ${selectedTask.status}`}
                >
                  {selectedTask.status ===
                  "todo"
                    ? "To Do"
                    : selectedTask.status ===
                      "in_progress"
                    ? "In Progress"
                    : "Done"}
                </span>

              </div>

              {/* TASK INFORMATION */}

              <div className="task-details-info">

                <div className="info-card">

                  <h3>
                    Priority
                  </h3>

                  <span
                    className={`priority ${selectedTask.priority}`}
                  >
                    {selectedTask.priority}
                  </span>

                </div>

                <div className="info-card">

                  <h3>
                    Assigned To
                  </h3>

                  <p>
                    {selectedTask.assigned_to_username ||
                      "Unassigned"}
                  </p>

                </div>

                <div className="info-card">

                  <h3>
                    Due Date
                  </h3>

                  <p>
                    {selectedTask.due_date ||
                      "No due date"}
                  </p>

                </div>

              </div>

              {/* COMMENTS */}

              <section className="comments-section">

                <div className="section-header">

                  <div>

                    <h2>
                      Comments
                    </h2>

                    <p>
                      Discuss this task with
                      your team.
                    </p>

                  </div>

                </div>

                {/* EXISTING COMMENTS */}

                <div className="comments-list">

                  {taskComments.length === 0 ? (

                    <div className="empty-comments">

                      <div className="empty-icon">
                        💬
                      </div>

                      <h3>
                        No comments yet
                      </h3>

                      <p>
                        Be the first to
                        comment on this task.
                      </p>

                    </div>

                  ) : (

                    taskComments.map(
                      (comment) => (

                        <div
                          className="comment-card"
                          key={comment.id}
                        >

                          <div className="comment-avatar">

                            {comment.username
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <div className="comment-content">

                            <div className="comment-header">

                              <strong>
                                {comment.username}
                              </strong>

                              <span>
                                {new Date(
                                  comment.created_at
                                ).toLocaleString()}
                              </span>

                            </div>

                            <p>
                              {comment.content}
                            </p>

                            {comment.username ===
                              username && (

                              <div className="comment-actions">

                                <button
                                  type="button"
                                  onClick={() => {

                                    const newContent =
                                      window.prompt(
                                        "Edit your comment:",
                                        comment.content
                                      );

                                    if (
                                      newContent &&
                                      newContent.trim() !==
                                        ""
                                    ) {

                                      editComment(
                                        comment.id,
                                        newContent.trim()
                                      );

                                    }

                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteComment(
                                      comment.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            )}

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

                {/* ADD COMMENT */}

                <form
                  className="comment-form"
                  onSubmit={async (e) => {

                    e.preventDefault();

                    if (!commentText.trim()) {
                      return;
                    }

                    try {

                      const token =
                        localStorage.getItem(
                          "access_token"
                        );

                      const response =
                        await axios.post(
                          "http://127.0.0.1:8000/api/comments/",
                          {
                            task:
                              selectedTask.id,
                            content:
                              commentText.trim(),
                          },
                          {
                            headers: {
                              Authorization:
                                `Bearer ${token}`,
                            },
                          }
                        );

                      setTaskComments(
                        (previousComments) => [
                          ...previousComments,
                          response.data,
                        ]
                      );

                      setCommentText("");

                    } catch (error) {

                      console.error(
                        "CREATE COMMENT ERROR:",
                        error
                      );

                      setMessage(
                        error.response?.data
                          ?.detail ||
                          "Unable to add comment."
                      );

                    }

                  }}
                >

                  <textarea
                    value={commentText}
                    onChange={(e) =>
                      setCommentText(
                        e.target.value
                      )
                    }
                    placeholder="Write a comment..."
                    rows="4"
                  />

                  <div className="comment-form-actions">

                    <button
                      type="submit"
                      className="submit-button"
                    >
                      Add Comment
                    </button>

                  </div>

                </form>

              </section>

            </div>

          )}

          {/* ==================================================
              EDIT TASK MODAL
          ================================================== */}

          {showEditTask &&
            editingTask && (

              <div className="modal-overlay">

                <div className="modal">

                  <div className="modal-header">

                    <h2>
                      Edit Task
                    </h2>

                    <button
                      className="close-button"
                      onClick={() => {

                        setShowEditTask(
                          false
                        );

                        setEditingTask(
                          null
                        );

                      }}
                    >
                      ✕
                    </button>

                  </div>

                  <div className="form-group">

                    <label>
                      Task Title
                    </label>

                    <input
                      type="text"
                      value={
                        editingTask.title
                      }
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Description
                    </label>

                    <textarea
                      value={
                        editingTask.description ||
                        ""
                      }
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description:
                            e.target.value,
                        })
                      }
                      rows="4"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      value={
                        editingTask.status
                      }
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          status:
                            e.target.value,
                        })
                      }
                    >

                      <option value="todo">
                        To Do
                      </option>

                      <option value="in_progress">
                        In Progress
                      </option>

                      <option value="done">
                        Done
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Priority
                    </label>

                    <select
                      value={
                        editingTask.priority
                      }
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          priority:
                            e.target.value,
                        })
                      }
                    >

                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={
                        editingTask.due_date ||
                        ""
                      }
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          due_date:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="modal-actions">

                    <button
                      className="cancel-button"
                      onClick={() => {

                        setShowEditTask(
                          false
                        );

                        setEditingTask(
                          null
                        );

                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="submit-button"
                      onClick={async () => {

                        try {

                          const token =
                            localStorage.getItem(
                              "access_token"
                            );

                          const response =
                            await axios.put(
                              `http://127.0.0.1:8000/api/tasks/${editingTask.id}/`,
                              {
                                project:
                                  editingTask.project,
                                title:
                                  editingTask.title,
                                description:
                                  editingTask.description,
                                assigned_to:
                                  editingTask.assigned_to,
                                status:
                                  editingTask.status,
                                priority:
                                  editingTask.priority,
                                due_date:
                                  editingTask.due_date ||
                                  null,
                              },
                              {
                                headers: {
                                  Authorization:
                                    `Bearer ${token}`,
                                },
                              }
                            );

                          setSelectedTask(
                            response.data
                          );

                          setShowEditTask(
                            false
                          );

                          setEditingTask(
                            null
                          );

                          if (
                            selectedProject
                          ) {
                            fetchProjectTasks(
                              selectedProject.id
                            );
                          }

                          setMessage(
                            "Task updated successfully."
                          );

                        } catch (error) {

                          console.error(
                            "UPDATE TASK ERROR:",
                            error
                          );

                          setMessage(
                            error.response?.data
                              ?.detail ||
                              "Unable to update task."
                          );

                        }

                      }}
                    >
                      Save Changes
                    </button>

                  </div>

                </div>

              </div>

            )}

          {/* ==================================================
              CREATE TASK MODAL
          ================================================== */}

          {showCreateTask &&
            selectedProject && (

              <div className="modal-overlay">

                <div className="modal">

                  <div className="modal-header">

                    <h2>
                      Create New Task
                    </h2>

                    <button
                      className="close-button"
                      onClick={() =>
                        setShowCreateTask(
                          false
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                  <form onSubmit={createTask}>

                    <div className="form-group">

                      <label>
                        Task Title
                      </label>

                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) =>
                          setTaskTitle(
                            e.target.value
                          )
                        }
                        placeholder="Enter task title"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Description
                      </label>

                      <textarea
                        value={taskDescription}
                        onChange={(e) =>
                          setTaskDescription(
                            e.target.value
                          )
                        }
                        placeholder="Enter task description"
                        rows="4"
                      />

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Status
                        </label>

                        <select
                          value={taskStatus}
                          onChange={(e) =>
                            setTaskStatus(
                              e.target.value
                            )
                          }
                        >

                          <option value="todo">
                            To Do
                          </option>

                          <option value="in_progress">
                            In Progress
                          </option>

                          <option value="done">
                            Done
                          </option>

                        </select>

                      </div>

                      <div className="form-group">

                        <label>
                          Priority
                        </label>

                        <select
                          value={taskPriority}
                          onChange={(e) =>
                            setTaskPriority(
                              e.target.value
                            )
                          }
                        >

                          <option value="low">
                            Low
                          </option>

                          <option value="medium">
                            Medium
                          </option>

                          <option value="high">
                            High
                          </option>

                        </select>

                      </div>

                    </div>

                    <div className="form-group">

                      <label>
                        Assign To
                      </label>

                      <select
                        value={taskAssignedTo}
                        onChange={(e) =>
                          setTaskAssignedTo(
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Unassigned
                        </option>

                        {selectedProject.members?.map(
                          (member) => (

                            <option
                              key={member.user}
                              value={member.user}
                            >
                              {member.username}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Due Date
                      </label>

                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) =>
                          setTaskDueDate(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="modal-actions">

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                          setShowCreateTask(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="submit-button"
                      >
                        Create Task
                      </button>

                    </div>

                  </form>

                </div>

              </div>

            )}

          {/* ==================================================
              EDIT PROJECT MODAL
          ================================================== */}

          {showEditProject &&
            editingProject && (

              <div className="modal-overlay">

                <div className="modal">

                  <div className="modal-header">

                    <h2>
                      Edit Project
                    </h2>

                    <button
                      className="close-button"
                      onClick={() => {

                        setShowEditProject(
                          false
                        );

                        setEditingProject(
                          null
                        );

                      }}
                    >
                      ✕
                    </button>

                  </div>

                  <div className="form-group">

                    <label>
                      Project Name
                    </label>

                    <input
                      type="text"
                      value={
                        editingProject.name
                      }
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          name:
                            e.target.value,
                        })
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Description
                    </label>

                    <textarea
                      value={
                        editingProject.description ||
                        ""
                      }
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          description:
                            e.target.value,
                        })
                      }
                      rows="5"
                    />

                  </div>

                  <div className="modal-actions">

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {

                        setShowEditProject(
                          false
                        );

                        setEditingProject(
                          null
                        );

                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="submit-button"
                      onClick={
                        updateProject
                      }
                    >
                      Save Changes
                    </button>

                  </div>

                </div>

              </div>

            )}

          {/* ==================================================
              CREATE PROJECT MODAL
          ================================================== */}

          {showCreateProject && (

            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">

                  <h2>
                    Create New Project
                  </h2>

                  <button
                    className="close-button"
                    onClick={() =>
                      setShowCreateProject(
                        false
                      )
                    }
                  >
                    ×
                  </button>

                </div>

                <form onSubmit={createProject}>

                  <div className="form-group">

                    <label>
                      Project Name
                    </label>

                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) =>
                        setProjectName(
                          e.target.value
                        )
                      }
                      placeholder="Enter project name"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Description
                    </label>

                    <textarea
                      value={
                        projectDescription
                      }
                      onChange={(e) =>
                        setProjectDescription(
                          e.target.value
                        )
                      }
                      placeholder="Enter project description"
                      rows="5"
                    />

                  </div>

                  <div className="modal-actions">

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() =>
                        setShowCreateProject(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="submit-button"
                    >
                      Create Project
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

          {/* ==================================================
              GLOBAL MESSAGE
          ================================================== */}

          {message && (

            <div className="global-message">
              {message}
            </div>

          )}

        </main>

      </div>

    </div>
  );
}


export default App;