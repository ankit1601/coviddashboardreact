import React,{useState,useEffect} from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
const options = {
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        }
    },
    maintainAspectRation:false,
    tootips:{
        mode:'index',
        intersect:false,
        callbacks:{
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales:{
        xAxes:[{
            type:"time",
            time:{
                format:"MM/DD/YY",
                toottipFormat:"ll"
            }
        }
      ],
      yAxes: [
          {
              gridLines: {
                display: false,
              },
              ticks:{
                  callback:function(value, index, values){
                      return numeral(value).format('0a');
                  }
              }
          }
      ]
    }
}

function LineGraph({casesType="cases", ...props}) {
    //https://disease.sh/v3/covid-19/historicall/all?lastdays=120
    const [data, setData] = useState([])
    useEffect( ()=>{
        const fetchData = async () =>{
            await  fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then( response => response.json())
            .then((data)=>{
                //clever stuff here
                console.log("----> GRAPH",data);
                const chartData = buildChartData(data, casesType);
                setData(chartData)
            }); 
        }
        fetchData()
      
    }, [casesType])

    const buildChartData = (data, casesType='cases') =>{
        const chartData = [];
        let lastDataPoint;
        console.log("CASESSSSSS",data[casesType])
        for (let date in data[casesType]) {
            if(lastDataPoint){
                const newDataPoint = {
                    x:date,
                    y:data[casesType][date] - lastDataPoint
                }

                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }
    return (
        <div className={props.className}>
            {/* <h1>I am Graph</h1> */}
            {data?.length>0 && ( <Line 
                options={options}
            data={
                {  
                    datasets:[{
                        backgroundColor:"rgba(204, 16, 52, 0.5)",
                        bordorColor:"#CC1034",
                        data:data}]
                }
            }></Line>) }
           
        </div>
    )
}

export default LineGraph
