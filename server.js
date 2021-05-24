const express = require('express');
const app = express();
const Papa = require('papaparse');
const fs = require('fs');
const { off } = require('process');

const file = fs.createReadStream('./vgsales.csv');

// const file = fs.readFile('./vgsales.csv', 'csv', (err, data) => {
//     if(!err) {
//         return data;
//     } else {
//         console.log(err)
//     }
// })

let dataFromPapa = [];


Papa.parse(file, {
    header: true,
    download: true,
    dynamicTyping: true,
    worker: true,
    // step: function(res) {
    //     // console.log(res.data)
    // },
    complete: function(res) {
        console.log('RES Все готово');
        dataFromPapa = res.data
        return dataFromPapa;
    },
    error: function (res) {
        console.log(res)
    }
})


app.get('/card/:rank', function (req, res) {
    console.log(req.params)
    const id = +req.params.rank;
    const card = dataFromPapa.find((el) => el.Rank === id);
    if(!card) {
        res.status(404).json("нет такого ранка");
        return;
    }
    res.status(200).json(card);
})


app.get('/card', function (req, res) {
    const count = parseInt(req.query.count);
    const offset = parseInt(req.query.offset);
    if(!dataFromPapa) {
        res.status(503).send('ОШИБКА');
        return;
    }
    if(offset < dataFromPapa.length - 1) {
        res.status(200).json(dataFromPapa.slice(offset, offset + count));   
        return
    }
        res.status(404).json("ОШИБКА")
})


app.listen(7777, () => {
    // console.log(dataFromPapa);
})