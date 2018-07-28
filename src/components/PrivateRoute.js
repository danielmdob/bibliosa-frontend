import React from 'react'
import AuthenticateService from '../services/authenticate_service'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                AuthenticateService.isLoggedIn === true ? (
                    alert("ASdf")
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute