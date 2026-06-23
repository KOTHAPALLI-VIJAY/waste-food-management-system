import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users"
      );

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );

      alert("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "30px",
          }}
        >
          Manage Users
        </h1>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#2e7d32",
                color: "white",
              }}
            >
              <th style={{ padding: "15px" }}>Name</th>
              <th style={{ padding: "15px" }}>Email</th>
              <th style={{ padding: "15px" }}>Role</th>
              <th style={{ padding: "15px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                style={{
                  textAlign: "center",
                }}
              >
                <td style={{ padding: "15px" }}>
                  {user.name}
                </td>

                <td style={{ padding: "15px" }}>
                  {user.email}
                </td>

                <td style={{ padding: "15px" }}>
                  {user.role}
                </td>

                <td style={{ padding: "15px" }}>
                  <button
                    onClick={() =>
                      deleteUser(user._id)
                    }
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageUsers;