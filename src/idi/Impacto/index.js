import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

function Index(props) {
    const [ano, setAno] = useState('');

    const handleChange = (event) => {
        setAno(event.target.value);
      };

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
          },
          selectEmpty: {
            marginTop: theme.spacing(2),
          },
      }));

    const classes = useStyles();

    const json = props.json;
    return (
      <div>
        
      </div>
    );
}

export default Index;