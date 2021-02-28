import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/home/home";

function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home}></Route>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
