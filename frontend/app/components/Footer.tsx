"use client";

import * as React from "react";
import { Paper, Box, Typography, Avatar, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { GitHub } from "@mui/icons-material";
import { DescriptionOutlined } from "@mui/icons-material";

export default function Footer() {
  return (
    <Paper elevation={0} sx={{ p: 2, mt: "auto", mx: 15 }}>
      <Typography variant="body1" sx={{ mb: 1, fontFamily: "monospace" }}>
        Get connected with us:
      </Typography>
      <Divider />
      <Box component="footer" sx={{ py: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontFamily={"monospace"} gutterBottom>
              App developed by
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <a
                href="https://github.com/JakobKlotz"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  alt="Jakob Klotz"
                  src="https://avatars.githubusercontent.com/u/177755923?v=4"
                  sx={{ cursor: "pointer" }}
                />
              </a>
              <a
                href="https://github.com/wildle"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  alt="Lenard Wild"
                  src="https://avatars.githubusercontent.com/u/115046052?v=4"
                  sx={{ cursor: "pointer" }}
                />
              </a>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex", // Make the grid item a flex container
              flexDirection: "column", // Stack items vertically
              alignItems: "center", // Center items horizontally
              textAlign: "center", // Keep text centered (for Typography)
            }}
          >
            <Typography variant="body1" fontFamily={"monospace"} gutterBottom>
              Useful links
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <a
                href="https://github.com/JakobKlotz/lhasa-app"
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex", // Make the link a flex container
                  alignItems: "center", // Align items vertically center
                  gap: "0.5rem", // Add some space between icon and text
                }}
              >
                <GitHub fontSize="small" />
                <span>This project</span>
              </a>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <a
                href="https://github.com/nasa/lhasa"
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <PublicOutlinedIcon fontSize="small" />
                <span>NASA LHASA</span>
              </a>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <a
                href="https://github.com/JakobKlotz/lhasa-app/LICENSE.pdf"
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <DescriptionOutlined fontSize="small" />
                <span>License</span>
              </a>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Typography variant="body1" fontFamily={"monospace"} gutterBottom>
              Contact
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
              }}
            >
              <a
                href="mailto:jakob.klotz@mci.edu"
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <MailOutlineIcon fontSize="small" />
                <span>jakob.klotz@mci.edu</span>
              </a>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
