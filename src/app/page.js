"use client";

import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  // Enable Bootstrap JS for carousel
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      section.classList.add("highlight");
      setTimeout(() => section.classList.remove("highlight"), 1500);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(to bottom right, #ff6969ff, #f18989ff)",
        color: "#333",
      }}
    >
      {/* --- Navbar --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
        <div className="container">
          <a
            className="navbar-brand fw-bold text-danger"
            href="#"
            onClick={() => scrollToSection("home")}
          >
            🩸 Blood Bank System
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn nav-link active"
                  onClick={() => scrollToSection("home")}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn nav-link"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn nav-link"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Hero / Home Section --- */}
      <section id="home">
        <header className="text-center py-5 bg-danger text-white shadow-sm position-relative">
          
          <h1 className="fw-bold display-5 mb-2 animate_animated animate_fadeInDown">
            Save Lives with Every Drop ❤
          </h1>
          <p className="fs-5 mb-0">
            “The gift of blood is the gift of life — become a hero today.”
          </p>
        </header>

        {/* --- Carousel --- */}
        <div
          id="bloodCarousel"
          className="carousel slide my-5 container"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded shadow">
            <div className="carousel-item active text-center p-5 bg-light">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
                className="mb-4"
                width="100"
                alt="Donate Blood"
              />
              <h4 className="text-danger fw-bold">
                “One pint of blood can save lives.”
              </h4>
            </div>
          </div>
        </div>

        {/* --- Role Selection --- */}
        <main className="container text-center my-4">
          <h2 className="fw-bold text-light mb-4">Choose Your Role</h2>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <button
              onClick={() => router.push("/admin/login")}
              className="btn btn-outline-danger btn-lg px-5 py-3 shadow-sm"
              style={{
                borderRadius: "50px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              👩‍💼 Admin Login
            </button>

            <button
              onClick={() => router.push("/donor")}
              className="btn btn-outline-danger btn-lg px-5 py-3 shadow-sm"
              style={{
                borderRadius: "50px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              🧍‍♂ Donor Registration
            </button>

            <button
              onClick={() => router.push("/hospital/register")}
              className="btn btn-outline-danger btn-lg px-5 py-3 shadow-sm"
              style={{
                borderRadius: "50px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              🏥 Hospital Registration
            </button>
          </div>
        </main>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-5 bg-white shadow-sm">
        <div className="container text-center">
          <h2 className="fw-bold text-danger mb-4">About Us</h2>
          <p className="fs-5 text-muted">
            Our Blood Bank Management System is designed to connect donors,
            hospitals, and administrators in one efficient platform. It simplifies
            blood donation drives, manages hospital requests, tracks blood stock,
            and ensures every drop reaches those in need.
          </p>
          <div className="row mt-4">
            <div className="col-md-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3476/3476456.png"
                width="100"
                alt="Donor"
                className="mb-3"
              />
              <h5 className="text-danger fw-bold">Donor Support</h5>
              <p>Join nearby donation camps and make your contributions.</p>
            </div>
            <div className="col-md-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2666/2666526.png"
                width="100"
                alt="Hospital"
                className="mb-3"
              />
              <h5 className="text-danger fw-bold">Hospital Management</h5>
              <p>Hospitals can request blood units and monitor stock in real time.</p>
            </div>
            <div className="col-md-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2942/2942789.png"
                width="100"
                alt="Admin"
                className="mb-3"
              />
              <h5 className="text-danger fw-bold">Admin Control</h5>
              <p>Admin manages all operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 text-center fade-section">
        <div className="container">
          <h2 className="fw-bold text-danger mb-4">Contact Us</h2>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <p className="lead text-muted mb-3">
                Have questions or want to collaborate with us?
              </p>
              <div className="p-4 border rounded bg-light shadow-sm">
                <p className="mb-2">
                  📞 <strong>+91 7899307115 | 9019428628 </strong>
                </p>
                <p className="mb-0">
                  ✉ <strong>renuu635@gmail.com | pallavishetty@gmail.com </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

       
           
      {/* --- Footer --- */}
      <footer className="text-center py-4 bg-light text-muted mt-auto border-top">
        <small>
          © {new Date().getFullYear()} Blood Bank Management System | Made with ❤
        </small>
      </footer>
      
  );
      {/* --- Animation Styles --- */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        .blood-drop {
          width: 20px;
          height: 20px;
          background-color: #ff4d4d;
          border-radius: 50%;
          animation: drop 1.2s infinite ease-in-out;
        }
        @keyframes drop {
          0% {
            top: 0;
            opacity: 0;
          }
          50% {
            top: 15px;
            opacity: 1;
          }
          100% {
            top: 30px;
            opacity: 0;
          }
        }
        .highlight {
          box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.3);
          transition: box-shadow 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}