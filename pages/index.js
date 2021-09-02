import React ,{useEffect,useState,useContext}from 'react';
import Layout from '../components/layout/Layout'
import {FirebaseContext} from '../firebase'
import DetallesProducto from '../components/layout/detallesProducto';


export default function Home() {
  const [productos, setProductos]=useState([]);

  
  const {firebase} = useContext(FirebaseContext)
  
  useEffect(() => {
   const obtenerProductos = ()=>{
    firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarSnapshot)
   }
   obtenerProductos()
  }, [])

  function manejarSnapshot(snapshot){
    const productos= snapshot.docs.map(doc=>{
      return {
        id:doc.id,
        ...doc.data()
      }
    })
    setProductos(productos)
  }

  return (
    <div>
      <Layout>
      <div className='listado-productos'>
        <div className='contenedor'>
          <div className='bg-white'>
            {productos.map(producto=>(
              <DetallesProducto
                key={producto.id}
                producto={producto}
              />
            ))}
          </div>
        </div>
      </div>
      
    </Layout>
    </div>
  );
}
