import { createChart, updateChart} from "./scatterplot.js"
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
let trainData;
let testData;

//Buttons
const predictButton = document.getElementById("predict");
const saveButton = document.getElementById("save");
const result = document.getElementById("result");

saveButton.addEventListener("click", () => save());
predictButton.addEventListener("click", () => makePrediction());


function loadData(){
        Papa.parse("./data/winequality.csv", {
                download:true,
                header:true,
                dynamicTyping:true,
                complete: results => checkData(results.data)
        });
}

//Zet de ph en alcohol om naar x en y waarden.
function checkData(data){
        // data voorbereiden
        data.sort(() => (Math.random() - 0.5))
        trainData = data.slice(0, Math.floor(data.length * 0.8))
        testData = data.slice(Math.floor(data.length * 0.8) + 1)
        console.table(data)

        // data toevoegen aan neural network
        for (let wine of trainData) {
                nn.addData({alcohol: wine.alcohol, citricAcid: wine.citricAcid, residualSugar: wine.residualSugar}, {quality: wine.quality})
        }

        nn.normalizeData()

        const chartdata = data.map(wine => ({
                x: wine.alcohol,
                y: wine.quality,
        }))

        // chartjs aanmaken
        createChart(chartdata, "Quality", "Alcohol");

        nn.train({ epochs: 10 }, () => finishedTraining());
}

async function finishedTraining() {
       console.log("Finished");
}

async function makePrediction() {

        let wineAlcohol = document.getElementById('Alcohol').value;
        let wineCitricAcid = document.getElementById('citricAcid').value;
        let residualSugar = document.getElementById('residualSugar').value;

        const results = await nn.predict({ alcohol:parseInt(wineAlcohol), CitricAcid:parseInt(wineCitricAcid), residualSugar:parseInt(residualSugar) })
        result.innerText = `The wine quality: ${(results[0].quality)}`
}

function save(){
        nn.save();
}

loadData()

