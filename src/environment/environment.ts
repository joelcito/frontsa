export const environment = {
  base_url: "http://localhost:8080/api",   //DESARROLLO LOCAL
  host    : "http://localhost:8080",   //DESARROLLO LOCAL

  // base_url: "http://10.0.10.28:8080/api",  // PRODUCCION
  // host    : "http://10.0.10.28:8080",  // PRODUCCION

  // ****************** CONEXION A MINIO ******************
  url_minio : "http://10.0.10.30:9000",
  user_minio: "minioadmin",
  pass_minio: "minioadmin",


  userId  : 1,
  getUrlSolicitudAsignacionRespuesta: function(datos:any) {
    let dato:any           = [];
    let sistema            = datos.sistema
    let formulario_id      = datos.formulario //FORMUALRIO DE LA DATE BASE
    let pregunta_respuesta = datos.pregunta_respuesta
    if(sistema === "extranjeria"){
      if(formulario_id === 1){//FORMULARIO DE SOLICITUD DE CAMBIO DE BANDEJA
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormulario/', tipo_saneo_id_encry, formulario_id_encry];
        }else{
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioRes/', solicitud_encry];
        }
      }else if(formulario_id === 2){//FORMULARIO DE SOLICITUD DE SANEAMIENTO DIRECTIVA 008/2019
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019/', tipo_saneo_id_encry, formulario_id_encry];
        }else{
          let solicitud_encry = datos.solicitud
          dato = ['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019Res/', solicitud_encry];
        }
      }else if(formulario_id === 3){//FORMULARIO DE CORRECCIONES CIE
        let solicitud_encry = datos.solicitud
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioCorrecionCie/', tipo_saneo_id_encry, formulario_id_encry, solicitud_encry];
        }else{
          dato = ['/solicitud/newTipoSolicitud/newFormularioCorrecionCieRes/', solicitud_encry];
        }
      }else if(formulario_id === 4){//FORMULARIO DE BAJA DEL ORPE NATURALIZACION
        let solicitud_encry = datos.solicitud
        if(pregunta_respuesta === "pregunta"){
          let tipo_saneo_id_encry = datos.tipo_saneo_id_encry
          let formulario_id_encry = datos.formulario_id_encry
          dato = ['/solicitud/newTipoSolicitud/newFormularioBajaOrpeNaturalizacion/', tipo_saneo_id_encry, formulario_id_encry, solicitud_encry];
        }else{
          dato = ['/solicitud/newTipoSolicitud/newFormularioBajaOrpeNaturalizacionRes/', solicitud_encry];
        }

      }else{

      }
    }else{

    }
    return dato;
  },

  // ********************** EXTRANJERIA **********************
  detalle_tipo_saneo_id_directiva_008_2019      : 4,   //DIRECTIVA 008/2019
  detalle_tipo_saneo_id_cambio_bandeja          : 3,   //CAMBIO DE BANDEJA
  detalle_tipo_saneo_id_correccion_cie          : 5,   //CORRECCION CIE
  detalle_tipo_saneo_id_baja_orpe_naturalizacion: 6    //CORRECCION CIE
}
