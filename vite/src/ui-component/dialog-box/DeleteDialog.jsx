import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Slide
} from '@mui/material';
import Fade from '@mui/material/Fade';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade in={props.in} ref={ref} {...props} />;
});

const DeleteDialog = ({open, onClose, onConfirm, name }) => {
    return (
        <Dialog
             open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle sx={{ color: '#545454', textAlign: 'center', fontSize: '1.6rem', fontWeight: '600' }}>Delete {name}?</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{textAlign: 'center'}}>
                Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </DialogContentText>
                    <Alert
                    severity="warning"
                    sx={{
                        mt: 2,
                        backgroundColor: 'rgba(255, 107, 129, 0.1)',
                        color: 'secondary.main',
                        textAlign: 'center',
                        justifyContent: 'center'
                    }}
                    >
                    Warning: Deleting this will permanently remove it.
                    </Alert>
            </DialogContent>
            <DialogActions sx={{ textAlign: 'center', justifyContent: 'center', paddingTop: '0' }}>
                <Button onClick={ onClose } variant="outlined" color="red"sx={{color: 'white', backgroundColor: '#DD3333', fontSize: '13px'}}>cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="secondary" sx={{ textTransform: 'none', fontSize: '13px', backgroundColor: '#673AB7' }}>Yes, Delete</Button>
            </DialogActions>
       </Dialog>
    )
}

export default DeleteDialog;