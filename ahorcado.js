// Referencias iniciales
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

// Valores de opciones para botones
let options = {
  Vocabulary: [
    "Book", "Table", "House", "Chair", "Computer", "Phone",
    "Car", "Dog", "Cat", "Tree", "Sun", "Moon",
    "Water", "Fire", "Air", "Earth", "School", "Student",
    "Teacher", "Library", "Guitar", "Music", "Movie",
    "Pizza", "Burger", "Cake", "Ice Cream", "Coffee", "Tea",
    "Ocean", "Mountain", "River", "Lake", "Park", "City",
    "Beach", "Forest", "Desert", "Star", "Rain", "Snow",
    "Wind", "Cloud", "Bird", "Fish", "Flower", "Grass"
  ],
  Verbs: [
    "Run", "Eat", "Sleep", "Write", "Read", "Speak",
    "Walk", "Jump", "Dance", "Sing", "Study", "Work",
    "Play", "Swim", "Drive", "Fly", "Climb", "Cook",
    "Shop", "Clean", "Draw", "Paint", "Talk", "Laugh",
    "Cry", "Hug", "Kiss", "Smile", "Think", "Listen",
    "Watch", "Build", "Create", "Destroy", "Plant", "Harvest",
    "Sail", "Explore", "Discover", "Escape", "Rescue", "Fight",
    "Win", "Lose", "Succeed", "Fail", "Achieve", "Believe"
  ],
  Others: [
    "Happy", "Sad", "Excited", "Beautiful", "Tired", "Angry",
    "Bored", "Surprised", "Anxious", "Confused", "Proud", "Shy",
    "Lonely", "Brave", "Clever", "Generous", "Kind", "Honest",
    "Loyal", "Optimistic", "Pessimistic", "Grateful", "Curious", "Energetic",
    "Friendly", "Polite", "Rude", "Silly", "Wise", "Stupid",
    "Patient", "Impatient", "Gentle", "Fierce", "Calm", "Nervous",
    "Relaxed", "Stressed", "Serious", "Funny", "Romantic", "Adventurous",
    "Independent", "Dependent", "Strong", "Weak", "Healthy", "Sick"
  ],
};


// Contadores
let winCount = 0;
let count = 0;

let chosenWord = "";

// Mostrar botones de opción
const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Please Select An Option</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

// Bloquear todos los botones
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  // Desactivar todas las opciones
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  // Desactivar todas las letras
  letterButtons.forEach((button) => {
    button.disabled.true;
  });
  newGameContainer.classList.remove("hide");
};

// Generador de palabras
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");
  // Si el valor de la opción coincide con el texto del botón, entonces resaltar el botón
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  // Ocultar inicialmente letras, borrar palabra anterior
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue];
  // Elegir palabra al azar
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  // Reemplace cada letra con un espacio que contenga un guión
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  // Mostrar cada elemento como intervalo
  userInputSection.innerHTML = displayItem;
};

// Función inicial (llamada cuando se carga la página/el usuario presiona nuevo juego)
const initializer = () => {
  winCount = 0;
  count = 0;

  // Borrar todo el contenido y ocultar letras y botón de nuevo juego inicialmente
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  // Para crear botones de letras
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    // Número a ASCII[A-Z]
    button.innerText = String.fromCharCode(i);
    // Evento de clic en el botón de caracteres
    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      // Si el array contiene el valor del botón clicado, reemplace el guion correspondiente con la letra, si no, dibuje en el canvas
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          // Si el carácter en el array es igual al botón clicado
          if (char === button.innerText) {
            // Reemplazar guion con letra
            dashes[index].innerText = char;
            // Incrementar contador
            winCount += 1;
            // Si winCount es igual a la longitud de la palabra
            if (winCount == charArray.length) {
              // Pedir al usuario que haga una frase con la palabra adivinada
              let userPhrase = prompt("Congratulations! You've guessed the word. Now, please make a sentence with this word:");
              // Evaluar la frase del usuario
              evaluatePhrase(userPhrase);
              // Bloquear todos los botones
              blocker();
            }
          }
        });
      } else {
        // Contador de pérdida
        count += 1;
        // Para dibujar el muñeco
        drawMan(count);
        // Count == 6 porque cabeza, cuerpo, brazo izquierdo, brazo derecho, pierna izquierda, pierna derecha
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${chosenWord}</span></p>`;
          blocker();
        }
      }
      // Desactivar el botón clicado
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  displayOptions();
  // Llamar a canvasCreator (para borrar el canvas anterior y crear el canvas inicial)
  let { initialDrawing } = canvasCreator();
  // initialDrawing dibujaría el marco
  initialDrawing();
};

// Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  // Para dibujar líneas
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  // Marco inicial
  const initialDrawing = () => {
    // Borrar canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // Línea inferior
    drawLine(10, 130, 130, 130);
    // Línea izquierda
    drawLine(10, 10, 10, 131);
    // Línea superior
    drawLine(10, 10, 70, 10);
    // Pequeña línea superior
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

// Dibujar el muñeco
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

// Evaluar la frase del usuario
const evaluatePhrase = (phrase) => {
  // Si la frase del usuario incluye la palabra adivinada, se considera correcta
  if (phrase && phrase.toUpperCase().includes(chosenWord)) {
    alert("Your sentence is correct! Well done!");
  } else {
    alert("Your sentence is incorrect!");
  }
};

// Nuevo juego
newGameButton.addEventListener("click", initializer);
window.onload = initializer;