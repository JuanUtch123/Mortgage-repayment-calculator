const crearMensajeError = (nodo) => {
    const elementoPadre = nodo.parentNode
    const span = document.createElement('span')
    span.classList.add('mensaje-error')
    elementoPadre.insertBefore(span, nodo.nextSibling)
    return span
}

const estaVacio = (nodo) => {
    if (nodo === null || !nodo.value) {
        if (nodo.nextElementSibling === null || nodo.parentNode.nextElementSibling.tagName !== 'SPAN') {
            const spanMensajeError = crearMensajeError(nodo.parentNode)
            spanMensajeError.textContent = "Este campo es obligatorio"
        }
        return false
    } else {
        if (nodo.closest('.userinput-radio').nextElementSibling !== null && nodo.closest('.userinput-radio').nextElementSibling.tagName === 'SPAN') {
            nodo.closest('.userinput-radio').nextElementSibling.remove()
        }
        return true
    }
}

const esExpValida = (regExp, nodo, mensaje) => {
    if (!regExp.test(nodo.value)) {
        if (nodo.nextElementSibling === null || nodo.nextElementSibling.tagName !== 'SPAN') {
            const spanMensajeError = crearMensajeError(nodo)
            if (!nodo.value) {
                spanMensajeError.textContent = "Este campo es obligatorio"
            } else {
                spanMensajeError.textContent = mensaje
            }
        } else if (nodo.nextElementSibling.tagName === 'SPAN') {
            if (!nodo.value) {
                nodo.nextElementSibling.textContent = "Este campo es obligatorio"
            } else {
                nodo.nextElementSibling.textContent = mensaje
            }
        }

        nodo.classList.add('userinput-input-error')
        nodo.parentNode.querySelector('.input-wrapper-label').classList.add('error-label')
        nodo.parentNode.querySelector('.input-wrapper-label').style.color = 'white'
        return false
    } else {
        if (nodo.nextElementSibling !== null && nodo.nextElementSibling.tagName === 'SPAN') {
            nodo.nextSibling.remove()
        }
        nodo.classList.remove('userinput-input-error')
        nodo.parentNode.querySelector('.input-wrapper-label').classList.remove('error-label')
        nodo.parentNode.querySelector('.input-wrapper-label').style.color = 'var(--slate700)'
        return true
    }
}

const calcularResultados = (valor, plazo, interes, tipoHipoteca) => {
    let capital = parseFloat(valor.replace(/,/g, ''))
    interes = parseFloat(interes.replace(/,/g, ''))

    let valorPagoMensual
    let valorTotalPlazo
    const interesMensual = (interes / 100) / 12

    if (tipoHipoteca === 'repayment') {
        console.log('amortización')
        valorPagoMensual = capital * (interesMensual * Math.pow(1 + interesMensual, plazo * 12)) / (Math.pow(1 + interesMensual, plazo * 12) - 1)
        valorTotalPlazo = valorPagoMensual.toFixed(2) * (parseInt(plazo) * 12)
    } else if (tipoHipoteca === 'interest') {
        valorPagoMensual = capital * interesMensual
        valorTotalPlazo = valorPagoMensual.toFixed(2) * (parseInt(plazo) * 12)
    }

    const pagoMensual = document.querySelector('[data-monthly-repayment]')
    const totalPlazo = document.querySelector('[data-term-value]')

    pagoMensual.textContent = `${valorPagoMensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`
    totalPlazo.textContent = `${valorTotalPlazo.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`
}

const botonCalcular = document.querySelector('.userinput-calculate')
const cantidadHipoteca = document.querySelector('[data-mortgage-amount]')
const plazoHipoteca = document.querySelector('[data-mortgage-term]')
const tasaInteres = document.querySelector('[data-interest-rate]')
const tipoHipoteca = document.getElementsByName('mortgageType')

botonCalcular.addEventListener('click', () => {
    let tipoSeleccionado = document.querySelector('.query-wrapper')
    for (let index = 0; index < tipoHipoteca.length; index++) {
        if (tipoHipoteca[index].checked) {
            tipoSeleccionado = tipoHipoteca[index]
            break
        }
    }

    const expDecimales = /^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/
    const expPlazo = /^\d+$/

    const mensajeCantidad = "Esta cantidad no es válida"
    const mensajePlazo = "Este plazo no es válido"
    const mensajeInteres = "Esta tasa de interés no es válida"

    const todosValidos = []
    todosValidos.push(esExpValida(expDecimales, cantidadHipoteca, mensajeCantidad))
    todosValidos.push(esExpValida(expPlazo, plazoHipoteca, mensajePlazo))
    todosValidos.push(esExpValida(expDecimales, tasaInteres, mensajeInteres))
    todosValidos.push(estaVacio(tipoSeleccionado))

    const resultadosVacios = document.querySelector('.empty-results')
    const resultadosCompletos = document.querySelector('.complete-results')
    if (todosValidos.every(element => element == true)) {
        calcularResultados(cantidadHipoteca.value, plazoHipoteca.value, tasaInteres.value, tipoSeleccionado.value)
        resultadosVacios.style.display = 'none'
        resultadosCompletos.style.display = 'block'
    } else {
        resultadosVacios.style.display = 'flex'
        resultadosCompletos.style.display = 'none'
    }
})

tipoHipoteca.forEach(elemento => {
    elemento.addEventListener('change', () => {
        tipoHipoteca.forEach(elemento => elemento.parentNode.classList.remove('selected-label'))
        elemento.parentNode.classList.add('selected-label')
    })
})

const limpiarTodo = document.querySelector('[data-clear]')
limpiarTodo.addEventListener('click', () => {
    cantidadHipoteca.value = ''
    plazoHipoteca.value = ''
    tasaInteres.value = ''
    tipoHipoteca.forEach(elemento => {
        elemento.checked = false
    })
})
