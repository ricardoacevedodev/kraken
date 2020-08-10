/*

//se deben crear modulos para poder tener mas organizado todo y tener organizado y privado todo por eso es importante
//tamben haremos metodo publicos 
//encapsulacion de datos permite esconder la implementacion de modulo hacia el exterior del codigo



//para crear modulos 
//budget controller

var budgetController = (function (){                //aqui se escribira el modulo

        var x = 23;                                 //valor de x

        var add = function(a){      //esto no puede ser accedido desde afuera
            return x + a;           //pero nos regresara una suma de x + a
        }
        return{                     //la funcion anterior dara como resultado un nuevo metodo llamado publicTest, el cual si podra ser accedido desde afuera
            publicTest: function(b){         //este metodo nos dara una funcion con el argumento b
                return add(b);        //el cual se usara como argumento en la suma es decir si b fuera 7 con la funcion de de add seria 7+23 =30
                
            }
        }
})();



var UIController = (function(){



})();

var controller = (function(budgetCtrl, UICtrl){   // este controlador hara que los dos mudulos anteriores interactuen   se abreviaran los nombres de los paramteros, lo cual no influye en el resultado final

    var z = budgetCtrl.publicTest(5);     //crearemos la variable z la cual sera el parametro budgetCtrl con el metodo publicoTest que regreso el controlador budgetController con el valor 5
    return {
        otroPublico: function(){                      //lo anterior lnos regresa una propiedad otroPublico y una funcioon que nos imprimira la variable z = 5 + 23
            console.log(z);
            
        }
    }

})(budgetController, UIController);                //llamamos la funcion con los nombres de los modulos involucrados

*/



//Budget controller
var budgetController = (function(){                //aqui se escribira el modulo
            
   var Expense = function(id, description, value){            //se hara un function contructor por esose pone en mayusculas modulo de gastos
        this.id = id;                                       //ponemos los datos que utilizaremos
        this.description = description;
        this.value = value;
        this.percentage = -1;
   }; 
   Expense.prototype.calcPercentage = function(totalInc){    //fucnion que nos cacluclara los porcentajes de expe y creamos una funcion usando los total inco
    if(totalInc > 0){
        this.percentage = Math.round((this.value / totalInc) * 100)
    }    else{
        this.percentage = -1;
    }
   };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

   var Income = function(id, description, value){            //se hara un function contructor por esose pone en mayusculas modulo de gastos
    this.id = id;                                       //ponemos los datos que utilizaremos
    this.description = description;
    this.value = value;
}; 

var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
        // sum = sum + cur.value;
    });
   data.totals[type] = sum; //guardaremos la informacion aqui en una estructura global usando el totals para guardar las sumas
};

var data = {                        //aqui se guardaran todos los datos
     allItems: {                    //creamos un objeto para guardar 

            exp: [],                //un arreglo para exp
            inc:[]                  //otro para income
                     },
     totals:{                       //creamos otro objeto para los totales
         exp: 0,                   // propiedad exp en 0
         inc: 0                     //propiedad inc en 0
     },

     budget: 0,
     percentage: -1
    
    };

        return{                      //metodo publico  que nos permitirara otros modulos agregar objetos en la estructura data
            addItem: function(type, des, val){
              var newItem, ID;
              //crear nuevo ID
              if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //esto nos posiscionara elID con el numero no logico de elemnto que debe ser es decir 1= 1noi 1= 0
              } else {
                  ID = 0;
              }
                   
                    // Crear el nuevo objeto basado en el tipo si es 'inc' o 'exp'
                if (type === 'exp'){
               newItem = new Expense(ID, des, val);
                } else if (type === 'inc'){
                    newItem = new Income(ID, des, val);   
                }
                    //subir el nuevo objeto a la estrictura data
                    data.allItems[type].push(newItem);  //con esto agregaremos un newItem al final del arreglo de data
                    // regresara el nuevo elemento
                    return newItem; //esto regresara el nuevo objeto
            },

               deleteItem: function(type, id){ //metodo para borrar objeto y llevara los parametros typo y ID
                var ids, index;            // declaramos las variables que usaremos abajo

               ids = data.allItems[type].map(function(current){    //haremos un loop para los elementos inc o expe //map devuelve un arreglo entetro
                return current.id;  //nos devolvera el id
            }); 

                index = ids.indexOf(id); // guardaremos el indice de id en la variable index
                 
                if(index !== -1){                  // 
                        data.allItems[type].splice(index, 1); // con esto se borra un elemento a la vez
                }


               },
                calculateBudget: function() {//metodo publico  es para calcular la suma de entradas y salidas 

                    //calcular total entradas y salidas

                    calculateTotal('exp');
                    calculateTotal('inc');

                    //calcular entradas - salida

                    data.budget = data.totals.inc - data.totals.exp;

                    //calcular porcentage de entradas que gastamos
                        if (data.totals.inc > 0){
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) ;
                } else {
                    data.percentage = -1;
                }

                },
               calculatePercentages: function(){ // funcion que calculara los porcentages
                   /*
                   a = 20
                   b= 10
                   c= 40
                   income = 100
                   a=20/100=20%
                   b=10/100=10%
                   c=40/100=40%
                   */
                 data.allItems.exp.forEach(function(cur) {
                        cur.calcPercentage(data.totals.inc);
                 });
               }, 

              getPercentages: function(){
                    var allPerc = data.allItems.exp.map(function(cur){
                        return cur.getPercentage();
                    });
                    return allPerc;
              },

            getBudget: function()    { //crearemos un nuevo metodo
                return{
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                };
            },

            testing: function(){
                console.log(data);
                
            }
        };
})();



