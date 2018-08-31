import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import AuthenticateService from './services/authenticate_service';

import 'bootstrap3/dist/css/bootstrap.min.css';
import './App.css'

import Loans from "./components/Loans";
import Books from "./components/Books";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import AddAdministrator from "./components/AddAdministrator";
import ManualAdd from "./components/ManualAdd";
import Categories from "./components/Categories";
import BookInfo from "./components/BookInfo";
import EditBook from "./components/EditBook";
import SmartAdd from "./components/SmartAdd";
import Author from "./components/Author";
import SubscribeUser from "./components/SubscribeUser";
import UserSearch from "./components/UserSearch";
import UserInfo from "./components/UserInfo";

class App extends Component {
    render() {
        AuthenticateService.isLoggedIn().then(isLoggedIn => {
            if (!isLoggedIn.data) {
                window.location.replace("http://localhost:8000");
            }
        });
        return (
            <BrowserRouter>
                <div>
                    <Navigation />
                    <Switch>
                        <Redirect from="/" to="/books" exact/>
                        <Route path="/loans" component={Loans} />
                        <Route path="/books" component={Books} exact />
                        <Route path="/books/:bookId" component={BookInfo} exact />
                        <Route path="/books/:bookId/edit" component={EditBook} exact />
                        <Route path="/add-administrator" component={AddAdministrator} />
                        <Route path="/manual-add" component={ManualAdd} />
                        <Route path="/smart-add" component={SmartAdd} />
                        <Route path="/categories" component={Categories} />
                        <Route path="/author/:authorId" component={Author} exact />
                        <Route path="/subscribe-user" component={SubscribeUser} />
                        <Route path="/user-search" component={UserSearch} />
                        <Route path="/users/:userId" component={UserInfo} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
};

export default App;