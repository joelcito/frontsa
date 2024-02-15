export const environment = {
  base_url: "http://localhost:8080/api",
  host    : "http://localhost:8080",
  userId  : 1,
  getUrlSolicitudAsignacionRespuesta: function(datos:any) {
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
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioRes/', solicitud_encry];
        }
      }else if(formulario_id === 2){
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019/', tipo_saneo_id_encry, formulario_id_encry];
        }else{
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019Res/', solicitud_encry];
        }
      }else if(formulario_id === 3){
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioCorrecionCie/', tipo_saneo_id_encry, formulario_id_encry];
        }else{
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019Res/', solicitud_encry];
        }
      }else{

      }
    }else{

    }
    return dato;
  },

  // ********************** EXTRANJERIA **********************
  detalle_tipo_saneo_directiva_008_2019: 4,   //DIRECTIVA 008/2019
  detalle_tipo_saneo_cambio_bandeja    : 3    //CAMBIO DE BANDEJA

}
