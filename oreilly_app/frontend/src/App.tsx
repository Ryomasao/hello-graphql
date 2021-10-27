import { BrowserRouter, Route, Switch } from 'react-router-dom'
import UsersPage from "./UsersPage";
import GithubCallbackPage  from './GithubCallbackPage';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={UsersPage}/>
        <Route exact path="/callback" component={GithubCallbackPage}/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
