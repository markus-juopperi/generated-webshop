import * as React from 'react';
import './App.css';
import Album from './Album';


class App extends React.Component{
  render(): React.ReactNode {
        return (
          <div className="App">
              <Album></Album>
          </div>
        );

  }
}
export default App;