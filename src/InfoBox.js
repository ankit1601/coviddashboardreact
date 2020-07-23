import React from 'react'
import {Card, CardContent, Typography}  from '@material-ui/core';
import './InfoBox.css';

function InfoBox({title, cases, total, ...props}) {
    return (
        <Card 
            onClick = {props.onClick}
            className={`infoBox ${props.active && "infoBox--selected--"}${props.casesType} `}>
            <CardContent >
                {/*  Title i.e Coronavirus */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases  infoBox--fontColor--${props.caseTypeValue}`}>{cases}</h2>

                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>


            </CardContent>
        </Card>
    )
}

export default InfoBox;
