export const environment = {
  base_url: "http://localhost:8080/api",
  host    : "http://localhost:8080",
  userId  : 1,

  getUrlSolicitudAsignacionRespuesta: function(
    // sistema            : string,
    // caso               : string,
    // pregunta_respuesta : string,
    // // formulario         : number,
    // // tipo_saneo_id      : number,
    // formulario_id      : number,
    // tipo_saneo_id_encry: string,
    // formulario_id_encry: string
    datos:any
    ) {

    let dato:any           = [];

    let sistema            = datos.sistema
    let formulario_id      = datos.formulario
    let pregunta_respuesta = datos.pregunta_respuesta

    if(sistema === "extranjeria"){
      if(formulario_id === 1){
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormulario/', tipo_saneo_id_encry, formulario_id_encry];
        }else{

        }
      }else if(formulario_id === 2 || formulario_id === 3){
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019/', tipo_saneo_id_encry, formulario_id_encry];
        }else{
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019Res/', solicitud_encry];
        }
      }
    }else{

    }
    return dato;
  }

}
