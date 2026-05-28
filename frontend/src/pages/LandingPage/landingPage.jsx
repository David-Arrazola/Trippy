import TripForm from "../../components/TripForm/TripForm.jsx";
import "./landingPage.css";

function LandingPage() {
  return (
    <div className="landingPage">
      {/* BACKGROUND GLOW */}
      <div className="backgroundGradient"></div>

      {/* HERO SECTION */}
      <section className="heroSection">
        <div className="heroContent">
          <p className="badge">AI Powered Travel Planner</p>

          <h1>Trippy</h1>

          <h2>Live spontaneously.</h2>

          <p className="heroDescription">
            Describe your dream trip in plain English and let AI build your
            itinerary, including:
          </p>

          {/* FEATURES */}
          <div className="featuresGrid">
            <div className="featureCard">🌎 Smart destinations</div>

            <div className="featureCard">✈️ Flight recommendations</div>

            <div className="featureCard">🏨 Hotel suggestions</div>

            <div className="featureCard">🗺️ Interactive travel map</div>
          </div>
        </div>

        {/* FORM */}
        <div className="formCard">
          <TripForm />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
