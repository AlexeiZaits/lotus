import Button from "@mui/material/Button/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent/CardContent"
import Typography from "@mui/material/Typography/Typography"
import { Link } from "react-router-dom"

interface IAuctionCard {
    id: string,
    name: string,
    link: string,
    isActive: boolean,
    startDate: Date,
}

export const AuctionCard = ({name, link, isActive, startDate}: IAuctionCard) => {
    return <Card
        sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.03)',
        },
        }}
    >
        <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
            {name}
        </Typography>
        <Typography
            variant="body1"
            color={isActive ? 'success.main' : 'error.main'}
        >
            {isActive ? 'Активный' : 'Неактивный'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            Дата начала: {new Date(startDate).toLocaleString()}
        </Typography>
        <Button
            component={Link}
            to={`/auction/${link}/Admin`}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
        >
            Перейти к аукциону
        </Button>
        </CardContent>
    </Card>
}