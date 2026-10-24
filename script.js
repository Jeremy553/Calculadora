// ==================================
// ELEMENTOS
// ==================================

const pantalla =
    document.getElementById(
        "pantalla"
    );


const botones =
    document.querySelectorAll(
        ".botones button"
    );


const botonIgual =
    document.getElementById(
        "igual"
    );


const entradaFuncion =
    document.getElementById(
        "funcion"
    );


const botonGraficar =
    document.getElementById(
        "graficar"
    );


const botonResolver =
    document.getElementById(
        "resolver"
    );


const botonLimpiarGrafica =
    document.getElementById(
        "limpiarGrafica"
    );


const tipoFuncion =
    document.getElementById(
        "tipoFuncion"
    );


const solucion =
    document.getElementById(
        "solucion"
    );


const motorInfo =
    document.getElementById(
        "motorInfo"
    );


const estadoMotor =
    document.getElementById(
        "estadoMotor"
    );


const estadoPanel =
    document.getElementById(
        "estadoPanel"
    );


const estadoGrafica =
    document.getElementById(
        "estadoGrafica"
    );


const tipoDetectadoInput =
    document.getElementById(
        "tipoDetectadoInput"
    );


const mensajeFuncion =
    document.getElementById(
        "mensajeFuncion"
    );


const iconoTipo =
    document.getElementById(
        "iconoTipo"
    );


const listaHistorial =
    document.getElementById(
        "historial"
    );


const botonesEjemplo =
    document.querySelectorAll(
        ".ejemplo"
    );


const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );



let historial = [];

let ultimaExpresionProcesada =
    "";

let resultadoMostrado =
    false;



// ==================================
// ESTADO VACÍO
// ==================================

function mostrarEstadoVacio() {

    const grafica =
        document.getElementById(
            "grafica"
        );


    grafica.innerHTML = `

        <div
            class="grafica-vacia"
            id="graficaVacia"
        >

            <div
                class="icono-vacio"
                aria-hidden="true"
            >

                <svg
                    viewBox="0 0 100 70"
                >

                    <path
                        d="
                        M7 53
                        C20 53 23 15 39 15
                        C55 15 57 55 73 55
                        C83 55 88 40 94 29
                        "
                    ></path>

                    <circle
                        cx="39"
                        cy="15"
                        r="3"
                    ></circle>

                </svg>

            </div>


            <p>
                Grafica
            </p>

            <small>
                Prueba una función rápida o escribe la tuya
            </small>

        </div>

    `;

}



// ==================================
// INFORMACIÓN DEL TIPO
// ==================================

function obtenerInfoTipo(
    tipo
) {

    switch (tipo) {

        case "Lineal":

            return {

                icono:
                    "／",

                mensaje:
                    "Parece una recta. Ya puedes graficarla."

            };


        case "Cuadrática":

            return {

                icono:
                    "∪",

                mensaje:
                    "Parece una parábola. Podemos buscar sus raíces."

            };


        case "Polinomial":

            return {

                icono:
                    "∿",

                mensaje:
                    "Es un polinomio. Vamos a verlo en el plano."

            };


        case "Trigonométrica":

            return {

                icono:
                    "≈",

                mensaje:
                    "Función periódica detectada."

            };


        default:

            return {

                icono:
                    "—",

                mensaje:
                    "Función constante detectada."

            };

    }

}



// ==================================
// ESTADO DEL INPUT
// ==================================

function actualizarEstadoEntrada() {

    const texto =
        entradaFuncion
            .value
            .trim();


    const pendiente =

        texto !== "" &&

        texto !==
        ultimaExpresionProcesada;


    botonGraficar
        .classList
        .toggle(
            "cta-pendiente",
            pendiente
        );


    if (
        texto === ""
    ) {

        tipoDetectadoInput
            .textContent =
            "";


        mensajeFuncion
            .textContent =
            "Escribe una función o ecuación para comenzar.";


        estadoPanel
            .textContent =
            "Listo";


        return;

    }


    const tipo =
        detectarTipo(
            texto
        );


    const info =
        obtenerInfoTipo(
            tipo
        );


    tipoDetectadoInput
        .textContent =
        tipo;


    mensajeFuncion
        .textContent =
        info.mensaje;


    estadoPanel
        .textContent =
        pendiente
            ? "Pendiente"
            : "Listo";

}



