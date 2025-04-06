import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AdminMainComponent = ({ currUser, setCurrUser }) => {
  const navigate = useNavigate();
  const [userData, setuserData] = useState([]); // To store fetched data
  const [loading, setLoading] = useState(true); // To show loading state
  //  const [error, setError] = useState(null); // To store any error if occurs
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/a/users/${currUser._id}`);
        setuserData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  const goBack = () => {
    window.history.back(); // Go back to the previous page
  };
  const HandleLogout = () => {
    setCurrUser(null);
    localStorage.removeItem('currUser');
    navigate('/login');
  }
  //  if (error) {
  //   return <div>{error}</div>;
  //  }

  return (
    // <div>
    //  <h1>Data Table</h1>
    //  <table border="1" cellPadding="10">
    //   <thead>
    //    <tr>
    //     <th>Sr.No</th>
    //     <th>Name</th>
    //     <th>Email</th>
    //     <th>Role</th>
    //    </tr>
    //   </thead>
    //   <tbody>
    //    {userData.map((item,index) => (
    //     <tr key={item._id}>
    //      <td>{index+1}</td>
    //      <td>{item.username}</td>
    //      <td>{item.email}</td>
    //      <td>{item.role}</td>
    //     </tr>
    //    ))}
    //   </tbody>
    //  </table>
    // </div>
    <div style={styles.container}>
      <h1 style={styles.header}>Data Table</h1>

      <div style={styles.buttonsContainer}>
        <button style={styles.button} onClick={goBack}>Go Back</button>
        <button style={styles.button} onClick={HandleLogout}>Logout</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default AdminMainComponent;


const styles = {
  container: {
    padding: '15px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '2rem',
  },
  buttonsContainer: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    border: '2px solid black',
    //  borderCollapse: 'collapse',
  },
  th: {
    padding: '5px',
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ddd',
    border: '2px solid black',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    border: '2px solid black',
  },
};