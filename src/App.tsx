import { useState } from 'react';
import './App.scss';
import Slider from './Slider';

function App() {
  const min: number = 0;
  const max: number = 100;
  const width: string  = '300px';
  const defaultVal: number = 50;
  
  const [value, setValue] = useState(defaultVal);
  const [dragValue, setDragValue] = useState(defaultVal);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <h1>react-form-slider</h1>
      <p>
        This is a <a href="./frontend_exercise.pdf" target="_blank">coding exercise</a> I was required to do for a job application.
        Basically they wanted a custom slider in React not using the native HTML range input or any 3rd party dependencies.  
        Use the slider below:
      </p>
      <Slider
        min={min}
        max={max}
        width={width}
        value={value}
        onValueChanged={setValue}
        onDrag={setDragValue}
        onDraggingStateChanged={setIsDragging}
      />
      <h2>Property values</h2>
      <div>
        <div>Value: {value} {value != defaultVal && (<>(<a href="#" onClick={() => setValue(defaultVal)}>reset</a>)</>)}</div>
        <div>Min: {min}</div>
        <div>Max: {max}</div>
        <div>Width: {width}</div>
      </div>
      <h2>Drag State</h2>
      <div>
        <div>Dragging: {isDragging ? 'true' : 'false'}</div>
        <div>{isDragging && <div>Dragging value: {dragValue}</div>}</div>
      </div>
    </>
  );
}

export default App;
