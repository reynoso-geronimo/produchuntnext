import React, { useState } from "react";
import { css } from "@emotion/react";
import Router from 'next/router';
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import firebase from "../firebase";

//validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INICIAL = {
  email: "",
  password: "",
};

export default function Login() {
  

  const [error, setError]=useState(false)

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email,password)
      Router.push('/')
     
      
    } catch (error) {
      console.error("hubo un error al iniciar Sesion", error);
      setError(error.message);
      
    }
  }

  return (
    <Layout>
      <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Crear Cuenta
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>
          
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Tu Email"
              name="email"
              value={email}
              onChange={handleChange}
              
            />
          </Campo>
          {errores.email && <Error>{errores.email}</Error>}
          <Campo>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Tu Password"
              name="password"
              value={password}
              onChange={handleChange}
              
            />
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}
          {error&&<Error>{error}</Error>}
          <InputSubmit type="submit" value="Iniciar Sesion" />
        </Formulario>
      </>
    </Layout>
  );
}
