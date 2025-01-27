import './App.scss'
import Slider from './Slider'

function App() {
  const min: number = 0;
  const max: number = 100;
  const width: string  = '100%';
  const value: number = (max / 2);

  return (
    <>
      <h1>react-form-slider</h1>
      <p>
        This is a coding exercise I was required to do for a job application.  Basically they wanted a custom slider in React not using the native HTML range input 
        or any 3rd party dependencies.  Use slider below:
      </p>
      <Slider></Slider>
      <h2>Property values</h2>
      <div>
        <div>Value: {value}</div>
        <div>Min: {min}</div>
        <div>Max: {max}</div>
        <div>Width: {width}</div>
      </div>
    </>
  )
}

export default App