//ui controller
var UIController = (function(){

    var DOMstrings = {      //creare un objeto privado para poder tener ahi todos los query selectors y si en el futuro voy a hacer cambios no me afecte
                inputType : '.add__type',
                inputDescription: '.add__description',
                inputValue : '.add__value',
                inputBtn: '.add__btn', 
                incomeContainer: '.income__list', //nuevo campo que llamaremos income container 
                expensesContainer: '.expenses__list',
                budgetLabel: '.budget__value', //clase de html en la que despliega el budget
                incomeLabel: '.budget__income--value', //clase en html en la que se muestra las entradas
                expenseLabel: '.budget__expenses--value', //clase en html en la que se muestran los gastos
                percentageLabel: '.budget__expenses--percentage', // clase en html en la que se guardan los porcentages
                container: '.container', //para el manejoador de elementos seleccionamos la clase container de el HTML
                expensesPercLabel: '.item__percentage',
                dateLabel: '.budget__title--month'
            };

            //crearemos un metodo privado
           var formatNumber = function(num, type){
                var numSplit, int, dec, type;
                    //metodo que cada vez que despliegue un numero al UI , llame al metodo y ponga un numero con el formato de comas y -
    
                    /*
                    + o - antes de cada numero
                    exactamente 2 puntos decimales
                    separado por coma los 100's
    
                    2321.5454 -> + 2,321.54
                    2000 -> 2,000.00
                    */
                   num = Math.abs(num);  //remueve el signo del numero
                   num = num.toFixed(2); //encargarse de numeros decimales
    
                   numSplit = num.split('.');//dividiremos el numero en decimales y enteros
    
                   int = numSplit[0];
                   if (int.length >3 ){
                     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3);//regresara solo la parte de la cadena que queremos ej con ese valor y el numero 2321.54 empezara en la posicion 0 de el arreglo y leera el primer valor, es decir numero 2
                   }
                   dec = numSplit[1];
    
                   type === 'exp' ? sign = '-' : sign = '+';
    
                   return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; //ponemos todo lo anterior funcionando mediante operadores ternarios
    
            };
            var nodeListForEach = function(list, callback){
                for (var i = 0; i< list.length; i++){
                    callback(list[i], i);
                }
        };

    return {                                //crearemos una funcion publica
        getInput: function(){
            return{
                type:  document.querySelector(DOMstrings.inputType).value,    //aqui obtendremos los valores de entrada mediante el qryselector que seleccionara la clase que le diremos en este caso es addtype. y el valor del typo
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parse float convertira la string en un numero con decimales 
        };
          
        },

        deleteListItem: function(selectorID){ //metodo para borrar elementos
            var el = document.getElementById(selectorID);
          el.parentNode.removeChild(el); //removeremos un metodo hijo con removechil metodo
        },

       addListItem: function(obj, type){ //nuevo metodo publico
        var html, newHtml, element;
                //crear HTML String con placeholder Tex
                if(type === 'inc'){
                    element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                } else if (type === 'exp'){
                    element = DOMstrings.expensesContainer;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                    //remplazar el placeholder text con some actual data
                
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


                //insertar el HTML en el DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },

     clearFields: function(){    //metodo publico que limpiara los campos
      var fields, fieldsArray; //creamos la variable
       fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); //definimos la variable y le especificamos que atributos del elemento utilizaremos queryselector all arroja una lista que debemos convertir en arreglo
        
      fieldsArray = Array.prototype.slice.call(fields); //convertimos los datos de la variable fields en un arreglo

      fieldsArray.forEach(function(current, index, array){       // esto se aplicara a cada elemento del arreglo
            current.value = "";
           
      });
      fieldsArray[0].focus(); //hara que el focus vuelva al campo description
     }, 

     displayBudget: function(obj){              //metodo para desplegar el budget
          var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';
           document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type ); //manipulacion de DOM se selecciona con query selector y llamamos al DOMstrinngs y su element, y mostara el contenido del texto y sera igual al budjet que sacaremos del metodo por eso obj.budget 
           document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
           document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
           

         if (obj.percentage > 0){ //para que no salga porcentage -1
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        }else{ 
            document.querySelector(DOMstrings.percentageLabel).textContent = '-----';
        }
     },

     displayPercentages: function(percentages){ //metodo para desplegar porcentajes

        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

        

        nodeListForEach(fields, function(current, index){
                

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';     //mostrar porcentages
                }else{
                  current.pe 
                }
        });
     },

        displayMonth: function(){
            var now, year, month, months;
                var now = new Date(); //vamos a usar un cinstructor de objetos para que nos regrese la fecha de hoy
                months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType, + ',' +
                DOMstrings.inputDescription, + ','+
                DOMstrings.inputValue);

                    nodeListForEach(fields, function(cur){
                        cur.classList.add('red-focus');
                    });

                    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');


        },
        getDOMstrings: function(){          //Haremos DOMstrings publico a los demas controladores
            return DOMstrings;                  //Aqui nos regresa el DOMstrings publico
        }
        
    };
})();


