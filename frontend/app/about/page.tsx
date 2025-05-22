"use client";
import Link from "@mui/material/Link";
import TextHighlighter from "../components/TextHighlighter";
import Divider from "@mui/material/Divider";

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
          color="primary"
        >
          Landslide Hazard Assessment for Situational Awareness (LHASA)
        </Link>{" "}
        model developed by{" "}
        <TextHighlighter color="secondary" heightPercentage={40}>
          NASA
        </TextHighlighter>
        {",  "}
        and provides easy access to daily predictions of rainfall-triggered
        landslide risk.
      </p>

      <Divider />

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

      <Divider />

      <h2>How to Use</h2>
      <p>By default, the latest available forecast is visualized.</p>

      <Divider />
      <p>
        The calendar allows you to select a specific date for which you want to
        view the forecast. If no data is available, the specific date is
        disabled in the calendar.
      </p>

      <p>
        <TextHighlighter color="secondary" heightPercentage={40}>
          Important Note:
        </TextHighlighter>{" "}
        The date you select is the day the forecast was <em>generated</em>. The
        actual forecast displayed applies to the <em>following day</em>. For
        example, selecting May 5<sup>th</sup> will show the predicted risk for
        May 6<sup>th</sup>.
      </p>
      <Divider />

      <h3>Map</h3>
      <p>
        The map shows the predicted landslide risk as probability. Choose a
        different basemap or change the opacity of the overly with the{" "}
        <b>customization options</b> in the bottom left corner of the map.
      </p>

      <h3>Data</h3>
      <p>
        Forecast data is automatically kept up to date, so you can always
        access the latest information. No need to worry about manually
        downloading or updating files.
      </p>
      <Divider />

      <h2>Disclaimer</h2>
      <p>
        The information provided by this app is for{" "}
        <TextHighlighter color="secondary" heightPercentage={40}>
          informational purposes
        </TextHighlighter>{" "}
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
            color="primary"
          >
            FastAPI
          </Link>{" "}
          - Serves as the backend to fetch and serve LHASA data.
        </li>
        <ul>
          <li>
            <Link
              href="https://cogeotiff.github.io/rio-tiler/"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
            >
              rio-tiler
            </Link>{" "}
            - To dynamically tile and serve LHASA data.
          </li>
        </ul>
        <li>
          <Link
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            Next.js
          </Link>{" "}
          - A React framework for building the frontend.
        </li>
        <ul>
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
              href="https://react-leaflet.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
            >
              (React) Leaflet
            </Link>{" "}
            - For the map.
          </li>
        </ul>
        <li>
          <Link
            href="https://www.docker.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
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
          color="primary"
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
