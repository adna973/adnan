import React from 'react';
import {
  IconButton, Dialog, ListItem,
  List, ListItemIcon, AppBar, Toolbar, Typography, ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { typeIconMapper, typeColorMapper } from './Mapping'
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Badge from '@material-ui/core/Badge';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';
import MapIcon from '@material-ui/icons/Map';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function ResultListDialog({
  osmDataCounted,
  osmData,
  range
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Paper onClick={handleClickOpen} style={{ padding: "10px" }}>
        {Object.keys(osmDataCounted)
          .map((key) => (
            <Tooltip key={`tooltip-${key}`} title={key} aria-label={key}>
              <Badge badgeContent={osmDataCounted[key]} style={{ color: typeColorMapper(key) }}>
                {typeIconMapper(key)}
              </Badge>
            </Tooltip>
          ))}
      </Paper  >
      <Dialog fullScreen open={open} onClose={handleClose} >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              POIs within {range}m range
            </Typography>
          </Toolbar>
        </AppBar>
        <List dense={true}>
          {osmData
            .map((entry, idx) => (
              <ListItem alignItems="flex-start" key={`listitem-${idx}`} >
                <ListItemAvatar>
                  <Avatar>
                    {typeIconMapper(entry.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={entry.name} secondary={entry.address.street + " " + entry.address.housenumber + ", " + entry.address.postcode + " " + entry.address.city} />
                <ListItemIcon>
                  <IconButton color="primary" disabled={!entry.phone} onClick={() => window.open("tel:" + entry.phone, "_blank")}>
                    <PhoneIcon />
                  </IconButton>
                </ListItemIcon>
                <ListItemIcon>
                  <IconButton color="primary" disabled={!entry.website} onClick={() => window.open(entry.website, "_blank")}>
                    <LanguageIcon />
                  </IconButton>
                </ListItemIcon>
                <ListItemIcon>
                  <IconButton color="primary" onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=" + entry.lat + "%2C" + entry.lon, "_blank")}>
                    <MapIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            ))}
        </List>
      </Dialog>
    </div >
  );
}