//global app controller
var controller = (function(budgetCtrl, UICtrl){   // este controlador hara que los dos mudulos anteriores interactuen   se abreviaran los nombres de los paramteros, lo cual no influye en el resultado final
   var setupEventListeners = function(){
    var   DOM = UICtrl.getDOMstrings();  //Aqui se define una variable nueva para obtener el DOMstrings que hicimos publico
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);               //event listener y el id name del boton en este caso el boton agreg se pone.add__btn por que es un selector y es la clase esto sera para agregar con el boton add
            

    document.addEventListener('keypress', function(event){            //agregaremos el event listener al documento global y esuchara cuando presionemos cualquier tecla
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();                                      //llamare a la funcion que agrega articulos
            
        }
        
    });   
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);             //agregaremos un manejador de elementos. con query selector y seleccionamos el elemento de DOMstrings, seleccionamos la variable DOM, que es la variable en donde obtenemos el DOMstrings
        document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
   };

   //agregaremos un manejador de elementos

        var updateBudget = function()  {
            
               //1 calcular el presupuesto
                budgetCtrl.calculateBudget();
            
               // 2 return the budget

               var budget = budgetCtrl.getBudget();

              //3 desplegar el objeto en la interface

              UIController.displayBudget(budget); //llamaremos el metodo desplegar y llamremos a budget, que es el resultado de getBudget metodo
              



        };
    
        var updatePercentages = function(){ //creamos funcion que calcule los porcentajes

            //1. calcular porcentajes
            budgetController.calculatePercentages();

            //2. leer porcentajes de budget controller

            var percentages = budgetController.getPercentages();
            // 3. actualizar interface con nuevos porcentajes
            UIController.displayPercentages(percentages);

        };

        var ctrlAddItem = function(){        //creare una fucnion  para agregar articulos
                var input, newItem;
             // 1 obtener los datos que se ingresan
            input = UICtrl.getInput();
            
            if(input.description !== "" && !isNaN(input.value) && input.value > 0 ){

          
            //2 agregar el articulo al controlador
            //usaremos el metodo que creamos
            newItem = budgetController.addItem(input.type, input.description, input.value);         //selecionamos el controlador y despues el metodo que creamos

            // 3 agregar el articulo a la interface
            UICtrl.addListItem(newItem, input.type);
            // 4limpiar los campos
            UIController.clearFields();

            //5 calcular y actualizar presupuesto
            updateBudget();

            //6. Calcular y actulizar porcentajes

            updatePercentages();
         
             }
            };   

            var ctrlDeleteItem = function(event){
                var itemID, splitID, type, ID;
                itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //mostrara en conosla el objeto que estamos haceiendo clicjk y el id

                if(itemID){

                    splitID = itemID.split('-');
                    type = splitID[0];
                    ID = parseInt(splitID[1]);

                    //1borrar objeto de la estructura de datos
                        budgetCtrl.deleteItem(type, ID); //llamaremos el metodo de borrar
                    //2 borar objeto de interface
                    UIController.deleteListItem(itemID);

                    //3 actualizar y mostrar el nuevo budger
                    updateBudget();

                    //4. Calcular y actulizar porcentajes

                    updatePercentages();

                }

            };
    
return {
    init: function(){
        console.log('la aplicacion ha iniciado');       //poner valores iniciales en 0
        UIController.displayMonth();
        UIController.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: 0
        }); 
        setupEventListeners();
        
    }
};

 

})(budgetController, UIController);                //llamamos la funcion con los nombres de los modulos involucrados

controller.init();