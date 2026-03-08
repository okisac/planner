import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    // 1. Verileri temizle
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // 2. Sayfayı sert bir şekilde yenile
    // Bu işlem App.jsx'teki 'user' state'ini sıfırlar ve
    // uygulama en baştan (token'sız) başlar.
    window.location.href = "/";
  };

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h3
        style={{
          color: "black",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        {" "}
        Welcome {localStorage.getItem("username")},
      </h3>

      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </nav>
  );
};

export default Navbar;
