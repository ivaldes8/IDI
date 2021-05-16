import React, { Component } from 'react';
import '../App.css';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardActionArea } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Stack from '@material-ui/core/Stack';
import logo from '../logo.svg';
import LOgo from '../logo_oficial.png';
import Divider from '@material-ui/core/Divider';

import NavigationTabs from './tabsNavigation/index';

class index extends Component {

    render() {

       const StyledToolbar = styled(Toolbar)(({ theme }) => ({
            alignItems: 'flex-start',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(2),
            // Override media queries injected by theme.mixins.toolbar
            '@media all': {
              minHeight: 80,
            },
          }));
        
       
        return (
            
            <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <StyledToolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, alignSelf: 'flex-end' }}
                        >
                            Generador de índice de dependencia importadora(IDI)
                        </Typography>
                        </StyledToolbar>
                    </AppBar>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid xs={0} md={5} xl={5}></Grid>
                        <Grid xs={12} md={2} xl={2}>
                        <Card>
                            <CardActionArea>
                                <CardContent>
                                <Stack direction="row" spacing={5}>
                                    <Avatar src={logo}/>
                                    <Avatar src={LOgo}/>
                                    <Avatar src={logo}/>
                                </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        </Grid>
                        <Grid xs={0} md={5} xl={5}></Grid>
                    </Grid>
                </Box>
                <br/>
            <Divider/>

                <NavigationTabs/>

            </div>
        );
    }
}

index.propTypes = {

};

export default index;