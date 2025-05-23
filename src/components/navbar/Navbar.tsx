import "./navbar.scss";

const Navbar = () => {
  const handleLogout = () => {
    // You can later replace this with your actual logout logic
    console.log("Logging out...");
    // For example: localStorage.clear(); navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="logo" />
        <span>Hydroponics</span>
      </div>
      <div className="icons">
        <div className="user">
          <img src="noavatar.png" alt="user" />
          <span>Name</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
