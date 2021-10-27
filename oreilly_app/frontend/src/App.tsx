import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPage from "./LandingPage";
import GithubCallbackPage  from './GithubCallbackPage';
import PostPhotoPage from "./PostPhotoPage";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/callback" component={GithubCallbackPage}/>
        <Route exact path="/new-photo" component={PostPhotoPage}/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
