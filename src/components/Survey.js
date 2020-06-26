import React, { Component } from "react";
import axios from "axios";
import NotFound from "./NotFound";
import logo from "../images/logo_axon.png";
import gracias from "../images/gracias.png";

const anchoBotones = (i) => {
  if (document.body.clientWidth > 600) {
    return { width: "9.09%" };
  }
  return { width: "9.09%" };
};

export default class Survey extends Component {
  state = {
    checked: false,
    step: "cargando",
    message: "",
    selected: "",
    loading: true,
  };
  componentDidMount = async () => {
    //Agarro el token de los parametros.

    const { token } = this.props.match.params;
    try {
      //Agarro los datos del token desde la API.
      const res = await axios.get(`https://api.axontraining.com/surveys`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const res_options = await axios.get(
        `https://api.axontraining.com/surveys/opciones`
      );

      //Acá manejo si ya hizo el primer paso antes

      if (res.data.type === "segundo_paso") {
        this.setState({
          token,
          response: res.data,
          opciones: res_options.data,
          loading: false,
          step: 2,
          checked: Number(res.data.nps),
        });
      } else {
        this.setState({
          token,
          response: res.data,
          opciones: res_options.data,
          loading: false,
          step: 1,
        });
      }
    } catch (e) {
      //Si hay error, devuelvo el status.
      this.setState({
        token,
        response: null,
        status: e.response.status,
        loading: false,
      });
    }
  };
  handleRadioChange = (selected) => {
    this.setState({ selected, error: false, message: "" });
  };
  handleMessageChange = ({ target }) => {
    this.setState({ message: target.value, error: false });
  };
  selRes = (checked) => {
    this.setState({ checked, step: 2 }, () => {
      const { token } = this.state;
      const { checked, message } = this.state;
      const data = {
        nps: checked,
        message: "",
      };
      axios
        .post("https://api.axontraining.com/surveys", data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.data.type === "success") {
          } else {
            this.setState({ step: null });
          }
        });
    });
  };
  onSubmit = () => {
    //Si se selecciono "otro" y no se ingreso ningun comentario
    if (this.state.message === "" && this.state.selected === "otro") {
      this.setState({ error: true });
      return;
    }
    this.setState({ step: "cargando" });

    const { token } = this.state;
    const { checked, message } = this.state;
    const data = {
      opcion: this.state.selected,
      nps: checked,
      message,
    };
    axios
      .post("https://api.axontraining.com/surveys", data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data.type === "success") {
          this.setState({ step: 4 });
        } else {
          this.setState({ step: null });
        }
      });
  };

  printButtons = () => {
    let buttons = [];
    for (let i = 0; i < 11; i++) {
      buttons = [
        ...buttons,
        <React.Fragment>
          <input
            type="radio"
            className="nps-radio"
            id={`nps-${i}`}
            name="nps"
            value={i}
            checked={this.state.checked === i}
            onClick={() => this.selRes(i)}
          />
          <label style={anchoBotones(i)} htmlFor={`nps-${i}`}>
            {i}
          </label>
        </React.Fragment>,
      ];
    }
    return buttons;
  };

  printPregunta = () => {
    const { message, checked, error } = this.state;
    let pregunta = [];
    if (checked > 8) {
      pregunta = [
        ...pregunta,
        <div>
          <h5 style={{ marginTop: 20 }} className={"text-dark text-center"}>
            ¿Qué aspectos resaltarías de la experiencia brindada?
          </h5>
        </div>,
      ];
    } else if (checked > 6) {
      pregunta = [
        ...pregunta,
        <div>
          <h5 style={{ marginTop: 20 }} className={"text-dark text-center"}>
            ¿Qué aspecto mejorarías para brindarte una mejor experiencia?
          </h5>
        </div>,
      ];
    } else {
      pregunta = [
        ...pregunta,
        <div>
          <h5 style={{ marginTop: 20 }} className={"text-dark text-center"}>
            ¿Qué aspecto consideras que te causó insatisfacción?
          </h5>
        </div>,
      ];
    }

    pregunta = [
      ...pregunta,
      <div>
        <hr />
        <div className="row" style={{ flexDirection: "column" }}>
          {this.state.opciones.map((opcion) => (
            <React.Fragment>
              <div className="col-12">
                <input
                  onClick={() => this.handleRadioChange(opcion.id)}
                  id={opcion.id}
                  type="radio"
                  checked={this.state.selected === opcion.id}
                  style={{ justifySelf: "center" }}
                />
                <label className="ml-3 mt-1 mb-1" for={opcion.id}>
                  {opcion.nombre}
                </label>
              </div>
            </React.Fragment>
          ))}

          <div className="col-12">
            <input
              type="radio"
              onClick={() => this.handleRadioChange("otro")}
              checked={this.state.selected === "otro"}
              id="otro"
              style={{ justifySelf: "center" }}
            />
            <label className="ml-3 mt-1 mb-1" for="otro">
              Otro
            </label>
          </div>
          <br />
          {this.state.selected && (
            <React.Fragment>
              <hr />
              <p>
                {this.state.selected === "otro"
                  ? "¿A qué se debe tu respuesta?"
                  : "Por favor cuéntanos más..."}
              </p>
              <input
                className="form-control"
                id="res-input"
                type="text"
                value={message}
                style={
                  error
                    ? { borderColor: "red", color: "black" }
                    : { color: "black" }
                }
                onChange={this.handleMessageChange}
              />
            </React.Fragment>
          )}

          <hr />
          <input
            type="button"
            disabled={!this.state.selected}
            onClick={() => this.onSubmit()}
            className="btn btn-primary form-control"
            value="Enviar"
          />
        </div>

        <hr />
        <input
          type="button"
          onClick={() => this.setState({ step: 1 })}
          className="btn btn-secondary"
          value="Volver"
        />
      </div>,
    ];
    return <div className="col-8 m-auto">{pregunta}</div>;
  };

  printSurvey = () => {
    const { usuario } = this.state.response;

    switch (this.state.step) {
      case "cargando":
        return (
          <div className="d-flex justify-content-center">
            <div className="mt-5 spinner-grow text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        );
      case 1:
        //se puede acceder al surveyid desde las propiedades, si quisieramos hacer otra pregunta, la podemos hardcodear acá
        return (
          <div className="d-flex col-12" style={{ flexDirection: "column" }}>
            <div>
              <img
                src={logo}
                className=" d-block"
                style={{ height: "auto", margin: "3rem auto" }}
                alt="logo"
              />
            </div>
            <div>
              <h5 className="text-center text-dark">
                {usuario.nombre}
                <br /> ¿Qué tan probable es que recomiendes Axon Training a un
                colega?
              </h5>
              <br />
              <div className="m-auto">
                <div className="table_nps">
                  <div className="nps">{this.printButtons()}</div>
                </div>
                <div
                  className="col-12 m-0 p-0 d-flex text-dark font-weight-bolder"
                  style={{ justifyContent: "space-between" }}
                >
                  <small className=" font-weight-bolder">Nada probable</small>
                  <small className=" font-weight-bolder">Muy probable</small>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="d-flex col-12" style={{ flexDirection: "column" }}>
            <div>
              <img
                src={logo}
                className="d-block"
                style={{ height: "auto", margin: "3rem auto" }}
                alt="logo"
              />
            </div>
            <br />
            {this.printPregunta()}
          </div>
        );
      case 4:
        return (
          <div className="d-flex col-12" style={{ flexDirection: "column" }}>
            <div
              class="alert alert-light col-11 m-auto text-dark "
              role="alert"
              style={{ marginTop: "1rem" }}
            >
              <div className="col-12 d-flex justify-content-center">
                <img src={gracias} />
              </div>
            </div>
            <hr />
            <div className="col-12 d-flex justify-content-center">
              <a href="https://www.axontraining.com.ar/" className="col-5">
                <input
                  type="button"
                  className="btn btn-secondary form-control"
                  value="Ir a la página"
                />
              </a>
            </div>
          </div>
        );

      default:
        return (
          <React.Fragment>
            <div className="d-flex col-12" style={{ flexDirection: "column" }}>
              <div
                class="alert alert-light col-11 m-auto text-dark font-weight-bold"
                role="alert"
                style={{ marginTop: "1rem" }}
              >
                <div className="col-12 d-flex justify-content-center">
                  <img src={gracias} />
                </div>
              </div>
              <hr />
              <div className="col-12 d-flex justify-content-center">
                <a href="https://www.axontraining.com.ar/" className="col-5">
                  <input
                    type="button"
                    className="btn btn-secondary form-control"
                    value="Ir a la página"
                  />
                </a>
              </div>
            </div>
          </React.Fragment>
        );
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center">
          <div className="mt-5 spinner-grow text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      );
    }
    if (!this.state.response) {
      return <NotFound status={this.state.status} />;
    }
    const { type } = this.state.response;
    if (type == "success" || type == "segundo_paso") {
      return (
        <div className="wrapper">
          <div className="main-panel">
            <div className="container justify-content-center d-flex">
              {this.printSurvey()}
            </div>
            <style global jsx>{`
              .rectangle {
                margin-top: 20px;
                box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.13);
                padding: 15px;
                background-color: #fff;
              }
              h1 {
                font-size: 20px;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.38;
                letter-spacing: normal;
                text-align: left;
                color: #1b1c20;
              }
            `}</style>
          </div>
        </div>
      );
    } else if (type == "completada") {
      return (
        <div className="wrapper">
          <div className="d-flex col-12" style={{ flexDirection: "column" }}>
            <div
              class="alert alert-light col-11 m-auto text-dark font-weight-bold"
              role="alert"
              style={{ marginTop: "1rem" }}
            >
              <div className="col-12 d-flex justify-content-center">
                <img src={gracias} />
              </div>
            </div>
            <hr />
            <div className="col-12 d-flex justify-content-center">
              <a href="https://www.axontraining.com.ar/" className="col-5">
                <input
                  type="button"
                  className="btn btn-secondary form-control"
                  value="Ir a la página"
                />
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return "Error";
    }
  }
}
