import { Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

export const MainPage = () => {
    const [nameAuction, setNameAuction] = useState("")
    const [auctions, setAuctions] = useState<string[]>([])

    useEffect(() => {
        const fetchAuctions = async () => {
          try {
            const response = await axios.get("http://localhost:3000/auctions");
            const auctionNames = response.data
            setAuctions(auctionNames);
          } catch (error) {
            console.error("Ошибка при загрузке аукционов:", error);
          }
        };
    
        fetchAuctions();
      }, []);
    
    const handleClick = async () => {
        if (!nameAuction.trim()) return;
        
        try {
            const bodyRequest = { id: nanoid(), name: nameAuction}
            // Отправка запроса на создание аукциона
            const response = await axios.post("http://localhost:3000/auctions", bodyRequest);
            console.log(response.data)
            // Обновление локального состояния
            setAuctions((prev) => [...prev, response.data.auction]);
            setNameAuction("");
        } catch (error) {
            console.error("Ошибка при создании аукциона:", error);
        }
    };

    return <Box>
        <Box sx={{padding: "2rem", display: "flex", flexDirection: "row", alignItems: "center"}}>
            <TextField
            label="Название аукциона"
            type=""
            value={nameAuction}
            onChange={(e) => {
                setNameAuction(e.target.value)
            }}
            fullWidth
            margin="normal"
            sx={{ maxWidth: "30rem"}}
            />
            <Button
            onClick={handleClick}
            variant="outlined"
            color="error"
            sx={{fontSize: "0.8rem", backgroundColor: "pink", marginLeft: "1rem"}}
            >Создать аукцион</Button>
            {/* : <>{id === "Admin" && <Button onClick={handleCreateAuction}>Создать аукцион</Button>}</> */}
        </Box>
        {auctions.length !== 0 && auctions.map((item) => {
            return <Link to={`/auction/${item._id}/Admin`}><Button>{item._id}</Button></Link>
        })}
    </Box>
}