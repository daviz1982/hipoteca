import React, { useState } from 'react'
import './App.css'

function App() {
  const [periodYears, setPeriod] = useState()
  const [importeTotal, setImporteTotal] = useState()
  const [interes, setInteres] = useState()
  const [cuota, setCuota] = useState()
  const [mortgageTable, setMortgageTable] = useState()

  const handleSubmit = (event) => {
    event.preventDefault()
    setCuota(() => {
      const _dividendo = importeTotal * (interes / 12)
      const _divisor =
        100 * (1 - (1 + interes / 12 / 100) ** -(periodYears * 12))
      return (_dividendo / _divisor).toFixed(2)
    })
  }

  const handleChange = (event) => {
    event.preventDefault()
    const { id, value } = event.target
    switch (id) {
      case 'importeTotal':
        setImporteTotal(value)
        break
      case 'periodYears':
        setPeriod(value)
        break
      case 'interes':
        setInteres(value)
        break
    }
  }

  Math.round10 = (value, exp) =>
    decimalAdjust('round', value, exp)

  Math.floor10 = (value, exp) =>
    decimalAdjust('floor', value, exp)
  
  Math.ceil10 = (value, exp) =>
    decimalAdjust('ceil', value, exp)

  const decimalAdjust = (type, value, exp) => {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value)
    }
    value = +value
    exp = +exp
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN
    }
    // Shift
    value = value.toString().split('e')
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
    // Shift back
    value = value.toString().split('e')
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
  }

  const calculateMortgageTable = () => {
    let pendiente = +importeTotal
    const months = periodYears * 12
    const table = []
    for (let i = 0; i <= months; i++) {
      const interesPagado = Math.ceil10(pendiente * interes / (12 * 100), -2)
      const amortizado = Math.ceil10(cuota - interesPagado, -2)
      const month = {
        n: i,
        cuota,
        pendiente,
        interesPagado,
        amortizado,
      }
      pendiente = Math.ceil10(pendiente - amortizado, -2)
      table.push(month)
    }
    setMortgageTable(table)
  }

  return (
    <div className='main'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='importeTotal'>IMPORTE TOTAL</label>

        <input
          id='importeTotal'
          type='number'
          step={10000}
          value={importeTotal}
          onChange={handleChange}
        />

        <label htmlFor='periodYears'>AÑOS</label>

        <input
          type='number'
          id='periodYears'
          step={5}
          value={periodYears}
          onChange={handleChange}
        />

        <label htmlFor='interes'>INTERÉS</label>

        <input
          type='number'
          step={0.01}
          id='interes'
          value={interes}
          onChange={handleChange}
        />

        <button>CALCULAR CUOTA</button>
      </form>
      {!!cuota && <div className='result'>CUOTA: {cuota}</div>}
      <button onClick={calculateMortgageTable}>Mostrar tabla de amortización</button>
      {!!mortgageTable && (
        <div className='tablaAmortizacion'>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Cuota</th>
                <th>Intereses</th>
                <th>Préstamo</th>
                <th>Capital restante</th>
              </tr>
            </thead>
            <tbody>
              {mortgageTable.map((row) => {
                return (
                  <tr key={row.n}>
                    <td>{row.n}</td>
                    <td>{row.cuota}</td>
                    <td>{row.interesPagado}</td>
                    <td>{row.amortizado}</td>
                    <td>{row.pendiente}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
