import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(to top, #4a4a95, #3d3d7c)",
    color: theme.palette.common.white,
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  boxShadow: `${theme.palette.primary.main} 0px 0px 10px 0px`,
  backgroundColor: "#f9f9f9",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: "20px",
  border: "solid 2px #12614b",
  maxHeight: "350px",
  overflow: "auto",
  marginLeft: "30px",
  height: "100%",
  boxShadow: "#12614b 0px 0px 10px 0px",

  "&::-webkit-scrollbar": {
    width: "6px",
    background: "linear-gradient(to top, #c8dfd8, #12614b)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#f9f9f9",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#0a4734",
  },
}));

const StyledTableContainerAc = styled(TableContainer)(({ theme }) => ({
  marginTop: "-5px",
  border: "solid 2px #12614b",
  maxHeight: "40%",
  overflow: "auto",

  "&::-webkit-scrollbar": {
    width: "8px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    height: "90%",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#12614b",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#0a4734",
  },
}));

export {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
  StyledTableContainer,
  StyledTableContainerAc,
};
