import { Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios";
import { AuctionCard } from "entities/index";
import { IAuction, protocolHttp } from "widjets/index";
const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = "9998";


export const MainPage = () => {
    const [nameAuction, setNameAuction] = useState("")
    const [auctions, setAuctions] = useState<IAuction[]>([])
    
    useEffect(() => {
        const fetchAuctions = async () => {
          try {
            const response = await axios.get(protocolHttp+apiUrl+apiPort+"/auctions");
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
            const bodyRequest = { name: nameAuction}
            const response = await axios.post(protocolHttp+apiUrl+apiPort+"/auctions", bodyRequest);
            setAuctions((prev) => [...prev, response.data.auction]);
            setNameAuction("");
        } catch (error) {
            console.error("Ошибка при создании аукциона:", error);
        }
    };
    
    const sortedCards = [...auctions].sort((itemA, itemB) => new Date(itemB.createdAt).getTime() - new Date(itemA.createdAt).getTime())

    return <Box sx={{padding: "2rem"}}>
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
        </Box>
        <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
        }}>
        {sortedCards.length !== 0 && sortedCards.map((item) => {
            return <AuctionCard id={item._id} isActive={item.isActive} link={item._id} name={item.name} startDate={item.createdAt} key={item._id}/>
        })}
        </Box>
    </Box>
}