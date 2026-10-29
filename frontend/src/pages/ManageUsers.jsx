import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  UserCog, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Users, 
  Building, 
  Utensils,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageUsers.css";

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/users");
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data?.users && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/users/${id}`);
      alert("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
      alert("Error deleting user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="manage-users-page">
      <Navbar />

      <div className="app-container manage-users-content">
        {/* Header */}
        <div className="manage-header-card card-surface">
          <div>
            <button className="back-link-btn" onClick={() => navigate("/admin")}>
              <ArrowLeft size={16} /> Back to Admin Console
            </button>
            <h1>User Management Directory 👥</h1>
            <p>Review registered food donors, verified charity NGOs, and platform administrators.</p>
          </div>

          <div className="user-count-pill">
            <Users size={16} />
            <span><strong>{users.length}</strong> Registered Accounts</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="users-toolbar card-surface">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="form-input search-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="role-filter-group">
            <button
              className={`filter-btn ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => setRoleFilter("all")}
            >
              All Users ({users.length})
            </button>
            <button
              className={`filter-btn ${roleFilter === "donor" ? "active" : ""}`}
              onClick={() => setRoleFilter("donor")}
            >
              Donors ({users.filter((u) => u.role === "donor").length})
            </button>
            <button
              className={`filter-btn ${roleFilter === "ngo" ? "active" : ""}`}
              onClick={() => setRoleFilter("ngo")}
            >
              NGOs ({users.filter((u) => u.role === "ngo").length})
            </button>
            <button
              className={`filter-btn ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => setRoleFilter("admin")}
            >
              Admins ({users.filter((u) => u.role === "admin").length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-panel card-surface">
          <div className="table-scroll-hint">
            <span>⟷ Swipe horizontally to view full table details</span>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>Access Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Loading registered users from database...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      No users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id || user.id}>
                      <td>
                        <div className="user-table-cell">
                          <div className={`user-table-avatar role-${user.role}`}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || "N/A"}</td>
                      <td>
                        <span className={`badge badge-${user.role === "donor" ? "veg" : user.role === "ngo" ? "claimed" : "accepted"}`}>
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-delete-user"
                          onClick={() => deleteUser(user._id || user.id, user.name)}
                          title="Delete User Account"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;