import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import meeting from "../../assets/Meeting.png";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="container hero text-center">
      <h1 id={"landing-page-title"}>1on1</h1>
      <p id={"landing-page-header"}>
        Meetings scheduler and calendar management.
      </p>

      <div className="row">
        <div className="col-md-6">
          <h2>Key Features</h2>
          <ul className="list-group features-list">
            <li className="list-group-item">Create and manage contacts</li>
            <li className="list-group-item">Easily schedule meetings</li>
            <li className="list-group-item">Set meeting preferences</li>
            <li className="list-group-item">
              Auto-generated emails for meeting invites
            </li>
            <li className="list-group-item">
              View and finalize suggested schedules
            </li>
          </ul>
        </div>
        <div className="col-md-6 text-center">
          <img src={meeting} alt="1-on-1 Meeting" className="img-fluid" />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <button className="btn btn-sign-up" onClick={handleSignUp}>
            Sign Up Now
          </button>
          <button
            className="btn btn-outline-primary btn-log-in"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
