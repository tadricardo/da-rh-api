import { CAlert, CButton, CSpinner } from "@coreui/react";
import fr from 'date-fns/locale/fr';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import { Component } from "react";
import DatePicker from 'react-datepicker';
import { withRouter } from "react-router-dom";
import { periodeCongeSalarie, dateFerieOuVisisteMedicale } from "src/utils/fonctions";
import salariesService from "../../../services/salaries.service";


class UpdateVisiteMedicale extends Component {
    constructor(props) {
        super(props);
        this.onChangeNomCentreMedicale = this.onChangeNomCentreMedicale.bind(this);
        this.onChangeTypologieVisite = this.onChangeTypologieVisite.bind(this);
        this.updateVM = this.updateVM.bind(this);
        this.state = {
            currentUser: {
                id: null,
                roles: null,
                email: null,
                isComptable: false,
            },
            currentSalarie: {
                id: null,
                nom: null,
                prenom: null,
                email: null,
                conges: {
                    id: 0,
                    dateDebut: null,
                    dateFin: null,
                    typeConge: null,
                },
            },
            currentErrors: {
                dateVisiteBool: false, dateVisite: null,
                dateFinValiditeBool: false, dateFinValidite: null,
                nomCentreMedicalBool: false, nomCentreMedical: null,
                typologieVisiteBool: false, typologieVisite: null,
            },
            currentVisiteMedicale: {
                id: 0,
                salarie: {
                    id: 0,
                },
                dateVisite: null,
                dateFinValidite: null,
                commentaire: "",
                nomCentreMedical: "",
                typologieVisite: null,
                rdvRealise: null,
                version: 0,
            },
            message: null,
            ifError: null,
            loading: false,
            notWorkingDay: (date) => {
                const day = new Date(date).getDay();
                return day !== 0 && day !== 6;
            },
        }
    }
    componentDidMount() {
        const currentUser = jwt_decode(JSON.parse(localStorage.getItem('token')));
        const salarieId = parseInt(this.props.parametres.id);
        this.setState((prevState) => ({
            currentUser: currentUser,
            salarieId: salarieId,
        }));
        this.getSalarie(salarieId);
        this.getVisiteMedicale(this.props.parametres.idVM);
    }

    getSalarie(salarieId) {
        salariesService.getSalarieById(salarieId)
            .then((response) => {
                this.setState({
                    currentSalarie: response.data,
                });
            })
            .catch((e) => {
                console.log("getSalarie : ", e);
            });
    }

    getVisiteMedicale(vmId) {
        salariesService.getVisiteMedicaleById(vmId)
            .then((response) => {
                this.setState({
                    currentVisiteMedicale: response.data,
                });
            })
            .catch((e) => {
                console.log("getVisiteMedicale : ", e);
            });
    }

