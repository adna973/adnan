import React from "react";
import Paper from '@material-ui/core/Paper';
import ErrorIcon from '@material-ui/icons/Error';
import { Grid, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import ResultListDialog from "./ResultListDialog"

class Bar extends React.Component {

    render() {
        if (this.props.loading) {
            return (
                <Paper style={{ padding: "5px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={2}>
                            <CachedIcon />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography align="center">
                                loading OSM data
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper  >
            );
        } else {
            if ((Object.getOwnPropertyNames(this.props.osmDataCounted).length > 0))
                return (
                    <ResultListDialog osmDataCounted={this.props.osmDataCounted} osmData={this.props.osmData} range={this.props.range} />
                );
            else if (this.props.osmError) {
                return (
                    <Paper style={{ padding: "5px" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={2}>
                                <ErrorIcon color="error" />
                            </Grid>
                            <Grid item xs={10}>
                                <Typography align="center" color="error">
                                    {this.props.osmError.message}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper  >
                );
            } else {
                return <React.Fragment />
            }
        }
    }

}
export default Bar;