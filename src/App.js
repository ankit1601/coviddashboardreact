import React, {useState, useEffect} from 'react';
import './App.css';
import {formControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core';

import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData , prettyPrintStat} from './utils';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  //https://disease.sh/v3/covid-19/countries

  
// ​https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

// ​https://disease.sh/v3/covid-19/all

  // USEREFFECT = Runs a piece of Code
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryinfo, setCountryInfo] = useState([])
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4790})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response=> response.json())
    .then(data => {
      setCountryInfo(data)
    })
  },[])

  // this empty array in the useEffect is there so that
  // So that it will be called once app loads

  useEffect (()=>{
    // The code inside here will run omce

    // when the component loads and not again
  
    const getCountriesData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country)=>(
          {
            name: country.country, // United STate
            value:country.countryInfo.iso2 // UK
          }
        ))

        const sortedData = sortData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log(countryCode,"---------------------")
    // setCountry(countryCode);

    const url = countryCode == "worldwide" ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}` 
    // see above we didnot use regular quotes because we wanted to include javascript in url

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("DATA LAT LONG",data)
      setCountry(countryCode)
      //All of the data from the response
      setCountryInfo(data)
      if (countryCode === 'worldwide'){
        setMapCenter([34.80746, -40.4790])
      }
      else{
        setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      }
      
      setMapZoom(4)
    });

    // ​https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // ​https://disease.sh/v3/covid-19/all


  };
  console.log("CountryInfo-->", countryinfo)

  return (
    <div className="app">
      <div className="app__left">
                <div className="app__header">
                <h1>COVID-19 TACKER</h1>

                  <formControl className='app__dropdown'>
                    <Select variant = "outlined" 
                            value={country}
                            onChange = {onCountryChange}>
                      <MenuItem value="worldwide">WorldWide</MenuItem>
                      {countries.map((country)=>(
                            <MenuItem value={country.value}>{country.name}</MenuItem>
                      ))}
                    
                      {/* <MenuItem>WordWide</MenuItem>
                      <MenuItem>WordWide</MenuItem>
                      <MenuItem>WordWide</MenuItem> */}
                    </Select>
                  </formControl>
                </div>

                <div className="app_stats">
                  {/* inforbox zcorona virus cases */}
                  {/* inforbox corona virus recovery*/}
                  {/* inforbox */}
                  <InfoBox 
                          active = {casesType === 'cases'}
                          casesType={casesType}
                          caseTypeValue = {'cases'}
                          onClick ={e => setCasesType('cases')}
                           title="Coronovirus Cases" 
                           cases={prettyPrintStat(countryinfo.todayCases)} 
                           total={prettyPrintStat( countryinfo.cases)}/>
                  <InfoBox 
                          active = {casesType === 'recovered'}
                          casesType={casesType}
                          caseTypeValue = {'recovered'}
                          onClick ={e => setCasesType('recovered')}
                           title="Recovered" 
                           cases={prettyPrintStat(countryinfo.todayRecovered)} 
                           total={prettyPrintStat(countryinfo.recovered)} />
                  <InfoBox 
                          active = {casesType === 'deaths'}
                          casesType={casesType}
                          caseTypeValue = {'deaths'}
                          onClick ={e => setCasesType('deaths')}
                           title="Deaths" 
                           cases={prettyPrintStat(countryinfo.todayDeaths)} 
                           total={prettyPrintStat(countryinfo.deaths)}/>

                </div>
              
                  {/* Header */}
                  {/* Title + Selecte input dropdown */}
                
                

                 

                  {/* map */}
                  <Map 
                       countries={mapCountries} 
                       center={mapCenter} 
                       zoom={mapZoom}
                       casesType={casesType}/>
      </div>
      <Card className="app__right">
                <CardContent>
                  <h3>Live Cases By Country</h3>
                      <Table countries={tableData}/>
                    <h3>World wide new {casesType}</h3>
                  <LineGraph className="app__graph" casesType={casesType}/>
                </CardContent>
                {/* table */}
                {/* Graph */}
      </Card>
    </div>
  );
}

export default App;