    onchangeDateVisiteMidicale(e) {
        if (e.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateVisite: "Veuillez saisir une date de la visite médicale.",
                    dateVisiteBool: true
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    dateVisite: e,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateVisite: null,
                    dateVisiteBool: false
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    dateVisite: e,
                },
            }));
        }
    }

    onchangeDateFinValidite(e) {
        if (e.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateFinValidite: "Veuillez saisir une date de fin de validité de la visite médicale.",
                    dateFinValiditeBool: true
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    dateFinValidite: e,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateFinValidite: null,
                    dateFinValiditeBool: false
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    dateFinValidite: e,
                },
            }));
        }
    }

    onChangeNomCentreMedicale(e) {
        if (e.target.value.length === 0) {
            this.setState((prevState) => ({
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    nomCentreMedical: e.target.value,
                },
                currentErrors: {
                    ...prevState.currentErrors,
                    nomCentreMedical: "Le nom du centre médicale est obligatoire.",
                    nomCentreMedicalBool: true
                }
            }));
        } else {
            this.setState((prevState) => ({
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    nomCentreMedical: e.target.value,
                },
                currentErrors: {
                    ...prevState.currentErrors,
                    nomCentreMedical: null,
                    nomCentreMedicalBool: false
                }
            }));
        }
    }

    onChangeTypologieVisite(e) {
        if (e.target.length === 0) {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    typologieVisite: "Veuillez sélectionner une typologie de visite médicale.",
                    typologieVisiteBool: true
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    typologieVisite: e.target.value,
                },
            }));
        } else {
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    typologieVisite: null,
                    typologieVisiteBool: false
                },
                currentVisiteMedicale: {
                    ...prevState.currentVisiteMedicale,
                    typologieVisite: e.target.value,
                },
            }));
        }
    }

    onChangerdvRealise(e) {
        this.setState((prevState) => ({
            currentVisiteMedicale: {
                ...prevState.currentVisiteMedicale,
                rdvRealise: e.target.value,
            },
        }));
    }

    onChangeCommentaire(e) {
        this.setState((prevState) => ({
            currentVisiteMedicale: {
                ...prevState.currentVisiteMedicale,
                commentaire: e.target.value,
            },
        }));
    }

    verifForm() {
        const currentErrors = this.state.currentErrors;
        if (currentErrors.dateVisiteBool
            && currentErrors.dateFinValiditeBool
            && currentErrors.nomCentreMedicalBool
            && currentErrors.typologieVisiteBool) {
            //erreur dans le formulaire
            this.setState((prevState) => ({
                currentErrors: {
                    ...prevState.currentErrors,
                    dateVisite: currentErrors.dateVisiteBool ? "Veuillez saisir une date de la visite médicale." : null,
                    dateFinValidite: currentErrors.dateFinValiditeBool ? "Veuillez saisir une date de fin de validité de la visite médicale." : null,
                    nomCentreMedical: currentErrors.nomCentreMedicalBool ? "Le nom du centre médicale est obligatoire." : null,
                    typologieVisite: currentErrors.typologieVisiteBool ? "Veuillez sélectionner une typologie de visite médicale." : null,
                },
                ifError: "danger",
                message: "Erreur dans le formulaire.",
                loading: false,
            }));
            return false;
        } else {
            //Formulaire OK
            return true;
        }
    }

    updateVM() {
        if (this.verifForm()) {
            this.setState({
                ifError: null,
                message: null,
                loading: true,
            });
            salariesService.updateVisiteMedicale(this.state.currentVisiteMedicale).then(() => {
                this.setState({
                    loading: false,
                    message: "Visite médicale modifié, redirection vers votre profil.",
                    ifError: "success",
                });
                window.setTimeout(() => { this.props.history.push(`/salaries/vie-professionnelle/${this.state.salarieId}`) }, 1500)
            }).catch((e) => {
                this.setState({
                    loading: false,
                    message: "Erreur " + e.message,
                    ifError: "danger",
                });
                console.log(e)
            });
        }
    }

    render() {
        const { currentSalarie, currentErrors, currentVisiteMedicale, notWorkingDay, message, ifError, loading, salarieId } = this.state;
        const dateNow = new Date();
        //console.log("currentUser : ", currentUser)
        //console.log("salarieId : ", salarieId);
        //console.log("currentVisiteMedicale : ", currentVisiteMedicale)
        //console.log("currentErrors : ", currentErrors);
        //console.log("currentSalarie : ", currentSalarie);
        // https://reactdatepicker.com/
        return (
            <>
                <form onSubmit={this.updateVM}>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="dateVisite">Date de la visite médicale*</label>
                            <DatePicker
                                filterDate={notWorkingDay}
                                showWeekNumbers
                                className="form-control"
                                excludeDates={dateFerieOuVisisteMedicale(currentVisiteMedicale.dateVisite, currentSalarie.visitesMedicales)}
                                excludeDateIntervals={periodeCongeSalarie(currentSalarie.conges)}
                                selected={new Date(currentVisiteMedicale.dateVisite)}
                                dateFormat="dd/MM/yyyy HH:mm"
                                value={moment(currentVisiteMedicale.dateVisite).format("DD/MM/yyyy HH:mm")}
                                minDate={dateNow - 2}
                                initialValue={dateNow}
                                onChange={(e) => this.onchangeDateVisiteMidicale(e)}
                                selectsStart
                                startDate={currentVisiteMedicale.dateVisite}
                                showYearDropdown
                                showTimeSelect
                                dateFormatCalendar="MMMM"
                                yearDropdownItemNumber={5}
                                scrollableYearDropdown
                                todayButton="Aujourd'hui"
                                placeholderText="Sélectionner la date de la visite médicale"
                                locale={fr}
                                min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                                    "YYYY-MM-DD"
                                )}
                                required
                            />
                            <span className="text-danger">{currentErrors.dateVisite}</span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="dateFinValidite">Fin de validitée*</label>
                            <DatePicker
                                filterDate={notWorkingDay}
                                showWeekNumbers
                                className="form-control"
                                excludeDates={dateFerieOuVisisteMedicale(currentVisiteMedicale.dateVisite, currentSalarie.visitesMedicales)}
                                excludeDateIntervals={periodeCongeSalarie(currentSalarie.conges)}
                                selected={new Date(currentVisiteMedicale.dateFinValidite)}
                                dateFormat="dd/MM/yyyy"
                                value={currentVisiteMedicale.dateFinValidite}
                                onChange={(e) => this.onchangeDateFinValidite(e)}
                                startDate={currentVisiteMedicale.dateVisite}
                                minDate={currentVisiteMedicale.dateVisite}
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                yearDropdownItemNumber={5}
                                scrollableYearDropdown
                                todayButton="Aujourd'hui"
                                placeholderText="Sélectionner la date de fin de validité"
                                locale={fr}
                                min={moment(dateNow.setDate(dateNow.getDate() + 1)).format(
                                    "YYYY-MM-DD"
                                )}
                                required
                            />
                            <span className="text-danger">{currentErrors.dateFinValidite}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nomCentreMedicale">Nom du centre médicale*</label>
                        <input type="text" className="form-control" id="nomCentreMedicale" value={currentVisiteMedicale.nomCentreMedical} placeholder="Saisir un nom de centre médicale" required onChange={(e) => this.onChangeNomCentreMedicale(e)} />
                        <span className="text-danger">{currentErrors.nomCentreMedicale}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="typologieVisite">Typologie de visite</label>
                        <select className="form-control" id="typologieVisite" required onChange={(e) => this.onChangeTypologieVisite(e)}
                            value={currentVisiteMedicale.typologieVisite === null ? "" : currentVisiteMedicale.typologieVisite}>
                            <option value="">Sélectionner une typologie de visite médicale</option>
                            <option value="VISITE_EMBAUCHE">Visite d'embauche</option>
                            <option value="VISITE_SUIVI">Visite de suivi</option>
                            <option value="VISITE_PRE_REPRISE">Visite de préreprise</option>
                            <option value="VISITE_REPRISE">Visite de reprise</option>
                            <option value="VISITE_DEMANDE_EMPLOYEUR">Visite sur la demande de l'employeur</option>
                        </select>
                        <span className="text-danger">{currentErrors.typologieVisite}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rdvRealise">Rendez-vous réalise ?</label>
                        <select className="form-control" id="rdvRealise" required onChange={(e) => this.onChangerdvRealise(e)}
                            value={currentVisiteMedicale.rdvRealise === null ? "" : currentVisiteMedicale.rdvRealise}>
                            <option value=""></option>
                            <option value="SALARIE_PRESENT">Salarié Présent</option>
                            <option value="SALARIE_ABSENT">Salarié Absent</option>
                        </select>
                        <span className="text-danger">{currentErrors.typologieVisite}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="commentaire">Commentaire</label>
                        <textarea value={currentVisiteMedicale.commentaire} className="form-control" id="commentaire" rows="3" onChange={(e) => this.onChangeCommentaire(e)} />
                    </div>
                    <div className="row">
                        <div className="col">
                            <CButton type="submit" className="mt-3" block color="info" disabled={loading}>
                                {loading && <CSpinner size="sm" variant="border" />} Ajouter la visite médicale
                            </CButton>

                        </div>
                        <div className="col">

                            <CButton className="mt-3" to={`/salaries/vie-professionnelle/${salarieId}`} block color="danger" title="Vous voulez annuler ?">
                                Annuler
                            </CButton>
                        </div>
                    </div>
                    {ifError !== null && <CAlert className="mt-3" color={ifError === "danger" ? "danger" : "success"}>{message}</CAlert>}
                </form>
            </>
        );
    }
}

export default withRouter(UpdateVisiteMedicale);