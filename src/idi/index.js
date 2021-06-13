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

import Highcharts from 'highcharts/highstock'
import Chart from './grafico';

// Load Highcharts modules
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/map')(Highcharts)

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
            balanza:[],
            columnsBalanza:[],
            idi1:[],
            columnsIDI1:[],
            idi2:[],
            columnsIDI2:[],
            avgT : 0,
            avgP : 0,
            value:0,
            options: {},
            
              tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                  '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                  '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                  '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
                footerFormat: '</table>',
                followPointer: true
              },
            
              plotOptions: {
                series: {
                  dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                  }
                }
              },
            
              series: [{
                data: [
                  { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                  { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                  { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                  { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                  { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                  { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                  { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                  { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                  { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                  { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                  { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                  { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                  { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                  { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                  { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
                ]
              }]
            
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

        const getCountries = (array) => {
          let arrayCountries = []
          let check = {}
          for (let i = 0; i < array.length; i++) {
            if(!check[array[i]['ReporterName']]){
              check[array[i]['ReporterName']] = true;
              arrayCountries.push(array[i]['ReporterName'])
            }
            
          }
          return(arrayCountries)
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

      const isMA = (element, average) => {
          if(element >= average){
            return 1;
          }
          else {
            return 0;
          }
      }

      const makeImpacto = (year) => {
        const {json} = this.state;
        let dataImpacto = [];
        let grandTotal = 0;
        let impacto = [];
        let columns = [];
        let average = 0;



        for (let i = 0; i < json.length; i++) {
          if(json[i]['Year'] === year && json[i]['TradeFlowName'] === 'Import' && json[i]['PartnerName'] === " World"){
            dataImpacto.push(json[i])
            grandTotal += parseFloat(json[i]['TradeValue in 1000 USD'])
          }
        }

        for(let i = 0; i < dataImpacto.length; i++){
          average +=  ((parseFloat(dataImpacto[i]['TradeValue in 1000 USD']) / grandTotal)*100)/dataImpacto.length            
        }

        for (let i = 0; i < dataImpacto.length; i++) {
          impacto.push([dataImpacto[i]['ReporterISO3'],
                        dataImpacto[i]['ReporterName'],
                        parseFloat(dataImpacto[i]['TradeValue in 1000 USD']),
                        parseFloat(dataImpacto[i]['NetWeight in KGM']),
                        (parseFloat(dataImpacto[i]['TradeValue in 1000 USD']) / grandTotal)*100,
                        isMA((parseFloat(dataImpacto[i]['TradeValue in 1000 USD']) / grandTotal)*100, average)
                      ])
        }

        columns = ["Reporter ISO3","ReporterName","Suma de TradeValue in 1000 USD", 'NetWeight in KGM', "Impacto", "Mercado Atractivo?"]
    
       //console.log(impacto.length)
       //console.log(impacto)
       
        this.setState({columns})
        this.setState({impacto})
        
      }

      const exportImpactoExcel = () => {
        let totalArray = [];
        const {columns, impacto} = this.state;
          totalArray.push([columns[0],columns[1],columns[2],columns[3],columns[4],columns[5]])   
        for (let i = 0; i < impacto.length; i++) {
          totalArray.push(impacto[i]);
        }
        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(totalArray)
         XLSX.utils.book_append_sheet(wb, wsAll, "Impacto")
         XLSX.writeFile(wb, "Impacto.xlsx")
      }

      const makeBalanza = (year) => {
        const {json} = this.state;
        let dataBalanza = [];
        let balanza = [];
        let countries = [];
        let columnsBalanza = [];

        for (let i = 0; i < json.length; i++) {
          if(json[i]['Year'] === year  && json[i]['PartnerName'] === " World"){
            dataBalanza.push(json[i])
          }
        }
        countries = getCountries(dataBalanza)

        for (let j = 0; j < countries.length; j++) { 
          let ischeck = false;
          for (let i = 0; i < dataBalanza.length; i++) {
            if(countries[j] === dataBalanza[i]['ReporterName'] ){
              if(dataBalanza[i]['TradeFlowName'] === 'Export'){
                ischeck = true;
                balanza.push([dataBalanza[i]['ReporterISO3'],
                            countries[j],
                          ])
              }
              if(!ischeck && dataBalanza[i]['TradeFlowName'] === 'Import'){
                balanza.push([dataBalanza[i]['ReporterISO3'],
                countries[j],
              ])
              }
            }
          }
        }

        for (let i = 0; i < balanza.length; i++) {
          for (let j = 0; j < dataBalanza.length; j++) {
            //console.log(balanza[i][1])
            if(balanza[i][1] === dataBalanza[j]['ReporterName'] && dataBalanza[j]['TradeFlowName'] === 'Export'){
              balanza[i].push(parseFloat(dataBalanza[j]['TradeValue in 1000 USD']))
            }
          }
        }

        for (let i = 0; i < balanza.length; i++) {
          if(balanza[i][2] === undefined){
            balanza[i][2] = 0
          }    
        }

        for (let i = 0; i < balanza.length; i++) {
          for (let j = 0; j < dataBalanza.length; j++) {
            //console.log(balanza[i][1])
            if(balanza[i][1] === dataBalanza[j]['ReporterName'] && dataBalanza[j]['TradeFlowName'] === 'Import'){
              balanza[i].push(parseFloat(dataBalanza[j]['TradeValue in 1000 USD']))
            }
          }
        }

        for (let i = 0; i < balanza.length; i++) {
          if(balanza[i][3] === undefined){
            balanza[i][3] = 0
          }    
        }

        for (let i = 0; i < balanza.length; i++) {
          balanza[i].push((balanza[i][2] - balanza[i][3])*1000)
          if(balanza[i][4] < 0){
            balanza[i].push(1)
          }
          else{
            balanza[i].push(0)
          }
        }
        columnsBalanza = ['Reporter ISO3', 'ReporterName', 'Export', 'Import', 'Balanza Comercial', 'Mercado Atractivo?']
        this.setState({balanza})
        this.setState({columnsBalanza})


      }

      const exportBalanzaExcel = () => {
        let totalArray = [];
        const {columnsBalanza, balanza} = this.state;
          totalArray.push([columnsBalanza[0],columnsBalanza[1],columnsBalanza[2],columnsBalanza[3],columnsBalanza[4],columnsBalanza[5]])   
        for (let i = 0; i < balanza.length; i++) {
          totalArray.push(balanza[i]);
        }
        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(totalArray)
         XLSX.utils.book_append_sheet(wb, wsAll, "Balanza")
         XLSX.writeFile(wb, "BalanzaComercial.xlsx")
      }

     const makeIDI = () => {
       const {impacto, balanza} = this.state;
       //console.log(impacto, "IMPACTO")
       //console.log(balanza, "BALANZA")
       let columnsIDI1 = [];
       let columnsIDI2 = [];
       let maxImpacto = -999999999999;
       let minImpacto = 999999999999;
       let maxBalanza = -999999999999;
       let minBalanza = 999999999999;
       let idi1 = [];
       let idi2 = [];
       let dataTable = [];
       let kgAndValueIDI1 = []
       let avgP;
       let avgT;
       let totalP = 0;
       let totalT = 0;
       let options = {}; 

       for (let i = 0; i < impacto.length; i++) {
         if(impacto[i][5] === 1 && balanza[i][5] === 1){
           idi1.push([impacto[i][0],impacto[i][1],impacto[i][4],balanza[i][4]])
           idi2.push([impacto[i][0],impacto[i][1]])
           kgAndValueIDI1.push([impacto[i][3],impacto[i][2]])
           if(maxImpacto < impacto[i][4]){
              maxImpacto = impacto[i][4];
           }
           if(minImpacto > impacto[i][4]){
            minImpacto = impacto[i][4];
           }
           if(maxBalanza < balanza[i][4]){
            maxBalanza = balanza[i][4];
           }
           if(minBalanza > balanza[i][4]){
            minBalanza= balanza[i][4];
           }
         }  
       }

       for (let i = 0; i < idi1.length; i++) {
         idi1[i].push((idi1[i][2] - minImpacto)/(maxImpacto - minImpacto),
          (idi1[i][3] - maxBalanza)/(minBalanza - maxBalanza))
         
       }

       columnsIDI1 = ['Reporter ISO3', 'ReporterName', 'Impacto', 'Balanza Comercial', 'Impacto Estandarizado', 'Balanza Estandarizada']

       this.setState({idi1})
       this.setState({columnsIDI1})
       //console.log(kgAndValueIDI1)
       for (let i = 0; i< idi2.length; i++) {
        idi2[i].push((idi1[i][4] + idi1[i][5])/2, kgAndValueIDI1[i][0], kgAndValueIDI1[i][0]/1000, kgAndValueIDI1[i][1], (kgAndValueIDI1[i][1] * 1000)/(kgAndValueIDI1[i][0]/1000))
        totalT += kgAndValueIDI1[i][0]/1000
        totalP += (kgAndValueIDI1[i][1] * 1000)/(kgAndValueIDI1[i][0]/1000)
       }

       for (let i = 0; i < idi2.length; i++) {
          dataTable.push({country: idi2[i][1], x: idi2[i][4], y: idi2[i][6]})
       }
       console.log(dataTable)
       avgT = totalT/idi2.length
       avgP = totalP/idi2.length

       columnsIDI2 = ['Reporter ISO3', 'ReporterName','IDI','Cantidad en Kg', 'Cantidad en toneladas', 'Valor Importado MUSD', 'Precio Unitario (US$/t)']

       options = {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
        },
      
        legend: {
          enabled: false
        },
      
        title: {
          text: 'Indice de Dependencia Importadora(IDI)'
        },
      
        subtitle: {
          text: 'Hecho por:<a href="https://ivaldes8.github.io/miPortafolio/">Iván González</a> y <a href="http://www.disaic.cu/">la Casa Consultora DISAIC</a>'
        },
      
        accessibility: {
          point: {
            valueDescriptionFormat: '{index}. {point.name}, Valor: {point.x}g, Cantidad: {point.y}g, Mercado: {point.z}%.'
          }
        },
      
        xAxis: {
          gridLineWidth: 1,
          title: {
            text: 'Cantidad Importada'
          },
          labels: {
            format: '{value} u'
          },
          plotLines: [{
            color: 'black',
            dashStyle: 'dot',
            width: 3,
            value: avgT,
            label: {
              rotation: 0,
              y: 15,
              style: {
                fontStyle: 'italic'
              },
              //text: 'Safe fat intake 65g/day'
            },
            zIndex: 3
          }],
          //accessibility: {
           //rangeDescription: 'Range: 60 to 100 grams.'
          //}
        },
      
        yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
            text: 'Valor Unitario()US$/t'
          },
          labels: {
            format: '{value} US$'
          },
          maxPadding: 0.2,
          plotLines: [{
            color: 'black',
            dashStyle: 'dot',
            width: 3,
            value: avgP,
            label: {
              align: 'right',
              style: {
                fontStyle: 'italic'
              },
              //text: 'Safe sugar intake 50g/day',
              x: -10
            },
            zIndex: 3
          }],
          //accessibility: {
            //rangeDescription: 'Range: 0 to 160 grams.'
          //}
       },
       tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
          '<tr><th>Cantidad:</th><td>{point.x}u</td></tr>' +
          '<tr><th>Valor:</th><td>{point.y}$</td></tr>',
        footerFormat: '</table>',
        followPointer: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.country}'
          }
        }
      },
      series: [{
        data: dataTable
      }]
    
      }

       this.setState({avgT})
       this.setState({avgP})
       this.setState({columnsIDI2})
       this.setState({idi2})
       console.log(idi2)
       this.setState({options})

     }

     const exportIDIExcel = () => {
      let totalArray1 = [];
      let totalArray2= [];
      const {columnsIDI1, columnsIDI2, idi1, idi2} = this.state;
        totalArray1.push([columnsIDI1[0],columnsIDI1[1],columnsIDI1[2],columnsIDI1[3],columnsIDI1[4],columnsIDI1[5]])  
        totalArray2.push([columnsIDI2[0],columnsIDI2[1],columnsIDI2[2],columnsIDI2[3],columnsIDI2[4],columnsIDI2[5],columnsIDI2[6]])    
      for (let i = 0; i < idi1.length; i++) {
        totalArray1.push(idi1[i]);
      }
      for (let i = 0; i < idi2.length; i++) {
        totalArray2.push(idi2[i]);
      }
      const wb = XLSX.utils.book_new()
      const wsAll = XLSX.utils.aoa_to_sheet(totalArray1)
      const wsAll2 = XLSX.utils.aoa_to_sheet(totalArray2)
       XLSX.utils.book_append_sheet(wb, wsAll, "IDI1")
       XLSX.utils.book_append_sheet(wb, wsAll2, "IDI2")
       XLSX.writeFile(wb, "IDI.xlsx")
     }

     const exportAllExcel = () => {
      let totalArray = [];
      let totalArray2 = [];
      let totalArray3 = [];
      let totalArray4 = [];
        const {columns, columnsBalanza, columnsIDI1, columnsIDI2, impacto, balanza, idi1 , idi2} = this.state;
          totalArray.push([columns[0],columns[1],columns[2],columns[3],columns[4],columnsBalanza[5]])  
          totalArray2.push([columnsBalanza[0],columnsBalanza[1],columnsBalanza[2],columnsBalanza[3],columnsBalanza[4],columnsBalanza[5]])
          totalArray3.push([columnsIDI1[0],columnsIDI1[1],columnsIDI1[2],columnsIDI1[3],columnsIDI1[4],columnsIDI1[5]])  
          totalArray4.push([columnsIDI2[0],columnsIDI2[1],columnsIDI2[2],columnsIDI2[3],columnsIDI2[4],columnsIDI2[5],columnsIDI2[6]]) 
        for (let i = 0; i < impacto.length; i++) {
          totalArray.push(impacto[i]);
        }
        for (let i = 0; i < balanza.length; i++) {
          totalArray2.push(balanza[i]);
        }
        for (let i = 0; i < idi1.length; i++) {
          totalArray3.push(idi1[i]);
        }
        for (let i = 0; i < idi2.length; i++) {
          totalArray4.push(idi2[i]);
        }
        const wb = XLSX.utils.book_new()

        const wsAll = XLSX.utils.aoa_to_sheet(totalArray)
        XLSX.utils.book_append_sheet(wb, wsAll, "impacto")
        const wsAll2 = XLSX.utils.aoa_to_sheet(totalArray2)
        XLSX.utils.book_append_sheet(wb, wsAll2, "Balanza")
        const wsAll3 = XLSX.utils.aoa_to_sheet(totalArray3)
        XLSX.utils.book_append_sheet(wb, wsAll3, "IDI1")
        const wsAll4 = XLSX.utils.aoa_to_sheet(totalArray4)
        XLSX.utils.book_append_sheet(wb, wsAll4, "IDI2")
         XLSX.writeFile(wb, "Indice de Dependencia Importadora.xlsx")
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
                                  <button onClick = {() => exportImpactoExcel()}>Descargar Impacto en Excel</button>
                                  <TableContainer>
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
                                        <TableRow key = {index}>
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
                            <Typography>Balanza Comercial</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <label>Select a year:</label>
                                  <select name="years" id="years"
                                    onChange = {(e) => {
                                      makeBalanza(e.target.value)
                                    }}
                                  >
                                    {this.state.years.map((item, index) => (
                                      <option value={item} key = {index}>{item}</option>
                                    ))}
                                  </select>
                              {this.state.balanza.length > 0 && 
                              <div>
                                <button onClick = {() => exportBalanzaExcel()}>Descargar Balanza en Excel</button>
                                <TableContainer>
                                  <Table stickyHeader size="small" aria-label="a dense table">
                                    <TableHead>
                                    <TableRow>
                                      {this.state.columnsBalanza.map((item,index) => (
                                        <TableCell component="th" key = {index}>{item}</TableCell>
                                      ))}
                                    </TableRow> 
                                    </TableHead>
                                    <TableBody>
                                      {this.state.balanza.map((item,index) => (
                                        <TableRow key = {index}>
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
                        { this.state.balanza.length > 0 && this.state.impacto.length > 0 && 
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                            >
                            <Typography>ïndice de Dependencia Importadora</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <button onClick = {() => makeIDI()}>Calcular IDI</button>
                            <br/>
                            {this.state.idi1.length > 0 &&
                            <div>
                               <button onClick = {() => exportIDIExcel()}>Descargar IDI en excel</button>
                               <button onClick = {() => exportAllExcel()}>Descargar Todo menos el gráfico en un solo excel</button>
                            </div>  
                            }
                           
                            {this.state.idi1.length > 0 && 
                            <div>
                              <TableContainer>
                                <Table stickyHeader size="small" aria-label="a dense table">
                                  <TableHead>
                                  <TableRow>
                                    {this.state.columnsIDI1.map((item,index) => (
                                      <TableCell component="th" key = {index}>{item}</TableCell>
                                    ))}
                                  </TableRow> 
                                  </TableHead>
                                  <TableBody>
                                    {this.state.idi1.map((item,index) => (
                                      <TableRow key = {index}>
                                        {item.map((item2,index2) => (
                                            <TableCell key = {index2}>{item2}</TableCell>
                                        ))}
                                      </TableRow> 
                                    ))}  
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <br/>
                              <hr/>
                              <br/>
                              <TableContainer>
                                <Table stickyHeader size="small" aria-label="a dense table">
                                  <TableHead>
                                  <TableRow>
                                    {this.state.columnsIDI2.map((item,index) => (
                                      <TableCell component="th" key = {index}>{item}</TableCell>
                                    ))}
                                  </TableRow> 
                                  </TableHead>
                                  <TableBody>
                                    {this.state.idi2.map((item,index) => (
                                      <TableRow key = {index}>
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
                        }
                        {this.state.idi1.length > 0 && 
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                            >
                            <Typography>Gráfico</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                           <Chart options={this.state.options} highcharts={Highcharts} />
                          </AccordionDetails>
                        </Accordion>
                        }
                    </div>
                : null}
            </div>
            
        );
    }
}

export default index;