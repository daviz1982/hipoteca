import React, { useState } from 'react'
import Big from 'big.js'
import './App.css'

function App() {
  const [periodYears, setPeriod] = useState(Big(25))
  const [importeTotal, setImporteTotal] = useState(Big(240000))
  const [interes, setInteres] = useState(Big(2.45))
  const [cuota, setCuota] = useState(0)
  const [mortgageTable, setMortgageTable] = useState()

  const handleSubmit = (event) => {
    event.preventDefault()
    setCuota(() => {
      // const _dividendo = importeTotal * (interes / 12)
      const _dividendo = importeTotal.times(interes.div(12))
      // const _divisor = 100 * (1 - (1 + interes / 12 / 100) ** -(periodYears * 12))
      const _divisor = Big(100).times(
        Big(1).minus(
          Big(1)
            .plus(interes.div(12).div(100))
            .pow(periodYears.toNumber() * -12)
        )
      )
      // return (_dividendo / _divisor).toFixed(2)
      return _dividendo.div(_divisor)
    })
  }

  const handleChange = (event) => {
    event.preventDefault()
    const { id, value } = event.target
    switch (id) {
      case 'importeTotal':
        setImporteTotal(Big(value))
        break
      case 'periodYears':
        setPeriod(Big(value))
        break
      case 'interes':
        setInteres(Big(value))
        break
    }
  }

  const calculateMortgageTable = () => {
    let pendiente = Big(importeTotal)
    const months = periodYears.times(12)
    const table = []
    for (let i = 0; i <= months; i++) {
      const interesPagado = pendiente.times(interes.div(12 * 100))
      const amortizado = cuota.minus(interesPagado)
      const month = {
        n: i,
        cuota,
        pendiente,
        interesPagado,
        amortizado,
      }
      pendiente = pendiente.minus(amortizado)
      table.push(month)
    }
    setMortgageTable(table)
  }

  return (
    <div className='main'>
      <h1>Calculadora de hipoteca</h1>
      <form onSubmit={handleSubmit}>
        <div className='formGroup'>
          <label htmlFor='importeTotal'>IMPORTE TOTAL (€)</label>
          <input
            id='importeTotal'
            type='number'
            step={importeTotal.toNumber() < 50000 ? 1000 : 10000}
            value={importeTotal.toNumber()}
            onChange={handleChange}
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='periodYears'>AÑOS</label>
          <input
            type='number'
            id='periodYears'
            step={1}
            value={periodYears.toNumber()}
            onChange={handleChange}
          />
        </div>
        <div className='formGroup'>
          <label htmlFor='interes'>INTERÉS (%)</label>
          <input
            type='number'
            step={0.01}
            id='interes'
            value={interes.toNumber()}
            onChange={handleChange}
          />
        </div>
        <div className='for mGroup'>
          <button className='button'>CALCULAR CUOTA</button>
        </div>
      </form>
      {!!cuota && (
        <>
          <div className='result'>CUOTA: {cuota.toFixed(2)}€ al mes</div>
          <button className='button' onClick={calculateMortgageTable}>
            Mostrar tabla de amortización
          </button>
        </>
      )}
      {!!mortgageTable && (
        <div className='tablaAmortizacion'>
          <table cellspacing={0} cellpadding={0}>
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
                    <td className="center">{row.n}</td>
                    <td className="right">{row.cuota.abs().toFixed(2)} €</td>
                    <td className="right">{row.interesPagado.abs().toFixed(2)} €</td>
                    <td className="right">{row.amortizado.abs().toFixed(2)} €</td>
                    <td className="right">{row.pendiente.abs().toFixed(2)} €</td>
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
