import React, { useState,useContext } from "react";
import { css } from "@emotion/react";
import Router,{useRouter} from 'next/router';
import Layout from "../components/layout/Layout";
import Error404 from "../components/layout/404";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import {FirebaseContext} from "../firebase";
import FileUploader from 'react-firebase-file-uploader'
//validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
 // imagen: "",
  url:"",
  descripcion:"",
};
export default function NuevoProducto() {
  
  const [nombreimagen, setNombreImagen]= useState("")
  const [subiendo, setSubiendo]=useState(false)
  const [progreso, setProgreso]=useState(0)
  const [urlimagen, setUrlimagen]= useState('')
  
  const [error, setError]=useState(false)

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  const { nombre, empresa, imagen, url, descripcion } = valores;
 
  //hook de routing para redireccionar

  const router =useRouter();

 // context con las operaciones crud de firebase
  const {usuario, firebase}= useContext(FirebaseContext);

  async function crearProducto(){
   //si e el usuario no esta autenticado llevar al login
   if(!usuario){
     return router.push('/login');
   }
   //crear el objeto de nuevo producto
   const producto = {
     nombre,
     empresa,
     url,
     urlimagen,
     descripcion,
     votos:0,
     comentarios:[],
     creado:Date.now(),
     creador:{
       id:usuario.uid,
       nombre:usuario.displayName
     },
     haVotado:[]

   }
   //insersartlo en la base de datos
   firebase.db.collection('productos').add(producto)
   return router.push('/');
 }
  
 const handleUploadStart = () =>  {
  setSubiendo (true);
  setProgreso(0)
 };

 const handleProgress = progreso => setProgreso({ progreso });

 const handleUploadError = error => {
  setError(error); 
  setSubiendo(false);
  console.error(error);
 };
 const handleUploadSuccess = nombre => {
   setProgreso(100);
   setSubiendo(false);
   setNombreImagen(nombre)
   firebase
   .storage
   .ref("productos")
   .child(nombre)
   .getDownloadURL()
   .then(url => {
      
      setUrlimagen(url)
  });
 };

  return (
    <Layout>
      {!usuario?<Error404/>:(
        <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Nuevo Producto
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>

          <fieldset>
            <legend>Informacion General</legend>
         

          <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Nombre del producto"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              id="empresa"
              placeholder="Nombre Empresa"
              name="empresa"
              value={empresa}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.empresa && <Error>{errores.empresa}</Error>}
          
           <Campo>
            <label htmlFor="imagen">Imagen</label>
            <FileUploader
              accept="image/*"
              id="imagen"
              name="imagen"
            
              randomizeFilename
              storageRef={firebase.storage.ref("productos")}
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              onUploadSuccess={handleUploadSuccess}
              onProgress={handleProgress}

            />
          </Campo>
        

          <Campo>
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="URL de tu producto"
              value={url}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.url && <Error>{errores.url}</Error>}
      
          </fieldset>
          <fieldset>
            <legend>Sobre tu Producto</legend>

            <Campo>
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.descripcion && <Error>{errores.descripcion}</Error>}

          </fieldset>
         
          {error&&<Error>{error}</Error>}
          <InputSubmit type="submit" value="Crear Producto" />
        </Formulario>
      </>
      )}
      
    </Layout>
  );
}