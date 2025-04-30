"use client";

import * as React from "react";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  AvatarGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { GitHub } from "@mui/icons-material";
import { DescriptionOutlined } from "@mui/icons-material";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

export default function Footer() {
  return (
    <Paper elevation={0} sx={{ p: 2, mt: "auto", mx: 15 }}>
      <Divider />
      <Box component="footer" sx={{ py: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              App Devs
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AvatarGroup max={4} sx={{ marginRight: 1 }}>
                <Avatar
                  alt="Jakob Klotz"
                  src="https://avatars.githubusercontent.com/u/177755923?v=4"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    window.open(
                      "https://github.com/JakobKlotz/",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                />
                <Avatar
                  alt="Lenard Wild"
                  src="https://avatars.githubusercontent.com/u/115046052?v=4"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    window.open(
                      "https://github.com/wildle",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                />
              </AvatarGroup>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <InsertLinkOutlinedIcon fontSize="small" />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Links
              </Typography>
            </Box>
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
                <Typography variant="caption">This project</Typography>
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
                <Typography variant="caption">NASA LHASA</Typography>
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
                <Typography variant="caption">License</Typography>
              </a>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
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
