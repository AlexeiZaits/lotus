import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Avatar
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
// import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditPriceDialog } from 'widjets/EditPriceDialog';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { formatDateTime } from './lib/formatDateTime';
import EditIcon from "@mui/icons-material/Edit";

const API_URL = 'ws://localhost:3000';


const generatePlayersId = (count: number) => {
    let ids = [];
    for (let i=0; i<count; i++){
        const id = nanoid();
        ids.push(id)
    }

    return ids
}

interface IPaticipiant {
    [key: string]: string|number|boolean
}

interface IAuction {
    participants: IPaticipiant[],
    currentBid: number,
    currentBidder: IPaticipiant,
    isActive: boolean,
    parameters: string[],
    status: "idle"| "create"| "active" | "ended" 
};

export interface IDialog {
    view: boolean,
    name: string,
    parametr: string,
    bid: string|number|boolean
}

export const AuctionTable = () => {
    const {id, auctionName} = useParams()
    const [dialog, setDialog] = useState<IDialog|null>(null)
    const [auction, setAuction] = useState<IAuction|null>(null);
    const [participant, setParticipant] = useState<IPaticipiant|null>(null); // текущий участник
    const [time, setTime] = useState<number>(0);
    const [timeTurn, setTimeTurn] = useState(30);
    const ws = useRef<WebSocket | null>(null);
    const dateTimeRef = useRef(new Date());

    const handleOpenDialog = (dialog: IDialog) => {
        setDialog(dialog)
    };
    
    const handleCloseDialog = () => setDialog(null);
    
    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:3000?id=${id}?auctionName=${auctionName}`);
        ws.current.onopen = () => {
            console.log('web socket connected')
            // const initialDataRequest = { type: 'GET_AUCTION_BY_ID', id: id};
            // ws.current?.send(JSON.stringify(initialDataRequest));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
            case 'GET_AUCTION_DATA':
                setAuction(data.auction);
                break
            case 'AUCTION_DETAILS':
                console.log(data)
                setAuction(data.auction)
                break;
            case 'AUCTION_CREATED':
                setAuction(data.auction);
                // setTime(Math.floor(data.timeRemaining / 1000))
                break;
            case 'AUCTION_STARTED':
                setAuction(data.auction);
                break;
            case 'BID_PLACED':
                // setMessages((prev) => [...prev, `${data.participant} placed a bid: $${data.bid}`]);
                setAuction(data.auction);
                break;
            case 'TURN_CHANGED':
                setAuction((prev: IAuction) => ({ ...prev, currentBidder: data.currentBidder }));
                break;
            case 'TIME_UPDATE':
                setTime(Math.floor(data.timeRemaining / 1000));
                break;
            case 'TIME_TURN':
                data.timeTurn !== undefined && setTimeTurn(data.timeTurn);
                break;
            case 'AUCTION_ENDED':
                // setMessages((prev) => [...prev, `Auction ended! Winner: ${data.winner} with $${data.finalBid}`]);
                setAuction((prev) => ({...prev, isActive: false}));
                break;
            default:
            }
        };
        
        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket');
        }

      return () => {
            // Закрываем WebSocket
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    useEffect(()=> {
        const indexParticipant = auction?.participants.findIndex((item) => item._id === id)
        if (!participant && id && indexParticipant) {
            setParticipant({id: id, indexParticipant: indexParticipant})
            
        }
    }, [])

    const handleStartAuction = () => {
        if(ws.current){
            ws.current.send(JSON.stringify({ type: 'START_AUCTION' }));
        }
    };
    
    const handlePlaceBid = (parametr: string, currentBid: string|number|boolean) => {
        if(ws.current)
        ws.current.send(JSON.stringify({
            type: 'PLACE_BID',
            id: id,
            parametr: parametr === "Введите название компании"? "name": parametr,
            bid: currentBid,
        }));
    };

    const handleNextTurn = () => {
        setTimeTurn(30)
        if(ws.current)
        ws.current.send(JSON.stringify({ type: 'NEXT_TURN' }));
    };
    
    const handleEndAuction = () => {
        if(ws.current)
        ws.current.send(JSON.stringify({ type: 'END_AUCTION' }));
    };

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;   
    
    console.log(auction?.status)
    return (
    <>
    {dialog?.view && <EditPriceDialog
        name={dialog ? dialog.name: ""}
        open={dialog !== null ? dialog.view: false}
        onClose={handleCloseDialog}
        onSave={handlePlaceBid}
        currentBid={dialog ? dialog.bid: ""}
        parametr={dialog ? dialog.parametr: ""}
    />}
    <Box sx={{backgroundColor: "white", padding: 2}}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant="h6" gutterBottom color="error">
                Ход торгов Тестовые торги на аппарат ЛОТОС №2033564 ({formatDateTime(dateTimeRef.current)})
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "15rem" }}>
                {<Button
                variant="outlined"
                color="error"
                sx={{
                    width: '100%',
                    backgroundColor: 'pink',
                    position: 'relative', // Относительное позиционирование для контейнера
                    padding: '16px 16px',
                }}
                >
                    <Box
                        sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)', // Центровка текста
                        textAlign: 'center',
                        }}
                    >
                        00:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </Box>
                    <HourglassBottomIcon
                        sx={{
                        position: 'absolute',
                        right: '16px', // Отступ от правого края
                        }}
                    />
                </Button>}
            </Box>
        </Box>
        <Typography variant="body2" color="error">
            Уважаемые участники, во время вашего хода вы можете изменить параметры торгов, указанных в таблице:
        </Typography>
        {id === "Admin" && auction?.participants.map((item) => {
            return <Link  key={String(item._id)} to={`/auction/${auctionName}/${item._id}`}>
                <Typography key={String(item._id)} variant="body2" color="error">
                {`${item._id}`}
                </Typography>
            </Link>
        })}
        
        <>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
            <TableHead>
                <TableRow >
                    <TableCell>
                    <Typography variant="body2" color="textSecondary">
                        Ход
                    </Typography>
                    </TableCell>
                    {auction?.participants.map((item, index) => 
                    <TableCell key={String(item._id)} align="center">
                        <Box key={String(item._id)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                           {auction.currentBidder.index === index && <Button
                            variant="outlined"
                            color="error"
                            sx={{
                                width: '100%',
                                backgroundColor: 'pink',
                                position: 'relative',
                                padding: '16px 16px',
                            }}
                            >
                            <Box
                                sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                textAlign: 'center',
                                }}
                            >
                                00:00:{timeTurn.toString().padStart(2, '0')}
                            </Box>
                            <HourglassBottomIcon
                                sx={{
                                position: 'absolute',
                                right: '16px',
                                }}
                            />
                            </Button>}
                        </Box>
                    </TableCell>)}
                </TableRow>
                <TableRow>
                    <TableCell align='center'>Параметры и требования</TableCell>
                    {auction?.participants.map((player, idx) =>
                    <TableCell key={String(player._id)} align="center" sx={{maxWidth: "13rem"}}>
                        <Typography>{`УЧАСТНИК №${idx+1}`}</Typography>
                        <Box sx={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative"}}> 
                            <Avatar
                            sx={{
                                width: 25,
                                height: 25,
                                backgroundColor: player.online ? "green" : "red",
                            }}
                            >
                            </Avatar>
                            <Typography  sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis", 
                            marginLeft: "0.5rem",
                            }}>
                                {player.name === "" ? "anonimus": player.name}
                            </Typography>
                            {player._id === id && 
                            <EditIcon 
                            onClick={() => handleOpenDialog({view: true, parametr: "name", name: String(player.name), bid: player.name})} 
                            sx={{width: 20, heigth: 20, position: "absolute", right: 0}}>
                            </EditIcon>}
                        </Box>
                    </TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
            {   
                auction?.parameters.map((parameter, idx) => {
                   return  <TableRow key={idx}>
                    <TableCell sx={{maxWidth: "25rem"}} key={parameter+idx}>
                        <Typography>{parameter}</Typography>
                    </TableCell>
                    {auction.participants.map((participant, index) => {
                        const activeTableCell = auction.currentBidder.index === index && id === auction.currentBidder.id && auction.status === "active";

                        return <TableCell
                        onClick={activeTableCell ? 
                        () => handleOpenDialog({view: true, parametr: parameter, name: String(participant.name), bid: participant[parameter]}) :
                        () => {}
                        }
                        key={participant._id + parameter}
                        align="center"
                        sx={{
                          cursor: `${activeTableCell? "pointer": ""}`,
                          '&:hover': {
                            backgroundColor: `${activeTableCell? "lightBlue": ""}`,
                          },
                        }}>
                        {participant[parameter]}
                        </TableCell>
                    })}
                </TableRow>
                })
            }
            </TableBody>
        </Table>
        </TableContainer>
        <Box sx={{backgroundColor: "white", padding: 2, display: "flex", justifyContent: "space-between"}}>
            <Typography sx={{color: "black"}}>Действия: {auction?.currentBidder.id === id && "можете изменить параметры в своём столбце или передать ход"}</Typography>
            {auction?.currentBidder.id === id && auction?.status === "active" && <Button onClick={handleNextTurn}>Передать ход</Button>}
            {id === "Admin" && auction?.status === "active" && <Button onClick={handleEndAuction}>Закончить аукцион</Button>}
            {id === "Admin" && auction?.status !== "active" &&  <Button onClick={handleStartAuction}>Начать аукцион</Button>}
        </Box>
        </>
    </Box>
    </>
    );
};

