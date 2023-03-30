import { CAlert, CButton, CSpinner } from "@coreui/react";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import ServiceService from "../../services/service.service";

class CreateService extends Component {
  constructor(props) {
    super(props);
    this.onChangeService = this.onChangeService.bind(this);
    this.createService = this.createService.bind(this);
    this.getService = this.getService.bind(this);

    this.state = {
      currentErrors: {
        title: null,
        titleBool: false
      },
      currentService: {
        id: null,
        titre: ""
      },
      message: null,
      ifError: null,
      loading: false
    };
  }

  onChangeService(e) {
    const service = e.target.value;
    if (service === "" || service === null || service.length === 0) {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          title: "Le champ titre est requis.",
          titleBool: true
        },
        currentService: {
          ...prevState.currentService,
          titre: service
        }
      }));
    } else {
      this.setState((prevState) => ({
        currentErrors: {
          ...prevState.currentErrors,
          title: null,
          titleBool: false
        },
        currentService: {
          ...prevState.currentService,
          titre: service
        }
      }));
    }
  }

  getService(id) {
    ServiceService.getServiceById(id)
      .then(response => {
        this.setState({
          currentService: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  createService(e) {
    e.preventDefault();
    this.setState({ loading: true })
    if (!this.state.currentErrors.titleBool) {
      ServiceService.getServiceByTitre(this.state.currentService.titre).then(resp => {
        if (resp.data === "") {
          ServiceService.save(this.state.currentService)
            .then(response => {
              this.setState({
                currentService: response.data,
                message: "Création bien prise en compte ! Redirection vers la liste des services.",
                ifError: false
              });
              window.setTimeout(() => { this.props.history.push("/service/liste") }, 2500);
            })
            .catch(e => {
              this.setState({
                message: e.message,
                ifError: true,
                loading: false
              });
            });
        } else {
          this.setState({
            message: "Ce service existe déjà.",
            ifError: true,
            loading: false
          });
        }
      })

    } else {
      this.setState({
        message: "Une erreur est présente dans votre formulaire.",
        ifError: true,
        loading: false
      });
    }

  }

  render() {
    const { currentService, currentErrors, message, ifError, loading } = this.state;

    return (
      <div>
        <div className="edit-form">
          <form name="createDomain" onSubmit={this.createService}>
            <div className="form-group">
              <label htmlFor="title">Créer un nouveau service</label>
              <input type="text" name="title" className="form-control" id="title" placeholder="Saisir un nom de service" value={currentService.titre} onChange={this.onChangeService} />
              <span className="text-danger">{currentErrors.title}</span>
            </div>
            <CButton type="submit" block color="info" disabled={loading}>
              {loading && <CSpinner size="sm" variant="border" />} Créer un service
            </CButton>
            <Link to={"/service/liste"} className="withoutUnderlane">
              <CButton className="mt-1" block color="danger" title="Vous voulez annuler ?">
                Annuler
              </CButton>
            </Link>
          </form>
          {ifError != null && <CAlert color={ifError ? "danger" : "success"}>{message}</CAlert>}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateService)