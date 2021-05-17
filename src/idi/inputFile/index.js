import React, { Component } from 'react';
import XLSX from 'xlsx';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class index extends Component {

    

    state = {
        cols:[],
        rows:[]
    }

    

    render() {
        const Input = styled('input')({
            display: 'none',
          });

          const useStyles = makeStyles({
            table: {
              minWidth: 650,
            },
            hideLastBorder: {
              '&:last-child td, &:last-child th': {
                border: 0,
              },
            },
          });

          const createRows = (rows) => {
              let array = []
              for (let i = 1; i < rows.length; i++) {
                  for( let j = 0; j < rows[i].length; j++){
                    // eslint-disable-next-line eqeqeq
                    if(rows[i][j] == undefined){
                        rows[i][j] = " ";
                    }
                  }
                array.push(rows[i]); 
              }
              return array;
          }

        const readExcel = (file) => {
            //const [excel,setExcel] = useState('');
            //const [columns, setColumns] = useState(true);
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e) => {
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type: 'binary'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const forRows = XLSX.utils.sheet_to_json(ws, {header:1});
                const forColumns = XLSX.utils.sheet_to_json(ws, {header:1});
                this.setState({cols:forColumns[0]});
                const rows = createRows(forRows);
                this.setState({rows:rows})
                //setColumns(cols);
                //console.log(this.state.data,"For Rows");
                //console.log(forColumns,"For Columns");
            }   
            
        }
        return (
            <div>
                <label htmlFor="contained-button-file">
                    <Input accept = ".xlsx" id="contained-button-file" type="file" onChange = {(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                    }}/>
                    <Button variant="contained" component="span">
                        Subir Excel
                    </Button>
                </label>
                <hr/>

                <TableContainer component={Paper}>
                    <Table className={useStyles.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            {this.state.cols.map((col,index) => (
                                <TableCell key = {index}>{col}</TableCell>
                                ))
                            }
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.rows.map((data,index) => (
                            <TableRow key={index} className={useStyles.hideLastBorder}>
                            {data.map((row,index) => (
                                <TableCell key={index} component="th" scope="row">
                                    {row}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
        );
    }
}

index.propTypes = {

};

export default index;