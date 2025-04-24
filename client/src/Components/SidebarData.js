import HomeIcon from "@mui/icons-material/Home";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const SidebarData = [
  {
    title: "Accueil",
    path: "/home",
    icon: <HomeIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Réservation",
    path: "/booking",
    icon: <BookmarkAddIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Mes Sessions",
    path: "/session",
    icon: <AssessmentIcon sx={{ color: "#fff" }} />,
  },
];