// ==================================
// ACTUALIZAR TIPO
// ==================================

function actualizarResultadoVisual(
    tipo
) {

    const info =
        obtenerInfoTipo(
            tipo
        );


    tipoFuncion
        .textContent =
        tipo;


    iconoTipo
        .textContent =
        info.icono;

}



// ==================================
// FORMATEAR NÚMEROS
// ==================================

function formatearNumero(
    numero
) {

    if (
        !Number.isFinite(
            numero
        )
    ) {

        return String(
            numero
        );

    }


    let valor =

        Math.round(
            numero * 1000
        ) / 1000;


    if (
        Math.abs(valor) <
        0.001
    ) {

        valor = 0;

    }


    return String(
        valor
    );

}



// ==================================
// CALCULADORA
// ==================================

function esOperador(
    valor
) {

    return [

        "+",
        "-",
        "*",
        "/",
        "^"

    ].includes(
        valor
    );

}



// Inserta un valor
function insertarEnCalculadora(
    valor
) {

    // Si había error
    if (
        pantalla.value ===
        "Error"
    ) {

        pantalla.value =
            "";

        resultadoMostrado =
            false;

    }


    // Si acabamos de obtener
    // un resultado
    if (
        resultadoMostrado
    ) {

        // Si toca operador,
        // seguimos usando el resultado
        if (
            esOperador(
                valor
            )
        ) {

            pantalla.value +=
                valor;

        }

        // Si toca número o función,
        // empieza cálculo nuevo
        else {

            pantalla.value =
                valor;

        }


        resultadoMostrado =
            false;


        return;

    }


    // Funcionamiento normal
    pantalla.value +=
        valor;

}



// ==================================
// BOTONES CALCULADORA
// ==================================

botones.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                const valor =
                    boton
                        .dataset
                        .valor;


                const accion =
                    boton
                        .dataset
                        .accion;



                // ------------------
                // LIMPIAR
                // ------------------

                if (
                    accion ===
                    "limpiar"
                ) {

                    pantalla.value =
                        "";

                    resultadoMostrado =
                        false;

                    pantalla.focus();

                    return;

                }



                // ------------------
                // BORRAR
                // ------------------

                if (
                    accion ===
                    "borrar"
                ) {

                    if (
                        pantalla.value ===
                            "Error" ||

                        resultadoMostrado
                    ) {

                        pantalla.value =
                            "";

                    }

                    else {

                        pantalla.value =

                            pantalla.value
                                .slice(
                                    0,
                                    -1
                                );

                    }


                    resultadoMostrado =
                        false;


                    pantalla.focus();

                    return;

                }



                // ------------------
                // BOTÓN NORMAL
                // ------------------

                if (
                    valor !==
                    undefined
                ) {

                    insertarEnCalculadora(
                        valor
                    );

                }


                pantalla.focus();

            }
        );

    }
);



// ==================================
// CALCULAR
// ==================================

function calcular() {

    const operacion =

        pantalla
            .value
            .trim();


    if (
        operacion ===
        ""
    ) {

        return;

    }


    try {

        const resultado =

            math.evaluate(
                operacion
            );


        if (
            resultado ===
                undefined ||

            resultado ===
                null
        ) {

            throw new Error(
                "Resultado inválido"
            );

        }


        const resultadoTexto =

            math.format(
                resultado,
                {
                    precision:
                        14
                }
            );


        pantalla.value =
            resultadoTexto;


        resultadoMostrado =
            true;


        agregarHistorial(
            operacion,
            resultadoTexto
        );

    }


    catch (
        error
    ) {

        console.error(
            "Error calculadora:",
            error
        );


        pantalla.value =
            "Error";


        resultadoMostrado =
            true;

    }

}



botonIgual.addEventListener(
    "click",
    calcular
);



// ==================================
// TECLADO CALCULADORA
// ==================================

