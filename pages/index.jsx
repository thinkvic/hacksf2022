import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import WalletIcon from "@mui/icons-material/Wallet";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {styled} from "@mui/system";

const StyledTextField = styled(TextField, {
  name: "StyledTextField",
})({
  width: 300,
  "& .MuiInputBase-root": {
    height: 36,
  },
});

const StyledButton = styled(Button)({
  height: 36,
});

function Home() {
  const [addrList, setAddrList] = useState([]);
  const [currentAddr, setCurrentAddr] = useState("");
  const [detail, setDetail] = useState();

  useEffect(() => {
    if (localStorage.getItem("addrList")) {
      const res = localStorage.getItem("addrList");
      const arr = res.split(",");
      setAddrList(arr);
    }
  }, []);

  const setAddr = (addr) => {
    setCurrentAddr(addr);
  };

  const addAddr = () => {
    const newList = [...addrList, currentAddr];
    localStorage.setItem("addrList", newList.join());
    setAddrList(newList);
  };

  const url1 = process.env.NEXT_PUBLIC_API;
  console.log("url1", url1);
  const url = "/api/balances?addr=";

  const getBalance = async (addr) => {
    const res = await fetch(url + addr);
    const json = await res.json();
    setDetail(json);
    console.log(json);
  };

  return (
    <div style={{display: "flex", padding: '20px'}}>

      <div style={{display: "flex", flexDirection: "column", alignItems:'center', width: "50%"}}>
        <div style={{display: "flex"}}>
          <StyledTextField
            variant="outlined"
            placeholder="New Address"
            onChange={(e) => setAddr(e.target.value)}
          />
          &nbsp;
          <StyledButton variant="outlined" onClick={addAddr}>
            Add Address
          </StyledButton>
        </div>
        <List>
          {addrList.map((addr) => {
            return (
              <ListItem key={addr} onClick={() => getBalance(addr)}>
                <ListItemIcon>
                  <WalletIcon />
                </ListItemIcon>
                <ListItemText primary={addr} />
              </ListItem>
            );
          })}
        </List>
      </div>

      <div style={{display: "flex", width: "50%", flexDirection: "column"}}>
        <ListItem>
          <ListItemText primary={detail?.nativeBalance} />
        </ListItem>
        <div>
          {detail?.tokenBalances.map((bal) => {
            return (
              <ListItem key={bal}>
                <ListItemText primary={bal} />
              </ListItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
