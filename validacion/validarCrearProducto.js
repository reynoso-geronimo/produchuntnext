export default function validarCrearProducto(valores) {
    let errores = {};
  
    //validar el nombre del usuario
    if (!valores.nombre) {
      errores.nombre = "El Nombre es Obligatorio";
    }
    //validar empresa
    if (!valores.empresa) {
      errores.empresa = "Empresa es Obligatorio";
    }
    //validar url
    if (!valores.url) {
      errores.url = "La url es Obligatoria";
    
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL mal formateada o no valida"
    }
    //validar descripcion.
    if(!valores.descripcion){
        errores.descripcion= "La descripcion es obligatoria"
    }

    return errores
  }
  