export default function About() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>About</h1>
      <p>
        This app builds on the{" "}
        <a
          href="https://github.com/nasa/lhasa"
          target="_blank"
          rel="noopener noreferrer"
        >
          Landslide Hazard Assessment for Situational Awareness (LHASA)
        </a>{" "}
        model developed by NASA, and provides easy access to daily predictions
        of rainfall-triggered landslide risk.
      </p>

      <p>LHASA was developed by:</p>

      <p style={{ marginLeft: "20px" }}>
        <cite>
          Khan, S., D. B. Kirschbaum, T. A. Stanley, P. M. Amatya, and R. A.
          Emberson. 2022. "Global Landslide Forecasting System for Hazard
          Assessment and Situational Awareness." Frontiers in Earth Science,
          10: 10.3389/feart.2022.878996
        </cite>
      </p>

      <h2>How to Use</h2>
      <p>To use the app, select a region from the dropdown menu.</p>
      <h2>Disclaimer</h2>
      <p>
        The information provided by this app is for informational purposes
        only. It is not intended to be a substitute for professional advice or
        judgment. Always consult with a qualified professional before making
        decisions based on the information provided.
      </p>
    </div>
  );
}