pantalla.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key ===
            "Enter"
        ) {

            evento.preventDefault();

            calcular();

            return;

        }


        if (
            !resultadoMostrado
        ) {

            return;

        }


        if (
            evento.ctrlKey ||
            evento.metaKey ||
            evento.altKey
        ) {

            return;

        }


        // Operador después
        // del resultado
        if (
            [
                "+",
                "-",
                "*",
                "/",
                "^"
            ].includes(
                evento.key
            )
        ) {

            resultadoMostrado =
                false;

            return;

        }


        // Número nuevo
        if (
            /^[0-9.(]$/
                .test(
                    evento.key
                )
        ) {

            pantalla.value =
                "";

            resultadoMostrado =
                false;

            return;

        }


        if (
            evento.key ===
                "Backspace" ||

            evento.key ===
                "Delete"
        ) {

            resultadoMostrado =
                false;

        }

    }
);



// ==================================
// HISTORIAL
// ==================================

function agregarHistorial(
    operacion,
    resultado
) {

    historial.unshift(
        `${operacion} = ${resultado}`
    );


    historial =
        historial.slice(
            0,
            6
        );


    listaHistorial
        .innerHTML =
        "";


    historial.forEach(
        item => {

            const elemento =

                document
                    .createElement(
                        "li"
                    );


            elemento.textContent =
                item;


            listaHistorial
                .appendChild(
                    elemento
                );

        }
    );

}



// ==================================
// NORMALIZAR EXPRESIÓN
// ==================================

function normalizarExpresion(
    texto
) {

    return texto

        .replace(
            /×/g,
            "*"
        )

        .replace(
            /÷/g,
            "/"
        )

        .replace(
            /−/g,
            "-"
        )

        .trim();

}



// ==================================
// PREPARAR ECUACIÓN
// ==================================

function prepararEcuacion(
    texto
) {

    const normalizada =

        normalizarExpresion(
            texto
        );


    if (
        normalizada.includes(
            "="
        )
    ) {

        const partes =

            normalizada
                .split(
                    "="
                );


        if (

            partes.length !==
                2 ||

            partes[0]
                .trim() ===
                "" ||

            partes[1]
                .trim() ===
                ""

        ) {

            throw new Error(
                "Ecuación incorrecta"
            );

        }


        return (

            `(${partes[0]}) - (${partes[1]})`

        );

    }


    return normalizada;

}



// ==================================
// DETECTAR TIPO
// ==================================

function detectarTipo(
    expresion
) {

    const texto =

        normalizarExpresion(
            expresion
        )

        .toLowerCase()

        .replace(
            /\s/g,
            ""
        );



    // Trigonométrica
    if (

        texto.includes(
            "sin("
        ) ||

        texto.includes(
            "cos("
        ) ||

        texto.includes(
            "tan("
        )

    ) {

        return (
            "Trigonométrica"
        );

    }



    let mayorPotencia =
        1;



    // Detectar x^2, x^3...
    const potencias = [

        ...texto.matchAll(
            /x\^(\d+)/g
        )

    ];


    potencias.forEach(
        coincidencia => {

            mayorPotencia =

                Math.max(

                    mayorPotencia,

                    Number(
                        coincidencia[1]
                    )

                );

        }
    );



    // Detectar x*x,
    // x*x*x, etc.
    const productosX = [

        ...texto.matchAll(
            /x(?:\*x)+/g
        )

    ];


    productosX.forEach(
        coincidencia => {

            const cantidad =

                coincidencia[0]
                    .split(
                        "x"
                    )
                    .length - 1;


            mayorPotencia =

                Math.max(
                    mayorPotencia,
                    cantidad
                );

        }
    );



    if (
        mayorPotencia ===
        2
    ) {

        return (
            "Cuadrática"
        );

    }


    if (
        mayorPotencia >=
        3
    ) {

        return (
            "Polinomial"
        );

    }


    if (
        texto.includes(
            "x"
        )
    ) {

        return (
            "Lineal"
        );

    }


    return (
        "Constante"
    );

}



// ==================================
// EVALUAR FUNCIÓN
// ==================================

function evaluarFuncion(
    funcion,
    x
) {

    try {

        const resultado =

            funcion.evaluate({
                x
            });


        if (

            typeof resultado !==
                "number" ||

            !Number.isFinite(
                resultado
            )

        ) {

            return null;

        }


        return resultado;

    }


    catch {

        return null;

    }

}



