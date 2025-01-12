Vue.createApp({
    data() {
        return {
            columns: ['Posicion', 'Alumno', 'Necesita plata?', 'Necesita sacar materias?', 'Se quiere morir?'],
            rows: [['Juanma', 'SI', 'SI', 'SI'], ['Juanma', 'SI', 'SI', 'SI'], ['Juanma', 'SI', 'SI', 'SI'], ['Juanma', 'SI', 'SI', 'SI']]
        }
    },
    computed: {

    },
    methods: {
        getInfo(table) {
            // Aca se decodifica el archivo con la info de los alumnos
            this.columns = table.shift();
            this.rows = table;
        },
        upload() {
            var fileUpload = document.getElementById("fileRespuestas");
            const reader = new FileReader();
            var rawData;
            reader.addEventListener('load', (event) => {
                rawData = event.target.result;
                // console.log("rawData", rawData);
                //this.columns = table.values.targe;
                var table = Papa.parse(rawData);
                this.getInfo(table.data)
                // this.exportFilterTemplate(table.data)

            });
            reader.readAsText(fileUpload.files[0]);

        },
        /**
         * Recibe un csv con los pesos de las preguntas
         * y los transforma en una tabla de Papa Parser
         */
        getWeights() {
            // Aca se decodifica el archivo con los pesos de la formula
            var fileUpload = document.getElementById("filePesos")
            const reader = new FileReader();
            var rawData;
            reader.addEventListener('load', (event) => {
                rawData = event.target.result;
                var table = Papa.parse(rawData,{header: false});
                // console.log(table)
                this.calculate(table.data)
            });
            reader.readAsText(fileUpload.files[0]);

        },
        calculate(weights) {
            //elimino header de la tabla
            weights.shift();
            //itero sobre cada estudiante para calcular su peso
            this.rows.forEach((row,index) => {
                this.getStudentWeight(row, weights)
            })
        },
        exportTable() {
            // Aca se exporta el archivo actual
        },
        /**
         * Calcula el peso de un estudiante.
         * @param {*} student - Estudiante a filtrar
         * @param {*} weights - tabla con los pesos para cada pregunta
         * @return {*} el peso de un estudiante
         */
        getStudentWeight(student,weights) {
            var weight = 0;
            //itero sobre cada respuesta del estudiante
            student.forEach(((answer,index) => {
                var wRow = 0;
                var wCol = 2 * index;
                // debugger;
                
                var filterAns = weights[wRow][wCol];
                //perdoname harpo
                while (filterAns !== undefined && filterAns !== "" && filterAns !== "-") {
                    if(answer === filterAns) {
                        weight += parseInt(weights[wRow][wCol+1]);
                    }
                                        
                    wRow += 1;
                    filterAns = weights[wRow][wCol];
                }
            }))
            var name = student[1];
            console.log(name,weight);
        },
        exportFilterTemplate(data) {
            
            var filters = [];

            this.columns.forEach(element => {
                if(element === "") return;

                filters.push(element);
                filters.push("");
            });

            var parsedFilters = Papa.unparse([filters])
            const blob = new Blob([parsedFilters], {type: "text/csv"})
            const url = window.URL.createObjectURL(blob)
            var link = document.createElement("a");
            link.setAttribute("href",url);
            link.setAttribute("download","filtros.csv")
            document.body.appendChild(link)

            link.click();
        }
        
    }
}).mount('#app')
