import Link from "@mui/material/Link";

export default function About() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>About</h1>
      <p>
        This app builds on the{" "}
        <Link
          href="https://github.com/nasa/lhasa"
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
        >
          Landslide Hazard Assessment for Situational Awareness (LHASA)
        </Link>{" "}
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

      <p>
        LHASA: Copyright © 2020 United States Government as represented by the
        Administrator of the National Aeronautics and Space Administration. All
        Rights Reserved.
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

      <h2>Tools 🚀</h2>
      <p>Following tools were used to build this app:</p>
      <ul>
        <li>
          <Link
            href="https://fastapi.tiangolo.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            FastAPI
          </Link>{" "}
          - Serves as the backend to fetch and serve LHASA data.
        </li>
        <li>
          <Link
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            Next.js
          </Link>{" "}
          - A React framework for building the frontend.
        </li>
        <li>
          <Link
            href="https://mui.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            Material-UI
          </Link>{" "}
          - To build the user interface.
        </li>
        <li>
          <Link
            href="https://www.docker.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            Docker
          </Link>{" "}
          - To containerize the application for easy deployment.
        </li>
      </ul>

      <h2>License & Contributions</h2>

      <p>
        This app is licensed under the{" "}
        <Link
          href="https://github.com/JakobKlotz/lhasa-app/blob/main/LICENSE.pdf"
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
        >
          NASA Open Source Software Agreement
        </Link>
        . Contributions to this app are always welcome! If you have
        suggestions, bug reports, or feature requests, please open an issue
        GitHub.
      </p>
    </div>
  );
}
