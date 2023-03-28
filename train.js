import { createChart, updateChart } from "./scatterplot.js"

const nn = ml5.neuralNetwork({task: 'regression', debug: true})
// nn.load('./model/model.json', modelLoaded)
// let trainData
// let testData

function loadData(){
        Papa.parse("./data/winequality.csv", {
                download:true,
                header:true,
                dynamicTyping:true,
                complete: results => checkData(results.data)
        })
}loadData()


//Zet de ph en alchohol om naar x en y waarden.
function checkData(data){
        const chartdata = data.map(wine => ({
                x: wine.quality,
                y: wine.alchohol,
        }))

        // chartjs aanmaken
        createChart(chartdata, "Quality", "Alchohol")

        // data voorbereiden
        data.sort(() => (Math.random() - 0.5))
        let trainData = data.slice(0, Math.floor(data.length * 0.8))
        let testData = data.slice(Math.floor(data.length * 0.8) + 1)

        // data toevoegen aan neural network
        for (let wine of data) {
                nn.addData({ quality: wine.quality, citricAcid: wine.citricAcid, residualSugar: wine.residualSugar}, {alchohol: wine.alchohol})
        }
        nn.normalizeData()
        nn.train({ epochs: 10 }, () => finishedTraining())
}


async function finishedTraining() {
        let predictions = []
        for (let quality = 40; quality < 250; quality += 2) {
                const pred = await nn.predict({quality: quality})
                predictions.push({x: quality, y: pred[0].alchohol})
        }
        updateChart("Predictions", predictions)
}

async function makePrediction() {
        const testCar = { quality: testData[0].quality, citricAcid: testData[0].citricAcid, residualSugar:testData[0].residualSugar }
        const pred = await nn.predict(testCar)
        console.log(pred[0].alchohol)
}

async function drawPredictions() {
        let predictions = []
        for (let quality = 40; quality <= 250; quality += 5) {
                const prediction = await nn.predict({quality: ph})
                predictions.push({x: quality, y: prediction[0].alchohol})
        }    updateChart("Predictions", predictions)
}