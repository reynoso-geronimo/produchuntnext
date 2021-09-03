import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 760px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //state del componente
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB]= useState(true)

  //routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;
  //context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id,consultarDB]);

  if (Object.keys(producto).length === 0 &&!error) return `Cargando...`;

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;
    //actualizar en la base de datos
    //ferificar que el usuario ha votado
    if (haVotado.includes(usuario.uid)) return;

    //guardar el usuario del id que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
    setConsultarDB(true);
  };
  //functiones para comentarios
  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //identefica si el comentario es de el creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/login");
    }
    //informacion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //tomar copia de comentarios y agregarlos arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //actualizar la base de datos
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });
    //actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setConsultarDB(true);
  };
//funcion que revisa si el autor del producto es el mismo que esta autenticado
const puedeBorrar=()=>{
  if(!usuario)return false;
  if(creador.id===usuario.uid){
    return true
  }
}
//eliminar un producto de la DB
const eliminarProducto= async()=>{
  if(!usuario){
    return router.push('/login')
  }
  if(creador.id!==usuario.uid){
    return router.push('/login')
  }

  try {
    
    await firebase.db.collection('productos').doc(id).delete();
    router.push('/')

  } catch (error) {
    console.log(error)
  }
}

  return (
    
    <Layout>
      <>
      {error ? <Error404 />:(
        <div className="contenedor">
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          {nombre}
        </h1>
        <ContenedorProducto>
          <div>
            <p>
              Publicado hace:{" "}
              {formatDistanceToNow(new Date(creado), { locale: es })}
            </p>
            <p>
              Por: {creador.nombre} de {empresa}
            </p>
            <img src={urlimagen}></img>
            <p>{descripcion}</p>
            {usuario && (
              <>
                <h2>Agrega tu Comentario</h2>
                <form onSubmit={agregarComentario}>
                  <Campo>
                    <input
                      type="text"
                      name="mensaje"
                      onChange={comentarioChange}
                    />
                  </Campo>
                  <InputSubmit type="submit" value="Agregar Comentario" />
                </form>
              </>
            )}
            <h2
              css={css`
                margin: 2rem 0;
              `}
            >
              Comentarios
            </h2>
            {comentarios.length === 0 ? (
              "Aun no hay comentarios"
            ) : (
              <ul>
                {comentarios.map((comentario, i) => (
                  <li
                    key={`comentario.usuarioId}-${i}`}
                    css={css`
                      border: 1px solid #e1e1e1;
                      padding: 2rem;
                    `}
                  >
                    <p>{comentario.mensaje}</p>
                    <p>
                      Escrito por:
                      <span
                        css={css`
                          font-weight: bold;
                        `}
                      >
                        {" "}
                        {comentario.usuarioNombre}
                      </span>
                    </p>
                    {esCreador(comentario.usuarioId) && (
                      <CreadorProducto>Es Creador</CreadorProducto>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <aside>
            <Boton target="_blank" bgColor="true" href={url}>
              Visitar Url
            </Boton>

            <div
              css={css`
                margin-top: 5rem;
              `}
            >
              <p
                css={css`
                  text-align: center;
                `}
              >
                {votos} Votos
              </p>
              {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
            </div>
          </aside>
        </ContenedorProducto>
        {puedeBorrar()&&
          <Boton
            onClick={eliminarProducto}
            >Eliminar Producto</Boton>
        }
      </div>
      )}
        
      </>
    </Layout>
  );
};

export default Producto;
