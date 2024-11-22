import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

interface EditPriceDialogProps {
  name: string;
  open: boolean;
  currentBid: string|number|boolean;
  parametr: string;
  onClose: () => void;
  onSave: (parametr: string, currentBid: string|boolean|number) => void;
}

export const EditPriceDialog = ({ name, open, onClose, onSave, currentBid, parametr }: EditPriceDialogProps) => {
  const [bid, setBid] = useState<string|boolean|number>(currentBid);
  
  const handleSave = () => {
    onSave(parametr, bid);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {parametr === "name" ? <Box>Введите название компании</Box>:
        <>
        <Box>Параметр: {parametr}</Box>
        <Box>Компания: {name}</Box>
        <Box>Текущее значение: {currentBid}</Box>
        </>}
      </DialogTitle>
      <DialogContent>
      <TextField
          label="Новое значение"
          type={typeof(bid)}
          value={bid}
          onChange={(e) => {
            if (typeof(bid) === "number"){
              setBid((Number(e.target.value)))
            } else {
              setBid((e.target.value))
            }
          }}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отменить
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};