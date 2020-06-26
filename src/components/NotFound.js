import React, { Component } from "react";

export default class NotFound extends Component {
  render() {
    //window.AxonPixel.track("NotFound");
    return (
      <div className="container" style={{ marginTop: 100 }}>
        <title>Axon Checkout</title>

        <head>
          <link
            href="/static/imagenes/axon_logo_icon.ico"
            rel="shortcut icon"
            type="image/x-icon"
          />
          {/* <link
            href="http://www.dominio.com/carpeta/imagen.jpg"
            rel="image_src"
          /> */}
          {/* para cuando se comparte: */}
          <meta
            property="og:image"
            content="https://axon-campus.s3.us-east-2.amazonaws.com/otros/axon-logoFAzul.jpeg"
          />
          <meta property="og:title" content="Campus - Axon Training" />
          <meta
            property="og:description"
            content="Estudiar Coaching Ontológico"
          />
          <meta property="og:type" content="website" />
        </head>

        <div className="row">
          <div className="col-12 text-center">
            <img
              src="https://axont-contenidos.s3.us-east-2.amazonaws.com/imagen/icono_importante%403x.png"
              alt=""
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 30 }}>
          <div className="col-md-3"></div>
          <div className="col-md-6 ">
            <h2 className="text-center text-noEncontrada">
              Ups! Página no encontrada
            </h2>
            <p className="text-center texto-NoPudimos">
              No pudimos encontrar lo que estás buscando.
            </p>
            <h4 className="text-center" style={{ fontSize: 20 }}>
              <a href="https://axontraining.com">Volver al home</a>
            </h4>
          </div>
        </div>
      </div>
    );
  }
}
