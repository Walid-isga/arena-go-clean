import React from "react";
import { Card, CardContent, Typography, Avatar, Grid, Divider } from "@mui/material";
import profileGif from "../Assets/user-profile.gif";
import defaultProfile from "../Assets/profile.gif";

export default function ProfileInformation({ userInfo1, userInfo2 }) {
  if (!userInfo1 || !userInfo2) return <p>Chargement du profil...</p>;

  const { familyName, givenName } = userInfo1;
  const { picture, isAdmin } = userInfo2;
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
            <Typography variant="h6">Informations du profil</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Admin :</strong> {isAdminText}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
