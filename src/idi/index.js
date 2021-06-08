import React, { Component } from 'react';
import XLSX from 'xlsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            cols:[],
            rows:[],
            json:[],
            years:[],
            columns:[],
            selectedYear:'',
            impacto:[],
            value:0,
        }
    }

    

    render() {
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

        const getYears = () => {
          const {json} = this.state;
          let arrayYears = []
          let check = {}
          for (let i = 0; i < json.length; i++) {
            if(!check[json[i]['Year']]){
              check[json[i]['Year']] = true;
              arrayYears.push(json[i]['Year'])
            }
            
          }
          return(arrayYears)
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
              const forWork = XLSX.utils.sheet_to_json(ws);
              this.setState({cols:forRows[0]});
              const rows = createRows(forRows);
              this.setState({rows:rows})
              this.setState({json:forWork})
              this.setState({years: getYears()})
              //setColumns(cols);
              //console.log(forWork,"For Work");
              //console.log(forColumns,"For Columns");
          }   
        }

      const makeImpacto = (year) => {
        const {json} = this.state;
        let dataImpacto = [];
        let grandTotal = 0;
        let impacto = [];
        let columns = [];
        let countrys = [];


        for (let i = 0; i < json.length; i++) {
          if(json[i]['Year'] === year && json[i]['TradeFlowName'] === 'Import' && json[i]['PartnerName'] === " World"){
            dataImpacto.push(json[i])
            countrys.push(json[i]['ReporterName'])
            grandTotal += parseInt(json[i]['TradeValue in 1000 USD'])
          }
        }

        for (let i = 0; i < dataImpacto.length; i++) {
          impacto.push([dataImpacto[i]['ReporterISO3'],
                        dataImpacto[i]['ReporterName'],
                        dataImpacto[i]['TradeValue in 1000 USD'],
                        (parseInt(dataImpacto[i]['TradeValue in 1000 USD']) / grandTotal)*100,
                      ])
        }
        columns = ["Reporter ISO3","ReporterName","Suma de TradeValue in 1000 USD", "Impacto"]
        this.setState({columns})
        this.setState({impacto})
        
      }

      const exportExcel = () => {
        let totalArray = [];
        const {columns, impacto} = this.state;
          totalArray.push([columns[0],columns[1],columns[2],columns[3]])   
        for (let i = 0; i < impacto.length; i++) {
          totalArray.push(impacto[i]);
        }
        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(totalArray)
         XLSX.utils.book_append_sheet(wb, wsAll, "All Users")
         XLSX.writeFile(wb, "export-demo.xlsx")
      }

        return (
            <div> 
                <AppBar position="static">
                    <Toolbar>
                    <Typography variant="h6">
                        Generador de Indice de Dependencia Importadora
                    </Typography>
                    </Toolbar>
                </AppBar>
                <hr/> 
                <input accept = ".xlsx" type="file" id="contained-button-file" 
                    onChange = {(e) => {
                                const file = e.target.files[0];
                                readExcel(file);
                    }}/>
                <hr/>                
                <hr/>
                {this.state.rows.length? 
                    <div>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Typography>Impacto</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                  <label>Select a year:</label>
                                  <select name="years" id="years"
                                    onChange = {(e) => {
                                      makeImpacto(e.target.value)
                                    }}
                                  >
                                    {this.state.years.map((item, index) => (
                                      <option value={item} key = {index}>{item}</option>
                                    ))}
                                  </select>
                              {this.state.impacto.length > 0 &&
                                <div>
                                  <button onClick = {() => exportExcel()}>Descargar Excel</button>
                                  <TableContainer component = {Paper}>
                                  <Table stickyHeader size="small" aria-label="a dense table">
                                    <TableHead>
                                    <TableRow>
                                      {this.state.columns.map((item,index) => (
                                        <TableCell component="th" key = {index}>{item}</TableCell>
                                      ))}
                                    </TableRow> 
                                    </TableHead>
                                    <TableBody>
                                      {this.state.impacto.map((item,index) => (
                                        <TableRow>
                                          {item.map((item2,index2) => (
                                              <TableCell key = {index2}>{item2}</TableCell>
                                          ))}
                                        </TableRow> 
                                      ))}  
                                    </TableBody>
                                  </Table>
                                  </TableContainer>
                                </div>

                              }
                                
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                            >
                            <Typography>Balanza</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                : null}
            </div>
            
        );
    }
}

export default index;