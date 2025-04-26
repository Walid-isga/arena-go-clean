import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import profileGif from "../Assets/user-profile.gif";
import defaultProfile from "../Assets/profile.gif";

export default function ProfileInformation({ user }) {
  if (!user) return <p>Chargement du profil...</p>;

  const { username, email, picture, city, phone, isAdmin } = user;
  const isAdminText = isAdmin ? "Oui" : "Non";

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={picture || defaultProfile}
              sx={{ width: 70, height: 70 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Nom :</strong> {username}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