// ==================================
// AGREGAR RAÍZ
// ==================================

function agregarRaiz(
    raices,
    raiz
) {

    if (
        !Number.isFinite(
            raiz
        )
    ) {

        return;

    }


    const yaExiste =

        raices.some(
            valor =>

                Math.abs(
                    valor - raiz
                ) < 0.02
        );


    if (
        !yaExiste
    ) {

        raices.push(
            raiz
        );

    }

}



// ==================================
// BISECCIÓN
// ==================================

function biseccion(
    funcion,
    a,
    b
) {

    let fa =
        evaluarFuncion(
            funcion,
            a
        );


    let fb =
        evaluarFuncion(
            funcion,
            b
        );


    if (
        fa === null ||
        fb === null
    ) {

        return null;

    }


    if (
        Math.abs(
            fa
        ) < 1e-8
    ) {

        return a;

    }


    if (
        Math.abs(
            fb
        ) < 1e-8
    ) {

        return b;

    }


    if (
        fa * fb >
        0
    ) {

        return null;

    }



    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const medio =

            (a + b) /
            2;


        const fm =

            evaluarFuncion(
                funcion,
                medio
            );


        if (
            fm === null
        ) {

            return null;

        }


        if (
            Math.abs(
                fm
            ) < 1e-9
        ) {

            return medio;

        }


        if (
            fa * fm <=
            0
        ) {

            b =
                medio;

            fb =
                fm;

        }

        else {

            a =
                medio;

            fa =
                fm;

        }

    }


    return (

        (a + b) /
        2

    );

}



// ==================================
// REFINAR RAÍZ
// ==================================

function refinarRaiz(
    funcion,
    inicio
) {

    let x =
        inicio;


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const y =

            evaluarFuncion(
                funcion,
                x
            );


        if (
            y === null
        ) {

            return null;

        }


        if (
            Math.abs(
                y
            ) < 1e-9
        ) {

            return x;

        }


        const h =
            0.0001;


        const y1 =

            evaluarFuncion(
                funcion,
                x + h
            );


        const y2 =

            evaluarFuncion(
                funcion,
                x - h
            );


        if (
            y1 === null ||
            y2 === null
        ) {

            return null;

        }


        const derivada =

            (y1 - y2) /
            (2 * h);


        if (

            !Number.isFinite(
                derivada
            ) ||

            Math.abs(
                derivada
            ) < 1e-10

        ) {

            return x;

        }


        x -=
            y /
            derivada;


        if (

            !Number.isFinite(
                x
            ) ||

            Math.abs(
                x
            ) > 1000

        ) {

            return null;

        }

    }


    return x;

}



// ==================================
// BUSCAR RAÍCES
// ==================================

function buscarRaices(
    expresion,
    textoOriginal
) {

    const funcion =

        math.compile(
            expresion
        );


    const tipo =

        detectarTipo(
            textoOriginal
        );



    const inicio =

        tipo ===
        "Trigonométrica"

            ? -10
            : -100;


    const final =

        tipo ===
        "Trigonométrica"

            ? 10
            : 100;


    const paso =

        tipo ===
        "Trigonométrica"

            ? 0.05
            : 0.1;



    const raices =
        [];


    let xAnterior =
        inicio;


    let yAnterior =

        evaluarFuncion(
            funcion,
            xAnterior
        );



    for (

        let x =
            inicio + paso;

        x <= final;

        x += paso

    ) {

        const y =

            evaluarFuncion(
                funcion,
                x
            );


        if (
            y !== null
        ) {


            // Punto muy cerca
            // del eje X
            if (
                Math.abs(
                    y
                ) < 0.004
            ) {

                const refinada =

                    refinarRaiz(
                        funcion,
                        x
                    );


                agregarRaiz(

                    raices,

                    refinada ??
                    x

                );

            }



            // Cambio de signo
            if (

                yAnterior !==
                    null &&

                yAnterior * y <
                    0

            ) {

                const raiz =

                    biseccion(

                        funcion,

                        xAnterior,

                        x

                    );


                agregarRaiz(
                    raices,
                    raiz
                );

            }

        }


        xAnterior =
            x;


        yAnterior =
            y;

    }


    return raices.sort(
        (a, b) =>
            a - b
    );

}



