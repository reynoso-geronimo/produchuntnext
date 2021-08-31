export default function validarIniciarSesion(valores) {
    let errores = {};
  
 
    //validar el email
    if (!valores.email) {
      errores.email = "El Email es Obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
      errores.email= "Email no valido"
    }
    if (!valores.password) {
      errores.password = "El Password es Obligatorio";
   
    }
    return errores
  }
  