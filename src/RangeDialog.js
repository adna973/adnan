import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

export default function RangeDialog({
    defaultRange,
    handleRangeChange,
    loadOSMData
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLoad = () => {
        setOpen(false);
        loadOSMData();
    };

    const marks = [
        {
            value: 500,
            label: '0.5 km',
        },
        {
            value: 1500,
            label: '1.5 km',
        },
        {
            value: 3000,
            label: '3 km',
        }
    ];

    function valuetext(value) {
        return `${value}km`;
    }


    return (
        <div>
            <Fab size="small" onClick={handleClickOpen}><AutorenewIcon /></Fab >
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"set range to search for POIs"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item>
                        </Grid>
                        <Grid item xs>
                            <Typography id="discrete-slider-always" gutterBottom>
                            </Typography>
                            <Slider value={defaultRange} onChange={handleRangeChange}
                                aria-labelledby="discrete-slider-always" step={500} defaultValue={1500} min={500} max={3000}
                                marks={marks} getAriaValueText={valuetext} valueLabelDisplay="off" />
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleLoad} color="primary" autoFocus>
                        Load
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}