// ==================================
// RANGO AUTOMÁTICO
// ==================================

function obtenerRangoX(
    raices
) {

    let minimoX =
        -10;

    let maximoX =
        10;


    if (
        raices.length >
        0
    ) {

        const raizMenor =

            Math.min(
                ...raices
            );


        const raizMayor =

            Math.max(
                ...raices
            );


        const margen =
            4;


        minimoX =

            Math.min(

                -10,

                Math.floor(
                    raizMenor -
                    margen
                )

            );


        maximoX =

            Math.max(

                10,

                Math.ceil(
                    raizMayor +
                    margen
                )

            );

    }


    minimoX =

        Math.max(
            minimoX,
            -100
        );


    maximoX =

        Math.min(
            maximoX,
            100
        );


    return {
        minimoX,
        maximoX
    };

}



// ==================================
// ANIMAR CURVA
// ==================================

function animarCurvaPlotly() {

    const lineas =

        document
            .querySelectorAll(
                "#grafica .scatterlayer .js-line"
            );


    lineas.forEach(
        linea => {

            if (
                !linea.getTotalLength
            ) {

                return;

            }


            const largo =

                linea
                    .getTotalLength();


            linea.style
                .strokeDasharray =
                `${largo}`;


            linea.style
                .strokeDashoffset =
                `${largo}`;


            linea.style
                .animation =
                "none";


            void linea
                .getBoundingClientRect();


            linea.style
                .animation =

                "trazarCurva 850ms cubic-bezier(0.22, 1, 0.36, 1) forwards";

        }
    );

}



// ==================================
// GRAFICAR
// ==================================

function graficarFuncion(
    raices = []
) {

    const texto =

        entradaFuncion
            .value
            .trim();


    if (
        texto ===
        ""
    ) {

        entradaFuncion
            .focus();


        mensajeFuncion
            .textContent =
            "Primero escribe una función o ecuación.";


        return;

    }



    try {

        const expresion =

            prepararEcuacion(
                texto
            );


        const funcion =

            math.compile(
                expresion
            );


        const {

            minimoX,
            maximoX

        } = obtenerRangoX(
            raices
        );



        const valoresX =
            [];

        const valoresY =
            [];



        const amplitud =

            maximoX -
            minimoX;


        const paso =

            Math.max(

                amplitud /
                600,

                0.03

            );



        for (

            let x =
                minimoX;

            x <=
                maximoX;

            x +=
                paso

        ) {

            const y =

                evaluarFuncion(
                    funcion,
                    x
                );


            if (

                y !== null &&

                Math.abs(
                    y
                ) < 100000

            ) {

                valoresX.push(
                    x
                );


                valoresY.push(
                    y
                );

            }

        }



        if (
            valoresX.length ===
            0
        ) {

            throw new Error(
                "No se obtuvieron puntos válidos"
            );

        }



        // ==========================
        // LÍNEA
        // ==========================

        const datos = [

            {

                x:
                    valoresX,

                y:
                    valoresY,

                mode:
                    "lines",

                type:
                    "scatter",

                name:
                    `f(x) = ${texto}`,

                hovertemplate:

                    "x = %{x:.3f}<br>" +
                    "y = %{y:.3f}" +
                    "<extra></extra>",

                line: {

                    color:
                        "#4cdec0",

                    width:
                        3

                }

            }

        ];



        // ==========================
        // RAÍCES
        // ==========================

        if (
            raices.length >
            0
        ) {

            datos.push({

                x:
                    raices,


                y:

                    raices.map(
                        () => 0
                    ),


                mode:
                    "markers+text",


                type:
                    "scatter",


                name:
                    "Raíces",


                text:

                    raices.map(
                        raiz =>

                            `x = ${
                                formatearNumero(
                                    raiz
                                )
                            }`
                    ),


                textposition:
                    "top center",


                textfont: {

                    color:
                        "#64b5f6",

                    family:

                        "SFMono-Regular, Menlo, Consolas, monospace",

                    size:
                        11

                },


                marker: {

                    size:
                        10,

                    color:
                        "#0a84ff",

                    line: {

                        color:
                            "#09090b",

                        width:
                            2

                    }

                },


                hovertemplate:

                    "x = %{x:.3f}" +
                    "<extra>raíz</extra>"

            });

        }



        // ==========================
        // DISEÑO
        // ==========================

        const diseno = {

            autosize:
                true,


            paper_bgcolor:
                "#09090b",


            plot_bgcolor:
                "#09090b",



            font: {

                color:
                    "#8e8e93",

                family:

                    "SFMono-Regular, Menlo, Consolas, monospace"

            },



            title: {

                text:
                    `Gráfica: ${texto}`,

                x:
                    0.025,

                xanchor:
                    "left",

                font: {

                    color:
                        "#f2f2f7",

                    family:

                        "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",

                    size:
                        15

                }

            },



            xaxis: {

                range: [

                    minimoX,
                    maximoX

                ],


                title: {

                    text:
                        "X",

                    font: {

                        color:
                            "#8e8e93"

                    }

                },


                color:
                    "#8e8e93",


                gridcolor:
                    "#242b2f",


                zeroline:
                    true,


                zerolinecolor:
                    "#6b7e86",


                zerolinewidth:
                    1.4,


                linecolor:
                    "#3a4449",


                tickcolor:
                    "#3a4449",


                showline:
                    true,


                fixedrange:
                    false

            },



            yaxis: {

                title: {

                    text:
                        "Y",

                    font: {

                        color:
                            "#8e8e93"

                    }

                },


                color:
                    "#8e8e93",


                gridcolor:
                    "#242b2f",


                zeroline:
                    true,


                zerolinecolor:
                    "#6b7e86",


                zerolinewidth:
                    1.4,


                linecolor:
                    "#3a4449",


                tickcolor:
                    "#3a4449",


                showline:
                    true,


                autorange:
                    true,


                fixedrange:
                    false

            },



            legend: {

                bgcolor:

                    "rgba(28, 28, 30, 0.82)",


                bordercolor:

                    "rgba(255,255,255,0.08)",


                borderwidth:
                    1,


                font: {

                    color:
                        "#c7c7cc",

                    size:
                        10

                },


                x:
                    0.99,


                xanchor:
                    "right",


                y:
                    0.99

            },



            hoverlabel: {

                bgcolor:
                    "#2c2c2e",


                bordercolor:
                    "#4cdec0",


                font: {

                    color:
                        "#ffffff"

                }

            },



            margin: {

                t:
                    58,

                r:
                    30,

                b:
                    52,

                l:
                    58

            }

        };



        // ==========================
        // LIMPIAR CONTENEDOR
        // ==========================

        const grafica =

            document
                .getElementById(
                    "grafica"
                );


        Plotly.purge(
            grafica
        );


        grafica.innerHTML =
            "";



        // ==========================
        // CREAR GRÁFICA
        // ==========================

        Plotly.newPlot(

            grafica,

            datos,

            diseno,

            {

                responsive:
                    true,

                displaylogo:
                    false,

                scrollZoom:
                    true

            }

        )

        .then(
            () => {

                animarCurvaPlotly();


                Plotly.Plots.resize(
                    grafica
                );

            }
        );



        ultimaExpresionProcesada =
            texto;


        botonGraficar
            .classList
            .remove(
                "cta-pendiente"
            );


        estadoGrafica
            .textContent =
            "lista";


        estadoPanel
            .textContent =
            "Listo";


        estadoMotor
            .textContent =
            "Motor matemático activo";

    }


    catch (
        error
    ) {

        console.error(
            "Error al graficar:",
            error
        );


        estadoGrafica
            .textContent =
            "error";


        estadoPanel
            .textContent =
            "Revisa la función";


        mensajeFuncion
            .textContent =
            "No pude interpretar esa expresión. Revisa los signos y paréntesis.";

    }

}



// ==================================
// BOTÓN GRAFICAR
// ==================================

botonGraficar.addEventListener(
    "click",
    () => {

        const texto =

            entradaFuncion
                .value
                .trim();


        if (
            texto ===
            ""
        ) {

            entradaFuncion
                .focus();

            return;

        }


        const tipo =

            detectarTipo(
                texto
            );


        actualizarResultadoVisual(
            tipo
        );


        solucion
            .textContent =
            "Sin resolver";


        motorInfo
            .textContent =
            "Gráfica numérica";


        graficarFuncion();

    }
);



// ==================================
// RESOLVER ECUACIÓN
// ==================================

function resolverEcuacion() {

    const texto =

        entradaFuncion
            .value
            .trim();


    if (
        texto ===
        ""
    ) {

        solucion
            .textContent =
            "Escribe una ecuación";


        entradaFuncion
            .focus();


        return;

    }



    try {

        estadoPanel
            .textContent =
            "Calculando…";


        motorInfo
            .textContent =
            "Buscando raíces…";



        const expresion =

            prepararEcuacion(
                texto
            );


        const raices =

            buscarRaices(
                expresion,
                texto
            );


        const tipo =

            detectarTipo(
                texto
            );



        actualizarResultadoVisual(
            tipo
        );



        if (
            raices.length ===
            0
        ) {

            solucion
                .textContent =
                "No encontré raíces reales";

        }

        else {

            solucion
                .textContent =

                raices

                    .map(
                        raiz =>

                            `x = ${
                                formatearNumero(
                                    raiz
                                )
                            }`
                    )

                    .join(
                        ", "
                    );

        }



        motorInfo
            .textContent =
            "Cálculo numérico";


        graficarFuncion(
            raices
        );

    }


    catch (
        error
    ) {

        console.error(
            "Error al resolver:",
            error
        );


        solucion
            .textContent =
            "Ecuación no válida";


        motorInfo
            .textContent =
            "Revisa la expresión";


        estadoPanel
            .textContent =
            "Error";

    }

}



botonResolver
    .addEventListener(
        "click",
        resolverEcuacion
    );



// ==================================
// ENTER EN FUNCIÓN
// ==================================

entradaFuncion.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key ===
            "Enter"
        ) {

            evento.preventDefault();

            resolverEcuacion();

        }

    }
);



// ==================================
// INPUT EN TIEMPO REAL
// ==================================

entradaFuncion.addEventListener(
    "input",
    actualizarEstadoEntrada
);



// ==================================
// PRUEBAS RÁPIDAS
// ==================================

botonesEjemplo.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                entradaFuncion.value =

                    boton
                        .dataset
                        .ejemplo;


                actualizarEstadoEntrada();


                resolverEcuacion();

            }
        );

    }
);



// ==================================
// LIMPIAR GRAFICADOR
// ==================================

botonLimpiarGrafica
    .addEventListener(
        "click",
        () => {

            const grafica =

                document
                    .getElementById(
                        "grafica"
                    );


            Plotly.purge(
                grafica
            );


            entradaFuncion.value =
                "";


            ultimaExpresionProcesada =
                "";


            tipoFuncion.textContent =
                "Sin analizar";


            solucion.textContent =
                "Sin resolver";


            motorInfo.textContent =
                "Numérico";


            iconoTipo.textContent =
                "∿";


            estadoGrafica.textContent =
                "esperando función";


            estadoPanel.textContent =
                "Listo";


            estadoMotor.textContent =
                "Motor matemático activo";


            mostrarEstadoVacio();


            actualizarEstadoEntrada();


            entradaFuncion.focus();

        }
    );



// ==================================
// NAVEGACIÓN
// ==================================

menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                menuItems.forEach(
                    enlace =>

                        enlace
                            .classList
                            .remove(
                                "activo"
                            )
                );


                item
                    .classList
                    .add(
                        "activo"
                    );

            }
        );

    }
);



// ==================================
// RESPONSIVE PLOTLY
// ==================================

window.addEventListener(
    "resize",
    () => {

        const grafica =

            document
                .getElementById(
                    "grafica"
                );


        if (

            grafica &&

            grafica
                .classList
                .contains(
                    "js-plotly-plot"
                )

        ) {

            Plotly.Plots.resize(
                grafica
            );

        }

    }
);



// ==================================
// INICIO
// ==================================

actualizarEstadoEntrada();